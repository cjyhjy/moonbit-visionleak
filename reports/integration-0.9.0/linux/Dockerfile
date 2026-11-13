FROM --platform=linux/amd64 visionleak-090-acceptance:candidate
WORKDIR /workspace/visionleak
COPY tools/package.py tools/package.py
COPY tests/release-contract.py tests/release-contract.py
RUN python tests/release-contract.py
RUN node --input-type=module -e 'import{sourceDigest}from"./tools/source-digest.mjs";if(sourceDigest(process.cwd())!=="d84189de589eb7bbd61e0920627da8891245db43ae51306d6a36666a080f2d0c")throw Error("Final policy source mismatch")'
CMD ["npm", "run", "verify:ci"]
