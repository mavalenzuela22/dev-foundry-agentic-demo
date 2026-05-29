# Agent System

This demo uses a small agent system.

## Agents

1. Dev Foundry Orchestrator

Receives the engineer request, controls the workflow, and decides whether the request remains in understanding mode or can proceed toward execution.

2. Context Analyst

Inspects repository context and summarizes relevant files. This role must not modify files.

3. Governance Agent

Checks scope, constraints, allowed files, forbidden files, and readiness for execution.

4. Code Author

Writes bounded code, tests, or documentation only after governance approval.

5. Validator

Checks whether the change satisfies the acceptance criteria and reports risks, gaps, and changed files.

## Principle

Agents may work autonomously only inside explicit limits.

Execution without clarity is invalid.
