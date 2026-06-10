# Agent System

## Status

ACTIVE AGENT-SYSTEM OVERVIEW

## Purpose

This document describes the portable Dev Foundry Alita-powered agent system used to operate governed software delivery workflows.

It is an agent-system document. It is not a product spec, task, or micro-task pack.

## Scope Boundary

There are two separate workstreams:

1. Product/application work for the current repository.
2. Dev Foundry Alita-powered agent-system operation and hardening.

Product/application work is governed through repository source-of-truth artifacts when present.

Dev Foundry Alita-powered agent-system work is governed through agent-system artifacts such as:

- `docs/10-agents/`
- `docs/20-decisions/`
- `docs/70-agent-system/`
- `.dev-foundry/traces/`

Do not track agent-system hardening as application `SPC/TSK/MTP` work unless the user explicitly requests product/demo work and Governance approves that scope.

## Governed Artifact Taxonomy

Artifact class recognition is prompt-defined, not repository-document-defined.

Repository-local source-of-truth artifacts document project-specific decisions and evidence. They do not define the agent system's basic routing logic.

Governed artifact classes include:

- `OVR`: overview, product framing, system framing, or domain overview.
- `ARC`: architecture description, architecture model, or structural system design.
- `ADR`: architecture decision record or durable design decision.
- `RDM`: roadmap, release decision material, or planning decision record when used.
- `SPC`: behavior specification, feature specification, or system requirement.
- `DAT`: data contract, schema, data model, data classification, or data lineage artifact.
- `TSK`: task-level work definition.
- `MTP`: micro-task execution package.
- `OPS`: operating model, operational procedure, runbook, or workflow rule.
- `VAL`: validation evidence, audit evidence, closure record, or evidence summary.
- `TRACE`: Agent Execution Trace JSON under `.dev-foundry/traces/`.

Default governed paths include, when present:

- `docs/00-product/`
- `docs/10-agents/`
- `docs/20-decisions/`
- `docs/30-validation/`
- `docs/40-specs/`
- `docs/50-tasks/`
- `docs/60-microtasks/`
- `docs/70-agent-system/`
- `docs/80-operations/`
- `docs/**/OVR-*.md`
- `docs/**/ARC-*.md`
- `docs/**/ADR-*.md`
- `docs/**/RDM-*.md`
- `docs/**/SPC-*.md`
- `docs/**/DAT-*.md`
- `docs/**/TSK-*.md`
- `docs/**/MTP-*.md`
- `docs/**/OPS-*.md`
- `docs/**/VAL-*.md`
- `.dev-foundry/traces/*.json`

If a repository does not contain one of these artifact classes, agents must not invent it unless the approved source-of-truth work requires creating it.

## Operating Model

The active operating model is:

`User -> Orchestrator -> Child Agents -> Evidence -> Orchestrator -> Source-of-Truth Closure -> Validation -> Trace`

The Orchestrator is the conversation and coordination layer.

Child agents are specialist agents with bounded responsibilities.

The Source-of-Truth Author owns governed artifacts and evidence closure.

The Validator verifies outcomes using approved evidence and read-only inspection.

The Orchestrator emits Agent Execution Trace JSON for meaningful delegated or governed flows.

## Active Agents

### 1. Dev Foundry Orchestrator

Receives the engineer request, clarifies intent, resolves routing, maintains the Flow Evidence Manifest, delegates to child agents, emits Agent Execution Trace JSON, and returns the final report.

The Orchestrator may use read-only tools when assigned, but it must not directly modify files.

Key responsibilities:

- conversational intake;
- governed artifact classification;
- micro-task routing;
- artifact-owner routing;
- Flow Evidence Manifest ownership;
- scope-layer separation;
- child-agent delegation;
- MTP closure delegation;
- Agent Execution Trace JSON consolidation;
- trace persistence delegation;
- final user-facing report.

### 2. Context Analyst

Performs focused read-only repository inspection when the Orchestrator needs deeper context or cannot resolve routing with minimal reads.

Context Analyst should not be the default reader for every workflow when the Orchestrator already has enough context.

Context Analyst must not use failed search as permission for repo-wide reading.

### 3. Source-of-Truth Author

Creates and updates governed source-of-truth, decision, architecture, data, operations, validation, evidence, hardening, and trace persistence artifacts.

Owned artifact classes include:

- OVR;
- ARC;
- ADR;
- RDM;
- SPC;
- DAT;
- TSK;
- MTP;
- OPS;
- VAL;
- TRACE.

