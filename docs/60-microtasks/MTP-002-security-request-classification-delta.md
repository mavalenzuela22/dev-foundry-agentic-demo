# MTP-002: Security request classification delta

Owner agent: Source-of-Truth Author

Purpose: Turn the `SPC-001` security-handling DELTA into an execution-ready operational contract (hybrid: spec-first delta applied to existing Slice-001 codebase).

## Guardrails (apply to every micro-task)

### Source-of-truth references (inputs)

- Spec (delta): `docs/40-specs/SPC-001-foundry-request-classification.md` → section **“DELTA (unimplemented): Security-related request handling”** + AC-006..AC-008.
- Task: `docs/50-tasks/TSK-002-security-request-classification-delta.md`
- Traceability map: `docs/00-product/source-of-truth-map.md`

### Non-negotiable constraints

- Deterministic classifier: no I/O, no time/date, no randomness (per `SPC-001`).
- No runtime test execution required; validation is by static inspection (per `SPC-001` AC-005 and `TSK-002`).
- Scope is limited strictly to the `SPC-001` security delta + `TSK-002` acceptance criteria.

### Security delta rules (verbatim anchors)

- **Security signals (initial):** `security`, `seguridad`, `ciberseguridad`, `vulnerability`, `vulnerabilidad`, `hardening`.
- **Default escalation (unless doc-only exception applies):** classify as `type: code`, `risk: medium`, `mode: needs_review`.
- **Doc-only security exception (must have precedence):** if documentation intent signals are present AND a security signal is present AND request does *not* mention any of:
  - `remediación`, `vulnerabilidad`, `hardening`, `implementación`, `endpoint`, `API`, `auth`, `permisos`
  - or any explicit code change intent
  then classify as documentation-only: `type: documentation`, `risk: low`, `mode: bounded_execution_ready`.

### Evidence convention (how to close micro-tasks)

When an agent completes an MT, they must:
1) Change `[ ]` → `[x]` for that MT in this file.
2) Add an **Evidence** bullet list under the MT containing:
   - touched file paths (or “no file changes”)
   - brief note of what changed / what was validated
   - any open UNKNOWNs/questions encountered

## Micro-tasks (execution-ready)

- [x] MT-001 - Create security classification source-of-truth delta
  - Owner: Source-of-Truth Author
  - Purpose: Ensure the spec and task delta exist and are traceable.
  - Evidence:
    - `docs/40-specs/SPC-001-foundry-request-classification.md`
    - `docs/50-tasks/TSK-002-security-request-classification-delta.md`

- [ ] MT-002 - Governance approval for bounded implementation scope
  - Owner agent: Governance Agent
  - Status: pending
  - Purpose:
    - Confirm the implementation and test changes are tightly bounded to `SPC-001` (AC-006..AC-008) and `TSK-002`.
    - Confirm no additional product scope (UI, runtime runner setup, dependencies) is introduced.
  - Inputs / references:
    - `docs/40-specs/SPC-001-foundry-request-classification.md` (security delta + AC-006..AC-008)
    - `docs/50-tasks/TSK-002-security-request-classification-delta.md`
    - This MTP: `docs/60-microtasks/MTP-002-security-request-classification-delta.md`
  - Allowed file operations (for this MT):
    - May edit **only**: `docs/60-microtasks/MTP-002-security-request-classification-delta.md` (to record approval decision).
    - May read: spec/task/map documents listed above.
  - Forbidden operations reminders:
    - Do not change implementation or tests.
    - Do not add runtime test runner setup (`package.json`, deps) or any deployment/config.
  - Procedure:
    1. Read `SPC-001` delta section and confirm it is implementable deterministically (keyword/signal approach).
    2. Read `TSK-002` and confirm planned touchpoints are limited to `src/requestClassifier.js` and `tests/requestClassifier.test.js`.
    3. Decide **APPROVE** or **BLOCK**.
       - If blocking: specify exactly what must change in this MTP/spec/task to become approvable (no vague feedback).
    4. Record the decision under this MT in an “Evidence” section and mark checkbox accordingly (`[x]` for approve, leave `[ ]` if blocked/pending).
  - Acceptance criteria:
    - A clear approval or block note exists under MT-002 including:
      - explicit allowed implementation files for Code Author (expected: `src/requestClassifier.js`, `tests/requestClassifier.test.js`)
      - explicit forbidden scope reminders (no new deps, no runner setup)
      - any identified UNKNOWNs that must be resolved before MT-003 starts
  - Expected evidence:
    - Updated MT-002 checkbox + an Evidence note directly under MT-002.

