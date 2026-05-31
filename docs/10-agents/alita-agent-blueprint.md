# Alita Agent Blueprint

## Status

ACTIVE BLUEPRINT

## Purpose

This file describes the recommended Alita / EliteA shape for the Dev Foundry agent system used by the Foundry Request Board demo.

The goal is not to build a full platform yet.

The goal is to operate a small, inspectable, governed agent workflow that can be tested safely against Foundry Request Board.

## System Boundary

This blueprint describes the Dev Foundry Alita-powered agent system.

It must not be confused with Foundry Request Board product source-of-truth.

Product/app work belongs to the app source-of-truth chain:

- specs;
- tasks;
- micro-task packs;
- product validation evidence.

Agent-system hardening belongs under:

- `docs/10-agents/`
- `docs/70-agent-system/`

## Recommended Alita Shape

Use one main Orchestrator agent and several specialist child agents.

The system may be implemented as:

- one Orchestrator agent with child agents attached as callable resources; or
- one Alita pipeline that calls specialist agents.

The pipeline option may be easier to explain visually once the workflow is stable.

The Orchestrator remains the conversation and coordination layer.

## Current Active Agents

1. Dev Foundry Orchestrator
2. Dev Foundry Context Analyst
3. Dev Foundry Source-of-Truth Author
4. Dev Foundry Governance Agent
5. Dev Foundry Scaffolder
6. Dev Foundry Code Author
7. Dev Foundry Validator

## Core Runtime Pattern

The preferred runtime pattern is:

1. User speaks naturally.
2. Orchestrator clarifies intent only when needed.
3. Orchestrator resolves routing using minimal reads or Context Analyst.
4. Orchestrator creates or updates the Flow Evidence Manifest.
5. Governance approves bounded execution using scope layers.
6. The assigned child agent executes only the selected task.
7. The child agent returns an evidence packet.
8. Orchestrator appends evidence to the manifest.
9. Source-of-Truth Author closes MTP/evidence when required.
10. Validator validates from the manifest and target files.
11. Orchestrator reports final state and next safe step.

## Flow Evidence Manifest

The Flow Evidence Manifest is the Orchestrator-controlled operational packet.

It exists to reduce repeated filesystem MCP calls and keep child agents from rediscovering the same facts.

It is in memory by default, not a repository artifact.

The manifest should contain:

- repository root;
- selected MTP path;
- selected MT id;
- selected MT owner;
- selected MT purpose;
- extracted selected MT requirements;
- acceptance criteria;
- source-of-truth references;
- implementation scope;
- source-of-truth closure scope;
- validation read scope;
- forbidden scope;
- governance decision packet;
- child-agent evidence packets;
- validation mode;
- limitations.

## Agent 1: Dev Foundry Orchestrator

### Responsibility

Controls the workflow from natural-language request to final report.

### Main Duties

- Receive the engineer request.
- Clarify intent without forcing prompt-engineering templates on the user.
- Resolve MTP/MT routing.
- Route by artifact ownership before action verb.
- Maintain the Flow Evidence Manifest.
- Separate implementation scope, source-of-truth closure scope, validation read scope, and forbidden scope.
- Delegate repository inspection to Context Analyst only when needed.
- Delegate readiness review to Governance Agent.
- Delegate source-of-truth work to Source-of-Truth Author.
- Delegate code or test changes only after approval.
- Delegate validation after changes.
- Return a final human-readable report.

### Must Not

- Modify files directly.
- Skip governance review for execution.
- Invent project decisions.
- Continue execution when scope is unclear.
- Ask the user for formal handoff details when they can be inferred safely.
- Force child agents to rediscover facts already present in the manifest.

### Output Contract

- Request summary.
- Current mode.
- Artifact ownership summary.
- Flow Evidence Manifest summary.
- Delegation steps performed.
- Governance result.
- Execution result if any.
- Validation result if any.
- Scope notes.
- Final recommendation.

## Agent 2: Context Analyst

### Responsibility

Performs focused read-only inspection when the Orchestrator needs deeper context or cannot resolve routing with minimal reads.

### Main Duties

- Inspect allowed repository files only when needed.
- Resolve repository root, MTP path, selected MT, or next pending MT when delegated.
- Use the Flow Evidence Manifest when provided.
- Explain observed facts and label inferences.
- Identify relevant files for review without approving modification scope.

### Must Not

- Modify files.
- Make governance decisions.
- Validate final results.
- Assume missing behavior.
- Perform broad repository discovery when a focused read or manifest fact is sufficient.

### Output Contract

- Files inspected.
- Flow Evidence Manifest facts reused.
- Relevant findings.
- Routing resolution, if applicable.
- Uncertainties.
- Read budget notes.

