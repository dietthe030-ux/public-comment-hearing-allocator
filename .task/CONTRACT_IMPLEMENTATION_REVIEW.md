# Contract implementation review

Status: **ACCEPTED FOR PROJECT INTEGRATION** (not a PRE_DEPLOY approval)

Claude used both contract attempts. Primary Codex independently inspected the
source, corrected remaining runtime-test and validator-partition issues, and
reran the gates below.

## Exact verification

- `genvm-lint check contracts/public_comment_allocator.py` — PASS; 20 methods.
- `pytest -q` — PASS; 46 fast logic tests.
- `python tests/runtime_smoke.py` — PASS through the installed
  `gltest.direct` deployment/execution path.
- `python -m compileall contracts scripts tests` — PASS.
- `uv pip check --python .venv/Scripts/python.exe` — PASS; 55 packages.

## Primary-review corrections

1. Added `tests/runtime_smoke.py` so the acceptance package does not mislabel
   permissive test doubles as GenVM runtime parity.
2. Relabeled `tests/conftest.py` accurately: it is a fast logic-test harness.
3. Changed validator comparison from raw cluster-number equality to semantic
   partition equality. Equivalent partitions with permuted numeric labels now
   agree; materially different memberships still fail consensus.

## Remaining release conditions

- The dependency header passes the installed semantic checker but the checker
  reports a newer runner. Re-verify the exact supported header in Studio before
  PRE_DEPLOY; do not change the pin speculatively.
- Frontend, wallet routing, deployment evidence, and anonymous checkpoint
  approvals are still pending.
- The 46-test suite is logic coverage. Runtime evidence is the separate
  `gltest.direct` smoke test above.
