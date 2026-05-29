# Agent System

This demo uses a small agent system.

## Agents

1. Dev Foundry Orchestrator

Receives the engineer request, controls the workflow, and decides whether the request remains in understanding mode or can proceed toward execution.

2. Context Analyst

Inspects repository context and summarizes relevant files. This role must not modify files.

3. Source-of-Truth Author

Creates or updates governed source-of-truth documents such as specs, tasks, micro-task packs, source-of-truth maps, and brownfield baselines.

4. Governance Agent

Checks scope, constraints, allowed files, forbidden files, and readiness for execution.

5. Scaffolder

Creates approved greenfield project structure, directories, and placeholder files required to enable bounded implementation work.

6. Code Author

Writes bounded code, tests, or documentation only after governance approval and only inside already approved structure.

7. Validator

Checks whether the change satisfies the acceptance criteria and reports risks, gaps, and changed files.

## Principle

Agents may work autonomously only inside explicit limits.

Execution without clarity is invalid.

Source-of-truth documents must govern execution.

Greenfield scaffold creation and feature implementation are separate responsibilities.
