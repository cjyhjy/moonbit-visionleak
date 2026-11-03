"""Read a release version only when every package manifest agrees."""
import json
import re


def release_version(root):
    package = json.loads((root / 'package.json').read_text())
    version = package.get('version')
    if not isinstance(version, str) or not re.fullmatch(r'[0-9]+\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9.-]+)?', version):
        raise ValueError('package.json has an invalid release version')
    lock = json.loads((root / 'package-lock.json').read_text())
    moon = re.search(r'^version\s*=\s*"([^"]+)"', (root / 'moon.mod').read_text(), re.MULTILINE)
    if lock.get('version') != version or lock.get('packages', {}).get('', {}).get('version') != version or not moon or moon[1] != version:
        raise ValueError('package.json, package-lock.json and moon.mod versions disagree')
    return version


def read_checksums(path):
    if not path.exists():
        return {}
    entries = {}
    for line in path.read_text().splitlines():
        match = re.fullmatch(r'([a-f0-9]{64})  (visionleak-[A-Za-z0-9.-]+\.zip)', line)
        if not match or match[2] in entries:
            raise ValueError('Invalid or duplicate SHA256SUMS entry')
        entries[match[2]] = match[1]
    return entries
