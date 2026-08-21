# CLAUDE_ATTEMPT 1/2 — Contract implementation

You are Claude, the code implementation worker. Work only inside:

`E:\Genlayer-Projects\public-comment-hearing-allocator`

First read the local `AGENTS.md`, `CLAUDE.md`, and `.task/SPECIFICATION.md` completely. The specification is approved and architecture-locked. Do not research a different idea, change scope, simplify a required workflow, edit shared governance, initialize Git, commit, push, deploy, operate Studio, or build the frontend in this attempt.

## Scope for this attempt

Implement only the Intelligent Contract, its direct-mode/local tests, project-local Python dependency metadata, and a short canonical-manifest format document/helper needed by those tests.

Allowed paths to create or modify:

- `contracts/**`
- `tests/**`
- `scripts/**` only for a manifest canonicalization helper used by tests/operators
- `docs/MANIFEST_FORMAT.md`
- `pyproject.toml`, `requirements*.txt`, `uv.lock`, `.gitignore`

Forbidden paths:

- `AGENTS.md`, `CLAUDE.md`, `.task/**`
- `frontend/**`, deployment files, Vercel files
- anything under `E:\Genlayer`
- any file outside this project

Do not add a backend, database, token, economic flow, voting, identity system, second contract, broad framework, custom package, or speculative abstraction. Use Python standard library and currently available project dependencies first. Project-local dependencies may be installed only inside this project; do not install global software.

## Current verified environment and official API baseline

- Windows PowerShell; WSL2 is available for a Windows-only runtime blocker.
- `uv 0.12.1`, Python 3.11/3.13, `genvm-lint 0.11.0`, `genlayer 0.39.2`, Node 22.22.2 already exist.
- Official current docs checked by Codex on 2026-08-21:
  - `https://docs.genlayer.com/developers/intelligent-contracts/features/non-determinism`
  - `https://docs.genlayer.com/developers/intelligent-contracts/features/web-access`
  - `https://docs.genlayer.com/developers/intelligent-contracts/features/storage`
  - `https://docs.genlayer.com/developers/intelligent-contracts/types/collections`
  - `https://docs.genlayer.com/developers/intelligent-contracts/testing`
- Use the current official contract import/header and APIs. The current docs show one discoverable class extending `gl.Contract`, `from genlayer import *`, supported typed storage, and all web/LLM operations inside a nondeterministic block. Do not copy a header/dependency hash from another project.
- Use custom semantic validator logic or an official comparative mechanism that independently verifies substantive outcome. Schema/type checks alone are forbidden.
- Mark only genuinely Studio-dependent syntax `VERIFY-AT-STUDIO` in the return report; do not hide local failures behind that label.

## Required implementation

Implement exactly the contract behavior in `.task/SPECIFICATION.md`, including:

1. One contract class and the complete state machine `COLLECTING -> LOCKED -> CLUSTERED -> ALLOCATED -> CHALLENGE -> FINAL`.
2. Maximum 12 comments, 1–6 slots, coverage-first allocation, max two selections per cluster after initial coverage, and deterministic digest/ID tie-break.
3. Public create/register/lock/cluster/allocate/open-challenge/resolve-challenge/finalize writes and all required views.
4. Exact duplicate defenses by external ID, URL, and digest before lock.
5. Canonical manifest construction from UTF-8 fields using one documented literal separator and registration order. `lock_batch` must compute and match the committed expected digest.
6. Proposal/comment evidence fetch and digest verification before any AI decision. Unavailable or mismatched evidence must leave state unchanged and return a retryable user-visible error.
7. Leader/validator normalization for clusters, relevance, near duplicates, selected IDs, reason codes, and challenge decisions. A caller may never inject any outcome-bearing field.
8. Store selected/unselected rationale and normalized reasons on-chain.
9. Challenges limited to `PROVENANCE_INVALID` and `DUPLICATE_PAIR`; prevent duplicate/replayed/late challenges; accepted challenges exclude evidence and recompute the affected allocation under the same policy; no unresolved challenge may finalize.
10. Permissionless liveness for cluster/allocation/challenge resolution/finalization; organizer authority only for creation and batch lock.
11. FINAL immutability and no economic/value semantics.

