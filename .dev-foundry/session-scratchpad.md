# Dev Foundry Session Scratchpad

## Status

ACTIVE SCRATCHPAD

## Purpose

Use this file for short operational notes and next-session prompts.

Use `.dev-foundry/session-handoff.md` as the primary continuation artifact.

## Current State

The repo is ready to move into presentation deck preparation.

The user reported final local checks as green:

- `git status --short`: clean / green
- `npm test`: green
- `npm run build`: green
- docs cleanup grep: green enough for demo readiness

## Workstreams

Keep these separate:

1. Foundry Request Board product/app work.
2. Dev Foundry Alita-powered agent-system hardening.

Product work belongs under product source-of-truth and validation docs.

Agent-system hardening belongs under:

- `docs/10-agents/`
- `docs/70-agent-system/`

Do not create app MTPs for agent-system hardening.

## Golden Demo Scenarios

### MTP-006

Negated code signal regression.

A request like `Update the README documentation for security guidance. No code changes.` now classifies as documentation-only instead of code.

Relevant files:

- `docs/60-microtasks/MTP-006-negated-code-signal.md`
- `docs/30-validation/VAL-006-negated-code-signal.md`
- `src/requestClassifier.js`
- `tests/requestClassifier.test.js`

Why it matters:

- Orchestrator handled an imperfect user prompt.
- Governance approved bounded scope.
- Code Author changed only classifier/tests.
- Validator was honest about static validation.
- User-run runtime evidence was recorded without claiming agent execution.

### MTP-007

Vite dev-server classifier interop fix.

`npm run preview` worked, but `npm run dev` failed. The workflow produced a bounded interop fix and required user-provided runtime evidence before closure.

Relevant files:

- `docs/60-microtasks/MTP-007-vite-dev-classifier-interop.md`
- `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`
- `src/requestClassifier.js`
- `ui/requestClassifierInterop.js`

Why it matters:

- The system did not invent proof.
- Validator asked for missing evidence.
- User-run `npm test`, `npm run dev`, and build/preview evidence were recorded honestly.

## Sanitization Commits

- `d063ebeaeec0603c29c37df51e22f8ae268263af` - Sanitize product source-of-truth docs for demo readiness
- `b36c7e8322eb35e9bdc9b06da9156d3ecf6540e3` - Polish bootstrap product traceability docs
- `c7ad2ac9e12fbe6b4eeb7192903082c8a0ccf00e` - Clean demo-facing validation evidence
- `0b94329db202cb0c4a850343a0ffb5bc1c388be5` - Remove local path noise from validation records
- `470d3b35181c06e64993e42dc765519d98f0fab5` - Refresh session handoff for deck readiness

## Active Agent-system Model

The current model remains:

- Flow Evidence Manifest
- manifest-first context
- scope layers
- evidence packets
- no-diff validation mode
- MCP read reduction / read budget

Do not regress from this model.

## Rules

- Do not reopen product sanitization unless a real contradiction appears.
- Do not start new product features before the deck unless a critical bug appears.
- Do not claim Alita agents executed runtime commands.
- User-run evidence must remain labeled as user-run evidence.
- Product and agent-system workstreams must stay separate.

## Recommended First Prompt for Next Session

We are resuming work in `mavalenzuela22/dev-foundry-agentic-demo`.

Start by reminding me to run `git pull` unless I already confirm it.

Before planning, prompting, or modifying artifacts, read:

1. `.dev-foundry/session-handoff.md`
2. `.dev-foundry/session-scratchpad.md`

Current focus:

- Presentation deck preparation for Dev Foundry / Alita-powered agentic demo.
- Repo is product/demo sanitized and local checks were green.
- Golden scenarios are MTP-006 and MTP-007.
- Do not start new product features unless a critical bug appears.

Immediate objective:

Prepare the presentation deck outline and approval narrative.

## Suggested Deck Narrative

Main claim:

Dev Foundry converts imperfect human intent into governed, bounded, evidence-backed agent execution.

Suggested flow:

1. Problem: unconstrained agents are powerful but drift-prone.
2. Approach: SDD governance plus role-specialized Alita agents.
3. System model: Orchestrator plus child agents.
4. Hardening model: Flow Evidence Manifest, scope layers, evidence packets, no-diff validation.
5. Demo product: Foundry Request Board.
6. Golden scenario MTP-006.
7. Golden scenario MTP-007.
8. Results: faster flows, less over-reading, stronger evidence, fewer rojo chillón outcomes.
9. Ask: approval to present and schedule the exam/demo.

## End State

Product docs are sanitized, local commands are green, handoff is refreshed, and next session should focus on the deck.
