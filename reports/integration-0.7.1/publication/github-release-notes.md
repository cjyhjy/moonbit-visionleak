MIH generation-mark integration preserves ordered pairs, local witnesses, budget counts and truncation prefixes. No ORB functionality is included in 0.7.1.

Validated with 27 local checks, JS/WasmGC/native, 58 Node tests (including 144 released-output budget cases and 12 independent exhaustive cases), Chrome desktop, 23 clean ZIP checks, and merged-head Linux CI run 41782987157 at b8d13d7d3de11729e5cc67bfe413bd0c49f07b5e.

Source/runtime ZIP SHA-256: 9a41d2e1848fe6fc4e2e93296f3ac69f6a80d287fbb575ab3ed0a66c71596e68.

Previous performance study remains macOS Node core-only; no new Linux/native/end-to-end speed claim. The first CI evidence-archive failure is retained in reports/integration-0.7.1/invalid-ci-scratch/.
