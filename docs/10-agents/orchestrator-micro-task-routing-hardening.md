# Orchestrator Hardening: Micro-task Shorthand Routing

## Purpose

This hardening note defines how the Dev Foundry Orchestrator should handle terse user commands such as:

- `ejecuta MT-002 del MTP-002`
- `execute MT-003 from MTP-002`
- `run MT-005`

The goal is to support realistic low-friction user behavior without requiring users to provide repository paths, handoff packages, allowed files, forbidden files, or acceptance criteria when those details already exist in the MTP.

## Rule

When a user references an MT/MTP shorthand, the Orchestrator must first resolve the selected MTP and selected MT before asking what execution means.

The Orchestrator must not assume that `execute` means implementation or code changes.

The selected MT owner determines the next child agent.

## Expected Resolution Behavior

1. Resolve the MTP reference.
   - `MTP-002` should normally resolve to a file under `docs/60-microtasks/` whose filename starts with `MTP-002`.
   - If exactly one matching MTP exists, use it.
   - If multiple matching MTPs exist, ask the user to choose.
   - If no matching MTP exists, ask for the MTP path.

2. Resolve the selected MT id inside the MTP.
   - Example: `MT-002` inside `MTP-002`.
   - If the MT is not found, ask for clarification.

3. Determine the owner agent from the selected MT.
   - If owner is Governance Agent, route to Governance Agent.
   - If owner is Source-of-Truth Author, route to Source-of-Truth Author.
   - If owner is Code Author, route to Code Author only after a relevant Governance APPROVED decision exists.
   - If owner is Validator, route to Validator only when required prior evidence exists.

4. Do not execute sibling MTs.

5. Do not ask the user for allowed files, forbidden files, or acceptance criteria if the selected MT already contains them.

## Repository Context Rule

If the conversation has an active repository root, use it.

If the Orchestrator has an active or default repository configured, use it.

If no active or default repository is available, ask only for the repository root or repository identifier.

Do not ask whether `execute` means code implementation until after the selected MT is resolved and its owner/purpose are known.

## Good Behavior

User:

`ejecuta mt-002 del MTP-002`

Expected Orchestrator behavior:

1. Resolve `MTP-002` to `docs/60-microtasks/MTP-002-security-request-classification-delta.md`.
2. Read `MT-002`.
3. Detect that owner is Governance Agent.
4. Delegate the selected MT package to Governance Agent.
5. Do not call Code Author.
6. Do not modify implementation or tests.

## Bad Behavior

Do not respond with broad questions such as:

- Does execute mean implementation?
- What are the allowed files?
- What are the forbidden files?
- What are the acceptance criteria?

Those answers should come from the selected MT whenever possible.

## Minimal Missing Information Rule

If something is missing, ask only for the smallest missing piece.

Examples:

- If repository root is missing and no default is configured, ask only for repository root.
- If multiple MTP-002 files exist, ask only which MTP-002 to use.
- If MT-002 is missing inside the resolved MTP, report that specific gap.

## Output Addition

When shorthand routing is used, include a `Micro-task Routing Summary` section in the Orchestrator report:

- MTP reference received
- resolved MTP path
- selected MT id
- selected MT owner agent
- selected MT purpose
- whether repository context was inferred or requested
