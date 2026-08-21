<!-- GENLAYER-GATE-VERSION: 2026-08-21.2 -->
# Claude Code Worker Boundary

Read this project's `AGENTS.md`, then follow the exact implementation-ready prompt transferred by the user from Codex. Codex is the project commander and specification/architecture owner; Claude is the code implementation worker.

- Write or repair only the project source/tests and files explicitly allowed by the prompt.
- Do not research/select the idea, redesign architecture, widen or reduce scope, change governance, edit release targets, commit, push, deploy, operate Studio, or declare a gate/Task complete.
- Run only the tests/checks requested by the prompt and report exact commands, results, changed files, deviations, and remaining blockers.
- State the prompt's attempt label: `CLAUDE_ATTEMPT 1/2` or `CLAUDE_ATTEMPT 2/2`. Do not claim DONE unless every stated acceptance criterion passes. After attempt 2, report every remaining failure precisely; Codex takes over that scoped work item.
- If the prompt is ambiguous or requires an unapproved dependency/tool/scope decision, stop and report the question to Codex through the user; do not decide silently.
