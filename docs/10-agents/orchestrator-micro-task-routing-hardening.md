# Orchestrator Hardening: Micro-task Shorthand Routing

## Purpose

This hardening note defines how the Dev Foundry Orchestrator handles terse user commands such as:

- `ejecuta MT-002 del MTP-002`
- `execute MT-003 from MTP-002`
- `run MT-005`
- `ejecuta el siguiente MT del MTP-002`

The goal is to support realistic low-friction user behavior without requiring users to provide repository paths, handoff packages, allowed files, forbidden files, or acceptance criteria when those details already exist in the MTP.

## Core Rule

When a user references an MT/MTP shorthand, the Orchestrator must first resolve the MTP and selected MT before asking broad clarification questions.

The selected MT owner determines the next child agent.

Do not assume that the word `execute` always means implementation or code changes.

## MTP Resolution

- `MTP-002` normally resolves to a file under `docs/60-microtasks/` whose filename starts with `MTP-002`.
- If exactly one matching MTP exists, use it.
- If multiple matching MTPs exist, ask the user to choose.
- If no matching MTP exists, ask for the MTP path.

## Repository Context Rule

- If the conversation has an active repository root, use it.
- If the Orchestrator has an active or default repository configured, use it.
- If no active/default repository is available, use `list_allowed_directories` when available.
- If `list_allowed_directories` returns exactly one directory, use that directory as the candidate repository root for MTP resolution.
- If multiple directories exist, inspect only enough to identify which one contains the requested MTP by standard path convention, or ask the user to choose if multiple candidates match.
- Do not ask for repository root when exactly one allowed directory is available.

## Selected MT Resolution

When the user names a specific MT, read the resolved MTP and find that MT id.

When the user asks for `the next MT`, `siguiente MT`, `next task`, or equivalent:

1. Read the resolved MTP.
2. Find micro-task checkbox entries in document order.
3. Treat `[x]` or `[X]` as completed.
4. Treat `[ ]` as pending.
5. Select the first pending `[ ]` MT.
6. Do not ask `next relative to which MT` if the MTP contains checkbox state.
7. If no pending MT exists, report that the MTP has no pending MT.
8. If checkbox state cannot be parsed safely, ask for clarification and cite the ambiguity.

Example:

- `[x] MT-001`
- `[x] MT-002`
- `[ ] MT-003`
- `[ ] MT-004`

In that state, `ejecuta el siguiente MT del MTP-002` means `MT-003`.

## Owner Routing

After resolving the selected MT, route by owner:

- Governance Agent -> send the selected MT package to Governance.
- Source-of-Truth Author -> send the selected MT package to Source-of-Truth Author.
- Code Author -> send to Code Author only after a relevant Governance APPROVED decision exists.
- Validator -> send to Validator only when required prior evidence exists.

Do not execute sibling MTs.

Do not ask the user for allowed files, forbidden files, or acceptance criteria if the selected MT already contains them.

## Bad Behavior

Do not respond with broad questions such as:

- Does execute mean implementation?
- What are the allowed files?
- What are the forbidden files?
- What are the acceptance criteria?
- Which MT is next?
- Next relative to which MT?

## Minimal Missing Information Rule

Ask only for the smallest missing piece:

- If no repo context and no allowed directory are available, ask only for repo root.
- If multiple MTP files match, ask only which MTP to use.
- If the selected MT is missing, report that specific gap.
- If all MTs are complete, report that there is no pending MT.

## Output Addition

When shorthand routing is used, include `Micro-task Routing Summary`:

- MTP reference received
- resolved repository root or candidate repository root
- resolved MTP path
- selected MT id or next pending MT id
- selected MT owner agent
- selected MT purpose
- whether repository context was inferred or requested
- checkbox-state basis when `next MT` was requested
