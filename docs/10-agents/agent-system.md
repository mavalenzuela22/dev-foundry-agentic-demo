# Agent System

## Status

ACTIVE AGENT-SYSTEM OVERVIEW

## Purpose

This document describes the Dev Foundry Alita-powered agent system used to operate the Foundry Request Board demo.

It is an agent-system document. It is not a Foundry Request Board product spec, task, or micro-task pack.

## Scope Boundary

There are two separate workstreams:

1. Foundry Request Board product/app work.
2. Dev Foundry Alita-powered agent-system operation and hardening.

Foundry Request Board product work is governed through app source-of-truth artifacts such as:

- `docs/40-specs/`
- `docs/50-tasks/`
- `docs/60-microtasks/`

Dev Foundry Alita-powered agent-system work is governed through:

- `docs/10-agents/`
- `docs/70-agent-system/`

Do not track agent-system hardening as app `SPC/TSK/MTP` work.

## Operating Model

The active operating model is:

`User -> Orchestrator -> Child Agents -> Evidence -> Orchestrator -> Source-of-Truth Closure -> Validation`

The Orchestrator is the conversation and coordination layer.

Child agents are specialist agents with bounded responsibilities.

The Source-of-Truth Author owns governed documents and evidence closure.

The Validator verifies outcomes using approved evidence and read-only inspection.

## Active Agents

### 1. Dev Foundry Orchestrator

Receives the engineer request, clarifies intent, resolves routing, maintains the Flow Evidence Manifest, delegates to child agents, and returns the final report.

The Orchestrator may use read-only tools when assigned, but it must not directly modify files.

Key responsibilities:

- conversational intake;
- micro-task routing;
- artifact-owner routing;
- Flow Evidence Manifest ownership;
- scope-layer separation;
- child-agent delegation;
- MTP closure delegation;
- final user-facing report.

### 2. Context Analyst

Performs focused read-only repository inspection when the Orchestrator needs deeper context or cannot resolve routing with minimal reads.

Context Analyst should not be the default reader for every workflow when the Orchestrator already has enough context.

### 3. Source-of-Truth Author

Creates and updates governed source-of-truth and evidence documents.

Owned artifacts include:

- specs;
- tasks;
- micro-task packs;
- source-of-truth maps;
- validation evidence;
- slice summaries;
- brownfield baselines;
- agent-system hardening documents;
- MTP closure evidence.

### 4. Governance Agent

Checks whether a request is ready for bounded execution.

Governance validates:

- clarity;
- owner-agent compatibility;
- scope layers;
- allowed files;
- forbidden files and operations;
- acceptance criteria.

Governance is decision-only and should normally require zero filesystem reads when a complete Flow Evidence Manifest is provided.

### 5. Scaffolder

Creates approved greenfield project structure, directories, and placeholder files required to enable bounded implementation work.

Scaffolder does not write application logic or tests.

### 6. Code Author

Applies bounded implementation or test changes after Governance approval.

Code Author owns implementation artifacts only, such as source code and executable tests.

Code Author must not own governed source-of-truth or evidence documents.

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
- known limitations.

## Scope Layers

The system uses explicit scope layers.

### Implementation Scope

Files the execution agent may modify.

### Source-of-Truth Closure Scope

Files Source-of-Truth Author may modify to record evidence, close an MT, or update traceability.

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

The current Alita environment does not provide terminal-based `git diff` during agent execution.

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
- Source-of-Truth Author reads direct document targets only.
- Validator reads validation target files only.
- Context Analyst is used for deeper ambiguity, not every small routing lookup.

## Core Principles

- Clarity precedes execution.
- Source-of-truth governs implementation.
- Artifact ownership precedes action verb.
- Execution must remain bounded.
- Evidence must be structured.
- Validation must be honest about environment limits.
- MCP filesystem usage should be minimal and purposeful.

## Current Demo Boundary

Foundry Request Board is the guinea pig application.

The real experiment is whether the Alita-powered Dev Foundry agents can converse, route, govern, execute, validate, and preserve evidence under deterministic rules without overusing tools or mixing responsibilities.
