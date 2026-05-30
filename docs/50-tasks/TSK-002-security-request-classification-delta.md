# TSK-002: Security-related request classification (delta; docs-only)

## Objective

Plan the future update to the request classifier so that security-related requests are classified as `type: code` with `risk: medium` and `mode: needs_review`, **except** when the request is strictly security documentation per `SPC-001` delta.

## Mode

Hybrid (spec-first delta for future implementation in existing Slice-001 codebase).

## In scope

- Update deterministic request classification rules per:
  - `docs/40-specs/SPC-001-foundry-request-classification.md` (DELTA: Security-related request handling)
- Update tests to reflect the new delta behavior.

## Out of scope

- Any runtime test runner setup.
- Any UI changes.

## Planned implementation touchpoints (read-only for this task doc)

- `src/requestClassifier.js`
- `tests/requestClassifier.test.js`

## Acceptance criteria

AC-TSK-002-001 Spec delta exists
- `SPC-001` contains a clearly marked DELTA section for security-related request handling with:
  - security signals list
  - decision logic including doc-only exception + precedence
  - normative examples
  - acceptance criteria (delta)

AC-TSK-002-002 Implementation aligns with spec delta (future)
- Classifier behavior matches AC-006 through AC-008 in `SPC-001`.

AC-TSK-002-003 Tests cover the delta (future)
- Add/adjust tests for at least:
  - security request escalation to `type: code`
  - doc-only security exception stays `type: documentation`
  - precedence: doc-only exception prevents escalation when "security/seguridad" appears

## Notes / risks

- Current Slice-001 implementation includes `security` as a generic code signal; the delta refines behavior by introducing a doc-only security exception with explicit negative keywords.
