# VisionLeak 0.7.0 local candidate

Implemented after initial review, with the 2026-11-03 coverage correction and stricter ordered regression. Publication status is tracked separately from local acceptance in `reports/followup-0.7.0/README.md`. Public 0.6.0 receipts remain in `reports/plan-0.6.0/publication/`; previous delivery text is preserved in `reports/history/pre-0.7.0-20261030/DELIVERY-0.6.0.md`.

See `docs/changes-0.7.0.md` for migration and `docs/followup-2026-11-03.md` for task status. Current evidence is indexed in `reports/followup-0.7.0/README.md`; `reports/post-review/` preserves the original pre-followup acceptance. Historical `reports/verification.json`, release receipts, ZIPs and freezes do not attest this candidate.

```sh
npm ci
npm run build
npm run verify:ci
node tools/demo-walkthrough.mjs output/walkthrough-v070
node tools/server.mjs --report output/walkthrough-v070/audit/report.json --port 4173
```

Current known-source regression: `research/.venv-oracle/bin/python tools/evaluate-post-review.py --regression --out output/known-replay`. Original frozen implementation: `research/.venv-oracle/bin/python tools/frozen_post_review.py --out output/historical-replay`. Both require new output directories. Neither obtains a new holdout.

After the fresh CI/browser evidence described in the current evidence index exists:

```sh
node tools/attest-followup.mjs
python3 tools/package.py --verification reports/followup-0.7.0/acceptance.json
python3 tools/accept-release.py --reference-dir reports/followup-0.7.0/ci --report reports/followup-0.7.0/clean-copy.json
```

The walkthrough creates a new directory and generates clearly marked scripted review records, offline HTML, suggestions and a corrected copy. It checks that original generated inputs are unchanged. CSV manifests use `--manifest`, and optional content-keyed caching uses `--cache`; the production audit never deletes or moves input files.

Requirements remain Node.js 22+, Python 3.13 for the independent oracles, and the pinned toolchain. Core publication packaging excludes photos and host tools. Crop v2, provider-backed Agents, natural-contamination evaluation and human review timing remain outside the completed scope.
