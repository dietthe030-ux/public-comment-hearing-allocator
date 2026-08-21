# Frontend implementation review

Status: **ACCEPTED FOR PRE_DEPLOY PREPARATION** after primary-Codex takeover.
This is not a PRE_DEPLOY approval and contains no live wallet, Studionet,
Explorer, Vercel, or user-E2E claim.

## Claude attempt result

Claude Attempt 2 reached 92 passing tests but was not accepted as delivered:

1. `executeWrite` emitted `reading_contract` and `completed` immediately after
   receipt classification, before any authoritative contract readback.
2. EIP-6963 discovery claimed UUID + provider-identity deduplication but stored
   by UUID only, allowing a colliding provider object to replace authority.
3. Studionet Explorer was configured with the wrong hostname
   (`explorer.studio.genlayer.com`).

Because this was Claude's second frontend attempt, primary Codex took over.

## Primary takeover corrections

- Transaction completion now occurs only in the application after the intended
  hearing state is read successfully. A failed readback enters explicit
  `reconciliation_required`, preserves the transaction hash, and warns against
  resubmission.
- EIP-6963 re-announcements update only when UUID and provider identity agree;
  UUID/provider collisions fail closed. Added a collision regression.
- Explorer is now the current official Studionet host:
  `https://explorer-studio.genlayer.com`.
- Corrected the inaccurate Attempt-2 report: finalization is eligible only from
  `CHALLENGE`, matching the contract.

## Independent verification

- `npm run lint` — PASS, zero warnings.
- `npm run typecheck` — PASS.
- `npm test -- --run` — PASS, 8 files / 93 tests.
- `npm run build` — PASS; nonblocking ~799 kB chunk warning remains.
- Scoped persistence/global-provider/obsolete-Explorer scan — no runtime use.
- Local HTTP probe — PASS (HTTP 200).
- In-app Browser local navigation timed out; therefore no visual-browser or
  responsive PASS is claimed here. Unit DOM checks are not a live-browser gate.

## Remaining stage conditions

- Real contract address is intentionally absent until user-guided Studio deploy.
- Live wallet routing, transaction receipt shapes, contract readback, responsive
  behavior, and reload-disconnected behavior require later user/live evidence.
- PRE_DEPLOY requires the user-selected Studio deployer/upgrader public address
  and an anonymous co-review AI `APPROVED` verdict for the exact package.
