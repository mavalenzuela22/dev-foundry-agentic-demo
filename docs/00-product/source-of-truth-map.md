# Source-of-Truth Map

> Honesty note (retroactive hardening): This source-of-truth spine was created after Agentic Slice 001 as Spec-Driven Development (SDD) hardening. It formalizes validated behavior and establishes the baseline for future source-of-truth-first execution.

## Spine (Agentic Slice 001)

- Spec: `docs/40-specs/SPC-001-foundry-request-classification.md`
- Task: `docs/50-tasks/TSK-001-documentation-only-classifier.md`
- Micro-task pack: `docs/60-microtasks/MTP-001-documentation-only-classifier.md`

## Planned spine (Frontend UI MVP)

- Spec: `docs/40-specs/SPC-002-frontend-ui.md`
- Task: `docs/50-tasks/TSK-003-frontend-ui.md`
- Micro-task pack: `docs/60-microtasks/MTP-004-frontend-ui.md`
  - Governance gate: MT-005 (tooling/dependencies approval)

## Product intent anchors

- Product direction: `docs/00-product/product-direction.md`
- Demo guardrails: `docs/20-governance/demo-guardrails.md`

## Implementation (validated in Slice 001)

- Classifier implementation: `src/requestClassifier.js`
- Jest-style tests (not executed; static inspection only): `tests/requestClassifier.test.js`

## Validation evidence (Slice 001)

- Slice summary: `docs/30-validation/agentic-slice-001-summary.md`
- Commit review (artifact attribution + behavior summary): `docs/30-validation/code-author-commit-review-e953f5a.md`
- Validator report (static inspection): `docs/30-validation/validator-smoke-test-001.md`

## Validation evidence (Slice 002)

- Slice summary: `docs/30-validation/agentic-slice-002-security-delta-summary.md`
- Documentation closure MTP (retroactive hardening): `docs/60-microtasks/MTP-003-slice-002-security-delta-summary-template-alignment.md`

## Traceability (minimal)

- `SPC-001` -> `TSK-001` -> `MTP-001`
- `SPC-001` -> delta tasks:
  - `docs/50-tasks/TSK-002-security-request-classification-delta.md` -> `docs/60-microtasks/MTP-002-security-request-classification-delta.md`
- `SPC-001` -> implementation: `src/requestClassifier.js`, `tests/requestClassifier.test.js`
- `SPC-001` -> validation evidence: `docs/30-validation/validator-smoke-test-001.md`

- `SPC-002` -> `TSK-003` -> `MTP-004`
  - Planned implementation (to be added after execution): UI files under `ui/**` (or chosen alternate) + bundler config
  - Planned validation evidence (to be added after execution): Validator report for UI MVP

## Notes / constraints captured

- Runtime test execution is intentionally out of scope for Slice 001 (no `package.json` / test runner). Validation was performed by static inspection.
- The classifier is deterministic and keyword/regex based; ambiguous requests route to `needs_review`.
