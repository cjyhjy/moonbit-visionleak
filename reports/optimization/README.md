# Unreleased optimization evidence

Implementation and limitations: `../../docs/optimization.md`.

- `ci-verification.json` / `ci-logs/`: 25 acceptance stages passed, including 81 MoonBit tests on each of JS/Wasm-GC/native, 49 Node integration tests, independent image oracles and historical regressions. Source digest was checked again after acceptance.
- `equivalence.json`: 14 ordered historical crop comparisons at thresholds 0/1/3/4/6/7/8, including witness identity.
- `scale-measured/results.json`: real CLI resource observations; compare against `../plan-0.5.0/scale-phase3-final/results.json`. Same generator/budgets; old baseline measurements were recorded earlier, not simultaneous timings.
- `fingerprint-memory.json`: three isolated-process 4MP observations per mode, with complete fingerprint equality assertions.
- `decode-probe.json`: both raw buffer and raw stream produced one complete 48 MB output block. No end-to-end streaming change was enabled.
- `crop-v2-probe.json`: exploratory stricter multi-witness profile on already-viewed photos. Not promoted: local recall fell to 18.2%; no fresh holdout validation.
- `workbench-desktop.png`, `workbench-mobile.png`: inspected screenshots of current overlays. The current browser receipt is `../../demo/qa/verification.json`; the original is retained in `baseline-demo-verification.json`.

The `scale/` directory contains only a failed sandbox timing attempt (`sysctl` denied); it is not evidence of a product failure and is excluded from the successful measurements above. Experiments are reproducible with scripts under `../../research/optimization/`.

No new version was published. Original release archives and historical freeze/report files were preserved.
