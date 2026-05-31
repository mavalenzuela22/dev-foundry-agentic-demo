# MTP-001: Documentation-only Request Classifier

## Status

COMPLETED PRODUCT MICRO-TASK PACK

## Purpose

Record the initial Foundry Request Board product source-of-truth spine for the documentation-only request classifier.

This micro-task pack belongs to Foundry Request Board product behavior. It does not define Dev Foundry agent-system hardening, Alita prompt behavior, Flow Evidence Manifest behavior, MCP read-reduction behavior, or Orchestrator behavior.

## Historical Note

This pack was created after the initial classifier implementation as retroactive source-of-truth hardening.

The underlying implementation already existed and had been reviewed before this pack was written. This document preserves traceability for the initial classifier slice without pretending the source-of-truth chain existed before the first implementation.

## Governing Documents

- Specification: `docs/40-specs/SPC-001-foundry-request-classification.md`
- Task: `docs/50-tasks/TSK-001-documentation-only-classifier.md`
- Source-of-truth map: `docs/00-product/source-of-truth-map.md`

## Product Goal

Capture the initial deterministic classifier behavior and link it to product source-of-truth evidence.

The initial classifier behavior covered:

- documentation-only requests;
- mixed documentation plus code requests;
- code or implementation requests;
- unknown or ambiguous requests.

## Scope

### Source-of-truth scope

- `docs/00-product/source-of-truth-map.md`
- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/50-tasks/TSK-001-documentation-only-classifier.md`
- `docs/60-microtasks/MTP-001-documentation-only-classifier.md`

### Implementation references

- `src/requestClassifier.js`
- `tests/requestClassifier.test.js`

### Validation references

- `docs/30-validation/agentic-slice-001-summary.md`
- `docs/30-validation/code-author-commit-review-e953f5a.md`
- `docs/30-validation/validator-smoke-test-001.md`

### Forbidden scope

This pack did not authorize new implementation changes.

Forbidden:

- source code changes
- test changes
- package or lockfile changes
- dependency changes
- UI changes
- backend changes
- deployment changes
- secrets
- environment files
- agent-system hardening changes

## Micro-tasks

### [x] MT-001 — Create source-of-truth map entry for Slice 001

Owner: Source-of-Truth Author

Purpose:

- Link the initial classifier behavior to product source-of-truth documents and evidence.

Allowed files:

- `docs/00-product/source-of-truth-map.md`

Forbidden:

- implementation files
- tests
- package files
- dependency changes
- UI files
- deployment files
- secrets
- agent-system docs

Acceptance criteria:

- Source-of-truth map references the classifier spec.
- Source-of-truth map references the task and micro-task pack.
- Source-of-truth map references implementation and validation evidence.

Evidence:

- `docs/00-product/source-of-truth-map.md`

Status:

- Completed.

### [x] MT-002 — Create SPC-001 classifier specification

Owner: Source-of-Truth Author

Purpose:

- Document the validated classifier behavior as a product specification.

Allowed files:

- `docs/40-specs/SPC-001-foundry-request-classification.md`

Forbidden:

- implementation files
- tests
- package files
- dependency changes
- UI files
- deployment files
- secrets
- agent-system docs

Acceptance criteria:

- Spec defines classifier purpose.
- Spec defines output shape.
- Spec defines documentation-only classification.
- Spec defines mixed request classification.
- Spec defines code request classification.
- Spec defines unknown request classification.
- Spec states deterministic constraints.

Evidence:

- `docs/40-specs/SPC-001-foundry-request-classification.md`

Status:

- Completed.

### [x] MT-003 — Create TSK-001 product task

Owner: Source-of-Truth Author

Purpose:

- Capture the product task boundary and acceptance criteria for the initial classifier slice.

Allowed files:

- `docs/50-tasks/TSK-001-documentation-only-classifier.md`

Forbidden:

- implementation files
- tests
- package files
- dependency changes
- UI files
- deployment files
- secrets
- agent-system docs

Acceptance criteria:

- Task describes the product objective.
- Task identifies implementation references.
- Task identifies source-of-truth documents.
- Task identifies validation mode and evidence links.

Evidence:

- `docs/50-tasks/TSK-001-documentation-only-classifier.md`

Status:

- Completed.

### [x] MT-004 — Create MTP-001 traceability pack

Owner: Source-of-Truth Author

Purpose:

- Record the documentation and traceability micro-tasks for the first classifier slice.

Allowed files:

- `docs/60-microtasks/MTP-001-documentation-only-classifier.md`

Forbidden:

- implementation files
- tests
- package files
- dependency changes
- UI files
- deployment files
- secrets
- agent-system docs

Acceptance criteria:

- MTP contains completed micro-tasks.
- MTP links evidence files.
- MTP states that the work was retroactive product source-of-truth hardening.
- MTP does not claim to have executed implementation code.

Evidence:

- `docs/60-microtasks/MTP-001-documentation-only-classifier.md`

Status:

- Completed.

### [x] MT-005 — Record runtime test follow-up evidence

Owner: Source-of-Truth Author

Purpose:

- Record later user-run runtime evidence that confirmed the classifier tests pass after test runner setup became available.

Historical context:

- The initial Slice 001 source-of-truth work did not require runtime test execution.
- Later project setup introduced usable test scripts.
- User-run test evidence was recorded as supporting evidence, not as proof that agents executed tests.

Allowed files:

- `docs/60-microtasks/MTP-001-documentation-only-classifier.md`
- related validation evidence documents, if applicable

Forbidden:

- implementation files
- tests
- package files
- dependency changes
- UI files
- deployment files
- secrets
- agent-system docs

Acceptance criteria:

- Runtime evidence is attributed to the user when user-run.
- Evidence does not falsely claim agent-executed tests.
- The initial static-validation limitation remains historically honest.

Evidence summary:

- User-run `npm test` evidence showed the classifier test suite passing at the time it was recorded.
- Later classifier work increased the number of tests, with current validation evidence recorded separately under later MTPs.

Status:

- Completed.

## Validation Evidence Summary

Initial validation/evidence:

- `docs/30-validation/agentic-slice-001-summary.md`
- `docs/30-validation/code-author-commit-review-e953f5a.md`
- `docs/30-validation/validator-smoke-test-001.md`

Later runtime support evidence:

- User-run `npm test` evidence was recorded after the test runner setup became available.
- Later classifier regression evidence is tracked in later validation records, especially:
  - `docs/30-validation/VAL-006-negated-code-signal.md`

## Final Outcome

MTP-001 is complete.

The initial classifier slice has product source-of-truth traceability and validation references.

Later classifier behavior changes are tracked separately through:

- `docs/60-microtasks/MTP-002-security-request-classification-delta.md`
- `docs/60-microtasks/MTP-006-negated-code-signal.md`

## Current Interpretation

Use this pack as a historical bootstrap traceability record.

Do not use this pack as the current model for all future work because the demo operating model evolved after this early slice.

For current product work:

- product behavior belongs in product SPC/TSK/MTP chains;
- implementation belongs to implementation-owned files;
- validation must state whether evidence is static, agent-run, or user-run;
- agent-system hardening belongs outside product micro-task packs.