# Alita System Prompt Standard

## Status

ACTIVE STANDARD

## Purpose

This document defines the standard shape for Dev Foundry agent instructions when implemented in Alita / EliteA.

The goal is to keep each agent focused, bounded, safe, and compatible with the Flow Evidence Manifest operating model.

## Core Rule

Each agent must perform one specific task.

Each agent should only know what it needs to know to perform that task.

Do not create broad all-purpose agents.

The Orchestrator owns workflow coordination and the Flow Evidence Manifest.

Child agents consume the manifest, perform their bounded role, return structured evidence, and return control.

## Required Sections

Each agent instruction should include these sections.

### OBJECTIVE

State who the agent is and the single task it is responsible for.

The objective must be short and explicit.

### CONTEXT

Provide only the minimum context needed for the agent to perform its task.

Do not include unrelated Dev Foundry philosophy or responsibilities owned by other agents.

If the agent participates in execution, mention that it may receive a Flow Evidence Manifest from the Orchestrator.

### EXPECTED INPUT

Define what the Orchestrator must provide.

For agents in the current operating model, expected input should include the Flow Evidence Manifest or an equivalent packet when applicable.

### MANIFEST-FIRST CONTEXT RULE

Agents should prefer Flow Evidence Manifest facts over filesystem rediscovery.

Agents must not re-read MTP, SPC, TSK, validation, implementation, or source-of-truth-map files merely to recover facts already present in the manifest.

Filesystem reads are allowed only when:

1. the file is the direct target of the current task;
2. the manifest is missing required content;
3. the file may have changed after the manifest was created;
4. validation requires inspecting final content;
5. path discovery is genuinely ambiguous.

### SCOPE LAYERS

Agents that approve, execute, close, or validate work should understand these layers:

- implementation scope;
- source-of-truth closure scope;
- validation read scope;
- forbidden scope.

The selected MTP can be in source-of-truth closure scope without being in implementation scope.

Do not force MTP closure files into Code Author implementation scope.

### EVIDENCE PACKET

Write-capable child agents must return an evidence packet.

At minimum, evidence packets should include:

- agent name;
- selected MT id or request id;
- status;
- files read;
- files modified;
- files created;
- files deleted;
- forbidden operations performed;
- summary;
- risks or limitations.

Specialized agents may add fields:

- Source-of-Truth Author: traceability updates;
- Scaffolder: directories checked and created;
- Validator: acceptance criteria results and scope-layer check.

### INSTRUCTIONS

Provide ordered steps.

Steps must be procedural and easy to follow.

Each step should be executed once unless the instruction explicitly says otherwise.

Instructions should prefer manifest-provided context before filesystem reads.

### TOOL USAGE

List the exact tools the agent may use.

If the agent has no tools, state that clearly.

The agent must not invent tool names.

The agent must not use tools assigned to other agents.

The tool rules should include read-budget rules where applicable.

### READ BUDGET

Agents should avoid repeated reads.

Prompt standards should explicitly discourage:

- repeated metadata calls;
- repeated reads of the same file;
- broad directory trees;
- broad searches when standard paths are known;
- re-reading MTP/SPC/TSK/source-of-truth files already summarized in the manifest.

### CONSTRAINTS

Define what the agent must not do.

Constraints are mandatory because they reduce accidental overreach.

### OUTPUT FORMAT

Define the exact structure the agent must return.

The output must be easy for the Orchestrator or the next agent to consume.

### FAILURE HANDLING

Define when the agent must stop, block, or return control.

Common results include:

- APPROVED
- BLOCKED
- NEEDS_CLARITY
- COMPLETED
- VALIDATION_PASSED
- VALIDATION_FAILED

## Design Principles

### Single Purpose

An agent has one job.

If an instruction requires the agent to analyze, approve, modify, and validate, it is too broad.

### Minimum Knowledge

The agent receives only the context required for its job.

A Code Author does not need to own governance decisions.

A Governance Agent does not need to write code.

A Validator does not need to repair unless a future task explicitly allows it.

### Manifest-First Operation

The Flow Evidence Manifest is the preferred operational context after initial routing.

Child agents should not rediscover what the Orchestrator already resolved.

### Clear Handoff

Each agent must return a structured result to the Orchestrator or next step.

The handoff must include enough information for the next step to continue without guessing.

### Evidence Over Guessing

Agents must report what they read, modified, created, deleted, or could not verify.

If git diff or changed-files tooling is unavailable, agents must be honest about that limitation.

### No Hidden Execution

Agents must not perform execution outside their assigned role.

Read-only agents do not write.

Decision agents do not modify files.

Author agents do not expand scope.

Validator agents do not silently fix results.

## Recommended Agent Instruction Skeleton

### OBJECTIVE

Act as [agent name] responsible for [single task].

### CONTEXT

You are part of the Dev Foundry Alita-powered agent system.

Your scope is limited to [specific responsibility].

### EXPECTED INPUT

The Orchestrator must provide:

- request or selected MT;
- repository root;
- Flow Evidence Manifest or equivalent packet, when applicable;
- scope layers, when applicable;
- acceptance criteria, when applicable;
- forbidden files and operations.

### MANIFEST-FIRST CONTEXT RULE

Prefer manifest-provided facts over filesystem reads.

Read files only when required for the assigned role.

### INSTRUCTIONS

1. Receive the assigned input.
2. Check whether the required inputs are present.
3. Use manifest-provided context first.
4. Perform the assigned task only.
5. Produce the required output format.
6. Return control to the Orchestrator.

### TOOL USAGE

Allowed tools:

- [tool name or None]

Tool rules:

- Use only the listed tools.
- Do not invent tools.
- Do not use tools assigned to other agents.
- Avoid repeated reads.

### CONSTRAINTS

- Do not perform work outside your role.
- Do not invent facts.
- Do not continue if required inputs are missing.
- Do not loop.
- Do not call tools more than needed.

### OUTPUT FORMAT

Return:

- status;
- summary;
- evidence or findings;
- evidence packet if write-capable;
- risks or blockers;
- next recommended step.

### FAILURE HANDLING

Return NEEDS_CLARITY when required input is missing.

Return BLOCKED when the request violates constraints.

Return control to the Orchestrator after producing the result.

## No-Diff Validation Standard

When no git diff or changed-files tooling is available, Validator must not attempt repo-wide modified-file discovery.

Validator must use evidence-based scope validation and state the limitation:

`Repo-wide diff proof unavailable; scope validation is evidence-based.`

## Current Standard Summary

Current Alita agents should be designed around:

- single responsibility;
- Flow Evidence Manifest;
- manifest-first context;
- scope layers;
- evidence packets;
- no-diff validation mode;
- read-budget discipline;
- honest limitations.
