# Studionet Deployment — User Action

1. Open `https://studio.genlayer.com/` and select **Studionet**.
2. Confirm the selected account is exactly `0xBf90Af1bc61314775d57B641b89c1f702a93b40D`.
3. Create/open a contract editor and load the exact bytes from `contracts/public_comment_allocator.py`.
4. Confirm the class shown is `PublicCommentAllocator`; there are no constructor arguments.
5. Before signing, capture one screenshot showing network, selected account, and contract source/header.
6. Deploy and sign exactly one deployment transaction.
7. Wait for terminal completion. Do not count submission/finality alone as success.
8. Return all of:
   - contract address;
   - deployment transaction hash;
   - Explorer link;
   - screenshot/text proving `FINALIZED`;
   - screenshot/text proving execution result `SUCCESS`;
   - consensus result if Studio shows it;
   - any error/retry, without hiding failed attempts.

Do not call any contract method yet. The primary AI will first verify deployment and deployed-source parity, then issue the Studio test matrix one controlled group at a time.
