# VisionLeak 0.9.0 candidate

This candidate makes large ORB audits reusable and recoverable: content/config/runtime-bound feature and completed-direction caches, disk batching with two resident feature payloads, OS locks, and durable scan checkpoints. Optional descriptor retrieval has separate index budgets and reports candidate-queue completion independently from exhaustive coverage. Defaults stay bounded; larger total-pixel budgets require explicit settings.

Full original COCO val2017 inputs (5000 images, 1,368,653,453 source/ORB pixels) passed cold, warm and actual interrupted-host recovery checks. The selected4975 pairs completed under repeated finite budgets; this is approximate coverage, not exhaustive absence-of-contamination evidence. Reported timings are exploratory wall time, not population or statistical speedup guarantees.

Doctor, bulk review/shared-image navigation and strict cross-audit transfer logic are included. Browser file-transfer preview/apply/undo passed on retry using a native Chrome accessibility click plus the documented browser chooser. No manual user action or permission change was needed. Existing Investigator Core0.8.0 integration was verified independently, not upgraded to unreleased0.9 by this candidate.

The public CIFAR/ciFAIR natural baseline retains79TP/170FN and3FP/34TN at default Core threshold6, plus4 unlabelled candidates. These are curated32px author annotations, not photo-scale ORB accuracy or a new human review-timing study. Human timing remains unmeasured.

This is a local candidate, not a published release. Same-source macOS and isolated Linux CI each passed30 checks (Node83 with zero skips, MoonBit85 per backend/native release); Linux x86 userland ran under Rosetta in an isolated ARM64 VM and is not a native-x86 performance result. A fresh local thumbnail-service check, final package extraction/rebuild and publication checks remain to be completed. Mooncakes distributes Core only; full ORB requires the source/Node bundle and pinned optional Python dependencies.
