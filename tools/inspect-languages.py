#!/usr/bin/env python3
"""Transparent local language-byte estimate for the intended standalone tree."""
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
EXTENSIONS = {'.mbt':'MoonBit','.mbti':'MoonBit','.mjs':'JavaScript','.js':'JavaScript',
              '.py':'Python','.html':'HTML','.css':'CSS','.sh':'Shell'}


def main():
    names = subprocess.check_output(['git','ls-files','-z','--cached','--others','--exclude-standard','--','.'],cwd=ROOT).decode().split('\0')
    totals, files, excluded = {}, [], []
    for name in sorted(set(filter(None,names))):
        path = ROOT/name
        if not path.is_file(): continue
        if name.startswith('dist/') or name.startswith('research/baselines/'):
            excluded.append(name)
            continue
        language = EXTENSIONS.get(path.suffix)
        if name == 'tools/moon': language = 'Shell'
        if not language: continue
        size = path.stat().st_size
        test = name.startswith('tests/') or path.name.endswith(('_test.mbt','_wbtest.mbt'))
        row = totals.setdefault(language,{'bytes':0,'testBytes':0,'files':0})
        row['bytes'] += size
        row['testBytes'] += size if test else 0
        row['files'] += 1
        files.append({'path':name,'language':language,'bytes':size,'test':test})
    primary = max(totals,key=lambda name:totals[name]['bytes'])
    print(json.dumps({'method':'Git tracked plus nonignored untracked files in this project; extension/shebang byte count, including tests and comments; excludes only compiled dist and compiled historical engine baselines per .gitattributes. This is a transparent estimate, not the full github-linguist classifier or a remote languages API result.',
                      'primaryLanguage':primary,'moonbitIsLargest':primary=='MoonBit',
                      'languages':totals,'excludedGenerated':excluded,'files':files},indent=2))


if __name__=='__main__': main()
