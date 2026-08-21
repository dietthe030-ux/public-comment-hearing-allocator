# PRE_DEPLOY package — Public Comment Hearing Allocator

## Revision identity

- Checkpoint: `PRE_DEPLOY`
- Submission category: `PROJECT`
- Project folder: `E:\Genlayer-Projects\public-comment-hearing-allocator`
- Revision ID: `PCHA-PREDEPLOY-26A0634F27D72A6E`
- Revision manifest SHA-256: `26A0634F27D72A6EC2993677C97F4D60971EB24866F6F73C181A53B7C2F2C9CA`
- Contract source SHA-256: `79291EA059C0724B9565FEA9991A7393020DC3381B27941E3131886FFF9ABDA0`
- Specification: `.task/SPECIFICATION.md` (SHA-256
  `31DD` prefix previously locked; reviewer must read the file itself)
- Exact Git commit: blank at this checkpoint; GitHub preparation has not begun.

No signature, deployment transaction, or contract write has been sent.

## Product and trust model

Public hearing organizers commit a proposal and an ordered manifest of public
comments. Comment submitters can otherwise duplicate material, misstate
provenance, or compete for scarce hearing slots; the organizer must not
unilaterally choose which viewpoints receive representation. The Intelligent
Contract fetches digest-bound public evidence, uses validator consensus to form
semantic clusters, then deterministically allocates scarce slots coverage-first.
Challenges can exclude invalid provenance or near-duplicate material and trigger
deterministic reallocation. The on-chain consequence is the immutable allocation
ledger and final hearing state. The project is non-economic.

Actors: organizer (creates and locks batch), comment registrar (registers before
deadline), permissionless progress caller (cluster/allocate/resolve/finalize),
challenger, and public reader. Contract guards—not UI role labels—are authority.

## Deployment classification and locked account

- Classification: `INTENTIONALLY FROZEN`.
- Decision authority: the user delegated the Task-specific classification choice
  to primary Codex on 2026-08-22; Codex selected frozen because the approved
  trust model has no administrator/upgrader and final allocation provenance is
  intended to remain immutable.
- Consequence acknowledged under the delegated decision: a post-deployment defect
  may require deployment of a replacement contract, frontend rewiring, and a
  complete rerun of live evidence.
- Locked Studio deployer account (read-only selection):
  `0xBf90Af1bc61314775d57B641b89c1f702a93b40D`.
- Role: deployer only; it receives no organizer privilege for hearings created by
  other accounts and no upgrade authority.
- Any account or source change invalidates PRE_DEPLOY approval.

## Draft deployment manifest and recovery plan

- Network: Studionet
- Chain ID: `61999`
- RPC: `https://studio.genlayer.com/api`
- Explorer base: `https://explorer-studio.genlayer.com`
- Contract address / deployment transaction: blank until user deployment.
- Constructor arguments: none.
- Linked contracts: none.
- Upgrade path/upgrader: none; intentionally frozen.
- Header/runtime pin: official docs current on 2026-08-22 show
  `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6`.
  Installed linter passes this pin but reports a newer runner as informational;
  the official documented pin is retained. Exact source must still compile in
  Studio before deployment is counted as evidence.

Recovery limits:

1. If local Studio UI data resets but Studionet state remains, re-import the
   contract by recorded address and verify source/readbacks.
2. If the deployer account is lost, the frozen contract remains readable while
   chain state survives; no upgrade is possible or claimed.
3. If Studionet resets, the old address/state cannot be recovered. Deploy the
   exact recorded source again, rerun the complete Studio matrix, update the
   frontend address and all documentation, and obtain fresh checkpoint reviews.
4. If a defect is found, deploy a replacement; do not imply an in-place repair.

## Source and implementation verification

Contract (primary Codex independently rerun on this revision):

- `genvm-lint check contracts/public_comment_allocator.py` — PASS: lint,
  validation, 20 methods (12 view / 8 write); newer-runner note reviewed as
  nonblocking because current official docs retain the pinned runner above.
- `.venv/Scripts/python.exe -m pytest -q` — PASS: 46 tests.
- `.venv/Scripts/python.exe tests/runtime_smoke.py` — PASS:
  `RUNTIME_SMOKE_PASS` through installed `gltest.direct`.
- compileall — PASS.
- `uv pip check` — PASS: 55 packages compatible.

Frontend after Claude attempt 2 and mandatory primary-Codex takeover:

- `npm run lint` — PASS, zero warnings.
- `npm run typecheck` — PASS.
- `npm test -- --run` — PASS: 8 files / 93 tests.
- `npm run build` — PASS; one reviewed nonblocking ~799 kB chunk warning.
- Runtime config has no contract address until the accepted deployment.
- Exact three-wallet EIP-6963 chooser, no persistence/auto-reconnect, fail-closed
  receipt handling, transaction-specific create identity, explicit readback
  reconciliation, time boundaries, and contract method parity have regression
  coverage. These are not substitutes for later user/live evidence.

Takeover corrections and honest limitations are recorded in
`.task/FRONTEND_IMPLEMENTATION_REVIEW.md`.

## PRE_DEPLOY gate status

Primary Codex verdict: `APPROVED FOR ANONYMOUS PRE_DEPLOY REVIEW` for revision
`PCHA-PREDEPLOY-26A0634F27D72A6E` only.

Still prohibited until anonymous `APPROVED`: signing, deployment, or any contract
write. Later-stage fields (contract address, transaction, Explorer object,
Studio matrix, GitHub, Vercel and user E2E) are intentionally blank.

Known limitations at this checkpoint:

- No live Studio compile/deployment/receipt/readback evidence exists yet.
- No live injected-wallet or browser-responsive PASS is claimed.
- In-app Browser could not navigate to the local dev server despite HTTP 200;
  this does not block contract PRE_DEPLOY but remains a later frontend QA item.
- Studionet is temporary; network reset destroys address and state.