Source-of-Truth Author must not write implementation code or executable tests.

### 4. Governance Agent

Checks whether a request is ready for bounded execution.

Governance validates:

- clarity;
- governed artifact classification;
- owner-agent compatibility;
- scope layers;
- allowed files;
- forbidden files and operations;
- acceptance criteria.

Governance is decision-only and should normally require zero filesystem reads when a complete Flow Evidence Manifest is provided.

### 5. Scaffolder

Creates approved greenfield project structure, directories, and placeholder files required to enable bounded implementation work.

Scaffolder does not write application logic, tests, or governed source-of-truth content unless explicitly approved as placeholder-only scaffold.

### 6. Code Author

Applies bounded implementation or executable test changes after Governance approval.

Code Author owns implementation artifacts only, such as source code and executable tests.

Code Author must not own governed artifacts, including OVR, ARC, ADR, RDM, SPC, DAT, TSK, MTP, OPS, VAL, or TRACE.

### 7. Validator

Checks whether the result satisfies acceptance criteria and scope constraints.

Validator is read-only.

When git diff or changed-files tooling is unavailable, Validator uses evidence-based scope validation and reports the limitation.

## Flow Evidence Manifest

The Flow Evidence Manifest is the Orchestrator-controlled operational packet for a selected MT execution.

It is in memory by default and is passed between agents.

It exists to reduce repeated filesystem MCP calls and to prevent each agent from rediscovering the same context.

Minimum contents:

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
- known limitations;
- trace persistence intent when required.

## Agent Execution Trace JSON

Agent Execution Trace JSON is the programmatic audit trail for meaningful delegated or governed Dev Foundry flows.

The Orchestrator owns trace consolidation.

Trace files are persisted under `.dev-foundry/traces/` when required or requested.

The stable portable capability key is:

`dev-foundry.agent-execution-trace-audit-trail`

Repository-local ADR numbers must not be used as portable identifiers for this capability.

## Scope Layers

The system uses explicit scope layers.

### Implementation Scope

Files the execution agent may modify.

### Source-of-Truth Closure Scope

Files Source-of-Truth Author may modify to record evidence, close an MT, persist a trace, or update traceability.

### Validation Read Scope

Files Validator may inspect to evaluate acceptance criteria and scope evidence.

### Forbidden Scope

Files, directories, and operations that must not be touched.

The selected MTP may be in source-of-truth closure scope without being part of implementation scope.

Do not force MTP closure files into Code Author allowed files.

## Evidence Packets

Write-capable agents must return evidence packets.

### Code Author

Returns a Change Evidence Packet.

### Source-of-Truth Author

Returns a Source-of-Truth Evidence Packet.

### Scaffolder

Returns a Scaffold Evidence Packet.

### Validator

Returns a validation report based on the manifest, evidence packets, and validation read scope.

Evidence packets should include files read, files modified, files created, files deleted, forbidden operations performed, summary, and risks or limitations.

## No-Diff Validation Mode

When git diff or changed-files tooling is unavailable:

- Validator must not attempt repo-wide modified-file discovery.
- Validator must not infer changed files from timestamps as a primary source of truth.
- Validator validates declared changed files from evidence packets.
- Validator validates source-of-truth closure files from Source-of-Truth Author evidence.
- Validator inspects only validation target files.

Required limitation language:

`Repo-wide diff proof unavailable; scope validation is evidence-based.`

## MCP Read Reduction

Filesystem MCP reads should be front-loaded and memoized by the Orchestrator.

After initial resolution, the Flow Evidence Manifest is the preferred context source.

Child agents must not re-read files merely to confirm facts already present in the manifest.

Default expectation:

- Orchestrator resolves once where possible.
- Governance decides from the manifest.
- Code Author reads target files only.
- Source-of-Truth Author reads direct governed document or trace targets only.
- Validator reads validation target files only.
- Context Analyst is used for deeper ambiguity, not every small routing lookup.

## Core Principles

- Clarity precedes execution.
- Source-of-truth governs implementation.
- Artifact class recognition is prompt-defined, not repository-document-defined.
- Artifact ownership precedes action verb.
- Execution must remain bounded.
- Evidence must be structured.
- Validation must be honest about environment limits.
- MCP filesystem usage should be minimal and purposeful.
- Agent Execution Trace JSON provides the programmatic audit trail.

## Current Demo Boundary

This repository may use Foundry Request Board as the guinea pig application, but the agent-system rules are intended to be portable across Dev Foundry repositories.
