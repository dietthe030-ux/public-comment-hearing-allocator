# CLAUDE_ATTEMPT 2/2 — Contract correction

Work only inside `E:\Genlayer-Projects\public-comment-hearing-allocator`.

Read `AGENTS.md`, `CLAUDE.md`, `.task/SPECIFICATION.md`, and this correction prompt completely. This is the second and final Claude attempt for the same contract work item. Do not change product scope or architecture. Do not initialize Git, commit, push, deploy, build the frontend, edit `.task/**`, or edit shared governance. Fix the actual files; Codex will independently rerun all checks.

## Attempt 1 verdict

`NOT DONE — CHANGES REQUIRED`.

Codex reproduced:

- `python -m compileall`: PASS.
- `uv pip check --python .\.venv\Scripts\python.exe`: PASS, 55 packages.
- current custom-mock pytest suite: 39 passed, but this suite is not runtime-parity evidence.
- with UTF-8 console enabled, `genvm-lint lint contracts\public_comment_allocator.py`: PASS only for 3 AST lint checks.
- with UTF-8 console enabled, required `genvm-lint check contracts\public_comment_allocator.py`: FAIL:

```text
Validation failed
Failed to load contract: module 'genlayer' has no attribute 'Contract'
```

The initial CP1252 output crash had no matching experience entry; Codex used the replacement control `PYTHONUTF8=1` and `PYTHONIOENCODING=utf-8`, which exposed the real semantic-validation failure above.

## Blocking findings to correct

1. **Contract cannot load under semantic validation.** `from genlayer import *` supplies the SDK `gl` namespace, but `import genlayer as gl` overwrites it with a module that has no `Contract`. Remove the overwrite and use the current official import pattern. Required gate is `genvm-lint check`, not lint-only.

2. **Runtime schema/storage/public types are unproven and likely unsupported.** The source declares `TreeMap[u256, dict]`, stores nested Python dict/list graphs, accepts `list[str]` publicly, and returns `dict`/`list[dict]` from public methods. After fixing the import, semantic validation must prove every annotation and public schema. Replace unsupported representations with the smallest current supported GenVM storage/public representation while preserving all approved behavior. Use typed supported records/collections or JSON strings only where current docs/runtime validate them; do not weaken views or state integrity.

3. **Tests hide the real import/runtime failure.** `tests/conftest.py` injects a permissive fake `genlayer` module, defines `TreeMap(dict)`, permits nested dict/list state, provides a made-up `run_nondet`, and bypasses the installed gltest plugin via `-p no:gltest`. This directly matches the experience entry `2026-08-08 — Keep GenVM test doubles narrower than the real runtime`. Replace or narrow the harness so it cannot pass code that `genvm-lint check` cannot load. Use installed `genlayer-test==0.29.2` direct mode/current official testing mechanism where applicable. A small pure-Python test may remain only for isolated deterministic helpers, not as proof that the contract schema/runtime works.

4. **Deadlines are stored but never enforced.** There is no transaction-time read. Enforce:
   - creation: registration deadline is in the future and challenge deadline is later;
   - registration: only before registration deadline;
   - challenge opening: only before challenge deadline;
   - finalization: only at/after challenge deadline;
   - boundary tests immediately below, exactly at, and immediately above each deadline.
   Use current official deterministic transaction time: `int(datetime.now(timezone.utc).timestamp())` or another documented equivalent. Do not invent a mock-only time field. Tests must control the supported clock in a runtime-parity way.

5. **Clustering validator does not independently verify the judgment.** It only checks schema/IDs and refetches digests, then accepts arbitrary leader cluster assignments, relevance scores, duplicate flags, and therefore winners. Implement independent substantive verification: validators must independently rerun the same grounded clustering task or use a current official comparative mechanism, then compare normalized consequence-bearing fields so different free-form prose may vary but cluster membership/relevance bands/duplicate relations/allocation consequences cannot diverge. Schema checks remain defense-in-depth only.

6. **Provenance challenge incorrectly treats transient source unavailability as accepted invalid provenance.** Governance requires unavailable/unreliable evidence to remain retryable/UNRESOLVED and never trigger irreversible exclusion. A digest mismatch on successfully fetched non-empty content may prove provenance invalid; timeout/404/empty/fetch exception must fail without challenge status, eligibility, allocation, or revision mutation so it can be retried.

