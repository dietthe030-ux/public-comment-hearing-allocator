# Public Comment Hearing Allocator — PRE_DEPLOY Re-review R2

- Revision ID: `PCHA-PREDEPLOY-9040CD546B9264DA`
- Canonical source-manifest SHA-256: `9040CD546B9264DAABD5615835FF79F972EDC316B6654A80F74D0F39D762C9F1`
- Contract SHA-256: `4A64A644BE1C20F73234384A53C158B17B43354B258646A8E81E76A2ADC9B15F`
- Network: Studionet
- Locked deployer-only account: `0xBf90Af1bc61314775d57B641b89c1f702a93b40D`
- Deployment classification: `INTENTIONALLY FROZEN`; defects require replacement deployment and a full evidence rerun.
- No signature, deployment, or contract write has occurred.

## Blocker remediation

1. Reproducible exact revision
   - Canonical manifest: `.task/REVISION_MANIFEST.txt`.
   - Generator/verifier: `scripts/revision_manifest.py`.
   - Canonical bytes are UTF-8 LF lines sorted by POSIX relative path in the exact form `UPPERCASE_SHA256|path\n`.
   - The manifest covers the contract, approved specification, docs, scripts (including its own generator), tests, Python lock/config, frontend source/config/tests/package lock, and frontend Hallmark metadata. Generated dependencies/build/cache and evidence wrappers are excluded.
   - Reproduce: `.\.venv\Scripts\python.exe scripts\revision_manifest.py --verify`.

2. Accepted-challenge reclustering
   - `cluster_comments` and `resolve_challenge` now share `_derive_clusters`, which independently re-fetches and digest-verifies the currently eligible locked batch and re-runs semantic clustering consensus.
   - An accepted challenge excludes the target, increments revision, re-derives clusters from all remaining eligible locked comments, then re-runs the unchanged deterministic allocation policy.
   - Empty eligible batches produce empty clusters and allocation without inventing a cluster.
   - Reclustering evidence failure raises a retryable error and preserves the pending challenge, revision, eligibility, clusters, and allocation.
   - Regression coverage proves changed cluster membership/coverage, duplicate exclusion, empty-cluster behavior, and fail-closed rollback.

## Verification

- `genvm-lint check contracts/public_comment_allocator.py`: PASS, 20 methods (12 view, 8 write).
- `pytest -q`: PASS, 48 tests.
- `tests/runtime_smoke.py`: `RUNTIME_SMOKE_PASS`.
- `compileall`: PASS.
- `uv pip check`: 55 compatible.
- Frontend lint/typecheck: PASS.
- Frontend Vitest: 8 files, 93 tests PASS.
- Frontend production build: PASS; known non-blocking 798.80 kB chunk warning.
- Manifest generate + independent verify: PASS, exact hash above.

## Primary verdict

`APPROVED FOR ANONYMOUS PRE_DEPLOY RE-REVIEW` for exact revision
`PCHA-PREDEPLOY-9040CD546B9264DA` only. Deployment remains blocked until the
anonymous co-review AI returns `APPROVED` for this exact revision.
