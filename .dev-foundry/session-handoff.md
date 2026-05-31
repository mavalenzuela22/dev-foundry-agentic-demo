# Dev Foundry Session Handoff

## Status

ACTIVE SESSION HANDOFF

## Repository

`mavalenzuela22/dev-foundry-agentic-demo`

Local working repo used during this phase:

`/Users/martin.valenzuela/Development/dev-foundry-agentic-demo`

## Date

2026-05-31

## Purpose of This File

This file captures the current project state, completed work, known rules, demo-readiness posture, and the next recommended session focus.

The project is an Alita-powered Dev Foundry agentic demo using a small guinea-pig product application called Foundry Request Board.

## Start-of-Next-Session Rule

At the start of the next session:

1. Remind the user to run `git pull` unless they already confirm they are up to date.
2. Read `.dev-foundry/session-handoff.md`.
3. Read `.dev-foundry/session-scratchpad.md`.
4. Do not plan, prompt, or modify artifacts before reading both files.

## Current Top-level Outcome

The repository is now demo-ready for presentation-deck preparation.

The strongest demo message is:

Dev Foundry converts imperfect human intent into governed, bounded, evidence-backed agent execution.

The current focus should move from product/system hardening to presentation deck preparation.

## Workstreams Must Stay Separated

There are two distinct workstreams:

1. Foundry Request Board product/app work.
2. Dev Foundry Alita-powered agent-system hardening.

Do not mix agent-system hardening into the app `SPC/TSK/MTP` chain.

Product/app work belongs under product source-of-truth chains such as:

- `docs/00-product/`
- `docs/30-validation/`
- `docs/40-specs/`
- `docs/50-tasks/`
- `docs/60-microtasks/`

Agent-system hardening belongs under:

- `docs/10-agents/`
- `docs/70-agent-system/`

Do not create app MTPs for agent-system hardening.

## Active Alita Agents

The active Alita agents remain:

- Dev Foundry Orchestrator
- Dev Foundry Context Analyst
- Dev Foundry Source-of-Truth Author
- Dev Foundry Governance Agent
- Dev Foundry Scaffolder
- Dev Foundry Code Author
- Dev Foundry Validator

The Orchestrator is coordination-only. It may use read-only tools if assigned, but it must not directly write repository files.

## Current Agent Operating Model

The system follows the Flow Evidence Manifest operating model:

- Orchestrator owns the Flow Evidence Manifest.
- Orchestrator resolves routing and scope facts once when possible.
- Orchestrator passes the manifest to downstream agents.
- Child agents must not repeatedly rediscover repository state already present in the manifest.
- Every write-capable agent returns an evidence packet.
- Validator uses evidence-based scope validation when git diff or changed-files tooling is unavailable.
- Filesystem MCP should be used as initial fact source and direct target inspection, not repeated workflow memory.

Scope layers must remain explicit:

- implementation scope;
- source-of-truth closure scope;
- validation read scope;
- forbidden scope.

Never force an MTP closure file into Code Author implementation scope.

## Current Product State

Foundry Request Board is intentionally small and demo-focused.

Implemented product surface:

- deterministic request classifier in `src/requestClassifier.js`;
- Jest classifier tests in `tests/requestClassifier.test.js`;
- browser-only UI under `ui/**`;
- Vite local dev/build/preview flow;
- in-browser classification with output badges, pretty JSON, copy JSON, and in-memory history.

Current classifier behavior:

- documentation-only requests classify as `documentation / low / bounded_execution_ready`;
- mixed documentation plus implementation requests classify as `mixed / medium / needs_review`;
- code/implementation requests classify as `code / medium / needs_review`;
- unknown requests classify as `unknown / unknown / needs_review`;
- security-related requests default to `code / medium / needs_review`;
- documentation-only security requests remain `documentation / low / bounded_execution_ready`;
- explicit no-code phrases such as `No code changes` do not force code classification when used to negate code work;
- Spanish documentation/security terms are covered by current tests.

## Golden Demo Scenarios

### Golden Scenario 1: MTP-006 negated code signal regression

User found a real classifier bug from the UI:

`Update the README documentation for security guidance. No code changes.`

The classifier was too conservative because the literal word `code` triggered code intent even though the user explicitly negated code work.

The Orchestrator handled a low-friction/brain-off prompt correctly:

- recognized product classifier behavior, not agent-system hardening;
- flowed through source-of-truth and MTP work;
- Governance approved bounded implementation;
- Code Author modified only classifier/test scope;
- Validator first provided static validation;
- user supplied `npm test` output;
- Source-of-Truth Author recorded user-run runtime evidence without claiming agents executed tests.

Evidence:

- `docs/60-microtasks/MTP-006-negated-code-signal.md`
- `docs/30-validation/VAL-006-negated-code-signal.md`

User-run test outcome:

- 1 test suite passed;
- 8 tests passed;
- no snapshots;
- all Jest suites completed successfully.

### Golden Scenario 2: MTP-007 Vite dev-server classifier interop fix

