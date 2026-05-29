# Brownfield Operating Model

## Purpose

This document explains how Dev Foundry handles existing projects where code, tests, and documentation may already exist before Dev Foundry is introduced.

This is included to make the demo realistic: most real engineering work is brownfield, not greenfield.

## Core Principle

In brownfield mode, Dev Foundry does not assume that existing documentation is complete, current, or authoritative.

It reconstructs a minimal source of truth from repository evidence before allowing bounded changes.

## Brownfield Flow

1. User describes a goal or problem in natural language.
2. Orchestrator acts as User Liaison and clarifies intent.
3. Context Analyst inspects the repository using safe read-only scope.
4. Source-of-Truth Author creates or updates a brownfield baseline.
5. Governance reviews the proposed delta scope.
6. Scaffolder is used only if approved structure is missing.
7. Code Author implements only the approved bounded change.
8. Validator checks the result against the baseline, delta spec, and acceptance criteria.

## Brownfield Baseline

A brownfield baseline must separate:

### Observed facts

Facts directly supported by code, tests, documentation, validation evidence, or repository structure.

### Inferences

Reasonable interpretations based on observed facts.

Inferences must be labeled as inferences.

### Unknowns

Important behavior, intent, risks, or dependencies that cannot be confirmed from available evidence.

### Risks

Areas where incorrect assumptions could cause regressions, scope creep, unsafe changes, or misleading validation.

### Safe change boundaries

Files, modules, behaviors, and operations that appear safe to change for the proposed slice.

## Delta Specs

After a brownfield baseline exists, new behavior should be defined as a delta spec.

A delta spec describes only the intended change relative to the observed baseline.

It should not rewrite the entire system as if Dev Foundry designed it from the start.

## Example Brownfield Answer

If asked how Dev Foundry handles an existing project, the concise answer is:

Dev Foundry enters Brownfield Mode. It first inspects the repo, separates observed facts from inferences and unknowns, creates a baseline source-of-truth document, and then creates a small delta spec for the requested change. Only after Governance approves the bounded delta does any implementation agent modify files.

## Demo Positioning

Greenfield demonstrates clean source-of-truth-first creation.

Brownfield demonstrates disciplined recovery of source of truth from existing evidence.

Hybrid demonstrates what happened in Agentic Slice 001: implementation evidence existed first, then Dev Foundry added a transparent source-of-truth spine as SDD hardening.