- [ ] MT-003 - Implement security delta in request classifier
  - Owner agent: Code Author
  - Status: pending
  - Purpose:
    - Update the classifier to match `SPC-001` security delta behavior (AC-006..AC-008), including **doc-only security exception precedence**.
  - Inputs / references:
    - `docs/40-specs/SPC-001-foundry-request-classification.md` (delta rules + normative examples)
    - `docs/50-tasks/TSK-002-security-request-classification-delta.md`
    - Existing implementation context: `src/requestClassifier.js`
  - Allowed file scope:
    - May edit: `src/requestClassifier.js`
    - May read (no edits): `tests/requestClassifier.test.js` (to align behavior with existing tests and patterns)
    - May edit: this MTP only to mark MT complete and add evidence.
  - Forbidden paths / operations:
    - Do not modify any other `src/**` files.
    - Do not add dependencies, configs, runners, build/deploy changes.
    - Do not add I/O (fs/network/console) or nondeterminism.
  - Procedure (implementation steps):
    1. Inspect current logic in `classifyRequest(requestText)`:
       - how the function normalizes/cases input (UNKNOWN if not present; record in evidence)
       - how it detects documentation intent signals and code intent signals
       - whether `security` is currently treated as a generic code signal (noted as a risk in `TSK-002`)
    2. Add security signal detection (case-insensitive substring match) using the exact initial list from `SPC-001`.
    3. Implement **doc-only security exception FIRST** (precedence rule):
       - Condition (all must hold):
         - documentation intent signals are present (use existing doc-signal detection)
         - AND a security signal is present
         - AND request does *not* contain any negative keywords:
           - `remediación`, `vulnerabilidad`, `hardening`, `implementación`, `endpoint`, `API`, `auth`, `permisos`
         - AND request does *not* indicate explicit code change intent
           - Use existing “code signals present” logic.
       - NOTE: Some terms are both security signals and negative keywords (e.g., `hardening`, `vulnerabilidad`). The exception requires the *absence* of negative keywords; therefore inputs containing those terms must **not** qualify for doc-only exception.
    4. Implement **security escalation default** after the doc-only exception:
       - If any security signal is present and exception did not apply → set:
         - `type: code`, `risk: medium`, `mode: needs_review`
         - `reason`: must mention security-related request and that review is required.
    5. Ensure the above does not break existing Slice-001 behaviors for non-security inputs.
    6. Update/extend `reason` strings as needed to satisfy:
       - For doc-only security exception: reason mentions documentation-only security and bounded execution readiness.
       - For security escalation: reason mentions security + needs_review.
  - UNKNOWNs / questions to resolve during execution:
    - UNKNOWN: What are the exact existing “documentation intent signals” and “code intent signals” in the current implementation? (MT-003 should reuse existing lists rather than invent new ones.)
    - UNKNOWN: Does the current implementation normalize accents (e.g., `remediación`) or rely on raw text matching only?
  - Acceptance criteria (must all pass by static inspection):
    - AC-MT-003-001 Security escalation default implemented
      - For an input containing a security signal (e.g., “Fix vulnerability in auth”), if doc-only exception does not apply, returned fields include:
        - `type: code`, `risk: medium`, `mode: needs_review`.
    - AC-MT-003-002 Doc-only security exception precedence implemented
      - For an input with documentation intent + security signal and without negative keywords/code intent (e.g., “actualizar documentación de seguridad”), returned fields include:
        - `type: documentation`, `risk: low`, `mode: bounded_execution_ready`.
      - Code inspection shows the exception is evaluated **before** escalation.
    - AC-MT-003-003 Normative examples satisfied
      - Implementation plausibly yields the `SPC-001` normative example outcomes (AC-008).
    - AC-MT-003-004 Determinism preserved
      - No I/O, time/date, randomness introduced.
  - Expected evidence:
    - Code Author updates this MTP under MT-003 with:
      - touched file: `src/requestClassifier.js`
      - brief summary of logic change and how precedence is ensured
      - answers to UNKNOWNs above (or notes if unresolved)