User found another real bug:

- `npm run preview` worked;
- `npm run dev` failed with classifier interop resolution error.

The Orchestrator again handled a low-friction/brain-off prompt correctly:

- created `MTP-007` for a bounded product runtime fix;
- Governance approved tight scope;
- Code Author modified only the allowed interop files;
- Validator requested missing runtime/browser evidence rather than inventing proof;
- user supplied the missing evidence;
- Source-of-Truth closure recorded user-run `npm test`, `npm run dev`, and `npm run build && npm run preview` evidence.

Evidence:

- `docs/60-microtasks/MTP-007-vite-dev-classifier-interop.md`
- `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`

This is the best demo example for evidence discipline: the system did not close until enough user-provided runtime evidence existed.

## Demo-readiness Sanitization Completed

Product source-of-truth and validation evidence were sanitized for demo readiness.

Sanitization intent:

- separate product documents from agent-system hardening;
- remove or reword outdated `future/unimplemented` language;
- remove local path noise and private attachment identifiers from demo-facing evidence;
- preserve validated product behavior and evidence;
- avoid creating new Dev Foundry MTPs for the cleanup itself.

Sanitization commits:

- `d063ebeaeec0603c29c37df51e22f8ae268263af` - Sanitize product source-of-truth docs for demo readiness
- `b36c7e8322eb35e9bdc9b06da9156d3ecf6540e3` - Polish bootstrap product traceability docs
- `c7ad2ac9e12fbe6b4eeb7192903082c8a0ccf00e` - Clean demo-facing validation evidence
- `0b94329db202cb0c4a850343a0ffb5bc1c388be5` - Remove local path noise from validation records

Final local checks reported by user:

- `git status --short`: green / clean
- `npm test`: green
- `npm run build`: green
- grep cleanup check: green except acceptable false-positive wording, if any

## Important Prior Completed Agent-system Hardening

The following agent-system model remains active:

- Flow Evidence Manifest;
- manifest-first context;
- explicit scope layers;
- child-agent evidence packets;
- no-diff validation mode;
- read budget / MCP read reduction.

Main hardening artifact:

- `docs/70-agent-system/hardening/HARD-001-flow-evidence-manifest.md`

The three secondary agent-system docs were aligned and should not be treated as outdated:

- `docs/10-agents/agent-system.md`
- `docs/10-agents/alita-agent-blueprint.md`
- `docs/10-agents/alita-system-prompt-standard.md`

All seven active agent prompts were updated for the Flow Evidence Manifest model:

- `docs/10-agents/orchestrator.md`
- `docs/10-agents/child-agents/context-analyst.md`
- `docs/10-agents/child-agents/source-of-truth-author.md`
- `docs/10-agents/child-agents/governance.md`
- `docs/10-agents/child-agents/scaffolder.md`
- `docs/10-agents/child-agents/code-author.md`
- `docs/10-agents/child-agents/validator.md`

## Important Rules to Keep Front of Mind

1. Do not mix Dev Foundry agent hardening with Foundry Request Board product MTPs.
2. Do not route governed docs to Code Author.
3. Do not let Validator reject SoT Author MTP closure as Code Author implementation scope drift.
4. Do not make Validator scan the repo by metadata or timestamps when no git diff exists.
5. Do not let each child agent rediscover the same MTP/SPC/TSK facts repeatedly.
6. Do not claim tests were executed by Alita agents; runtime evidence in current flows was user-run.
7. Do not create terminal-based test-runner work unless explicitly governed as a future slice.
8. Do not treat `[x]` on a validation MT as validation success; the validation outcome lives in evidence.
9. Product docs are now sanitized for demo-readiness; avoid re-opening cleanup unless a real contradiction appears.

## Recommended Next Session Start

1. Ask the user to run `git pull` locally unless they already confirm they are up to date.
2. Read `.dev-foundry/session-handoff.md`.
3. Read `.dev-foundry/session-scratchpad.md`.
4. Confirm whether the goal is presentation deck creation.
5. Do not modify product code or source-of-truth docs unless the user explicitly asks.

## Suggested Next Work

Primary next work:

- Start the presentation deck for approval/exam scheduling.

Recommended deck narrative:

- Problem: unconstrained agents execute quickly but may drift, over-read, touch wrong files, or invent evidence.
- Proposal: Dev Foundry provides SDD governance, bounded execution, ownership routing, and evidence-backed validation for Alita agents.
- Demo product: Foundry Request Board.
- Golden scenarios: `MTP-006` and `MTP-007`.
- Value: less prompt-engineering burden for tired users, more deterministic execution, stronger evidence, fewer `rojo chillón` moments.

Do not start new product features before the deck unless a critical bug appears.

## Session Close State

The session ended after:

- MTP-006 and MTP-007 proved the workflow under real imperfect prompts;
- product source-of-truth and validation evidence were sanitized;
- local commands were reported green;
- the repo was ready for presentation deck preparation.
