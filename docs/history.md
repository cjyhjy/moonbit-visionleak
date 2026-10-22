# Repository history and publication

This repository preserves nine VisionLeak development commits extracted from the original local multi-project Git repository with `git subtree split --prefix=projects/visionleak`. The extraction used no squash or message annotation. Original commits belonging only to other projects are absent.

The original local commits span **2026-10-22 11:28:15–11:58:50 America/New_York**. They became publicly visible only when this independent repository was first pushed; their original timestamps do not imply earlier public availability or contest eligibility.

[history-extraction.json](history-extraction.json) maps each original local commit to its extracted commit and root tree. For all nine entries, author and committer identities, timestamps, complete messages, and the original `projects/visionleak` subtree were checked against the extracted metadata and root tree. Commit IDs change because the repository root and parent graph change. The last extracted commit is `d7cc72eae2523b818e6c17b990f824bacbe5d2d4`; subsequent commits contain independent-repository setup and genuine fixes.

No historical commits were rewritten to create a longer development timeline. The mapping's original IDs refer to the local source repository and are not presented as public GitHub links.

The committed reports, browser screenshots, source digests and release checksum predate the public CI setup. Their scope is documented in [reports/README.md](../reports/README.md). Fresh Linux CI evidence is attached to each [Actions run](https://github.com/cjyhjy/moonbit-visionleak/actions/workflows/ci.yml), with its actual commit SHA and platform. A successful run is automated verification, not human review, package publication, or formal contest submission.
