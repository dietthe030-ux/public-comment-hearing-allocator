# CLAUDE_ATTEMPT 1/2 — Frontend implementation

You are the implementation coder. Work only inside:

`E:\Genlayer-Projects\public-comment-hearing-allocator`

This is a fresh, isolated GenLayer project. Do not reuse code, addresses,
environment values, repositories, deployments, or decisions from any other
project. Do not edit `E:\Genlayer` governance or shared rules.

## Read first

Read completely before editing:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `.task/SPECIFICATION.md`
4. `DESIGN.md`
5. `contracts/public_comment_allocator.py`
6. `docs/MANIFEST_FORMAT.md`
7. `.task/CONTRACT_IMPLEMENTATION_REVIEW.md`

The specification and `DESIGN.md` are locked baselines. Do not redesign the
product, contract, lifecycle, allocation policy, or wallet requirement.

## Allowed scope

- Create and edit `frontend/**` only.
- You may read all project files.
- Do not modify contract, Python tests, docs, `.task`, root governance files,
  or root Python dependency files.
- Project-local npm dependencies under `frontend` are allowed. Do not install
  global software and do not touch `E:\Genlayer-Tools`.
- Do not initialize Git, deploy, create a repository, contact external parties,
  or create `.env` with fake values.

## Stack and simplicity

Build a minimal Vite + React + TypeScript application under `frontend` using:

- React, React DOM, TypeScript, Vite
- `genlayer-js`
- Vitest + Testing Library + jsdom for focused tests
- native CSS and browser APIs

Do not add a component framework, CSS framework, state library, router,
animation library, wallet connector package, icon package, or backend. Use
small modules and standard APIs. SVG icons may be written locally and must be
decorative or correctly labelled.

Before installing, confirm the existing Node/npm versions. Install only local
dependencies needed by the frontend and commit the resulting lockfile later
(do not Git commit now).

## Current GenLayer SDK contract

Use the official patterns currently documented:

- `createClient({ chain: studionet })` for disconnected/read operations.
- For writes, create the client with Studionet and the selected wallet account,
  call `client.connect("studionet")`, then `writeContract`.
- Wait for `TransactionStatus.FINALIZED`, inspect/query the transaction result,
  and perform an authoritative contract readback before declaring success.
- A transaction hash or receipt alone is not success.
- Reads use `readContract({ address, functionName, args })`.

If installed SDK types/API disagree with documentation, inspect the installed
package and implement against its actual public API. Document the discrepancy;
do not use `any` to silence it and do not invent an API.

## Runtime configuration

Use `VITE_CONTRACT_ADDRESS` as the only deployment-specific setting. Provide
`frontend/.env.example` with an empty value and explanatory comments—never a
placeholder address. Validate a configured value as `0x` + 40 hex characters.

When absent/invalid, render an honest “Deployment pending” read-only state and
disable contract calls. Never fall back to another project's address.

Network is Studionet only. Explorer links must use the official Studionet
Explorer base confirmed from current project/docs; centralize the base URL. If
not authoritatively known, isolate it as an empty config and hide Explorer links
instead of guessing.

## Wallet contract — blocking requirement

Implement EIP-6963 discovery and an explicit accessible chooser containing
exactly these supported wallet labels:

1. MetaMask
2. OKX Wallet
3. Rabby

Requirements:

- Discover providers by announced identity/RDNS and retain the exact selected
  provider object for all account, chain, signing, and connection operations.
- Do not use `window.ethereum` as a silent fallback and do not auto-pick a
  provider when several wallets inject.
- “Connect wallet” opens a keyboard-operable modal/listbox showing installed or
  unavailable state for all three wallets.
- Selecting an unavailable wallet explains how to install it without opening
  an unrelated provider.
- Request accounts only after the user selects a wallet.
- Handle account and chain changes on the selected provider; detach listeners
  on disconnect/unmount.
- Never persist provider, account, connection, or prior-wallet choice in local
  storage, session storage, cookies, IndexedDB, URL, or app cache.
- Every full reload must begin disconnected even when the wallet previously
  authorized the site. No eager `eth_accounts` reconnect on load.
- A user-initiated Disconnect clears all in-memory wallet state.
- Tests must cover provider collision/routing and reload-disconnected behavior.

## Product behavior

Implement one responsive application shell, not a marketing landing page.

Required surfaces:

- Edge-aligned masthead with product name, Studionet status, and wallet control.
- Hearing selector by numeric ID plus refresh.
- Lifecycle rail: COLLECTING → LOCKED → CLUSTERED → ALLOCATED → CHALLENGE →
  FINAL. Note: `allocate_slots` transitions directly to CHALLENGE; display
  ALLOCATED as a completed policy milestone, not a separately readable state.
- Hearing details: organizer, proposal URL/digest, manifest expected/computed,
  slot count, deadlines, revision, state.
- Registered comments table and canonical manifest helper/preview.
- Cluster view and allocation ledger with rationale/reason codes.
- Challenge list/details.
- Contextual forms for every valid contract write. Organizer-only actions must
  be marked and disabled for a non-organizer account; permissionless actions
  remain available.
