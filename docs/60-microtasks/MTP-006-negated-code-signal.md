# MTP-006: Negated “code” signal should not force code classification

## Request / Intent

Bugfix request classification logic so explicit negation phrases (e.g., "no code changes") do **not** count as code intent.

Target scenario:
- Input: "Update the README documentation for security guidance. No code changes."
- Expected: `type: documentation`, `risk: low`, `mode: bounded_execution_ready`

## Scope and constraints

- Keep scope bounded to request classification logic + tests + governed docs.
- **Forbidden**: modify `package.json`, lockfiles, build config, or introduce dependencies.

## Source-of-truth

- Spec: `docs/40-specs/SPC-001-foundry-request-classification.md`

## Execution micro-tasks (operational contract)

### [x] MT-001 — Update spec delta for explicit negated code intent

- **Owner**: Source-of-Truth Author
- **Purpose**: Update SPC-001 to define that explicit negation phrases about code work (e.g., “no code changes”) must suppress the literal token `code` as a code intent signal.
- **Allowed files**:
  - `docs/40-specs/SPC-001-foundry-request-classification.md`
- **Forbidden**: implementation files (`src/**`, `tests/**`), runtime/deps.
- **Requirements**:
  - Add a **small DELTA** section under the existing Security-related delta (or doc-only security exception rules) clarifying precedence:
    - If documentation intent signals are present and the request includes an explicit “no code changes” / “no code change” / “without code changes” / “sin cambios de código” style phrase, that phrase must be treated as **negating** code intent.
    - The negation handling must apply specifically to avoid false positives where the word “code” appears only inside a negation phrase.
  - Add the normative example:
    - "Update the README documentation for security guidance. No code changes." => `documentation/low/bounded_execution_ready`
- **Acceptance criteria**:
  - Spec delta is unambiguous and testable.
- **Evidence**:
  - Spec updated (DELTA section + normative example): `docs/40-specs/SPC-001-foundry-request-classification.md`

### [x] MT-002 — Implement fix: negated "code" phrases do not count as code intent

- **Owner**: Code Author
- **Purpose**: Prevent the literal word `code` from triggering `hasCodeSignals=true` when it appears within an explicit negation phrase (e.g., “no code changes”), so doc-only security exception can apply.
- **Allowed files**:
  - `src/requestClassifier.js`
- **Forbidden**:
  - `package.json`, lockfiles, build config, new deps
  - any files outside `src/requestClassifier.js`
- **Implementation requirements** (must be deterministic):
  - Update code-signal detection so that explicit negation phrases suppress code intent.
  - Minimum phrase coverage (case-insensitive):
    - "no code changes"
    - "no code change"
    - "without code changes"
    - "without code change"
  - Optional (if already present in classifier patterns): Spanish coverage:
    - "sin cambios de código"
  - Ensure the example request classifies as documentation/low/bounded_execution_ready.
  - Ensure security escalation still applies for clear code security fixes, e.g. "Fix vulnerability in auth".
- **Acceptance criteria**:
  - Behavior matches updated SPC-001 delta.
- **Evidence**:
  - Agent evidence packet (Code Author): `src/requestClassifier.js` modified only (negation phrase stripping/suppression in `detectCodeSignals`).
  - Validation: `docs/30-validation/VAL-006-negated-code-signal.md` (includes user-run `npm test` PASS output)

### [x] MT-003 — Tests: add regression coverage for negated "code" phrase

- **Owner**: Code Author
- **Purpose**: Prove the classifier correctly handles explicit negated code intent.
- **Allowed files**:
  - `tests/requestClassifier.test.js`
- **Forbidden**:
  - `package.json`, lockfiles, build config, new deps
  - modifying `src/**` (that is MT-002)
- **Test requirements**:
  - Add a test case asserting:
    - Input: "Update the README documentation for security guidance. No code changes."
    - Output includes: `type: 'documentation'`, `risk: 'low'`, `mode: 'bounded_execution_ready'`
  - Add/retain a test case asserting security escalation still holds:
    - Input: "Fix vulnerability in auth"
    - Output includes: `type: 'code'`, `risk: 'medium'`, `mode: 'needs_review'`
- **Acceptance criteria**:
  - New test(s) fail before MT-002 and pass after MT-002.
- **Evidence**:
  - Agent evidence packet (Code Author): `tests/requestClassifier.test.js` modified only; regression test added: `treats negated 'code' phrase as documentation-only (regression)`.
  - Validation: `docs/30-validation/VAL-006-negated-code-signal.md`

### [x] MT-004 — Validation evidence for MTP-006

- **Owner**: Validator (primary) + Source-of-Truth Author (closure)
- **Purpose**: Record validator findings and link evidence back to MTP-006 and SPC-001.
- **Allowed files**:
  - `docs/30-validation/VAL-006-negated-code-signal.md` (preferred new doc)
  - (or update an existing validation log if Governance directs)
  - `docs/60-microtasks/MTP-006-negated-code-signal.md` (for checkbox closure + evidence links)
- **Forbidden**: any implementation (`src/**`, `tests/**`) changes.
- **Validation requirements**:
  - Confirm the new/updated test case(s) exist and assert expected outputs.
  - Confirm existing security escalation test(s) still pass by static inspection (or by running tests if Validator is permitted to run them in their environment).
  - Capture key evidence snippets (test names + expected outputs; classifier logic summary).
- **Acceptance criteria**:
  - Validation doc includes: date, validator, scope, evidence links, pass/fail summary.
  - MTP-006 MT checkboxes updated to `[x]` with links to validation evidence (SoT Author step after Validator report is available).
- **Evidence**:
  - Validation doc: `docs/30-validation/VAL-006-negated-code-signal.md` (includes user-run `npm test` PASS output)
  - MTP closure: this document (checkbox updates)
