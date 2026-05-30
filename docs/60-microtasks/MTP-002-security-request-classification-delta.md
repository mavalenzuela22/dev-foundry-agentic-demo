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

- [x] MT-002 - Governance approval for bounded implementation scope
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
  - Evidence:
    - Decision: **APPROVE**
    - Allowed implementation files (for MT-003 / MT-004):
      - `src/requestClassifier.js`
      - `tests/requestClassifier.test.js`
    - Forbidden scope reminders:
      - No other `src/**` or `tests/**` edits.
      - No new deps or config; no `package.json` / runner setup; no UI changes.
      - Preserve determinism: no I/O, time/date, randomness.
    - Preconditions / UNKNOWNs (must be resolved during MT-003 by reusing existing classifier conventions):
      - How “documentation intent” is detected in request text (e.g., `doc`, `documentation`, `documentación`).
      - Confirm matching rules: case-insensitive behavior and tokenization/substring strategy (including accent handling for terms like `remediación`).

- [x] MT-003 - Implement security delta in request classifier
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
  - Evidence:
    - MT-003 completed by Code Author.
    - Commit: 49fa23efef1e0fd9faa3daeca65bb41a58dde776
    - Touched file: src/requestClassifier.js
    - Summary: implemented security signal detection, doc-only security exception precedence, and default security escalation to code/medium/needs_review.
    - No dependencies, runtime config, I/O, randomness, tests, or deployment files changed.

- [x] MT-004 - Add/adjust Jest-style tests for security delta
  - Owner agent: Code Author
  - Status: completed
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
  - Evidence:
    - Files read (read-only):
      - `tests/requestClassifier.test.js`
      - `src/requestClassifier.js`
    - Files modified:
      - `tests/requestClassifier.test.js`
    - Tests added (behavior → input):
      1) classifies security vulnerability fix request as code, medium risk, needs_review → "Fix vulnerability in auth"
      2) classifies Spanish security hardening request as code, medium risk, needs_review → "ciberseguridad hardening"
      3) applies documentation-only security exception precedence over default security escalation → "Update documentation about security best practices."
      4) classifies Spanish documentation-only security request as low risk and bounded execution ready → "actualizar documentación de seguridad"
    - Notes:
      - Used `expect.objectContaining({ type, risk, mode })` assertions.
      - For precedence test, asserted `reason` contains "documentation-only security".
    - Scope constraints affirmed:
      - No runner/config/dependency changes.
    - UNKNOWNs:
      - none

- [x] MT-005 - Validator static inspection (implementation + tests)
  - Owner agent: Validator
  - Status: completed
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
  - Evidence:
    - Outcome: **VALIDATION_FAILED**
    - Files inspected (read-only):
      - `src/requestClassifier.js`
      - `tests/requestClassifier.test.js`
    - `SPC-001` security delta acceptance criteria results:
      - AC-006: **PASS**
      - AC-007: **FAIL** — doc-only security exception not triggered for Spanish because documentation intent signals are missing in Spanish.
      - AC-008: **FAIL** — example “actualizar documentación de seguridad” not classified as `type: documentation`, `risk: low`, `mode: bounded_execution_ready`.
    - Scope check:
      - No file changes made during validation.

- [x] MT-006 - Minimal fix: recognize Spanish documentation intent signals
  - Owner agent: Code Author
  - Status: completed
  - Purpose:
    - Fix the doc-only security exception gap identified in MT-005 by recognizing Spanish documentation intent in the classifier with minimal scope.
  - Inputs / references:
    - `docs/40-specs/SPC-001-foundry-request-classification.md` (AC-006..AC-008)
    - `docs/50-tasks/TSK-002-security-request-classification-delta.md`
    - Validator outcome recorded under MT-005 (VALIDATION_FAILED)
    - Implementation context: `src/requestClassifier.js`
    - Tests context (read-only): `tests/requestClassifier.test.js`
  - Allowed file scope:
    - May edit: `src/requestClassifier.js`
    - May read (no edits): `tests/requestClassifier.test.js`
    - May edit: this MTP only to mark MT complete and add evidence.
  - Forbidden paths / operations:
    - Do not modify any other `src/**` files.
    - Do not modify any `tests/**` files (tests are evidence only for this MT).
    - Do not add dependencies, configs, runners, build/deploy changes.
    - Do not add I/O (fs/network/console) or nondeterminism.
  - Procedure (minimal implementation steps):
    1. Locate the documentation intent detection function (e.g., `detectDocumentationSignals` or equivalent) in `src/requestClassifier.js`.
    2. Add Spanish documentation intent terms to the existing documentation signals list/matcher:
       - Must match both accented and unaccented forms:
         - `documentación`
         - `documentacion`
       - Matching must be case-insensitive and follow existing classifier conventions (do not refactor tokenization unless strictly required).
    3. Confirm that, with the added documentation signals, the doc-only security exception can trigger for the normative Spanish example: “actualizar documentación de seguridad”.
    4. Confirm non-security classification behavior remains unchanged (no regressions for inputs without security signals).
  - Acceptance criteria:
    - AC-MT-006-001 `SPC-001` AC-007 passes by static inspection
      - Code inspection shows Spanish documentation intent is recognized such that the doc-only security exception can apply when appropriate.
    - AC-MT-006-002 `SPC-001` AC-008 passes by static inspection
      - The example “actualizar documentación de seguridad” classifies as:
        - `type: documentation`, `risk: low`, `mode: bounded_execution_ready`.
    - AC-MT-006-003 No regression for non-security classification
      - No changes were made to non-security signal handling beyond documentation intent recognition.
    - AC-MT-006-004 Scope constraints honored
      - Only `src/requestClassifier.js` modified; no deps/config/runner changes.
  - Expected evidence:
    - Code Author updates this MTP under MT-006 with:
      - touched file: `src/requestClassifier.js`
      - brief summary of the minimal change (where the new signals were added)
      - note confirming no other behavior changes were introduced
  - Evidence (per Code Author report):
    - Summary: updated `detectDocumentationSignals` to match Spanish “documentación/documentacion” via regex `\bdocumentaci[oó]n\b`.
    - Files changed:
      - `src/requestClassifier.js`
    - Notes:
      - Tests not executed.
      - Static reasoning: the Spanish example “actualizar documentación de seguridad” now triggers the doc-only security exception.
      - Risk: `\b` word boundaries may behave unexpectedly with punctuation/Unicode boundaries; monitor for false negatives.

