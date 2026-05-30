# MTP-001: Documentation-only classifier (retroactive SDD hardening)

> Honesty note (retroactive hardening): This micro-task pack was created after Agentic Slice 001 as SDD hardening. The underlying implementation was already validated; this pack captures traceable documentation work.

Owner agent: Dev Foundry Source-of-Truth Author

## Micro-tasks

- [x] MT-001 - Create source-of-truth map for Slice 001
  - Owner: Dev Foundry Source-of-Truth Author
  - Evidence: `docs/00-product/source-of-truth-map.md`

- [x] MT-002 - Create SPC-001 spec for request classification behavior
  - Owner: Dev Foundry Source-of-Truth Author
  - Evidence: `docs/40-specs/SPC-001-foundry-request-classification.md`

- [x] MT-003 - Create TSK-001 task capturing boundaries and acceptance criteria
  - Owner: Dev Foundry Source-of-Truth Author
  - Evidence: `docs/50-tasks/TSK-001-documentation-only-classifier.md`

- [x] MT-004 - Create MTP-001 checklist with owners + evidence links
  - Owner: Dev Foundry Source-of-Truth Author
  - Evidence: `docs/60-microtasks/MTP-001-documentation-only-classifier.md`

- [x] MT-005 - Governance follow-up: decide if/when to add runtime test execution (package/test runner)
  - Owner: Governance Agent
  - Evidence:
    - README updated to document Node 20 LTS+ requirement and how to run tests.
    - File: `README.md`
    - Run instructions (as documented): `npm ci` (or `npm install`), then `npm test`
  - Additional runtime execution evidence (user-provided):
    - Preconditions: Node 20+ and npm
    - Command + output:

      ```
      ❯ npm test

      > foundry-request-board@0.0.0 test
      > jest

       PASS  tests/requestClassifier.test.js
        classifyRequest
          ✓ classifies documentation-only request as low risk and bounded execution ready (2 ms)
          ✓ does not classify mixed doc + code request as documentation-only
          ✓ classifies unknown or ambiguous request as unknown
          ✓ classifies security vulnerability fix request as code, medium risk, needs_review (1 ms)
          ✓ classifies Spanish security hardening request as code, medium risk, needs_review
          ✓ applies documentation-only security exception precedence over default security escalation
          ✓ classifies Spanish documentation-only security request as low risk and bounded execution ready

      Test Suites: 1 passed, 1 total
      Tests:       7 passed, 7 total
      Snapshots:   0 total
      Time:        0.161 s
      Ran all test suites.
      ```

## Related implementation + validation evidence (read-only)

- Implementation:
  - `src/requestClassifier.js`
  - `tests/requestClassifier.test.js`
- Validation evidence:
  - `docs/30-validation/validator-smoke-test-001.md`