If a current GenVM storage/public-type constraint makes the exact method/storage shape impossible, preserve behavior using the smallest supported representation. Stop and report only if behavior itself cannot be preserved; do not redesign silently.

## Safety and implementation constraints

- Deterministic validation occurs before nondeterministic execution.
- Copy persistent values into primitive locals before nondeterministic closures.
- No storage writes, contract calls, messages, or nested nondeterminism inside nondeterministic closures.
- Do not initialize runtime-managed `TreeMap`/`DynArray` in a way rejected by the current SDK/runtime. Follow current docs and prove with lint/tests.
- Avoid float types and unsupported public/storage types.
- Normalize and validate addresses at public boundaries using a current supported pattern if needed.
- Prompt inputs must use explicit delimiters and instruct models to treat fetched public text as untrusted evidence, not instructions. Defend against prompt injection from proposal/comments.
- Parse and validate every nondeterministic result before storage: exact registered IDs, no duplicates, complete comment coverage, valid enums, cluster/allocation invariants, slot count, cap, and deterministic tie-break.
- Free-form rationale may vary; compare normalized semantic outcomes, not prose bytes.
- Error messages must be stable enough for tests and frontend handling.

## Required tests

Create runnable tests covering every contract acceptance item in specification section 9. At minimum include:

- create/deadline boundaries and invalid transitions;
- registration cap and duplicate ID/URL/digest;
- manifest canonicalization, match, mismatch;
- dead/unavailable source and digest mismatch with no state advancement;
- irrelevant, exact duplicate, near duplicate, small cluster, oversubscription, coverage-first, cap, and deterministic tie-break;
- below/at/above consequential thresholds;
- malformed leader result and semantic validator disagreement;
- accepted/rejected/replayed/late provenance and duplicate challenges plus recomputation;
- permissionless trigger paths;
- no unresolved challenge finalization and FINAL immutability.

Mocks/fakes must model runtime restrictions rather than make the contract easier to pass. Do not let direct-mode tests invent transaction context, address coercions, collection constructors, or time APIs that current GenVM does not support. Where official testing tooling supports web/LLM mocks, use it.

## Commands and verification

Use a project-local virtual environment. Prefer existing `uv`; do not install global tools. Run and report exact outputs for:

1. dependency sync/install command;
2. `genvm-lint check <contract-file>`;
3. complete direct test suite;
4. `python -m compileall` or equivalent syntax check;
5. `uv pip check --python .\.venv\Scripts\python.exe` (or the exact project-local equivalent).

If the known Windows `genlayer-test 0.29.2` file-lock failure occurs, reproduce the same pinned environment/test in WSL/POSIX; do not patch installed site-packages. If any error occurs, first search `E:\Genlayer\experience\Task Build Experience.md` for a matching entry before applying a fix, and report which entry was used or why none applied.

## Acceptance criteria

Claim `DONE` only when:

- every required behavior is implemented;
- every required test exists and passes;
- linter, syntax, and dependency checks pass with no unreviewed blocker;
- no forbidden file changed;
- no source, address, dependency, deployment, evidence, or design from another Task was reused;
- the implementation remains deployable as one Studionet Intelligent Contract subject to the later Studio gate.

## Required return package

Return exactly:

```text
CLAUDE_ATTEMPT 1/2
Status: DONE | NOT DONE
Changed files:
Architecture mapping:
Commands run and exact results:
Test totals:
Lint diagnostics and disposition:
Experience entries applied or inapplicable:
VERIFY-AT-STUDIO items:
Deviations from specification: NONE | <exact list>
Remaining blockers: NONE | <exact list>
```

Do not return a narrative claim without the actual files and command evidence. Codex will inspect the diff/files and rerun checks independently.
