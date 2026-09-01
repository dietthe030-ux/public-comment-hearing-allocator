# Verification Record

This document is the reviewer-facing verification record for the public release.

## Release identity

- Prior approved public Git commit: `fbe2881d7b9a6d3c9e9d7d840176886fd28fae06`
- Correction contract-source commit: `a5fb6be2f66eb522ee1f0e0ad4440b7e131592c7`
- Correction public-source/docs commit: `733d43e702e52a8646860b8666f6fcb50f2035ae`
- Reviewed exact application/source commit: `1cb770305cfaf340a07a9ef7ca4bb9252be69755`
- Documentation lineage: public verification correction after the selected-wallet provider fix
- Network: GenLayer Studionet
- Contract: `0x5ed3410A6cb6766339394828D0f35DdB0eCE4f86`
- Deployment transaction: `0xd568b8eb1baef25fbd05978aecdfb983d8bf8c9bd06b8a96ca837aa38e47db7e`
- Prior approved finalization transaction (previous release): `0x80391c3c2dc52faeae6cc46765967a38b387c2e03fb47d005d247830afa058c4`
- Contract source SHA-256: `0B338E54EA482D147E677A7C721D25593E24FF722AA4F8E3D462B14C718C83A3`
- Correction smoke canonical manifest SHA-256: `00F955340697087D2266AF2C5B8A12F3204E2D0B8AC54251A9C25E233EF25AF1`
- Correction production-fixture manifest SHA-256: `8CC4B33E2CC0A3802EBC8233C17EA615A1F060FD6DFFA0C44A17D5B38D34364F`
- Frontend: https://public-comment-hearing-allocator.vercel.app
- Vercel release inspect: https://vercel.com/dietthe030-uxs-projects/public-comment-hearing-allocator/62o7nduQuf9xBMQ9XRaR5RL4nk2Y

## Authoritative Studionet result

The correction deployment is a new Studionet instance because the judge-requested signer-bound admission and pre-lock recovery behavior changes contract source. The correction evidence uses disposable hearings on that same contract. Hearing 6 completed the Full Consensus path through lock, clustering, allocation, challenge open, and challenge resolution; hearing 5 completed finalization after its challenge deadline. All authoritative reads below are from the correction contract `0x5ed3410A6cb6766339394828D0f35DdB0eCE4f86`.

### Correction POST_DEPLOY_TEST receipts

| Hearing | Method | Finalized transaction | Result |
|---|---|---|---|
| 6 | create_hearing | `0xab7b720b4c98fb43befc3c5e326f210e5de3a01ad97de2caaea51df87a7b8571` | SUCCESS |
| 6 | register_comment c1 | `0xb863...` | SUCCESS |
| 6 | register_comment c2 | `0x49cc...` | SUCCESS |
| 6 | lock_batch | `0xbb2b65e7262b648f32de2f9c5cbfdfb6a894c1c017e03794b8754cf64589ff76` | SUCCESS; manifest parity |
| 6 | cluster_comments | `0x38768db47b16837e9c2e1dc7495991f3d98be38d2f2bd7e479f6e9c782349a66` | SUCCESS; Full Consensus |
| 6 | allocate_slots | `0x9fb727751aebf0852ac2fa5924a04917564e277fc63062670c56b9c1e4cfeec8` | SUCCESS; Full Consensus |
| 6 | open_challenge | `0x720d8329726fb122702e2dfd7c0f7a4dad7dc05a9f3724578b47eb8afd5ea9ef` | SUCCESS |
| 6 | resolve_challenge | `0xdeafb1953e8d64994e0d5490c6f250c547f165ab530d85edb0e84ef0babf65fa` | SUCCESS; REJECTED; pending 0 |
| 5 | finalize_hearing | `0x7387c317e4bc01909f529e94259039fbacd2a68dc8512570b2db758eb8668967` | SUCCESS; FINAL |

Hearing 6 authoritative readback: `CHALLENGE`, `comment_count=2`, `computed_manifest_digest=expected_manifest_digest=8cc4b33e2cc0a3802ebc8233c17ea615a1f060fd6dffa0c44a17d5b38d34364f`, `total_challenge_count=1`, `pending_challenge_count=0`, and both registrars equal the admission authority `0x34b92e6553eaca11a00a9d86d75d8a7881779d78`. Hearing 5 authoritative final readback: `FINAL`, `comment_count=2`, matching computed/expected manifest digest, `pending_challenge_count=0`.

Production fixture evidence is served by the exact final Vercel alias:

