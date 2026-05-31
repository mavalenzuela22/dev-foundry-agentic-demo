# Dev Foundry Session Scratchpad

## Status

ACTIVE SCRATCHPAD

## Purpose

This scratchpad captures working notes, recent decisions, open questions, and near-term execution ideas from the session.

Use `.dev-foundry/session-handoff.md` as the primary continuation artifact. Use this file for operational notes and next-session prompts.

## Current Mental Model

There are two separate workstreams:

1. Foundry Request Board product/app work.
2. Dev Foundry Alita-powered agent-system hardening.

Do not mix them.

App behavior and features belong to the Foundry Request Board `SPC/TSK/MTP` chain.

Agent-system behavior belongs under:

- `docs/10-agents/`
- `docs/70-agent-system/`

## Session Highlights

### Foundry Request Board

The app has a small deterministic classifier:

- `src/requestClassifier.js`
- `tests/requestClassifier.test.js`

The classifier can identify documentation-only, mixed, code, unknown, and security-related requests.

Slice 002 closed by static validation after remediation.

The important remediation was recognizing Spanish documentation intent via:

`/\bdocumentaci[oó]n\b/`

### Alita Agent System

The major hardening was a shift to:

- Flow Evidence Manifest;
- manifest-first context;
- explicit scope layers;
- child-agent evidence packets;
- no-diff validation mode;
- read budget / MCP read reduction.

All active agents and the secondary agent-system docs were aligned to this model.

## Files to Remember

### Active agent prompts

- `docs/10-agents/orchestrator.md`
- `docs/10-agents/child-agents/context-analyst.md`
- `docs/10-agents/child-agents/source-of-truth-author.md`
- `docs/10-agents/child-agents/governance.md`
- `docs/10-agents/child-agents/scaffolder.md`
- `docs/10-agents/child-agents/code-author.md`
- `docs/10-agents/child-agents/validator.md`

### Secondary agent-system docs

These were updated at the very end and must not be forgotten:

- `docs/10-agents/agent-system.md`
- `docs/10-agents/alita-agent-blueprint.md`
- `docs/10-agents/alita-system-prompt-standard.md`

### Agent-system hardening

- `docs/70-agent-system/hardening/HARD-001-flow-evidence-manifest.md`

### App source of truth