## Agent 3: Source-of-Truth Author

### Responsibility

Creates or updates governed source-of-truth and evidence documents.

### Main Duties

- Create or update specs, tasks, MTPs, maps, baselines, validation summaries, slice summaries, and agent-system hardening documents.
- Own translation, template alignment, and evidence normalization for governed docs.
- Close MTP checkboxes and evidence when the Orchestrator delegates closure.
- Use manifest facts instead of rediscovering context.
- Return a Source-of-Truth Evidence Packet.

### Must Not

- Modify implementation code.
- Write executable tests.
- Approve execution.
- Validate implementation.
- Touch runtime, dependency, deployment, or secret files.

### Output Contract

- Documents created.
- Documents updated.
- Evidence reviewed.
- Traceability summary.
- Source-of-Truth Evidence Packet.
- Risks or limitations.

## Agent 4: Governance Agent

### Responsibility

Decides whether the request is ready for bounded execution.

### Main Duties

- Check clarity.
- Check artifact owner compatibility.
- Check scope layers.
- Check allowed files.
- Check forbidden files and operations.
- Check acceptance criteria.
- Decide APPROVED, BLOCKED, or NEEDS_CLARITY.

### Must Not

- Write code.
- Modify files.
- Approve broad or unclear execution.
- Approve Code Author ownership for governed source-of-truth documents.
- Re-read filesystem context when a complete manifest is provided.

### Output Contract

- Decision.
- Reason.
- Owner agent.
- Scope layers.
- Allowed files by scope layer.
- Forbidden files or operations.
- Acceptance criteria.
- Artifact ownership check.
- Safe next step.

## Agent 5: Scaffolder

### Responsibility

Creates approved greenfield project structure, directories, and placeholder files required to enable bounded implementation work.

### Main Duties

- Create only approved directories.
- Create only approved placeholder files.
- Avoid application logic, tests, dependencies, and configuration unless explicitly approved.
- Use manifest-first context.
- Return a Scaffold Evidence Packet.

### Must Not

- Implement business logic.
- Write tests.
- Add dependencies.
- Modify files outside scaffold scope.
- Touch secrets or runtime/deployment files.

### Output Contract

- Directories checked.
- Directories created.
- Files checked.
- Placeholder files created.
- Scaffold Evidence Packet.
- Risks or limitations.

## Agent 6: Code Author

### Responsibility

Applies bounded code or test changes after governance approval.

### Main Duties

- Modify only implementation-scope files.
- Keep changes minimal.
- Preserve existing behavior unless explicitly approved.
- Add or update tests when required and approved.
- Return a Change Evidence Packet.

### Must Not

- Modify files outside implementation scope.
- Modify governed source-of-truth or evidence docs.
- Add dependencies unless explicitly approved.
- Touch secrets.
- Commit, push, deploy, or install packages during the demo.
- Re-read MTP/SPC/TSK files when the manifest already contains the selected MT requirements.

### Output Contract

- Files read.
- Files modified.
- Change summary.
- Acceptance criteria addressed.
- Change Evidence Packet.
- Anything intentionally not changed.

## Agent 7: Validator

### Responsibility

Checks whether the result satisfies the acceptance criteria and scope constraints.

### Main Duties

- Review the Flow Evidence Manifest.
- Validate declared modified files against scope layers.
- Inspect only validation target files.
- Compare result against acceptance criteria.
- Identify risks or gaps.
- Report no-diff limitations honestly.

### Must Not

- Modify files.
- Repair issues unless a future task explicitly allows validator repair.
- Approve results without evidence.
- Infer repo-wide changes from timestamps.
- Perform broad repository discovery when evidence packets are available.

### Output Contract

- Validation result.
- Flow Evidence Manifest reviewed.
- Scope layer check.
- Acceptance criteria results.
- Runtime validation note.
- Risks or gaps.
- Recommended next step.

## No-Diff Validation Boundary

The current Alita environment does not provide terminal execution or git diff during agent runs.

Validator must not pretend to prove repo-wide changed files when that evidence is unavailable.

Use this limitation language:

`Repo-wide diff proof unavailable; scope validation is evidence-based.`

## Demo Boundary

Foundry Request Board is the guinea pig application.

The real experiment is whether the Alita / EliteA agents can converse, inspect, decide, modify, validate, preserve evidence, and reduce repeated tool calls under Dev Foundry rules.

## First Test Scenario

The first completed scenario was documentation-only classification.

The second completed scenario was security request classification with a real validation failure and bounded remediation.

Future test scenarios should be small, deterministic, and should not mix agent-system hardening into app product MTPs.
