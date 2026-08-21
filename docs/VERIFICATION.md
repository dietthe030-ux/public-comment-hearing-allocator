# Verification Record

This document is the reviewer-facing verification record for the public release.

## Release identity

- Prior reviewed public Git commit: `2592dff51c51e9e3b63c42a94cc4608b8730a341`
- Final public Git commit: `a850ee93b24a9c8fed2d408b65df6b7a806769f8`
- Network: GenLayer Studionet
- Contract: `0xd98C7f861b0712A0102EaB56922A285Bd4AE4411`
- Deployment transaction: `0x988d91858da2f24211bf506bdabd5299c41233541d01a8f37e38c1f8b0a93068`
- Finalization transaction: `0x80391c3c2dc52faeae6cc46765967a38b387c2e03fb47d005d247830afa058c4`
- Contract source SHA-256: `B37C4040CF0C17DABA65360336668D444CE0239F385C3555AF9D7D79FD276D8F`
- Canonical manifest SHA-256: `6DD8C6A4A7B94F2133E617230D1FDB8451C7924465D845B8CF2A5C4ACE09BA18`
- Frontend: https://public-comment-hearing-allocator.vercel.app
- Vercel release inspect: https://vercel.com/dietthe030-uxs-projects/public-comment-hearing-allocator/5hZDnnJdgPo6S9QW6xwDco3voBEf

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

## Final Vercel E2E matrix

This matrix is tied to the final Vercel alias above. The wallet rows are user-executed checks; the write/readback rows are tied to the finalized Studionet transaction evidence listed in the release identity.

| # | Journey | Expected result | Evidence/status |
|---|---|---|---|
| 1 | Load the final Vercel alias | App title and Studionet contract are visible | PASS; live HTTP 200 and title verified |
| 2 | Open wallet chooser | Exactly MetaMask, OKX Wallet, and Rabby are offered | PASS; user-executed final E2E |
| 3 | MetaMask connect, disconnect, reload | Correct provider/account; disconnect; reload remains disconnected | PASS; user-executed final E2E |
| 4 | OKX Wallet connect, disconnect, reload | Correct provider/account; disconnect; reload remains disconnected | PASS; user-executed final E2E |
| 5 | Rabby connect, disconnect, reload | Correct provider/account; disconnect; reload remains disconnected | PASS; user-executed final E2E |
| 6 | Create hearing and register three comments | Wallet-confirmed writes finalize and read back exact records | PASS; create `0xd572a4625ca8fd12a5eeeb79a18055e910eb0e7e528036b88a5c807d0ee3c4e5`; registrations `0x4774d2eb39a7a96e44d65dbeb2bc7ba7b940079802d925d018f40cf335c6b1aa`, `0x8e580ec16e1f353db1c038639d6368860816f9fbed67c3a89cce43183a43aa79`, `0x6dc6998bbdab256221e5c9790e3bb46999ff1d3d647321eff3359ce914f97adb` |
| 7 | Lock, cluster, allocate | Lifecycle advances and ledger reads back | PASS; lock `0xdd09f5c12d14e8613519fe37a1a8d25192577193583931f234b950f0f0d1e6de`, cluster `0xa1e15a29f71c4823a61cf37337013cdb8d8f67def1c98ac8353f57f5834de596`, allocate `0x888a7dbdd9688bac81b65be552083acbcf3bee1375736e91c24e824b35d16eb6` |
| 8 | Accepted duplicate challenge | Revision increments and ledger reallocates | PASS; resolve `0x447e4fb85060279c322f8e804adbbeb4eb903788e0e8399ab07fd0d4aa1fc85b` |
| 9 | Rejected provenance challenge | Revision and prior ledger remain stable | PASS; resolve `0x0dce4d6f8aa08840a51aea1fb2eddac3348ef40faae7c68ef402656d21636863` |
| 10 | Duplicate replay and early finalize failures | Expected errors display; state remains unchanged | PASS; negative controls `0x40b415be563b17e7280db1c9ccd4a6f5112254b744afd1a1b809024883815b25` and `0xd3c2173d5df4b4fefea32ebd711367f1dab9a9cf8044059d5bc3946ffad9baa1` |
| 11 | Finalize and reload | Final state and zero pending challenges read back | PASS; finalization `0x80391c3c2dc52faeae97a38b387c2e03fb47d005d247830afa058c4`; final state `FINAL`, revision `1`, pending `0` |

## Public release

The public GitHub tree contains the contract, frontend, scripts, tests, manifest documentation, this verification record, and the public README. Local governance files, task transcripts, task evidence packages, and tool metadata are intentionally excluded from the public tree.
