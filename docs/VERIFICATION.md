# Verification Record

This document is the reviewer-facing verification record for the public release.

## Release identity

- Prior approved public Git commit: `fbe2881d7b9a6d3c9e9d7d840176886fd28fae06`
- Correction source/public Git commit: `c907de4f7f8227ce7964569c4adceb210b8d3980`
- Documentation lineage: judge-requested correction after `fbe2881d7b9a6d3c9e9d7d840176886fd28fae06`
- Network: GenLayer Studionet
- Contract: `0x5ed3410A6cb6766339394828D0f35DdB0eCE4f86`
- Deployment transaction: `0xd568b8eb1baef25fbd05978aecdfb983d8bf8c9bd06b8a96ca837aa38e47db7e`
- Prior approved finalization transaction (previous release): `0x80391c3c2dc52faeae6cc46765967a38b387c2e03fb47d005d247830afa058c4`
- Contract source SHA-256: `0B338E54EA482D147E677A7C721D25593E24FF722AA4F8E3D462B14C718C83A3`
- Correction smoke canonical manifest SHA-256: `00F955340697087D2266AF2C5B8A12F3204E2D0B8AC54251A9C25E233EF25AF1`
- Frontend: https://public-comment-hearing-allocator.vercel.app
- Vercel release inspect: https://vercel.com/dietthe030-uxs-projects/public-comment-hearing-allocator/AS86Cf5vp8erkvM58VUrMhW3Dt81

## Authoritative Studionet result

The prior approved deployment remains the evidence for the original release. The correction deployment is a new Studionet instance because the judge-requested signer-bound admission and pre-lock recovery behavior changes contract source. The correction deployment, create-hearing transaction, and two organizer-signed registration transactions finalized successfully. A fresh lock/clustering/allocation/challenge/finalization run and frontend E2E package are required before final resubmission.

## Contract verification

- GenLayer lint: PASS
- Direct-mode contract tests: 52 passed
- Runtime smoke test: PASS
- Python compilation: PASS
- Dependency check: PASS

## Frontend verification

- ESLint: PASS
- TypeScript typecheck: PASS
- Vitest: 94 passed
- Production build: PASS
- Live URL response: HTTP 200
- Wallet chooser: MetaMask, OKX Wallet, and Rabby are discovered through EIP-6963 allowlisted RDNS values; provider-supplied logos are used with local fallbacks.
- Wallet session behavior: no wallet session is persisted across reload.

## Prior release Vercel E2E matrix

The prior matrix below belongs to the previously approved release. A new numbered matrix tied to the correction deployment and final Vercel release is required; Studio transactions are not substitutes for user-owned frontend evidence.

| # | Journey | Expected result | Evidence/status |
|---|---|---|---|
| 1 | Load the final Vercel alias | App title and Studionet contract are visible | PASS; live HTTP 200 and title verified |
| 2 | Open wallet chooser | Exactly MetaMask, OKX Wallet, and Rabby are offered | PASS; user-executed final E2E |
| 3 | MetaMask connect, disconnect, reload | Correct provider/account; disconnect; reload remains disconnected | PASS; user-executed final E2E |
| 4 | OKX Wallet connect, disconnect, reload | Correct provider/account; disconnect; reload remains disconnected | PASS; user-executed final E2E |
| 5 | Rabby connect, disconnect, reload | Correct provider/account; disconnect; reload remains disconnected | PASS; user-executed final E2E |
| 6 | Create hearing and register three comments | User confirms wallet-confirmed writes, lifecycle progress, and exact frontend readback | PASS; user-executed final Vercel E2E; retained hashes: create `0xd572a4625ca8fd12a5eeeb79a18055e910eb0e7e528036b88a5c807d0ee3c4e5`, registrations `0x4774d2eb39a7a96e44d65dbeb2bc7ba7b940079802d925d018f40cf335c6b1aa`, `0x8e580ec16e1f353db1c038639d6368860816f9fbed67c3a89cce43183a43aa79`, `0x6dc6998bbdab256221e5c9790e3bb46999ff1d3d647321eff3359ce914f97adb` |
| 7 | Lock, cluster, allocate | User confirms lifecycle progress, transaction stages, and ledger readback | PASS; user-executed final Vercel E2E; retained hashes: lock `0xdd09f5c12d14e8613519fe37a1a8d25192577193583931f234b950f0f0d1e6de`, cluster `0xa1e15a29f71c4823a61cf37337013cdb8d8f67def1c98ac8353f57f5834de596`, allocate `0x888a7dbdd9688bac81b65be552083acbcf3bee1375736e91c24e824b35d16eb6` |
| 8 | Accepted duplicate challenge | User confirms accepted challenge, revision increment, and reallocation readback | PASS; user-executed final Vercel E2E; retained resolve hash `0x447e4fb85060279c322f8e804adbbeb4eb903788e0e8399ab07fd0d4aa1fc85b` |
| 9 | Rejected provenance challenge | User confirms rejected challenge and unchanged revision/ledger readback | PASS; user-executed final Vercel E2E; retained resolve hash `0x0dce4d6f8aa08840a51aea1fb2eddac3348ef40faae7c68ef402656d21636863` |
| 10 | Duplicate replay and early finalize failures | User confirms expected UI errors, unchanged state, and retry/recovery behavior | PASS; user-executed final Vercel E2E; retained negative controls `0x40b415be563b17e7280db1c9ccd4a6f5112254b744afd1a1b809024883815b25` and `0xd3c2173d5df4b4fefea32ebd711367f1dab9a9cf8044059d5bc3946ffad9baa1` |
| 11 | Finalize and reload | User confirms finalization, final-state readback, disconnect/reload behavior | PASS; user-executed final Vercel E2E; retained finalization `0x80391c3c2dc52faeae97a38b387c2e03fb47d005d247830afa058c4`; final state `FINAL`, revision `1`, pending `0` |

## Public release

The public GitHub tree contains the contract, frontend, scripts, tests, manifest documentation, this verification record, and the public README. Local governance files, task transcripts, task evidence packages, and tool metadata are intentionally excluded from the public tree.
