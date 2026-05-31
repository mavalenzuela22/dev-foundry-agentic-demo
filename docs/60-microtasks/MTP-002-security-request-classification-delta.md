# MTP-002: Security Request Classification Delta

## Status

COMPLETED PRODUCT MICRO-TASK PACK

## Purpose

Close the product behavior delta that added deterministic security-related request classification to Foundry Request Board.

This micro-task pack belongs to Foundry Request Board product behavior. It does not define Dev Foundry agent-system hardening, Alita prompt behavior, Flow Evidence Manifest behavior, MCP read-reduction behavior, or Orchestrator behavior.

## Historical Note

This pack was created while the demo workflow and agent operating model were still evolving. Earlier closure records may have used broader ownership language than the current operating model.

The sanitized record below preserves the product work, implementation evidence, and validation outcome while separating product behavior from agent-system concerns.

## Governing Documents

- Specification: `docs/40-specs/SPC-001-foundry-request-classification.md`
- Task: `docs/50-tasks/TSK-002-security-request-classification-delta.md`
- Source-of-truth map: `docs/00-product/source-of-truth-map.md`

## Product Goal

Implement and validate deterministic handling for security-related request classification.

The required behavior is:

- security remediation and hardening requests escalate to review;
- documentation-only security requests remain documentation-only;
- existing documentation, mixed, code, and unknown classifications remain stable.

## Scope

### Implementation scope

- `src/requestClassifier.js`
- `tests/requestClassifier.test.js`

### Source-of-truth and evidence scope

- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/50-tasks/TSK-002-security-request-classification-delta.md`
- `docs/60-microtasks/MTP-002-security-request-classification-delta.md`
- `docs/30-validation/agentic-slice-002-security-delta-summary.md`

### Forbidden scope

- UI files.
- Backend files.
- Dependency changes.
- package files and lockfiles.
- Vite or build configuration.
- deployment files.
- secrets.
- environment files.
- agent-system hardening docs.
- agent prompt files.

## Product Rules Implemented

### Security signals

Initial security signals:

- `security`
- `seguridad`
- `ciberseguridad`
- `vulnerability`
- `vulnerabilidad`
- `hardening`

### Default escalation

If any security signal is present and the documentation-only exception does not apply:

- `type`: `code`
- `risk`: `medium`
- `mode`: `needs_review`

### Documentation-only security exception

If documentation intent is present, a security signal is present, and effective code/remediation/hardening/implementation intent is absent:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

### Exception precedence

The documentation-only security exception must be evaluated before default security escalation.

## Micro-tasks

### [x] MT-001 — Create security classification source-of-truth delta

Owner: Source-of-Truth Author

Purpose:

- Capture the security-related classification delta in product source-of-truth.

Allowed files:

- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/50-tasks/TSK-002-security-request-classification-delta.md`

Forbidden:

- implementation files
- tests
- package files
- dependencies
- UI files
- agent-system docs

Acceptance criteria:

- `SPC-001` includes security request behavior.
- `TSK-002` defines product task scope and acceptance criteria.
- Traceability to classifier implementation and tests is clear.

Evidence:

- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/50-tasks/TSK-002-security-request-classification-delta.md`

Status:

- Completed.

### [x] MT-002 — Governance approval for bounded implementation scope

Owner: Governance Agent

Purpose:

- Confirm that implementation and test changes are tightly bounded to the security classification delta.

Allowed review inputs:

- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/50-tasks/TSK-002-security-request-classification-delta.md`
- `docs/60-microtasks/MTP-002-security-request-classification-delta.md`

Approved implementation files:

- `src/requestClassifier.js`
- `tests/requestClassifier.test.js`

Forbidden:

- any other source files
- UI files
- package files
- lockfiles
- dependency changes
- runtime configuration
- deployment files
- secrets

Acceptance criteria:

- A bounded implementation scope exists.
- The scope is limited to classifier logic and tests.
- No unrelated product scope is introduced.

Evidence:

- Governance approved bounded implementation and test scope for the security classification delta.

Status:

- Completed.

### [x] MT-003 — Implement security delta in request classifier

Owner: Code Author

Purpose:

- Update classifier logic to support security signals, documentation-only security exception, and default escalation.

Allowed files:

- `src/requestClassifier.js`

Read-only references:

- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/50-tasks/TSK-002-security-request-classification-delta.md`
- `tests/requestClassifier.test.js`

Forbidden:

- any other `src/**` files
- UI files
- tests, except where separately authorized
- package files
- dependency changes
- runtime configuration
- deployment files
- secrets
- source-of-truth closure files

Requirements:

- Add security signal detection.
- Preserve existing documentation-only, mixed, code, and unknown behavior.
- Evaluate documentation-only security exception before security escalation.
- Escalate clear security remediation and hardening requests.
- Preserve deterministic behavior.
- Introduce no I/O, network calls, time/date dependence, randomness, or external service dependencies.

Acceptance criteria:

- `Fix vulnerability in auth` produces `code`, `medium`, `needs_review`.
- `ciberseguridad hardening` produces `code`, `medium`, `needs_review`.
- `actualizar documentación de seguridad` produces `documentation`, `low`, `bounded_execution_ready`.
- Existing non-security behavior remains stable.

Evidence:

- Commit: `49fa23efef1e0fd9faa3daeca65bb41a58dde776`
- Modified file: `src/requestClassifier.js`
- Summary: security signal detection, documentation-only security exception precedence, and default security escalation were implemented.
- No dependency, runtime, deployment, or UI changes were introduced.

Status:

- Completed.

### [x] MT-004 — Add Jest regression tests for security delta

Owner: Code Author

Purpose:

- Add tests that document and preserve security classification behavior.

Allowed files:

- `tests/requestClassifier.test.js`

Read-only references:

- `src/requestClassifier.js`
- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/50-tasks/TSK-002-security-request-classification-delta.md`

Forbidden:

- package files
- test runner configuration
- dependency changes
- UI files
- implementation files not explicitly allowed
- source-of-truth closure files

Test coverage requirements:

- security vulnerability escalation
- Spanish security hardening escalation
- documentation-only security exception
- exception precedence

Acceptance criteria:

- Tests exist for the normative security examples.
- Tests use existing project test style.
- No test runner or dependency changes are introduced.

Evidence:

- Modified file: `tests/requestClassifier.test.js`
- Added or preserved tests for:
  - `Fix vulnerability in auth`
  - `ciberseguridad hardening`
  - documentation-only security exception
  - Spanish documentation-only security request
- Assertions use classifier output fields such as `type`, `risk`, and `mode`.

Status:

- Completed.

### [x] MT-005 — Validate security delta and record initial failure/remediation need

Owner: Validator

Purpose:

- Validate the security classification delta against product acceptance criteria and identify any gaps.

Allowed read scope:

- `src/requestClassifier.js`
- `tests/requestClassifier.test.js`
- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/50-tasks/TSK-002-security-request-classification-delta.md`
- `docs/60-microtasks/MTP-002-security-request-classification-delta.md`

Forbidden:

- file modifications
- runtime/dependency/config changes
- broad repository rewrites
- agent-system docs

Acceptance criteria:

- Validator reports pass/fail for the security delta.
- Any failure is described concretely.
- Validation limitations are stated honestly.

Evidence:

- Validation found a real gap during the Slice 002 flow.
- The gap led to remediation micro-tasks and re-validation.

Status:

- Completed.

### [x] MT-006 — Apply remediation for validation findings

Owner: Code Author

Purpose:

- Apply minimal remediation for the validation findings without expanding product scope.

Allowed files:

- `src/requestClassifier.js`
- `tests/requestClassifier.test.js`, only if required by the validated failure

Forbidden:

- package files
- dependency changes
- UI files
- runtime configuration
- deployment files
- unrelated refactors
- source-of-truth closure files

Acceptance criteria:

- The validation gap is resolved.
- Classifier behavior remains deterministic.
- No unrelated behavior changes are introduced.
- Existing classifier tests remain aligned with the specification.

Evidence:

- Commit: `28a8ac61f13e277b5f872e0ecf018b631afb407d`
- Summary: validation failure, remediation, and re-validation were captured in the Slice 002 closure flow.

Status:

- Completed.

### [x] MT-007 — Re-validate and close security delta

Owner: Validator and Source-of-Truth Author

Purpose:

- Confirm remediation resolved the validation finding and record closure evidence.

Allowed validation read scope:

- `src/requestClassifier.js`
- `tests/requestClassifier.test.js`
- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/50-tasks/TSK-002-security-request-classification-delta.md`

Allowed closure scope:

- `docs/60-microtasks/MTP-002-security-request-classification-delta.md`
- `docs/30-validation/agentic-slice-002-security-delta-summary.md`

Forbidden:

- implementation changes during validation or closure
- package/dependency changes
- UI changes
- deployment changes
- secrets
- agent-system hardening changes

Acceptance criteria:

- Security escalation behavior is validated.
- Documentation-only security exception is validated.
- Remaining limitations are documented.
- Closure evidence is recorded without changing implementation scope.

Evidence:

- `docs/30-validation/agentic-slice-002-security-delta-summary.md`
- Commit: `127729f7275a8d1deae84ebea84f405aefab7fe4`
- Later template/English alignment: `4fac9829aa2f7b946e4877c3a4e078aeadd3a5bd`

Status:

- Completed.

## Validation Summary

The security classification delta was validated through static inspection and later reinforced by additional classifier regression coverage.

The final active classifier behavior is documented in:

- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/30-validation/agentic-slice-002-security-delta-summary.md`
- `docs/30-validation/VAL-006-negated-code-signal.md`

## Known Historical Limitations

This pack reflects an early workflow period. Some historical evidence may refer to broad agent roles or closure actions in language that is stricter in the current operating model.

For current interpretation:

- implementation belongs to implementation-owned files;
- source-of-truth closure belongs to source-of-truth documents;
- validation is read-only;
- product behavior is separate from agent-system hardening.

## Final Outcome

MTP-002 is complete.

Foundry Request Board now supports deterministic security request classification with a documentation-only exception and preserved review escalation for true security remediation or hardening requests.