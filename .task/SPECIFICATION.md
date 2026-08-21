# Public Comment Hearing Allocator — Task Specification

Status: SPEC_APPROVED by primary Codex for implementation handoff
Category: PROJECT
Network: Studionet only
Project slug: `public-comment-hearing-allocator`
Display name: Public Comment Hearing Allocator

## 1. Baseline and product boundary

Build one GenLayer Intelligent Contract and one public frontend that turn a locked batch of public comments into a transparent, consensus-backed hearing-slot allocation. Preserve the lifecycle:

`COLLECTING -> LOCKED -> CLUSTERED -> ALLOCATED -> CHALLENGE -> FINAL`

The MVP is non-economic. It allocates hearing slots, not money, votes, representation, legal rights, or a claim of perfect democratic fairness. Do not add tokens, staking, escrow, governance voting, a backend, a database, user accounts, or a second contract.

## 2. Locked MVP defaults

- Maximum comments per hearing: 12.
- Hearing slots: constructor/method input, constrained to 1–6 and never greater than registered comments.
- Cluster cap: 1–6 clusters; each selected comment must cover a distinct cluster until either every eligible cluster is covered or slots are exhausted.
- Per-cluster maximum selection: 2, used only after every eligible cluster has one selected comment.
- Public evidence must be retrievable without cookies, credentials, API keys, custom headers, or secrets.
- Regulations.gov is preferred, but any equivalent public dataset is valid when each proposal/comment has a stable public URL and canonical content digest.
- Every comment registration contains a stable external ID, public URL, and SHA-256 digest of canonical UTF-8 text.
- Exact digest duplicates are rejected before lock. Near-duplicates are identified during clustering and remain challengeable.
- Deterministic tie-break: ascending SHA-256 digest, then ascending comment ID.
- Challenge window is expressed as an explicit Unix timestamp supplied when the hearing is created; contract time handling must follow the current supported GenVM API and be verified in Studio.

## 3. Actors and authority

- Organizer: creates the hearing and may lock it after the committed manifest matches. The organizer cannot provide clusters, relevance scores, winners, or override an allocation.
- Registrar: any address may register a public comment reference during COLLECTING. Contract guards the batch cap, unique comment ID, unique URL, and unique digest.
- Triggerer: any address may trigger clustering, allocation, challenge resolution, or finalization when state/deadline conditions permit.
- Challenger: any address may challenge only `PROVENANCE_INVALID` for one comment or `DUPLICATE_PAIR` for two comments during CHALLENGE.
- GenLayer validators: independently fetch locked evidence and determine semantic clusters, relevance, near-duplicate relationships, coverage, selection, and challenge validity.

No UI role check substitutes for contract authorization.

## 4. Trust problem and source of truth

The organizer must not be able to hand-pick favorable comments. Comment submitters may spam, duplicate, near-duplicate, or submit irrelevant material. The contract is the source of truth for lifecycle, locked evidence references, exclusions, clusters, allocation, challenges, and final result. Public web content is evidence, not authority by itself. Validator consensus determines the normalized outcome from the exact locked evidence.

Field-level binding:

- proposal: public URL + committed SHA-256 digest;
- batch: expected manifest SHA-256 committed at creation;
- comment: hearing ID + external ID + URL + canonical text digest + registration index;
- allocation: hearing ID + locked manifest + clustering revision + deterministic policy constants;
- challenge: hearing ID + type + target IDs + current allocation revision.

The manifest is canonical UTF-8 lines in registration order using literal separators and includes every external ID, URL, and digest. The exact canonicalization algorithm must be documented and tested.

## 5. Contract state and views

Use one discoverable `gl.Contract` class. Persist only supported GenVM types. Exact storage representation may be selected by Claude only when it is a direct mechanical mapping of this specification and current official SDK constraints; no architecture decision may change.

Required hearing data:

- organizer address;
- proposal URL and proposal digest;
- expected and computed comment-manifest digests;
- slot count, registration deadline, challenge deadline;
- state enum string;
- registered comment count;
- clustering/allocation revision;
- accepted challenge count.

Required comment data:

- external ID, URL, digest, registrar;
- eligible/excluded flag and exclusion reason;
- cluster ID/label;
- selected flag, rank, rationale, or unselected reason.

Required views expose hearing summary, comment count, comment by index/ID, cluster summary, allocation ledger, challenge record, and current state without requiring private/off-chain storage.

## 6. Required writes and transitions

