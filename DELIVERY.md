# VisionLeak 0.7.1

MIH generation-mark integration preserves the released 0.7.0 ordered output and budget semantics. Current local acceptance and publication receipts are in `reports/integration-0.7.1/`; see `docs/changes-0.7.1.md`. ORB is reserved for the following 0.8.0 opt-in integration.

Reproduce this version with `npm run verify:ci`, `node tools/demo-walkthrough.mjs output/walkthrough-v071-fresh`, and `node --test tests/mih-generation.test.mjs`. Package with `python3 tools/package.py --verification reports/integration-0.7.1/acceptance.json`; validate using `python3 tools/accept-release.py --reference-dir reports/integration-0.7.1/ci --report reports/integration-0.7.1/clean-copy.json`.

The following section is the preserved 0.7.0 delivery record; its receipts do not attest 0.7.1.

# VisionLeak 0.7.0 delivery

Published on 2026-11-03 after the coverage correction and stricter ordered regression. GitHub Release v0.7.0 and Mooncakes cjyhjy/visionleak@0.7.0 were independently downloaded/imported and verified; see `reports/followup-0.7.0/publication/completion.json`. Public 0.6.0 receipts remain in `reports/plan-0.6.0/publication/`; previous delivery text is preserved in `reports/history/pre-0.7.0-20261030/DELIVERY-0.6.0.md`.

See `docs/changes-0.7.0.md` for migration and `docs/followup-2026-11-03.md` for task status. Current evidence is indexed in `reports/followup-0.7.0/README.md`; `reports/post-review/` preserves the original pre-followup acceptance. Historical `reports/verification.json`, older ZIPs and freezes do not attest this release.

```sh
npm ci
npm run build
npm run verify:ci
node tools/demo-walkthrough.mjs output/walkthrough-v070
node tools/server.mjs --report output/walkthrough-v070/audit/report.json --port 4173
```

Current known-source regression: `research/.venv-oracle/bin/python tools/evaluate-post-review.py --regression --out output/known-replay`. Original frozen implementation: `research/.venv-oracle/bin/python tools/frozen_post_review.py --out output/historical-replay`. Both require new output directories. Neither obtains a new holdout.

The following were the packaging commands. The published ZIP is immutable; use a fresh isolated checkout to reproduce acceptance, and a new version for a different deliverable:

```sh
node tools/attest-followup.mjs
python3 tools/package.py --verification reports/followup-0.7.0/acceptance.json
python3 tools/accept-release.py --reference-dir reports/followup-0.7.0/ci --report reports/followup-0.7.0/clean-copy.json
```

The walkthrough creates a new directory and generates clearly marked scripted review records, offline HTML, suggestions and a corrected copy. It checks that original generated inputs are unchanged. CSV manifests use `--manifest`, and optional content-keyed caching uses `--cache`; the production audit never deletes or moves input files.

Requirements remain Node.js 22+, Python 3.13 for the independent oracles, and the pinned toolchain. Core publication packaging excludes photos and host tools. Crop v2, provider-backed Agents, natural-contamination evaluation and human review timing remain outside the completed scope.

Subsequent bounded experiments are separate: `reports/followup-quality/README.md` records the ORB research candidate and frozen new-source results; `reports/followup-retrieval/README.md` records the equivalent MIH generation-mark candidate. Neither candidate changes the published 0.7.0 runtime or its supported profiles.
