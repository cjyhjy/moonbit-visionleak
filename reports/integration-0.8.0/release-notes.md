# VisionLeak 0.8.0 — opt-in ORB geometric candidates

Adds `--include-orb` to the Node host with pinned optional Python/OpenCV dependencies. Reports carry geometric witnesses, explicit phase budgets and partial coverage. The workbench displays projected crop regions and inliers, with review, undo and exports. Deterministic evidence remains first; ORB remains an experimental candidate requiring review.

Local acceptance: 30 checks, 83 tests per MoonBit backend, 63 Node tests with real ORB enabled, 23 clean ZIP checks and desktop/390px Chrome. Linux acceptance preserves all frozen known-source hits (development 136/144, prior holdout 67/72, no new FP). Cross-platform numerical differences are recorded and checked against the unchanged frozen algorithm on each platform.

Native performance is mixed: known-photo workload faster, sparse workload slower. Capacity measurements use generated inputs and bounded ORB prefixes. Natural-contamination accuracy and human review time remain unmeasured.

The GitHub ZIP includes the complete host, sources and evidence. Mooncakes provides only reusable MoonBit Core/report validation; it does not bundle the Python worker. See docs/changes-0.8.0.md and reports/integration-0.8.0/README.md.

Candidate ZIP SHA-256: eea07e314504f2e63a35f5bc7fe8ab071a26cece750a9e93d11bc0b1f7724127
