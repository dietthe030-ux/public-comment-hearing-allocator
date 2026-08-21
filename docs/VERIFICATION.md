# Verification Record

This document is the reviewer-facing verification record for the public release.

## Release identity

- Network: GenLayer Studionet
- Contract: `0xd98C7f861b0712A0102EaB56922A285Bd4AE4411`
- Deployment transaction: `0x988d91858da2f24211bf506bdabd5299c41233541d01a8f37e38c1f8b0a93068`
- Finalization transaction: `0x80391c3c2dc52faeae6cc46765967a38b387c2e03fb47d005d247830afa058c4`
- Contract source SHA-256: `B37C4040CF0C17DABA65360336668D444CE0239F385C3555AF9D7D79FD276D8F`
- Canonical manifest SHA-256: `6DD8C6A4A7B94F2133E617230D1FDB8451C7924465D845B8CF2A5C4ACE09BA18`
- Frontend: https://public-comment-hearing-allocator.vercel.app

## Authoritative Studionet result

The deployment and finalization transactions were read back from the Studionet RPC. Both finalized with consensus and successful leader execution. The final contract state is `FINAL`, revision `1`, with two selected comments, one accepted duplicate challenge, one rejected provenance challenge, and zero pending challenges. The three-line canonical comment manifest read back with an exact digest match.

## Contract verification

- GenLayer lint: PASS
- Direct-mode contract tests: 50 passed
- Runtime smoke test: PASS
- Python compilation: PASS
- Dependency check: PASS

## Frontend verification

- ESLint: PASS
- TypeScript typecheck: PASS
- Vitest: 93 passed
- Production build: PASS
- Live URL response: HTTP 200
- Wallet chooser: MetaMask, OKX Wallet, and Rabby are discovered through EIP-6963 allowlisted RDNS values; provider-supplied logos are used with local fallbacks.
- Wallet session behavior: no wallet session is persisted across reload.

## Public release

The public GitHub tree contains the contract, frontend, scripts, tests, manifest documentation, this verification record, and the public README. Local governance files, task transcripts, task evidence packages, and tool metadata are intentionally excluded from the public tree.
