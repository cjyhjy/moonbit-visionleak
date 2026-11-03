"""Compatibility for the pinned publisher's successful HTTP-202 previews."""
import json
import os
from pathlib import Path
import re
import subprocess
import sys

AFFECTED_PUBLISHER = "mooncake-bin 0.1.20260911 (7344121 2026-09-11)"
GENERIC_ERROR = "Error: `moon publish` failed"


def accepted_dry_run(args, status, stdout, stderr, publisher_version, manifest):
    # Never generalize this to actual publication or arbitrary 2xx responses.
    if (not args or args[0] != "publish" or "--dry-run" not in args
            or any(arg not in {"publish", "--dry-run", "--frozen"} for arg in args)
            or status != 255 or publisher_version != AFFECTED_PUBLISHER
            or not manifest or not manifest.get("name") or not manifest.get("version")):
        return False
    lines = (stdout + "\n" + stderr).splitlines()
    success = ("Server status: 202 Accepted, detail: Dry run completed successfully. "
               "No changes were made. The dry-run was made for package "
               f"{manifest['name']} version {manifest['version']}.")
    server_lines = [line for line in lines if line.startswith("Server status:")]
    errors = [line for line in lines if re.match(r"^(Error:|error:|thread .*panicked|Caused by:)", line)]
    return (server_lines == [success] and lines.count("Check passed") == 2
            and any(line.startswith("validating packaged zip: ") for line in lines)
            and "running moon check on extracted package" in lines
            and errors == [GENERIC_ERROR]
            and stderr.rstrip().endswith(success + "\n" + GENERIC_ERROR))


def manifest_at(directory):
    # Support simple quoted current-format fields; unfamiliar syntax retains
    # the upstream exit code instead of guessing which module was checked.
    try:
        text = (directory / "moon.mod").read_text()
        fields = {}
        for name in ("name", "version"):
            matches = re.findall(r'^' + name + r'\s*=\s*("[^"\r\n]*")\s*$', text, re.MULTILINE)
            if len(matches) != 1:
                return None
            fields[name] = json.loads(matches[0])
        return fields
    except (OSError, ValueError):
        return None


def run_dry_run(binary, args):
    env = dict(os.environ)
    # Credentials stay in their existing home; do not read or copy them here.
    if env.get("VISIONLEAK_MOONCAKES_HOME"):
        env["MOON_HOME"] = str(Path(env["VISIONLEAK_MOONCAKES_HOME"]).resolve())
    env["MOON_TOOLCHAIN_ROOT"] = str(binary.parent.parent)
    try:
        result = subprocess.run([str(binary), *args], env=env, capture_output=True, text=True, timeout=180)
    except (OSError, subprocess.TimeoutExpired) as error:
        print(f"Mooncakes dry-run could not complete: {error}", file=sys.stderr)
        return 1
    publisher_version = ""
    if not env.get("MOONCAKE_OVERRIDE"):
        try:
            version = subprocess.run([str(binary.parent / "mooncake"), "--version"], env=env,
                                     capture_output=True, text=True, timeout=10, check=True)
            publisher_version = version.stdout.strip()
        except (OSError, subprocess.SubprocessError):
            pass
    normalized = accepted_dry_run(args, result.returncode, result.stdout, result.stderr,
                                  publisher_version, manifest_at(Path.cwd()))
    sys.stdout.write(result.stdout)
    sys.stderr.write(result.stderr.rsplit(GENERIC_ERROR, 1)[0] if normalized else result.stderr)
    if normalized:
        print("[visionleak] Dry-run succeeded (HTTP 202). Applied compatibility for mooncake "
              "7344121; upstream exit 255, effective exit 0.", file=sys.stderr)
    return 0 if normalized else (result.returncode if result.returncode >= 0 else 1)


if __name__ == "__main__":
    if len(sys.argv) < 4 or sys.argv[2] != "publish" or "--dry-run" not in sys.argv[3:]:
        sys.exit("Use ./tools/moon publish --dry-run [--frozen].")
    sys.exit(run_dry_run(Path(sys.argv[1]).resolve(), sys.argv[2:]))