- [x] MT-007 - Validator re-inspection after MT-006 (AC-006..AC-008)
  - Owner agent: Validator
  - Status: completed
  - Purpose:
    - Re-validate by static inspection that the `SPC-001` security delta AC-006..AC-008 are satisfied after MT-006, and confirm no forbidden scope changes occurred.
  - Inputs / references:
    - `docs/40-specs/SPC-001-foundry-request-classification.md` (AC-006..AC-008)
    - `docs/50-tasks/TSK-002-security-request-classification-delta.md`
    - This MTP: `docs/60-microtasks/MTP-002-security-request-classification-delta.md`
    - Files to inspect:
      - `src/requestClassifier.js`
      - `tests/requestClassifier.test.js`
  - Allowed file scope:
    - May read: `src/requestClassifier.js`, `tests/requestClassifier.test.js`
    - May edit: this MTP only to record results and evidence.
  - Forbidden operations:
    - Do not run tests; do not execute code.
    - Do not modify implementation/tests (validation-only).
    - Do not approve or allow any scope beyond MT-006 constraints.
  - Procedure:
    1. Inspect `src/requestClassifier.js` and confirm the Spanish documentation intent terms are recognized (`documentación`/`documentacion`) without broad refactors.
    2. Re-check `SPC-001` AC-006..AC-008 by static inspection, including the normative Spanish example.
    3. Confirm scope boundaries were honored:
       - Only `src/requestClassifier.js` changed since MT-005 failure.
       - No deps/config/runner changes.
    4. Record PASS/FAIL for each AC with one-line justification.
  - Acceptance criteria:
    - AC-MT-007-001 MT-007 Evidence states PASS/FAIL for:
      - AC-006
      - AC-007
      - AC-008
    - AC-MT-007-002 Evidence explicitly confirms whether any forbidden scope changes occurred.
  - Expected evidence:
    - MT-007 checkbox updated to `[x]` with an Evidence section containing:
      - AC-006 PASS/FAIL + note
      - AC-007 PASS/FAIL + note
      - AC-008 PASS/FAIL + note
      - list of inspected files
      - scope confirmation (no forbidden changes)
  - Evidence (Validator report):
    - Validation result: **VALIDATION_PASSED**
    - Files inspected (read-only):
      - `src/requestClassifier.js`
      - `tests/requestClassifier.test.js`
    - `SPC-001` security delta acceptance criteria results:
      - AC-006: **PASS** — security signal detection + escalation default present (type: code, risk: medium, mode: needs_review).
      - AC-007: **PASS** — doc-only security exception evaluated before security escalation (exception precedence confirmed by code ordering).
      - AC-008: **PASS** — tests cover the three normative examples, including Spanish doc-only security: “actualizar documentación de seguridad”.
    - Brief anchors:
      - Spanish documentation intent regex: `/\bdocumentaci[oó]n\b/`.
      - Exception precedence: doc-only exception check occurs before security escalation default.
      - Tests: include the three normative examples (vulnerability/auth escalation; ciberseguridad hardening escalation; doc-only security exception).
    - Scope / guardrails:
      - Static inspection only (no test execution).
      - Cannot prove repo-wide diff; however, no evidence of forbidden scope changes was observed in inspected files (no deps/config/runner changes indicated).

## References

- Spec (delta section): `docs/40-specs/SPC-001-foundry-request-classification.md` ("DELTA (unimplemented): Security-related request handling")
- Task: `docs/50-tasks/TSK-002-security-request-classification-delta.md`
- Traceability map: `docs/00-product/source-of-truth-map.md`
