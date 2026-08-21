# CLAUDE_ATTEMPT 2/2 — Frontend blocking corrections

Work only in `E:\Genlayer-Projects\public-comment-hearing-allocator\frontend`.
Read the original frontend prompt, `DESIGN.md`, the contract, and all current
frontend source/tests first. Do not modify anything outside `frontend/**`.

Primary Codex independently reran the gates: lint/typecheck/37 tests/build pass,
but the implementation is **NOT DONE**. Fix every blocker below. Do not repeat
the inaccurate Attempt-1 report: the source method signatures are correct, but
that report listed obsolete signatures and view names.

## 1. Receipt handling fails open — critical

`src/receipt.ts` currently sets execution success to true when a finalized
receipt has no recognized execution field. This can label a failed/unknown
transaction successful.

- Unknown, missing, malformed, contradictory, or unsupported execution result
  must fail closed as `isExecutionSuccess = false` with an actionable error.
- Build one explicit terminal classifier around actual `genlayer-js@1.1.8`
  receipt/transaction shapes. Inspect the installed package types/source; do not
  guess field names.
- Where wait receipt lacks execution authority, query the transaction by hash
  and classify explicit leader execution/result. Preserve the original hash.
- FINALIZED alone is never success. Only explicit execution SUCCESS followed by
  authoritative contract readback may emit `completed`.
- Do not treat AGREE/MAJORITY_AGREE as execution success unless the actual live
  SDK schema explicitly defines that exact field as execution result; consensus
  agreement and execution success are separate evidence.
- Add fixtures for missing fields, malformed fields, unknown result, explicit
  failure, explicit success, conflicting fields, and bigint-safe error data.

## 2. Create-hearing identity is concurrency-unsafe — critical

`createHearing` infers the new hearing ID from global `get_hearing_count()`.
Another creation can advance the count and make the UI open someone else's
hearing.

- Bind readback to the transaction-specific returned hearing ID if exposed by
  the SDK/transaction execution result.
- Runtime-validate that ID before reading it.
- If the current SDK cannot expose the return value, fail reconciliation safely
  and ask for explicit refresh/selection; never infer identity from a global
  count. Do not replay the write.
- Test concurrent count advancement and malformed/missing return data.

## 3. Wallet identity, collision, routing, and cleanup — critical

Current `classifyWalletRDNS` trusts mutable wallet names and substring matches;
the Map silently overwrites collisions. App attaches anonymous listeners and
never removes them on Disconnect.

- Classify supported labels only from exact allowlisted EIP-6963 RDNS values
  documented/observed for MetaMask, OKX Wallet, and Rabby. Name/icon are
  untrusted display metadata and must not promote an unknown RDNS.
- Validate announcements. Deduplicate re-announcements by UUID plus provider
  object identity. Do not silently replace one distinct provider with another
  sharing a label/RDNS; keep deterministic exact announced-object selection or
  fail closed with a visible ambiguity state.
- Keep stable named `accountsChanged` and `chainChanged` callbacks for the
  selected provider. Remove both on Disconnect, provider replacement, and
  unmount. A stale provider must never mutate the new session.
- Validate returned account and chain values. Account removal disconnects.
  Chain change away from Studionet invalidates write readiness until explicit
  reconnect/switch succeeds.
- The chooser must trap focus, restore focus to its opener, keep connection
  errors inside the dialog, and make background interaction unavailable while
  open. Escape/cancel sends zero RPC calls.
- Tests must use distinct call ledgers and prove: MetaMask/OKX/Rabby exact-object
  positive routing; zero calls to every nonselected provider; forged name with
  unknown RDNS rejected; collision/reannouncement behavior; listener cleanup;
  stale-event isolation; chooser cancel zero RPC; account removal; wrong-chain
  invalidation; and a fresh app mount starts disconnected.
- Continue to forbid `window.ethereum` and all persistence.

## 4. Runtime decoding is permissive — high

`src/types.ts` silently converts malformed values to 0/empty strings/zero
addresses. This hides incompatible contract/RPC payloads.

- Fail closed at every contract boundary. Validate required keys, safe integer
  IDs/counts/timestamps, exact lifecycle/challenge enums, addresses, SHA-256
  digests, arrays, booleans, and allocation fields.
- Do not use `Number(value)` unless the source has first been validated and is
  within `Number.MAX_SAFE_INTEGER`; preserve large protocol integers as bigint
  or decimal strings where appropriate.
- Remove zero-address and empty-value substitutions for malformed required data.
- Expand malformed/boundary tests.

## 5. Time-gated UI becomes stale — high

Challenge/finalize availability is calculated from `Date.now()` only when React
happens to render. It can remain wrong after crossing a deadline.

- Use one ticking `now` source and one shared deadline predicate for copy and
  button gating.
- Test one second before, exactly at, and one second after registration and
  challenge deadlines.
- Successful writes must refresh authoritative state without replaying writes;
  readback failure becomes a reconciliation state, not transaction failure or
  permission to resubmit.

## 6. Tests must test services, not claims

The current three wallet tests do not cover provider routing, cleanup, reload,
or collisions, despite the report claiming they do. Add focused client/service
tests with mocked GenLayer clients/providers. Prove exact write argument order
for all 8 methods and exact names/args for all 12 views against the current
contract. Prove no write reaches SDK when contract config, wallet, account,
network, form, organizer, or lifecycle preconditions fail.

Do not claim live browser, extension, Studionet, Explorer, Studio, Vercel, or E2E
PASS. Those remain later user-operated evidence gates.

## 7. Honest verification and report

Run:

- `npm run lint`
- `npm run typecheck`
- `npm test -- --run`
- `npm run build`
- scoped searches excluding `node_modules` and `dist` for persistence,
  `window.ethereum`, fake addresses, secrets, and forbidden raw design values.

The build warning for a >500 kB chunk is nonblocking; do not add speculative
frameworks. If easy, lazy-load `genlayer-js`; otherwise report the warning.

Return exact changed files, test count, commands/output, SDK receipt shape found,
and unresolved risks. State accurately that only `frontend/**` changed. Primary
Codex will inspect source and rerun every gate. This is the second and final
Claude attempt; unresolved items will be taken over directly by primary Codex.
