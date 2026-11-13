FROM --platform=linux/amd64 visionleak-090-acceptance:original-budget
WORKDIR /workspace/visionleak
ADD source.tar.gz /workspace/visionleak/
RUN npm ci --offline --no-audit --no-fund
RUN python -c 'from pathlib import Path; from importlib.metadata import version; lines=(Path("requirements-oracle.txt").read_text()+"\n"+Path("requirements-orb.txt").read_text()).splitlines(); pins=[s.split("==") for s in lines if s.strip() and not s.lstrip().startswith("#")]; assert all(version(n)==v for n,v in pins)'
RUN python tools/bootstrap.py && test -x /bin/ps
RUN node --input-type=module -e 'import{sourceDigest}from"./tools/source-digest.mjs";if(sourceDigest(process.cwd())!=="79317cd6b05ad364a00efc0bc26c250fbf91ba977cf18594e4b602bf81be033c")throw Error("Candidate source mismatch")'
CMD ["npm", "run", "verify:ci"]
