# Dev Foundry Agentic Demo

This repository is a controlled experiment for Dev Foundry powered by Alita / EliteA agents.

The goal is to test a small governed agent system against a simple application named Foundry Request Board.

Foundry Request Board is the guinea pig app. The real subject is whether specialized agents can inspect, decide, modify, validate, and report under Dev Foundry rules.

## Requirements

- Node.js **20 LTS+** (see `package.json` `engines.node`)

## Quickstart

```bash
npm ci
npm test
```

If you are not using lockfile-driven installs:

```bash
npm install
npm test
```

## Documentation

- `docs/00-product/product-direction.md`
- `docs/00-product/experiment-model.md`
- `docs/10-agents/agent-system.md`
- `docs/10-agents/alita-agent-blueprint.md`
- `docs/10-agents/alita-system-prompt-standard.md`
- `docs/10-agents/child-agents/`
- `docs/20-governance/demo-guardrails.md`

## Current Stage

Repository structure and agent instructions are being bootstrapped.

The Foundry Request Board sample code is intentionally minimal and includes a Jest test suite (run via `npm test`).