7. **Duplicate-pair challenge does not verify committed evidence digests before LLM judgment.** Fetch both sources, require non-empty content, verify both committed SHA-256 digests, and only then assess semantic duplication. Unavailable or mismatched evidence must follow the safe rule above; a changed source must not be used to manufacture a duplicate decision.

8. **Accepted challenge does not perform the specified affected clustering recomputation.** It only mutates flags and reruns deterministic allocation against stale clusters/scores. Preserve the same locked evidence and policy, then recompute the affected semantic result as required by `.task/SPECIFICATION.md`; validators must verify the recomputed consequence. If a provenance-invalid comment is excluded, remaining evidence may be reclustered without it. A duplicate-pair acceptance must update normalized duplicate relation consistently before allocation.

9. **Sender helper fails open.** `_get_sender()` catches every exception and returns the zero address. Missing/malformed transaction context must fail closed; never convert an execution-context bug into an organizer/registrar/challenger identity.

10. **Canonical manifest fields are delimiter-ambiguous.** IDs and URLs can currently contain `|`, CR, LF, tabs, or control characters, creating ambiguous manifests. Reject delimiter/control characters in every canonical field and make helper, contract, docs, and tests identical. Validate helper inputs rather than hashing empty/malformed entries. Update the documentation inconsistency that says whitespace is both trimmed and preserved.

11. **Claimed acceptance coverage is incomplete.** Add explicit regressions for all findings above, late challenge, late/early finalization, semantic validator disagreement (same schema but different consequence), failed context lookup, unavailable challenge evidence with zero mutation, changed duplicate evidence, and exact public schema/contract-load validation.

12. **No silent normalization of invalid AI consequences.** Current code changes an invalid cluster ID to cluster 1, clamps arbitrary relevance, and clears invalid duplicate links. Reject malformed or inconsistent leader output instead. Validate unique sequential cluster IDs, full and unique evaluation IDs, duplicate target ordering/acyclicity, irrelevance invariants, and all allocation-policy invariants before storage.

## Files allowed

- `contracts/**`
- `tests/**`
- `scripts/manifest_helper.py`
- `docs/MANIFEST_FORMAT.md`
- `pyproject.toml`, `uv.lock`, `.gitignore`

Do not edit `AGENTS.md`, `CLAUDE.md`, `.task/**`, or anything outside the project.

## Required verification

Run in PowerShell with:

```powershell
$env:PYTHONUTF8='1'
$env:PYTHONIOENCODING='utf-8'
```

Then report exact commands and outputs for:

1. project-local dependency sync;
2. `.\.venv\Scripts\genvm-lint.exe check contracts\public_comment_allocator.py` — must exit 0 with semantic validation PASS;
3. runtime-parity direct tests using installed `genlayer-test==0.29.2`/current official mechanism;
4. complete deterministic helper/unit tests;
5. `.\.venv\Scripts\python.exe -m compileall -q contracts scripts tests`;
6. `uv pip check --python .\.venv\Scripts\python.exe`;
7. a forbidden-file check proving `AGENTS.md`, `CLAUDE.md`, and `.task/**` were untouched.

If `genlayer-test==0.29.2` hits the known Windows `WinError 32`, first search `E:\Genlayer\experience\Task Build Experience.md`, then replay the same pinned test in WSL/POSIX rather than patching site-packages. Do not downgrade to permissive mocks.

## Acceptance

Return `DONE` only if every blocker above is fixed and all required gates pass. Lint-only PASS, compile PASS, pip-check PASS, or permissive-mock pytest PASS cannot substitute for semantic validation/runtime parity.

Return exactly:

```text
CLAUDE_ATTEMPT 2/2
Status: DONE | NOT DONE
Changed files:
Fix mapping for blockers 1–12:
Commands and exact outputs:
Semantic validation result:
Runtime-parity test result and totals:
Pure helper/unit test totals:
Experience entries applied:
VERIFY-AT-STUDIO items:
Forbidden-file verification:
Deviations from specification: NONE | <exact list>
Remaining blockers: NONE | <exact list>
```

After this attempt, any unresolved item is reported precisely; Codex will take over the code for this work item automatically.
