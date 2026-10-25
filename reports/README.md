# Verification evidence

Each report describes the source digest, environment and time recorded in that file. A local result is not a GitHub Actions result or a statement about publication or contest submission.

- `verification.json` records the local source, backend, Node, oracle and browser-evidence checks for a delivery. Refer to its `sourceDigest`, `compiledArtifact` and evidence hashes when comparing it with changed source.
- `release-verification.json` records acceptance of the final ZIP named in the report. Its `archiveSha256` must match that archive and `release/SHA256SUMS`. A previous version's checksum does not attest to a new archive.
- `evaluation.json`, `evaluation-audit.json` and `evaluation-oracle.json` describe the deterministic synthetic image evaluation. They are not measurements of naturally occurring contamination in a licensed real dataset.
- `demo/qa/` is outside this directory and contains the browser evidence for its recorded source hashes. The source CI below does not repeat those browser interactions.

Run `npm run verify:ci` for fresh source acceptance. It writes `.ci-artifacts/verification.json`, per-check logs and an independent image evaluation without replacing the delivery reports above. It checks and tests JavaScript, Wasm GC and native backends; native release acceptance builds and executes a test executable because the pinned compiler cannot build this package as a native foreign library. Native debug tests also run.

The workflow in `.github/workflows/ci.yml` installs the checksummed compiler and standard library with `python tools/bootstrap.py`, then uploads `.ci-artifacts/` as `linux-acceptance-<commit SHA>`. A workflow file alone is not evidence that a Linux run passed: inspect the actual run and its uploaded report. CI does not publish a package, rebuild a delivery ZIP, or submit a contest entry.

The `photos-v1/` reports are controlled transformations of ten actual licensed photographs, with fixed source-disjoint development/holdout groups. `baseline-*` are immutable 0.3.0 runs, `current-*` describe the current engine, and `summary.*` aggregates the two independent experiments. Source photos, attribution, protocol and the implementation freeze are under `research/photos-v1/`. No cross-partition pairs or naturally occurring contamination are included in these metrics. `photos-demo/` is the current held-out-source orientation report with thumbnails.

## 2026-10-25 synchronization

Reports in `plan-0.5.0/` record phase 0–2 implementation, local acceptance, independent metric checks and browser evidence. Each report's recorded source digest, platform and phase define its scope. `plan-0.5.0/git-sync-2026-10-25.json` maps the local commits to public history and links fresh Linux acceptance for the synchronization batches.

At that synchronization the package version was 0.4.0 and phase 3 had not started. Phase 2 implementation evidence did not constitute an independent Claude review or a finished 0.5.0 release.

## 0.5.0 local candidate

Version metadata is now 0.5.0. Phase 3 is complete; phase 4 local verification, packaging and clean extraction acceptance are recorded in `plan-0.5.0/phase-4.md` and the current verification reports. New public synchronization and formal Mooncakes publication still require the owner's approval. Phase reviews by Codex are implementation self-review, not independent Claude review.

`photos-v1/current-*` are refreshed regression reports. Their previous bytes are preserved in `history/pre-0.5.0-20261025/`; `research/photos-v1/freeze/archive-locations.json` resolves the eight 0.4.0 baselines to those immutable files and enforces the original frozen SHA-256 values. Original freeze records and historical ZIPs remain unchanged.

`plan-0.5.0/crops-development/` and `crops-holdout/` report controlled transformations of 32 newly licensed file sources. Source and scene partitioning, freeze chronology, oracle comparisons, resource results and their limits are recorded in `plan-0.5.0/phase-3.md`. The old photos-v1 holdout is a regression set for this version.
