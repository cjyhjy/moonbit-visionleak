# Repository history and publication

This repository preserves nine VisionLeak development commits extracted from the original local multi-project Git repository with `git subtree split --prefix=projects/visionleak`. The extraction used no squash or message annotation. Original commits belonging only to other projects are absent.

The original local commits span **2026-10-22 11:28:15–11:58:50 America/New_York**. They became publicly visible only when this independent repository was first pushed; their original timestamps do not imply earlier public availability or contest eligibility.

[history-extraction.json](history-extraction.json) maps each original local commit to its extracted commit and root tree. For all nine entries, author and committer identities, timestamps, complete messages, and the original `projects/visionleak` subtree were checked against the extracted metadata and root tree. Commit IDs change because the repository root and parent graph change. The last extracted commit is `d7cc72eae2523b818e6c17b990f824bacbe5d2d4`; subsequent commits contain independent-repository setup and genuine fixes.

No historical commits were rewritten to create a longer development timeline. The mapping's original IDs refer to the local source repository and are not presented as public GitHub links.

The committed reports, browser screenshots, source digests and release checksum predate the public CI setup. Their scope is documented in [reports/README.md](../reports/README.md). Fresh Linux CI evidence is attached to each [Actions run](https://github.com/cjyhjy/moonbit-visionleak/actions/workflows/ci.yml), with its actual commit SHA and platform. A successful run is automated verification, not human review, package publication, or formal contest submission.

## 2026-10-25 follow-up synchronization

Nine additional commits from the original project's local history were synchronized in two batches, after the existing public commit `f77a531`. Original author and committer identities, dates, and complete messages were preserved. For each published tree, every path outside the three retained standalone history files (`docs/history-extraction.json`, `docs/history.md`, and `reports/README.md`) matches the original project subtree exactly. The following documentation commit reconciles the current report index with the retained history documents. The existing public ancestry was retained; there was no force push or rewrite.

The first batch contains five commits for cumulative 0.2–0.4 work and phase 0–1 remediation; the second contains four phase 2 commits. Earlier 0.2 and 0.3 changes did not have separate original commit boundaries, so this synchronization does not fabricate historical version tags or separate release dates. Version metadata remains 0.4.0 while the 0.5.0 plan is in progress.

[git-sync-2026-10-25.json](../reports/plan-0.5.0/git-sync-2026-10-25.json) records the original-to-public commit mapping, both batch heads, source digests, local checks and Linux CI runs. A following documentation commit records this synchronization and restores the CI badge. Package registries were not published by this operation.
