# TSK-001: Documentation-only classifier (retroactive hardening)

> Honesty note (retroactive hardening): This task document was created after Agentic Slice 001 as SDD hardening. It captures already-validated behavior and constraints.

## Objective

Formalize the Slice 001 implementation of the Foundry Request Board documentation-only request classifier.

## Mode

Hybrid (retroactive hardening after Agentic Slice 001).

## Allowed files (implementation evidence; do not modify for this task)

- `src/requestClassifier.js`
- `tests/requestClassifier.test.js`

## Allowed source-of-truth documents (this task creates/owns)

- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/50-tasks/TSK-001-documentation-only-classifier.md`
- `docs/60-microtasks/MTP-001-documentation-only-classifier.md`
- `docs/00-product/source-of-truth-map.md`

## Forbidden files / operations

- Do not modify any files under `src/` or `tests/`.
- Do not add/modify `package.json`, lockfiles, or install dependencies.
- Do not add runtime configuration, deployment files, secrets, or `.env`.
- Do not commit or push.

## Acceptance criteria

AC-TSK-001 Source-of-truth spine exists
- `docs/00-product/source-of-truth-map.md` links spec, task, MTP, implementation files, and validation evidence.

AC-TSK-002 Spec captures validated behavior
- `SPC-001` states:
  - deterministic classifier output shape
  - documentation-only classification fields
  - mixed request behavior
  - unknown request behavior
  - static-inspection validation mode

AC-TSK-003 Task captures governance boundaries
- This task states allowed/forbidden files and explicitly notes retroactive hardening.

AC-TSK-004 Micro-task pack provides traceable checklist
- `MTP-001` contains checkbox micro-tasks with owner agent and evidence paths for completed items.

## Validation mode

- Documentation validation by static inspection:
  - confirm required docs exist at allowed paths
  - confirm traceability links are present
  - confirm honesty note is present (retroactive hardening)

## Evidence

- Behavior summary: `docs/30-validation/agentic-slice-001-summary.md`
- Commit review: `docs/30-validation/code-author-commit-review-e953f5a.md`
- Validator report: `docs/30-validation/validator-smoke-test-001.md`