- `docs/00-product/source-of-truth-map.md`
- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/50-tasks/TSK-001-documentation-only-classifier.md`
- `docs/50-tasks/TSK-002-security-request-classification-delta.md`
- `docs/60-microtasks/MTP-001-documentation-only-classifier.md`
- `docs/60-microtasks/MTP-002-security-request-classification-delta.md`

### Validation evidence

- `docs/30-validation/agentic-slice-001-summary.md`
- `docs/30-validation/agentic-slice-002-security-delta-summary.md`

## Important Commits from This Session

### Slice 002 and validation evidence

- `49fa23efef1e0fd9faa3daeca65bb41a58dde776` - MT-003 implementation
- `8e149d94d28bb3b5d2a6d12f585ca588eda306dc` - MT-003 closure
- `d4250d33caf93378f67b4c9aabe4249e83cb4527` - MT-004 tests and closure
- `28a8ac61f13e277b5f872e0ecf018b631afb407d` - MT-005 failure, MT-006 remediation, MT-007 re-validation
- `127729f7275a8d1deae84ebea84f405aefab7fe4` - Slice 002 summary persisted
- `4fac9829aa2f7b946e4877c3a4e078aeadd3a5bd` - Slice 002 summary translated/aligned

### Orchestrator and routing hardening

- `fb10f8c1a7f9c8b7571ab9750058afdfa87ba066` - Context Analyst resolver mode
- `3b5f0ac6e02bd5be9705bcb645c0cb766ec1a060` - Orchestrator resolver delegation rule
- `6329eb95b3579d4c2cae4a381a0a43c4f4487818` - Orchestrator consolidated into single canonical file
- `ade55498d8f3f68d90b57a9d3a818037bc03d7cb` - removed separate Orchestrator hardening file

### Artifact owner routing

- `8828098a1ea604c483009f65fad5cc27ee70de0e` - Orchestrator governed-doc owner routing
- `a5cf03b4ef517db4d00402d20d7ea7ee0f4a0fa0` - SoT Author governed document ownership
- `b210c3df2a3bab39b48ccf5dda6c114682e32871` - Governance owner compatibility checks

### Flow Evidence Manifest and read reduction

- `273d3fdaefc6bdc5f3d360dbf50336fcb49aa64b` - HARD-001 created
- `9dc9eecbf09be27e63aab4451d7a8a2c50cf8231` - HARD-001 strengthened for MCP read reduction
- `3d44c82a0dc56225872ebbd0101eb7b3ee7dc785` - Orchestrator Flow Evidence Manifest
- `f650d0e4cc3215363eefd2d663b9651e991cc1c0` - Governance scope layers
- `e39099e57e179a4c858749882939b5b80f21f4a8` - Code Author Change Evidence Packet
- `5338b38c6a17ac20c3040acb85e94b94375eb032` - Validator no-diff validation mode
- `47d63a3cc202cd82ea94badb0745ae7d5975a3c0` - SoT Author manifest-first/evidence packet
- `2c6e5d86190d888829e9931ae95bab580b456109` - Context Analyst manifest-first
- `c6d1a6c42d768fd0bd45729ee1d4af6d37793566` - Scaffolder manifest-first/evidence packet

### Secondary agent-system docs

- `a753b10bc48f57a5fcddb5994a6b881dc2732e62` - aligned `docs/10-agents/agent-system.md`
- `f5a246a0077b61bd715695bed0bfd0edae6531c5` - aligned `docs/10-agents/alita-agent-blueprint.md`
- `63afa8503a54c049c3ba98db3a5bcb0c7962a3d2` - aligned `docs/10-agents/alita-system-prompt-standard.md`

### Session continuity

- `94df55569cd192a14d0460b501879361bd61c407` - created `.dev-foundry/session-handoff.md`
- `ddf5d77ea739febbfe29a5fe7d157d6589c475b3` - created `.dev-foundry/session-scratchpad.md`
- `4ba865b7ae20102f1a292a628a901e3f5674e707` - refreshed `.dev-foundry/session-handoff.md` after secondary docs alignment
- current commit refreshes `.dev-foundry/session-scratchpad.md` after secondary docs alignment

## Rules to Keep Front of Mind

### Do not overuse MCP filesystem

The user explicitly complained that agents were making too many filesystem MCP calls:

- repeated metadata calls;
- repeated file reads;
- directory trees;
- broad scans;
- re-reading the same MTP/spec/task files multiple times.

The fix is not just documentation. The next session should test whether the updated agents actually reduce MCP calls.

### Validator cannot prove repo-wide diff

There is no terminal and no git diff available in the Alita agent environment.

Validator must not pretend it can prove repo-wide changed files.

Use evidence-based validation:

- declared changed files from child-agent evidence packets;
- SoT closure files from SoT Author evidence;
- static inspection of validation target files.

### MTP closure is not implementation scope

The selected MTP can be modified by SoT Author for evidence closure. That must be tracked under source-of-truth closure scope, not Code Author implementation scope.

### Timestamps are advisory only

Do not use file modification timestamps as the primary changed-file mechanism.

### No terminal

Alita agents do not currently have terminal access.

Do not claim tests were executed unless there is actual runtime evidence.

### Secondary docs are now aligned

Do not assume `agent-system.md`, `alita-agent-blueprint.md`, or `alita-system-prompt-standard.md` are old/outdated. They were refreshed at the end of the session to preserve the Flow Evidence Manifest model.

## Open Questions

1. Should the next app slice be product-facing or agent-system validation?
   - Product-facing options: CLI, UI, request board view.
   - Agent-system validation option: run a small controlled task and measure MCP calls.

2. Should runtime test execution be added later through CI?
   - Possible future slice.
   - Do not assume terminal access.
   - Would require governance because it touches package/config/workflow files.

3. Should `.dev-foundry` continuity files be added to source-of-truth map?
   - Not decided.
   - They are session artifacts, not product artifacts.

4. Should a lightweight metric be added to Orchestrator reports for tool calls/read count?
   - This may help prove MCP read reduction.
   - Could be part of an agent-system smoke test rather than app work.

## Recommended First Prompt for Next Session

Use this prompt to start the next session:

We are resuming work in `mavalenzuela22/dev-foundry-agentic-demo`.

Start by reminding me to run `git pull` unless I already confirm it.

Before planning, prompting, or modifying artifacts, read:

1. `.dev-foundry/session-handoff.md`
2. `.dev-foundry/session-scratchpad.md`

Current focus:
- Dev Foundry / Alita-powered agentic demo.
- Keep Foundry Request Board product work separate from agent-system hardening.
- Active agent prompts are under `docs/10-agents/`.
- Agent-system hardening lives under `docs/70-agent-system/`.
- The latest model is Flow Evidence Manifest + manifest-first context + scope layers + evidence packets + no-diff validation mode.
- Secondary docs `agent-system.md`, `alita-agent-blueprint.md`, and `alita-system-prompt-standard.md` are aligned with the model.
- Do not create app MTPs for agent-system hardening.
- Do not claim runtime tests were executed; Alita agents do not have terminal access.

Immediate question:
Confirm whether all seven Alita agents have been updated with the latest prompt files, then propose the smallest safe test to verify the new manifest-first / MCP-read-reduction behavior.

## Next Safe Test Idea

Ask Orchestrator something simple first:

`What is the current status of MTP-002 and are there any pending MTs? Do not execute anything.`

Expected behavior:

- Orchestrator should answer read-only.
- It should not call Code Author.
- It should use minimal reads or existing manifest/context.
- It should report no pending MTs if MTP-002 is fully closed.
- It should avoid unnecessary Context Analyst delegation if it can read directly.

Then test a small doc-only governed change only if needed.

## Scratch Notes

- User prefers low-friction natural language prompts for the demo.
- The demo audience may include engineers with only a few months of AI tooling experience.
- The Orchestrator must absorb prompt-engineering complexity.
- The system should not require users to provide allowed files, forbidden files, acceptance criteria, or repo root when those can be inferred safely.
- Orchestrator should not ask for repo root if exactly one allowed directory is available or if it can read directly.
- Context Analyst should not be invoked for every simple routing question if Orchestrator can read directly.
- Governance should normally require zero filesystem reads when the manifest is complete.
- Validator should return `VALIDATION_PASSED_WITH_LIMITATION` style language if ACs pass but repo-wide diff proof is unavailable, even though its official result enum remains `VALIDATION_PASSED`.

## End State

Continuity files were refreshed because the current session is closing and work will resume in a new session.
