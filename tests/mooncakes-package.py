"""Check the actual Mooncakes archive without login or an upload."""
import re
from pathlib import Path
import subprocess
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]


class PackageContents(unittest.TestCase):
    def test_archive_contains_only_the_reusable_library_under_one_megabyte(self):
        subprocess.run([str(ROOT / "tools/moon"), "package", "--frozen"], cwd=ROOT, check=True,
                       capture_output=True, text=True)
        manifest = (ROOT / "moon.mod").read_text()
        name = re.search(r'^name\s*=\s*"([^"]+)"', manifest, re.M)[1]
        version = re.search(r'^version\s*=\s*"([^"]+)"', manifest, re.M)[1]
        archive = ROOT / "_build/publish" / (name.replace("/", "-") + "-" + version + ".zip")
        self.assertLess(archive.stat().st_size, 1_000_000)
        with zipfile.ZipFile(archive) as package:
            files = set(package.namelist())
        self.assertTrue({"moon.mod", "README.md", "LICENSE", "core/moon.pkg"} <= files)
        for path in files:
            self.assertTrue(path in {"moon.mod", "README.md", "LICENSE", "core/moon.pkg"}
                            or re.fullmatch(r"core/[^/]+\.(mbt|mbti)", path), path)
            self.assertNotRegex(path, r"_(wb)?test\.mbt$")


if __name__ == "__main__":
    unittest.main()