- [ ] MT-004 - Add/adjust Jest-style tests for security delta
  - Owner agent: Code Author
  - Status: pending
  - Purpose:
    - Add static (not executed) tests that document the expected behavior for the security delta per `SPC-001` AC-006..AC-008 and `TSK-002` AC-TSK-002-003.
  - Inputs / references:
    - `docs/40-specs/SPC-001-foundry-request-classification.md` (AC-006..AC-008; normative examples)
    - `docs/50-tasks/TSK-002-security-request-classification-delta.md`
    - Existing tests context: `tests/requestClassifier.test.js`
  - Allowed file scope:
    - May edit: `tests/requestClassifier.test.js`
    - May read (no edits): `src/requestClassifier.js` (to confirm function name/export)
    - May edit: this MTP only to mark MT complete and add evidence.
  - Forbidden paths / operations:
    - Do not add or change test runner configuration, deps, scripts, `package.json`, etc.
    - Do not add additional test frameworks.
    - Do not modify any other test files.
  - Procedure:
    1. Inspect existing `tests/requestClassifier.test.js` structure and match its conventions (describe/it naming, import style, assertion style).
    2. Add/adjust tests that cover at minimum:
       - Case A (escalation): “Fix vulnerability in auth” → `type: code`, `risk: medium`, `mode: needs_review`.
       - Case B (escalation): “ciberseguridad hardening” → `type: code`, `risk: medium`, `mode: needs_review`.
       - Case C (doc-only exception): “actualizar documentación de seguridad” → `type: documentation`, `risk: low`, `mode: bounded_execution_ready`.
    3. Add an explicit **precedence** test showing doc-only exception prevents escalation when “security/seguridad” appears in a documentation-only request.
       - Representative test input: reuse Case C above; assertion must include `mode: bounded_execution_ready` to demonstrate exception.
    4. (Optional but aligned with spec negative keywords) Add one test confirming that a documentation-intent request containing a negative keyword does **not** qualify for doc-only exception.
       - Example input (aligned to negative list): “actualizar documentación de seguridad para auth” → expect escalation (`type: code`, `mode: needs_review`).
       - If current implementation cannot support this without additional scope, record as UNKNOWN and stop (do not guess).
  - UNKNOWNs / questions to resolve during execution:
    - UNKNOWN: Exact existing assertion patterns and how the output object is compared (deep equality vs. partial match).
  - Acceptance criteria:
    - AC-MT-004-001 Tests exist for the three normative examples (AC-008).
    - AC-MT-004-002 At least one test demonstrates doc-only exception precedence (AC-007).
    - AC-MT-004-003 No runner/dependency/config changes were made.
  - Expected evidence:
    - Code Author updates this MTP under MT-004 with:
      - touched file: `tests/requestClassifier.test.js`
      - list of added/modified test names and the input strings used

- [ ] MT-005 - Validator static inspection (implementation + tests)
  - Owner agent: Validator
  - Status: pending
  - Purpose:
    - Confirm by static inspection that MT-003 and MT-004 changes satisfy the `SPC-001` security delta acceptance criteria (AC-006..AC-008) and do not exceed scope.
  - Inputs / references:
    - `docs/40-specs/SPC-001-foundry-request-classification.md` (AC-006..AC-008)
    - `docs/50-tasks/TSK-002-security-request-classification-delta.md`
    - Updated files to inspect:
      - `src/requestClassifier.js`
      - `tests/requestClassifier.test.js`
  - Allowed file scope:
    - May read: `src/requestClassifier.js`, `tests/requestClassifier.test.js`
    - May create/update validation evidence doc under: `docs/30-validation/` (suggested filename below)
    - May edit: this MTP only to mark MT complete and add evidence.
  - Forbidden operations:
    - Do not run tests; do not execute code.
    - Do not modify implementation/tests (validation-only).
  - Procedure:
    1. Inspect `src/requestClassifier.js` and verify logic order:
       - doc-only security exception check occurs before security escalation default.
       - security signals list matches `SPC-001`.
       - negative keyword list matches `SPC-001`.
    2. Inspect `tests/requestClassifier.test.js` and verify cases exist for normative examples + precedence.
    3. Produce a short validator report capturing:
       - which `SPC-001` ACs were checked and how
       - any discrepancies/risks
       - whether changes stayed within bounded scope
       - note any UNKNOWNs discovered (e.g., normalization/accents).
  - Acceptance criteria:
    - AC-MT-005-001 Validator report exists in `docs/30-validation/` (suggested: `docs/30-validation/validator-smoke-test-002-security-delta.md`).
    - AC-MT-005-002 Report explicitly states PASS/FAIL against `SPC-001` AC-006..AC-008.
  - Expected evidence:
    - New/updated validator report doc under `docs/30-validation/`.
    - MT-005 checkbox updated to `[x]` with Evidence linking to the report path.

## References

- Spec (delta section): `docs/40-specs/SPC-001-foundry-request-classification.md` ("DELTA (unimplemented): Security-related request handling")
- Task: `docs/50-tasks/TSK-002-security-request-classification-delta.md`
- Traceability map: `docs/00-product/source-of-truth-map.md`
