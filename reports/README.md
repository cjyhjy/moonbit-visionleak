# Historical local evidence

Files already present in this directory at extracted commit `d7cc72eae2523b818e6c17b990f824bacbe5d2d4` are the **2026-10-22 pre-publication macOS arm64 delivery snapshot**. They are retained for auditability; their recorded source digests, versions, paths, timings, publication flags and ZIP checksum describe that run only.

- Source verification ran at 15:55:40–15:55:46 UTC (11:55:40–11:55:46 America/New_York).
- The evaluation JSON was generated at 15:55:44 UTC.
- The final local ZIP acceptance ran at 15:57:55–15:57:59 UTC.
- `demo/qa/` holds historical browser evidence from the same delivery session. Current CI does not re-run those browser interactions.

These are not GitHub Actions results for the latest commit. The original ZIP is not rebuilt or published by the repository CI; a checksum recorded here does not attest to a new archive from current source. Historical `publication: false` fields and untested-platform statements remain accurate for their original run.

Fresh source acceptance is `npm run verify:ci`: it writes `.ci-artifacts/verification.json`, per-check logs, and an independent image evaluation without changing these files. On GitHub, those outputs are uploaded under `linux-acceptance-<commit SHA>` and the run records the actual status. Consult [Actions](https://github.com/cjyhjy/moonbit-visionleak/actions/workflows/ci.yml) for current Linux evidence.
