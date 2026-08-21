# Public Comment Hearing Allocator

A GenLayer Studionet application for transparent, evidence-backed public-comment hearing allocation.

The contract collects a bounded comment batch, verifies evidence during consensus, clusters comments, allocates limited hearing slots with deterministic tie-breaking, and supports provenance and near-duplicate challenges before finalization.

## Live deployment

- Frontend: https://public-comment-hearing-allocator.vercel.app
- Explorer: https://explorer-studio.genlayer.com/address/0xd98C7f861b0712A0102EaB56922A285Bd4AE4411
- Network: GenLayer Studionet
- Contract: `0xd98C7f861b0712A0102EaB56922A285Bd4AE4411`

The frontend supports MetaMask, OKX Wallet, and Rabby through EIP-6963 provider discovery. Wallet sessions are intentionally disconnected after reload.

## Contract

Source: [`contracts/public_comment_allocator.py`](contracts/public_comment_allocator.py)

The lifecycle is `COLLECTING -> LOCKED -> CLUSTERED -> ALLOCATED -> CHALLENGE -> FINAL`. The canonical manifest format is documented in [`docs/MANIFEST_FORMAT.md`](docs/MANIFEST_FORMAT.md).

## Development

```text
cd frontend
npm ci
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

Contract checks require the pinned project environment described by `pyproject.toml` and `uv.lock`.

## Verification

See [`docs/VERIFICATION.md`](docs/VERIFICATION.md) for deployment identifiers, authoritative readback, test results, and public release evidence.
