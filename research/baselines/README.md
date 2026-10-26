# Frozen comparison baseline

`visionleak-0.1.0.mjs` is the unmodified ESM artifact from the locally accepted 0.1.0 ZIP. Its original path was `dist/visionleak.js`; only the extension changed for explicit Node ESM loading.

- Artifact SHA-256: `94b042685bb55030f5b44f11545c7b6f19ee28cf5971bb3c4598398c2281f2ab`
- Original ZIP SHA-256: `ddc66b151622545abe7e76e41fb6cd679643f5335ea91c6c5bad98500058689b`
- Own code: MIT; bundled MoonBit standard library: Apache-2.0, with notices retained in `LICENSES/`.

Used only by `node tests/core-performance.mjs` for reproducible complete-output parity and paired synthetic timings. This is a historical local release, not independent or external validation.

`0.5.0/` contains the unchanged implementation files listed by
`research/photos-v2/freeze-0.5.0.json`, extracted from the original 0.5.0 source ZIP.
The crop-reference test checks every archived file against that frozen digest.
This permits current implementation changes without rewriting historical evidence.
