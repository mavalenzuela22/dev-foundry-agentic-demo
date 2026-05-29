# Alita System Prompt Standard

## Purpose

This document defines the standard shape for Dev Foundry agent instructions when implemented in Alita / EliteA.

The goal is to keep each agent focused, bounded, and safe.

## Core Rule

Each agent must perform one specific task.

Each agent should only know what it needs to know to perform that task.

Do not create broad all-purpose agents.

## Required Sections

Each agent instruction should include these sections.

### OBJECTIVE

State who the agent is and the single task it is responsible for.

The objective must be short and explicit.

### CONTEXT

Provide only the minimum context needed for the agent to perform its task.

Do not include unrelated Dev Foundry philosophy or responsibilities owned by other agents.

### INSTRUCTIONS

Provide ordered steps.

Steps must be procedural and easy to follow.

Each step should be executed once unless the instruction explicitly says otherwise.

### TOOL USAGE

List the exact tools the agent may use.

If the agent has no tools, state that clearly.

The agent must not invent tool names.

The agent must not use tools assigned to other agents.

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

### Clear Handoff

Each agent must return a structured result to the Orchestrator or next step.

The handoff must include enough information for the next step to continue without guessing.

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

### INSTRUCTIONS

1. Receive the assigned input.
2. Check whether the required inputs are present.
3. Perform the assigned task only.
4. Produce the required output format.
5. Return control to the Orchestrator.

### TOOL USAGE

Allowed tools:

- [tool name or None]

Tool rules:

- Use only the listed tools.
- Do not invent tools.
- Do not use tools assigned to other agents.

### CONSTRAINTS

- Do not perform work outside your role.
- Do not invent facts.
- Do not continue if required inputs are missing.
- Do not loop.
- Do not call tools more than needed.

### OUTPUT FORMAT

Return:

- status
- summary
- evidence or findings
- risks or blockers
- next recommended step

### FAILURE HANDLING

Return NEEDS_CLARITY when required input is missing.

Return BLOCKED when the request violates constraints.

Return control to the Orchestrator after producing the result.