- Proposal: `https://public-comment-hearing-allocator.vercel.app/fixtures/hearing-proposal.txt` SHA-256 `9cb52e04c528a1b07524e0deb58a599da88ccabbcf7b9daf8be06b333c416d11`
- Comment c1: `https://public-comment-hearing-allocator.vercel.app/fixtures/comment-access.txt` SHA-256 `5c6108bc8a28ca22aa1014649dbc7eadda42ef6eff903a361624f59c57dd3dab`
- Comment c2: `https://public-comment-hearing-allocator.vercel.app/fixtures/comment-monitoring.txt` SHA-256 `df70ddfb9f49d66062449e9c0056ca48dfe131c98873f0712dd748db1b1b799a`

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
- Wallet chooser: MetaMask, OKX Wallet, and Rabby are allowlisted by EIP-6963 RDNS; only detected providers are rendered, with provider-supplied logos and local fallbacks. In the user Chrome run, MetaMask and OKX were detected and Rabby was correctly omitted because it was not installed.
- Wallet session behavior: no wallet session is persisted across reload.
- Selected-provider write routing: the frontend passes the selected EIP-6963 provider into the write transport and does not call GenLayer client connect, which would otherwise fall back to the global `window.ethereum` provider. The user-owned run confirmed OKX signatures for every write below.

## Current exact release Vercel E2E matrix

Every row below was executed by the user through the final Vercel alias `https://public-comment-hearing-allocator.vercel.app` served by Vercel deployment `62o7nduQuf9xBMQ9XRaR5RL4nk2Y`, using the connected OKX Wallet. Docket #8 was signed by `0x2deacd...44ed`; Docket #10 was signed by `0xbf90...b40d`; each docket's stored organizer and admission authority matched its signing wallet. These are frontend E2E receipts, not substituted Studio evidence.

| # | Journey | Expected result | Evidence/status |
|---|---|---|---|
| 1 | Load the exact Vercel alias | App title, Studionet, and contract identity are visible | PASS; live alias HTTP 200 and title verified |
| 2 | Open wallet chooser | Only installed allowlisted providers are shown | PASS; MetaMask and OKX detected; Rabby omitted as not detected |
| 3 | OKX connect and account binding | Header shows the selected OKX account and it matches the docket authority | PASS; `OKX Wallet: 0xbf90...b40d`; Docket #10 authority `0xbf90...b40d` |
| 4 | Create hearing | Wallet-confirmed write reaches finalized/readback; reconciliation recovery is safe | PASS; `0xea7b3b57d8feb1cc4614f555cc4e1ccf342593db27faad40d29ae595734c6b35`; final success after Refresh revealed Docket #10; no resubmission |
| 5 | Register two comments | Each user-signed write reaches finalized/readback and updates the manifest | PASS; c1 `0x43527466581dcdcf3aa55e12827e9863e1e1de344540233a71b37dc1b1dde6dd`; c2 `0x4f3ead5e73043a769a05b3ae3467725aa3b50233bd2c4c94f20e9b52901ef6ba` |
| 6 | Lock batch | Manifest parity is verified and state becomes `LOCKED` | PASS; `0x54eadf0db4def687048e896227608b51bd52bb16c0e4bb6dcf777f954debb66f`; finalized/readback; expected = computed `8cc4b33e...34364f` |
| 7 | Cluster and allocate | Consensus clustering and deterministic 2/2 ledger read back in the frontend | PASS; cluster `0xbf9dc66717f82ded4ae0de89ef51b1e73a569dbff756d91bc10aac9ce49db4ed`; allocate `0xa82c58b67d0fa5b49ceed6c1b826995a598709cfd3727e8ad14e91734b9b291e`; both finalized/readback |
| 8 | Open provenance challenge | Challenge opens during the active window and is pending | PASS; `0xcb96fe7d05a649f8efdf7c4d3f17c6f44129cc42e0239c598a0a6aba25784446`; target c1; pending readback |
| 9 | Resolve provenance challenge | Consensus resolves the challenge and preserves revision/ledger when evidence is valid | PASS; `0x8c52d396392d9071f35685c2ae24d7c9a18ce4cf63f8f3dfcc6662d004408af0`; `REJECTED`, revision `#0`, pending `0` |
| 10 | Wrong-wallet/retry control | Rejected wallet requests do not create a hash or alter state; correct account can retry | PASS; user rejected earlier requests with no hash/state change; Docket #10 then succeeded after reconnecting `0xbf90...b40d` |
| 11 | Finalize and reload | After challenge deadline, finalize reaches `FINAL`; disconnect/reload returns disconnected | PASS on exact release using Docket #8 finalization `0x202255070523f9e14b4b50bf504e8a1cfe1cccbe56213c519f6268407c79b404`; frontend readback `FINAL`, 2 comments, 2/2 slots, 0 pending; Disconnect returned `Connect Wallet`, reload stayed disconnected |

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
