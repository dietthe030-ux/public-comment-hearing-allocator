<!-- GENLAYER-GATE-VERSION: 2026-08-21.5 -->
# GenLayer Child Project Entry

This directory is one independent GenLayer Task. This local file is a pointer, not a copy of global rules and not a public-repository artifact.

Codex or another primary Task agent must, before substantive action:

1. Read `E:\Genlayer\AGENTS.md`.
2. Read `E:\Genlayer\governance\START-HERE.md`.
3. Read `E:\Genlayer\governance\AI-HIERARCHY.md`.
4. Read `E:\Genlayer\brain\AI Project Orchestration Rules.md`.
5. Read `E:\Genlayer\experience\Task Build Experience.md` in full; matching verified entries are default rules unless primary Task Codex records the required inapplicability deviation.
6. Read `E:\Genlayer\Prompt Genlayer.docx` as a lower-priority workflow/reference brief.
7. Identify the submission category and current stage, then read only the gate routed for that stage.
8. Return the mandatory `GENLAYER RULE READ RECEIPT`.

The anonymous co-review AI follows the first-message template and may reuse unchanged documents at later checkpoints in the same conversation.

- Do not reuse another Task's code, addresses, credentials, deployment state, evidence, or AI output.
- Treat the idea/plan in the user's first Task prompt as the mandatory product baseline. Codex must follow it and may only propose the smallest necessary correction for a concrete blocker; it must not materially replace or redesign the baseline without user direction.
- Studionet is mandatory for deployments and submission evidence.
- Codex or the primary Task AI owns research, planning, architecture, project-directory initialization, specifications, Claude implementation/correction prompts, review, testing, preparation/guidance/verification of user-executed Studio deployment/live contract testing, acceptance, commits, GitHub push, Vercel deployment, and submission preparation. It codes only after Claude's second unsuccessful attempt for that scoped work item or when the user explicitly grants a Task-specific exception.
- Claude is the mandatory code implementation worker. The user transfers Codex's complete copy-ready prompt to Claude and returns Claude's result. Claude may write/repair only project source/tests within that prompt and may not change scope, architecture, governance, commit, push, deploy, or approve. Codex must inspect the actual changes and independently verify required checks; incomplete work receives another focused Claude correction prompt.
- Claude has at most two attempts for the same scoped work item. Codex records the attempt label and cannot reset it for the same unresolved acceptance criterion. If attempt 2 is not DONE, Codex takes over that work item and completes its code and verification directly.
- The primary Task AI may use subagents for bounded non-coding internal analysis but remains responsible for their instructions, scope, verification, token use, and every final decision. Claude/subagent output cannot count as independent anonymous review, checkpoint approval, dual approval, governance authority, or permission to push/deploy.
- The anonymous co-review AI is not a subagent and must remain a separate, non-forked Task/chat. The primary AI prepares the complete mandatory first-message prompt and the user manually sends it. After the user confirms delivery and supplies the exact reviewer chat/Task link, URL, thread ID, or address, the primary AI must communicate directly with that reviewer for all later checkpoints whenever Task-to-Task messaging is available; the user does not relay routine later messages. Manual handoff remains the fallback only when direct messaging is unavailable or the supplied route is invalid. The reviewer remains read-only and receives no implementation, push, deploy, or command authority.
- Apply `E:\Genlayer\brain\GitHub Presentation Gate.md` before any public push. Keep this file, `CLAUDE.md`, local prompts, working design/context files, and internal evidence out of the public repository.
- The user confirms the exact GitHub account/repository and Vercel account/team/project once per Task. Codex records and verifies these locked release targets; that confirmation authorizes later commit, push, and Vercel deployment to those exact targets after applicable gates pass. Codex must not ask again where, whether, or for permission to push/deploy. It stops and asks only if the user changes a target, verification finds a mismatch, a target is unavailable, or a gate blocks the action. Before `PRE_DEPLOY` review, the primary AI guides the user through a read-only Studio step to select the intended Studionet deployer/upgrader account and return its public address/role; no signature or transaction occurs. The account is locked into the review package, and changing it requires fresh review. After approval, the human user operates Studio with the locked account to sign, deploy, invoke methods, and execute the live test matrix. The primary AI supplies exact steps one safe group at a time, waits for returned evidence, verifies every result, and never claims to have performed the user's Studio actions.
- Browser dApps support exactly MetaMask, OKX Wallet, and Rabby. Connect wallet opens a selector and shows whichever of those three are detected; other wallet brands are out of scope unless the user explicitly changes the Task scope. Every full reload starts disconnected and requires a fresh explicit connection.
- The exact final Vercel frontend must pass mandatory end-to-end testing before final review. The primary AI prepares and guides the complete numbered judge-like script; the human user executes it with the user's own compatible wallet and returns observations/evidence. Automated, browser, mock, or Studio tests cannot replace this user-owned gate. Failures require a fix, redeployment when applicable, and rerun; no unresolved required case may advance to `POST_GITHUB_VERCEL_FINAL` or completion.
- Completion means `DUAL_APPROVED` for one exact revision and evidence package.
- Classify the submission as `PROJECT` or `INTELLIGENT_CONTRACT`; `MILESTONE` is outside the current workflow.
- Anonymous approval is required at `PRE_DEPLOY`, `POST_DEPLOY_TEST`, and `POST_GITHUB_VERCEL_FINAL`; only the last checkpoint can satisfy final completion.

The first message to the anonymous co-review AI must use `E:\Genlayer\templates\Anonymous Co-Review First Message.txt` verbatim, replacing only its bracketed placeholders with verified Task data.
