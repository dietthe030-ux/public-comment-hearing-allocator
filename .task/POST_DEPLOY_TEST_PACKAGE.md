# POST_DEPLOY_TEST Evidence Package

- Revision: `PCHA-PREDEPLOY-6DD8C6A4A7B94F21`
- Manifest SHA-256: `6DD8C6A4A7B94F2133E617230D1FDB8451C7924465D845B8CF2A5C4ACE09BA18`
- Contract source SHA-256: `B37C4040CF0C17DABA65360336668D444CE0239F385C3555AF9D7D79FD276D8F`
- Contract: `0xd98C7f861b0712A0102EaB56922A285Bd4AE4411`
- Network: Studionet
- Locked deployer: `0xBf90Af1bc61314775d57B641b89c1f702a93b40D`

## Deployment

- Transaction: `0x988d91858da2f24211bf506bdabd5299c41233541d01a8f37e38c1f8b0a93068`
- Status: `FINALIZED`
- Consensus: `MAJORITY_AGREE`
- Execution: `SUCCESS`
- Deployed source parity: exact byte parity with local contract hash above.
- Initial readback: `get_hearing_count = 0`.

## User-executed Studio matrix

1. `create_hearing`: `0xd572a4625ca8fd12a5eeeb79a18055e910eb0e7e528036b88a5c807d0ee3c4e5`
   - FINALIZED / SUCCESS / MAJORITY_AGREE; readback hearing 1, COLLECTING.
2. `register_comment(comment-a)`: `0x4774d2eb39a7a96e44d65dbeb2bc7ba7b940079802d925d018f40cf335c6b1aa`
   - FINALIZED / SUCCESS; count 1 and exact digest readback.
3. `register_comment(comment-b)`: `0x8e580ec16e1f353db1c038639d6368860816f9fbed67c3a89cce43183a43aa79`
   - FINALIZED / SUCCESS; count 2 and exact digest readback.
4. `register_comment(comment-c)`: `0x6dc6998bbdab256221e5c9790e3bb46999ff1d3d647321eff3359ce914f97adb`
   - FINALIZED / SUCCESS; count 3 and exact digest readback.
5. `lock_batch`: `0xdd09f5c12d14e8613519fe37a1a8d25192577193583931f234b950f0f0d1e6de`
   - FINALIZED / SUCCESS; LOCKED; computed manifest equals expected.
6. `cluster_comments`: `0xa1e15a29f71c4823a61cf37337013cdb8d8f67def1c98ac8353f57f5834de596`
   - FINALIZED / SUCCESS / MAJORITY_AGREE after 3 rounds; CLUSTERED; two semantic clusters read back.
7. `allocate_slots`: `0x888a7dbdd9688bac81b65be552083acbcf3bee1375736e91c24e824b35d16eb6`
   - FINALIZED / SUCCESS / MAJORITY_AGREE; CHALLENGE; two coverage-first winners read back.
8. Accepted duplicate challenge open: `0xe38adcecb61ee91a0cbff67050aa2fc1151d841d9959c9c893148409fbba5512`
   - FINALIZED / SUCCESS; challenge 1 PENDING.
9. Accepted duplicate challenge resolve: `0x447e4fb85060279c322f8e804adbbeb4eb903788e0e8399ab07fd0d4aa1fc85b`
   - FINALIZED / SUCCESS / MAJORITY_AGREE after 4 rounds; ACCEPTED; revision 1; reclustered/reallocated ledger read back.
10. Rejected provenance challenge open: `0xcad421ff12e216e1ebf4aa2db8d6c96449a7c2e8226d20c32f89fb132413ca75`
    - FINALIZED / SUCCESS; challenge 2 PENDING.
11. Rejected provenance challenge resolve: `0x0dce4d6f8aa08840a51aea1fb2eddac3348ef40faae7c68ef402656d21636863`
    - FINALIZED / SUCCESS / MAJORITY_AGREE; REJECTED; revision and ledger unchanged.
12. Duplicate replay negative control: `0x40b415be563b17e7280db1c9ccd4a6f5112254b744afd1a1b809024883815b25`
    - FINALIZED / expected execution ERROR; exact `ERR_DUPLICATE_CHALLENGE`; state unchanged.
13. Early finalize negative control: `0xd3c2173d5df4b4fefea32ebd711367f1dab9a9cf8044059d5bc3946ffad9baa1`
    - FINALIZED / expected execution ERROR; exact `ERR_CHALLENGE_ACTIVE`; state unchanged.
14. `finalize_hearing`: `0x80391c3c2dc52faeae6cc46765967a38b387c2e03fb47d005d247830afa058c4`
    - FINALIZED / SUCCESS / MAJORITY_AGREE; FINAL.

## Final authoritative readback

- State: `FINAL`
- Revision: `1`
- Accepted challenges: `1`
- Total challenges: `2`
- Pending challenges: `0`
- Slot ledger: `comment-a`, `comment-b`, both `UNIQUE_CLUSTER_COVERAGE`.
- Challenge 1: `ACCEPTED`, `comment-c` near-duplicate of `comment-a`.
- Challenge 2: `REJECTED`, `comment-b` source matched committed digest.
- Manifest readback: exact three-line canonical manifest; digest matches committed manifest.

Explorer: `https://explorer-studio.genlayer.com/transactions/0x80391c3c2dc52faeae6cc46765967a38b387c2e03fb47d005d247830afa058c4`

This package requests `POST_DEPLOY_TEST` approval only. GitHub, Vercel, and user-owned final frontend E2E are not yet complete.
