FROM --platform=linux/amd64 python:3.13.7-slim-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl xz-utils build-essential clang git libglib2.0-0 && rm -rf /var/lib/apt/lists/*
RUN set -eu; cd /tmp; curl -fsSLO https://nodejs.org/dist/v22.22.0/node-v22.22.0-linux-x64.tar.xz; curl -fsSLO https://nodejs.org/dist/v22.22.0/SHASUMS256.txt; awk '$2 == "node-v22.22.0-linux-x64.tar.xz" {print}' SHASUMS256.txt | sha256sum -c -; tar -xJf node-v22.22.0-linux-x64.tar.xz --strip-components=1 -C /usr/local; rm node-v22.22.0-linux-x64.tar.xz SHASUMS256.txt
WORKDIR /workspace/visionleak
ADD source.tar.gz /workspace/visionleak/
RUN npm ci --no-audit --no-fund && python -m pip install --no-cache-dir pip==25.2 && python -m pip install --no-cache-dir -r requirements-oracle.txt -r requirements-orb.txt
RUN python tools/bootstrap.py
RUN node --input-type=module -e 'import{sourceDigest}from"./tools/source-digest.mjs";if(sourceDigest(process.cwd())!=="399a2d11bd966529f0e771bb7abfce7244255bc72df5144f5039c60bafa5ccf2")throw Error("Linux snapshot source mismatch")'
RUN apt-get update && apt-get install -y --no-install-recommends procps && rm -rf /var/lib/apt/lists/* && test -x /bin/ps
ENV VISIONLEAK_ORACLE_PYTHON=python VISIONLEAK_ORB_PYTHON=python PYTHONDONTWRITEBYTECODE=1
CMD ["npm", "run", "verify:ci"]