1. `create_hearing(...)`: validates URLs/digests, slot bounds, and deadlines; creates COLLECTING hearing.
2. `register_comment(...)`: COLLECTING only and before registration deadline; rejects malformed fields, duplicate ID/URL/digest, and over-cap registration.
3. `lock_batch(hearing_id)`: organizer only, after at least slot-count comments exist and registration has closed or organizer explicitly closes collection; computes canonical manifest and requires equality with expected manifest; moves to LOCKED.
4. `cluster_comments(hearing_id)`: permissionless in LOCKED; fetches proposal and every comment, verifies committed digests, fails closed on unavailable/mismatched evidence, independently derives normalized clusters/relevance/near-duplicate flags through validator consensus; moves to CLUSTERED.
5. `allocate_slots(hearing_id)`: permissionless in CLUSTERED; applies coverage-first policy, relevance and uniqueness, cluster min/max rules, and deterministic tie-break; stores selected and unselected reasons; moves through ALLOCATED to CHALLENGE as one finalized write.
6. `open_challenge(...)`: CHALLENGE only and before deadline; only the two allowed challenge types; prevents replay/duplicate challenge keys.
7. `resolve_challenge(...)`: permissionless; independently verifies provenance or semantic duplication. Rejected challenge records a reason without changing allocation. Accepted challenge excludes the invalid/redundant comment, increments revision, and recomputes affected clustering/allocation from the locked eligible batch while preserving the same policy.
8. `finalize_hearing(hearing_id)`: permissionless after challenge deadline, with no unresolved challenge; moves to FINAL. FINAL is immutable.

If the current runtime cannot safely support a separate open/resolve challenge record without weakening liveness, Claude must stop and report the exact SDK/runtime constraint instead of silently collapsing the workflow.

## 7. Consensus contract

All web/LLM work is inside the current official non-deterministic execution mechanism. Storage values are copied to primitive locals before entering nondeterministic closures.

Leader and validators independently fetch the same locked URLs and return a normalized JSON-compatible result. Schema guards are necessary but insufficient. Validators must independently verify semantic outcome fields:

- each comment maps to exactly one normalized cluster or `IRRELEVANT`;
- cluster labels are concise and grounded in the proposal/comments;
- duplicate groups contain only registered IDs;
- allocation contains exactly the allowed number of distinct eligible IDs;
- coverage-first and per-cluster cap invariants hold;
- selected IDs, cluster assignments, and normalized reason codes agree semantically;
- free-form rationale wording is not compared byte-for-byte.

Safe result on unavailable, malformed, conflicting, or digest-mismatched evidence is a retryable error with no state advancement. No caller can inject cluster IDs, scores, winners, or challenge verdicts.

Normalized reason codes:

- selected: `UNIQUE_CLUSTER_COVERAGE`, `ADDITIONAL_CLUSTER_DEPTH`;
- unselected: `LOWER_RELEVANCE`, `NEAR_DUPLICATE`, `CLUSTER_CAP`, `SLOT_LIMIT`, `IRRELEVANT`, `PROVENANCE_EXCLUDED`.

## 8. Frontend

One responsive frontend provides:

- hearing creation and registration;
- overview and lifecycle status;
- cluster map/list;
- selected/unselected filters;
- slot ledger with rationale and source links;
- challenge form restricted to the two allowed types;
- final result and explicit limitations.

Every write shows signing, submitted/pending, consensus/accepted, finalized, execution success/error, and authoritative readback/reconciliation. Never display success from submission alone.

Wallet behavior is mandatory:

- support exactly MetaMask, OKX Wallet, and Rabby;
- Connect opens an accessible explicit chooser and sends no account request;
- use EIP-6963 announcements and bind all requests/writes to the exact selected provider object;
- show only detected supported wallets;
- no silent first-provider/global-provider fallback that can mislabel a wallet;
- full reload always starts disconnected with no automatic account request or session restoration;
- handle cancel, rejection, no provider, empty accounts, account change/removal, chain change, network switch/add, provider switch, listener cleanup, focus trap/restoration, and inline errors.

## 9. Acceptance tests

Contract tests must cover at minimum:

- create validation and deadline boundaries;
- register authorization/state/cap and duplicate ID/URL/digest;
- manifest match/mismatch and canonicalization;
- unavailable proposal/comment and digest mismatch with no state advancement;
- relevant, irrelevant, exact duplicate, near-duplicate, small cluster, oversubscription, coverage-first, per-cluster cap, and deterministic tie-break;
- below/at/above every consequential threshold;
- malformed leader result and semantic validator disagreement;
- provenance and duplicate challenges: valid, invalid, replayed, late, and recomputation;
- permissionless liveness for clustering/allocation/challenge resolution/finalization;
- every invalid transition and FINAL immutability.

Frontend tests must cover all wallet cases above, all write lifecycle states, exact selected-provider routing with zero calls to non-selected providers, readback reconciliation, refresh-disconnected behavior, filters, errors, and accessible dialog behavior.

## 10. Live proof plan

Studionet evidence must exercise every write method and include one complete hearing plus alternate paths for duplicate rejection, irrelevant comment, unavailable source, manifest mismatch, accepted/rejected challenge, late challenge, and final immutability. Every attempted transaction is recorded with actor, arguments, hash, finality, execution result, consensus when applicable, and pre/post readback.

The final Vercel user E2E must repeat the critical journeys with the user's own wallet and fresh explicit wallet selection after reload.

## 11. Limitations and claim calibration

This MVP demonstrates transparent allocation under a locked batch and published rules. It does not prove perfect democratic representation, legal compliance, identity uniqueness, sybil resistance, or production availability of third-party evidence. Public-source availability and LLM consensus remain explicit dependencies.

## 12. Implementation sequence

1. Contract, direct tests, manifest canonicalization helper/documentation.
2. Codex review and verification.
3. Frontend and frontend tests.
4. Codex review and verification.
5. PRE_DEPLOY package and anonymous review; user-guided Studio steps only after approval.