- Transaction progress with distinct preparation, signature, submitted hash,
  finality, execution result, and readback steps.
- Empty, loading, stale/refreshing, malformed-response, RPC failure, wallet
  rejection, wrong network, pending, finalized-but-failed, and successful
  readback states.

Do not fabricate hearing data, comments, clusters, wallet state, transactions,
stats, timestamps, or testimonials. Empty states must be explicit.

## Contract methods

Writes and exact argument order:

- `create_hearing(proposal_url, proposal_digest, expected_manifest_digest,
  slot_count, registration_deadline, challenge_deadline)`
- `register_comment(hearing_id, external_id, url, digest)`
- `lock_batch(hearing_id)`
- `cluster_comments(hearing_id)`
- `allocate_slots(hearing_id)`
- `open_challenge(hearing_id, challenge_type, target_ids)` where type is
  `PROVENANCE_INVALID` (one target) or `DUPLICATE_PAIR` (two targets)
- `resolve_challenge(hearing_id, challenge_id)`
- `finalize_hearing(hearing_id)`

Views:

- `get_hearing_count()`
- `get_hearing(hearing_id)`
- `get_comment_count(hearing_id)`
- `get_comment_by_index(hearing_id, index)`
- `get_comment_by_id(hearing_id, external_id)`
- `get_all_comments(hearing_id)`
- `get_clusters(hearing_id)`
- `get_allocation_ledger(hearing_id)`
- `get_challenge(hearing_id, challenge_id)`
- `get_all_challenges(hearing_id)`
- `get_state(hearing_id)`
- `get_manifest(hearing_id)`

Treat numeric IDs/timestamps safely at the SDK boundary. Validate SHA-256 as
exactly 64 hexadecimal characters, URLs as HTTP(S), slot count 1–6, comments
max 12, external IDs 1–128 without pipe/control characters, target counts, and
deadline ordering before wallet invocation. Reuse the canonical manifest format
from `docs/MANIFEST_FORMAT.md`; include a pure, tested digest helper using Web
Crypto and registration order.

## Design implementation

Follow `DESIGN.md` exactly:

- Workbench macrostructure, austere civic “public docket” appearance.
- No gradients, glow/orbs, glassmorphism, bento/card grid, fake browser chrome,
  invented metrics, emoji icons, italic headers, or giant decorative headline.
- Use tables, definition lists, hairlines, and a lifecycle rail.
- Create `frontend/src/styles/tokens.css`; every color/type/space/easing/radius
  used by CSS must be a named token. Raw color literals belong only in this
  token file.
- First non-empty line of the main page stylesheet must be:
  `/* Hallmark · macrostructure: Workbench · tone: austere civic · anchor hue: civic blue */`
- Add `.hallmark/preflight.json` and `.hallmark/log.json` inside `frontend`,
  recording this first run, Workbench, Public docket, no enrichment, and the
  current date. Do not add invented history.
- At most two motion primitives; transform/opacity only; support
  `prefers-reduced-motion`.
- Responsive at 320/375/414/768/1024/1440; no page-level horizontal overflow.
- Full keyboard flow, semantic landmarks, labelled modal/forms, visible
  focus-visible ring, status announcements, ≥44 px touch targets, WCAG AA.

## Architecture boundaries

Keep modules small and explicit. A suitable minimal split is:

- app/UI components
- `config.ts` for validated address and Explorer base
- `genlayer/client.ts` for read/write transaction handling
- `wallet/eip6963.ts` + wallet state hook/context
- contract types/parsers (runtime-validate unknown RPC data; no blind casts)
- manifest helper
- focused tests

Do not introduce speculative abstractions. Never expose secrets or log provider
payloads/accounts beyond what the UI needs.

## Required tests and commands

At minimum test:

1. Manifest canonicalization and ordering-sensitive SHA-256.
2. Contract-address validation and deployment-pending mode.
3. EIP-6963 classification for MetaMask/OKX/Rabby, provider collision, exact
   selected-provider routing, listener cleanup, explicit disconnect, and fresh
   reload disconnected.
4. Form validation and lifecycle action gating, including organizer checks.
5. Transaction state machine: hash is not success; finalized failure is not
   success; only execution success plus authoritative readback succeeds.
6. Critical accessible chooser/form rendering.

Run and report exact outputs for:

- `npm run lint`
- `npm run typecheck`
- `npm test -- --run`
- `npm run build`

Also run a search proving no raw secrets/fake address and no forbidden wallet
persistence or `window.ethereum` fallback. Do not claim browser E2E, Studionet,
wallet extension, Vercel, or deployment PASS; those require later user evidence.

## Completion report

Return:

- files created/changed;
- architecture and wallet-routing summary;
- exact dependency versions;
- exact commands/results and test count;
- Hallmark preflight + 58-gate slop-test result (list any failures honestly);
- SDK/documentation discrepancy, if any;
- unresolved risks/blockers;
- statement that only `frontend/**` changed.

Do not merely report success. Leave the filesystem with the implementation and
evidence so primary Codex can independently inspect source, diff, tests, and
build output.
