# Public Comment Hearing Allocator

## 1. Trust problem

Public hearings often have more comments than available speaking slots. A trusted allocator must preserve submitted evidence, make representative selection understandable, resist duplicate or invalid-source claims, and leave a reviewable record of every decision.

## 2. Why GenLayer is essential

The input evidence is external web content and clustering is non-deterministic. GenLayer consensus lets independent validators fetch and compare source evidence while the contract keeps the manifest, digest checks, challenge lifecycle, deterministic tie-breaking, and final state on-chain.

## 3. Complete actor journeys

### Organizer

1. Connect MetaMask, OKX Wallet, or Rabby on GenLayer Studionet.
2. Create a hearing with proposal URL, proposal digest, manifest digest, slot count, and deadlines.
3. Admit comments from the authenticated organizer wallet in canonical order and lock the batch with the expected manifest digest. Other wallets cannot poison the batch.
4. Run clustering and deterministic slot allocation.
5. Review the allocation ledger and challenge results, then finalize after the challenge period.

### Comment submitter

The organizer/admission authority provides an external ID, canonical HTTPS URL, and SHA-256 digest for each public record. The contract binds every comment to the organizer's authenticated transaction signer and a receipt derived from the exact hearing, record, URL, digest, and signer. Other wallets cannot register comments. Malformed, duplicate, or late admissions are rejected before lock.

### Challenger and reviewer

Anyone may open an allowed provenance or duplicate-pair challenge during the challenge window. Consensus evaluates the challenge; an accepted challenge increments the hearing revision and deterministically reallocates slots. Finalization is blocked while a dispute remains pending.

## 4. Architecture and source-of-truth boundary

- Intelligent Contract: [`contracts/public_comment_allocator.py`](contracts/public_comment_allocator.py) is the source of truth for state, validation, consensus calls, allocation, disputes, and finalization.
- Frontend: [`frontend/`](frontend/) is a read/write client and never substitutes local state for authoritative contract readback.
- Manifest tooling: [`scripts/manifest_helper.py`](scripts/manifest_helper.py) implements the canonical `<index>|<external_id>|<url>|<digest>` format.

## 5. Transaction lifecycle

`COLLECTING -> LOCKED -> CLUSTERED -> ALLOCATED -> CHALLENGE -> FINAL` (or `CANCELLED` before lock)

Every write displays wallet confirmation, submission, consensus/finality, execution verification, contract readback, and completion. A successful transaction whose readback cannot be reconciled is surfaced as reconciliation-required.

## 6. Deployment and recovery

- Network: GenLayer Studionet
- Contract: `0x5ed3410A6cb6766339394828D0f35DdB0eCE4f86`
- Deployment transaction: `0xd568b8eb1baef25fbd05978aecdfb983d8bf8c9bd06b8a96ca837aa38e47db7e`
- Correction smoke transactions: create `0xca246b410f007e64116da5ff1d6ff20f12d0b9b760150581021e2dde75935e58`; registrations `0x06b78b676030d0330198a2ad2a2622c74dbdb78075f7947745d0a6881492c984` and `0x736e0499bf1fded36cc6aca13bb022dc16e6a6b0a5828493c93e24deeaa7f1ea`.
- Explorer: https://explorer-studio.genlayer.com/address/0x5ed3410A6cb6766339394828D0f35DdB0eCE4f86
- Live frontend: https://public-comment-hearing-allocator.vercel.app

If a wallet prompt or browser session is interrupted, the frontend retains the transaction hash, stops automatic resubmission, and requires authoritative refresh/readback before another attempt. Before lock, the organizer can cancel a tainted or incomplete admission batch and create a replacement hearing with a new manifest; after lock, the committed batch is immutable.

## 7. Security and trust boundaries

- Only allowlisted EIP-6963 RDNS values are accepted: `io.metamask*`, `com.okx.wallet`, `com.okex.wallet`, and `io.rabby`.
- The selected provider object is bound exactly; display names and icons are not used to authorize a wallet.
- URL, digest, deadline, duplicate, state-transition, and challenge validations execute at the contract boundary.
- Admission is signer-bound: `gl.message.sender_address` must equal the hearing's organizer/admission authority, and `lock_batch` rechecks every stored admission receipt.
- External evidence is untrusted input and is digest-checked before it can affect clustering.
- No wallet session, key, token, or prior wallet choice is persisted by the frontend.

## 8. Known limitations

- This is a Studionet demonstration, not an economic mainnet deployment.
- Clustering depends on reachable HTTPS evidence and consensus availability.
- The contract intentionally bounds a batch to 12 comments, 6 slots, and 6 clusters.
- The frontend bundle is currently a single Vite chunk and reports a size warning during build; functionality and tests are unaffected.

## 9. Verification

See [`docs/VERIFICATION.md`](docs/VERIFICATION.md) for exact source identity, test results, authoritative readback, and the numbered final Vercel E2E matrix.

## Development

```text
cd frontend
npm ci
npm run lint
npm run typecheck
npm test -- --run
npm run build
```
