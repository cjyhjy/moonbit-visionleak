# VisionLeak 0.6.0 delivery

The previous 0.4.0 delivery record is preserved at reports/history/pre-0.5.0-20261025/DELIVERY-0.4.0.md. Historical ZIPs and freeze records remain unchanged.

## Run

Requires Node.js 22+; development acceptance uses Python 3.13 and the checksummed MoonBit toolchain in toolchain.lock.json.

```sh
npm ci
node tools/cli.mjs audit --root fixtures/crop-demo --out output/crops --include-crops --fail-on candidate
node tools/server.mjs --report output/crops/report.json --port 4173
```

The controlled example contains a byte copy and local crop candidates, so the audit deliberately exits 3. The tool never deletes or moves source images.

## Evidence

- reports/verification.json: final current-source verification, compiled artifact and browser evidence hashes.
- reports/release-verification.json: acceptance of release/visionleak-0.6.0.zip outside the archive; release/SHA256SUMS contains its digest.
- reports/plan-0.5.0/phase-3.md: frozen crop experiment, source/scene split, independent oracles, 1k/5k resource runs and limitations.
- research/photos-v2/ATTRIBUTION.md: 32 CC0 file sources with per-file authors, license pages and hashes; old photos-v1 holdout is a regression set.
- docs/changes-0.5.0.md: breaking max-pixels semantics and migration to max-decode-pixels.

The source/runtime ZIP is separate from the Mooncakes core archive. The core archive has a strict sub-1,000,000-byte contract and excludes host code, evaluation photos, screenshots, tests and reports.

## Rebuild and verify

```sh
python3.13 tools/bootstrap.py
npm run build
npm run verify:ci
node tools/verify.mjs
python3.13 tools/package.py
python3.13 tools/accept-release.py
```

The final verification refreshes current report pointers; prior report bytes are archived with checksums under reports/history/pre-0.5.0-20261025. Actual public synchronization, registry publication and clean-import receipts are under reports/plan-0.6.0/publication/. The final Release upload and download attestation is recorded outside the ZIP. npm remains private.

0.6.0 migration and downstream contract: docs/changes-0.6.0.md. The 0.5.0 delivery text is archived under reports/history/pre-0.6.0-20261026/. Crop v2 and end-to-end streaming decode are not enabled.
