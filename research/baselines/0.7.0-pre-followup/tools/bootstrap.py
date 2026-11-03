#!/usr/bin/env python3
"""Install checksummed official MoonBit archives inside this checkout."""
import hashlib
import json
import os
import platform
import shutil
import subprocess
import tarfile
import tempfile
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOCK_PATH = ROOT / "toolchain.lock.json"
LOCK = json.loads(LOCK_PATH.read_text())
INSTALL = ROOT / ".tools" / "moon"
CACHE = ROOT / ".cache" / "moonbit"


def digest(path):
    return hashlib.file_digest(path.open("rb"), "sha256").hexdigest()


def download(url, checksum):
    CACHE.mkdir(parents=True, exist_ok=True)
    target = CACHE / (checksum + ".tar.gz")
    if target.exists():
        if digest(target) != checksum:
            raise SystemExit(f"Cached archive checksum mismatch: {target.name}")
        return target
    temporary = target.with_suffix(".partial")
    for attempt in range(3):
        try:
            print(f"Downloading {url}", flush=True)
            with urllib.request.urlopen(url, timeout=120) as response, temporary.open("wb") as out:
                shutil.copyfileobj(response, out)
            if digest(temporary) != checksum:
                raise SystemExit("Downloaded archive checksum mismatch")
            temporary.replace(target)
            return target
        except (OSError, TimeoutError):
            temporary.unlink(missing_ok=True)
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)


def main():
    key = {("Darwin", "arm64"): "darwin-aarch64", ("Linux", "x86_64"): "linux-x86_64"}.get(
        (platform.system(), platform.machine()))
    if key not in LOCK["archives"]:
        raise SystemExit("Pinned bootstrap supports macOS arm64 and Linux x86_64.")
    lock_digest = digest(LOCK_PATH)
    marker = INSTALL / ".visionleak-toolchain"
    if INSTALL.exists():
        if marker.is_file() and marker.read_text().strip() == lock_digest:
            print("Pinned toolchain already installed.")
            return
        raise SystemExit("Existing .tools/moon is not a complete matching installation; move it aside first.")
    version = urllib.parse.quote(LOCK["version"], safe="")
    compiler = download(f"https://cli.moonbitlang.com/binaries/{version}/moonbit-{key}.tar.gz",
                        LOCK["archives"][key]["sha256"])
    core = download(f"https://cli.moonbitlang.com/cores/core-{version}.tar.gz", LOCK["core_sha256"])
    INSTALL.parent.mkdir(parents=True, exist_ok=True)
    # The final installation appears only after both archives verify and core bundles.
    with tempfile.TemporaryDirectory(prefix="moon-install-", dir=INSTALL.parent) as temporary:
        staging = Path(temporary) / "moon"
        staging.mkdir()
        for archive_path, destination in ((compiler, staging), (core, staging / "lib")):
            destination.mkdir(parents=True, exist_ok=True)
            with tarfile.open(archive_path) as archive:
                archive.extractall(destination, filter="data")
        for binary in (staging / "bin").iterdir():
            if binary.is_file():
                binary.chmod(binary.stat().st_mode | 0o111)
        tcc = staging / "bin" / "internal" / "tcc"
        if tcc.exists():
            tcc.chmod(tcc.stat().st_mode | 0o111)
        env = dict(os.environ, MOON_HOME=str(staging),
                   PATH=str(staging / "bin") + os.pathsep + os.environ.get("PATH", ""))
        subprocess.run([str(staging / "bin" / "moon"), "-C", str(staging / "lib" / "core"),
                        "bundle", "--warn-list", "-a", "--all"], env=env, check=True)
        version_text = subprocess.check_output([str(staging / "bin" / "moonc"), "-v"], env=env, text=True)
        if "v" + LOCK["version"] + " " not in version_text:
            raise SystemExit("Installed compiler version differs from the lock")
        (staging / marker.name).write_text(lock_digest + "\n")
        staging.rename(INSTALL)
    print("Installed " + version_text.strip())


if __name__ == "__main__":
    main()
