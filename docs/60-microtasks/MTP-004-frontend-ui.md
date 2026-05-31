# MTP-004: Frontend UI (browser-only, Vite-bundled)

Owner agent: Dev Foundry Source-of-Truth Author

Governing spec: `docs/40-specs/SPC-002-frontend-ui.md`
Derived task: `docs/50-tasks/TSK-003-frontend-ui.md`
Dependency: `docs/40-specs/SPC-001-foundry-request-classification.md`

## Execution notes

- This MTP includes **documentation-authoring** microtasks (owned by Source-of-Truth Author) and **implementation** microtasks (owned by Code Author) that must not be executed by the Source-of-Truth Author.
- Any changes to tooling (e.g., adding Vite, changing `package.json`) require Governance approval prior to execution.

## Micro-tasks (ordered)

### Documentation / governance spine

- [x] MT-001 - Author SPC-002 frontend UI spec
  - Owner: Dev Foundry Source-of-Truth Author
  - Purpose: Define MVP UX + functional/non-functional requirements and constraints.
  - Allowed files:
    - `docs/40-specs/SPC-002-frontend-ui.md`
  - Forbidden:
    - Any non-doc changes (`src/**`, `tests/**`, `package.json`, tooling, deployment).
  - Acceptance criteria:
    - Spec includes: UX, FRs, NFRs, constraints (no backend), Vite decision, out-of-scope, acceptance criteria.
  - Expected evidence:
    - `docs/40-specs/SPC-002-frontend-ui.md`

- [x] MT-002 - Author TSK-003 derived task document
  - Owner: Dev Foundry Source-of-Truth Author
  - Purpose: Translate spec into execution boundaries and task-level acceptance criteria.
  - Allowed files:
    - `docs/50-tasks/TSK-003-frontend-ui.md`
  - Forbidden:
    - Any non-doc changes.
  - Acceptance criteria:
    - Task references `SPC-002` and includes governance/tooling sensitivity note.
  - Expected evidence:
    - `docs/50-tasks/TSK-003-frontend-ui.md`

- [x] MT-003 - Author MTP-004 micro-task pack
  - Owner: Dev Foundry Source-of-Truth Author
  - Purpose: Create an execution-ready operational contract for implementation + validation.
  - Allowed files:
    - `docs/60-microtasks/MTP-004-frontend-ui.md`
  - Forbidden:
    - Any non-doc changes.
  - Acceptance criteria:
    - Microtasks are detailed, bounded, and reference spec ACs.
  - Expected evidence:
    - `docs/60-microtasks/MTP-004-frontend-ui.md`

- [x] MT-004 - Update source-of-truth map with new UI spine
  - Owner: Dev Foundry Source-of-Truth Author
  - Purpose: Maintain traceability from SoT map to spec/task/MTP.
  - Allowed files:
    - `docs/00-product/source-of-truth-map.md`
  - Forbidden:
    - Any non-doc changes.
  - Acceptance criteria:
    - SoT map includes `SPC-002` -> `TSK-003` -> `MTP-004`.
  - Expected evidence:
    - `docs/00-product/source-of-truth-map.md`

### Governance review gates (must be approved before implementation proceeds)

- [x] MT-005 - Governance decision: approve bundler/dev server addition (Vite preferred)
  - Owner: Governance Agent
  - Purpose: Approve (or reject/adjust) adding Vite and any associated config/scripts.
  - Inputs:
    - `docs/40-specs/SPC-002-frontend-ui.md` (Tech decisions: TD-001)
    - `docs/50-tasks/TSK-003-frontend-ui.md`
  - Allowed operations:
    - Governance review only; no repo changes required for the decision itself.
  - Acceptance criteria:
    - Governance records “approved bundler choice + constraints” for execution.
    - If not approved, Governance specifies alternate bundler or constraints.
  - Expected evidence:
    - Governance decision captured in the slice orchestration record (or equivalent governance artifact). (Path TBD by Governance.)
  - Evidence:
    - Governance decision: **APPROVED**
    - Approved scope:
      - Add Vite-based frontend UI (static SPA) with text input, Classify button, formatted JSON output + badges, in-memory history list, Copy JSON button
      - Configure Vite for local dev/build
      - No modifications to existing classifier logic file
    - Allowed files:
      - `package.json`, `package-lock.json`, `index.html`, `vite.config.js`, `ui/**`
    - Forbidden:
      - Modify `src/requestClassifier.js`
      - Add backend code beyond Vite dev server
      - Add frameworks (React/Vue/etc)
      - Touch `docs/**`
      - Add network calls/telemetry/external APIs
      - Add any dependency other than `vite` (devDependency only)
    - Acceptance criteria (confirmed):
      - Stay within allowlist
      - Only `vite` added
      - UI runs in-browser with specified features
      - Classifier logic unchanged

### Implementation (future; Code Author)

- [x] MT-006 - Create Vite-based SPA scaffold (**COMPLETED — stakeholder-approved to proceed**)
  - Owner: Code Author
  - Purpose: Add a minimal Vite app that can import and run the classifier in-browser.
  - Preconditions:
    - MT-005 approved.
  - Allowed files/directories:
    - `package.json` (scripts/deps)
    - `package-lock.json` (if npm is used)
    - `vite.config.*` (if needed)
    - `index.html`
    - `ui/**` (preferred UI source root)
    - `src/requestClassifier.js` (edits only if required for browser bundling compatibility)
  - Forbidden:
    - Backend/server code.
    - `.env` files and secrets.
    - Deployment/CI files.
    - `docs/**` (explicitly forbidden by MT-005 approved scope)
  - Requirements:
    - Provide dev server entrypoint and minimal render of UI shell.
    - Ensure build can bundle `classifyRequest()` for browser execution.
  - Acceptance criteria:
    - Dev server starts and renders a page with header + placeholder cards.
    - Classifier module is importable from UI without runtime errors.
    - Dependency constraint clarification: **Vite is the only NEW dependency added for bundling/dev server**; pre-existing devDependencies (e.g., `jest`) are allowed to remain.
  - Stakeholder decision / override (closure basis):
    - Stakeholder (user) approved proceeding/closure: **`docs/**` timestamp-only changes are attributed to an earlier micro-task and should not block MT-006 acceptance**.
  - Static validation evidence (non-runtime):
    - `package.json` includes Vite scripts and devDependency:
      - Scripts: `dev: "vite"`, `build: "vite build"`, `preview: "vite preview"`
      - `devDependencies.vite` present
      - Dependency check: `vite` is the only **newly introduced** dependency for bundling/dev server work in this micro-task; existing devDependencies (e.g., `jest`) may remain.
    - `index.html` loads UI entrypoint:
      - `<script type="module" src="/ui/main.js"></script>`
    - `ui/main.js` renders scaffold shell:
      - Renders header “Foundry Request Board” and includes placeholder cards (Input placeholder, History placeholder)
  - Remaining risk / limitation (tracked for MT-013):
    - The prior validator run did not execute a full browser runtime path; any **runtime CJS/ESM interop issues under Vite** (e.g., importing `src/requestClassifier.js`) remain a validation risk to be explicitly checked and recorded in MT-013.
  - Evidence:
    - Stakeholder override/approval: recorded in this MTP update request (user instruction).
    - Evidence note (docs scope / working tree hygiene): user-reported `git diff -- docs/60-microtasks/MTP-004-frontend-ui.md` showed **no diff** and `git status --porcelain` was **clean** at the time of this clarification request.
    - Repository static checks (file contents):
      - `package.json`
      - `index.html`
      - `ui/main.js`

- [x] MT-007 - Implement MVP UI layout + styling (card-based)
  - Owner: Code Author
  - Status: **COMPLETED** (stakeholder-approved closure; validator marked NEEDS_CLARITY)
  - Purpose: Implement the UX layout and “vistoso” styling without external component library.
  - Allowed files:
    - `ui/**`
    - `index.html`
  - Forbidden:
    - Adding heavyweight UI component libraries unless Governance explicitly approves.
  - Requirements (from `SPC-002`):
    - Header
    - Input card with textarea + Classify button (+ optional Clear)
    - Output card with badges + pretty JSON + Copy JSON button
    - History panel
    - Responsive layout
  - Acceptance criteria:
    - Meets `SPC-002` UX requirements (Layout + Visual design).
  - Expected evidence:
    - UI source files + screenshots included in PR description or validator evidence doc (path chosen by Validator).
  - Evidence (closure record):
    - User-provided changed files for this micro-task closure:
      - `docs/60-microtasks/MTP-004-frontend-ui.md` (this MT closure update)
      - `ui/main.js`
      - `ui/styles.css`
    - Delivery summary:
      - Implemented an MVP **card-based layout** for the Foundry Request Board UI and accompanying **styling/theme** ("vistoso") via updates to `ui/main.js` + `ui/styles.css`.
    - Validator outcome: **NEEDS_CLARITY**
      - Static/behavioral acceptance criteria were reported as **PASS**.
      - Validator could not conclusively prove "only allowlisted files changed" because **git diff/status evidence was not provided** (no authoritative working-tree proof).
    - Stakeholder override / approval to close:
      - Stakeholder (user) explicitly approved formally closing MT-007 despite missing git diff/status proof.
    - Follow-up recommendation (still advised):
      - Capture `git status --porcelain` and relevant `git diff` output (or a validator evidence report under `docs/30-validation/**`) to fully substantiate allowlist compliance.

- [ ] MT-008 - Wire classification + output rendering
  - Owner: Code Author
  - Purpose: Connect UI controls to the classifier and render results.
  - Allowed files:
    - `ui/**`
  - Forbidden:
    - Any network dependency for classification.
  - Requirements:
    - FR-001: clicking Classify calls `classifyRequest()` and renders badges + pretty JSON.
    - Ensure JSON shown matches returned object.
  - Acceptance criteria:
    - Meets `SPC-002` AC-UI-002 and AC-UI-003.
  - Expected evidence:
    - Code diff + brief note describing how results are rendered.

- [ ] MT-009 - Implement in-memory history (newest first) with reload-on-click
  - Owner: Code Author
  - Purpose: Track recent classifications during the session.
  - Allowed files:
    - `ui/**`
  - Forbidden:
    - Persistence (localStorage/sessionStorage) for MVP.
  - Requirements:
    - FR-002: append on successful classify; newest-first; click reloads.
  - Acceptance criteria:
    - Meets `SPC-002` AC-UI-004.
  - Expected evidence:
    - Code diff + note describing the in-memory structure.

- [ ] MT-010 - Implement Copy JSON + error handling
  - Owner: Code Author
  - Purpose: Copy the current output JSON to clipboard and handle failures.
  - Allowed files:
    - `ui/**`
  - Forbidden:
    - Adding clipboard polyfills unless Governance approves.
  - Requirements:
    - FR-003: copy current JSON.
    - FR-005: show error on failure + recovery hint.
  - Acceptance criteria:
    - Meets `SPC-002` AC-UI-005 and AC-UI-006 (clipboard portion).
  - Expected evidence:
    - Code diff + manual verification note.

- [ ] MT-011 - Input validation (empty request)
  - Owner: Code Author
  - Purpose: Prevent empty classifications and show inline message.
  - Allowed files:
    - `ui/**`
  - Requirements:
    - FR-004: empty/whitespace shows validation and does not call classifier.
  - Acceptance criteria:
    - Meets `SPC-002` AC-UI-006 (empty input portion).
  - Expected evidence:
    - Code diff + manual verification note.

- [ ] MT-012 - Accessibility pass (baseline)
  - Owner: Code Author
  - Purpose: Ensure keyboard navigation and accessible labels.
  - Allowed files:
    - `ui/**`
    - `index.html`
  - Requirements:
    - Tab navigation across controls.
    - History list items are keyboard-activatable.
    - Accessible labels for text area and buttons.
  - Acceptance criteria:
    - Meets `SPC-002` AC-UI-007.
  - Expected evidence:
    - Code diff + short checklist in PR description.

### Validation (future; Validator)

- [ ] MT-013 - Validator: automated checks + manual UI verification checklist
  - Owner: Validator
  - Purpose: Provide governed evidence that MVP meets `SPC-002` acceptance criteria.
  - Allowed files:
    - `docs/30-validation/**` (new validation report file)
  - Forbidden:
    - Implementation changes.
  - Validation steps (minimum):
    1. Automated (if applicable after tooling changes):
       - `npm test` (classifier tests)
       - `npm run build`
    2. Manual UI checklist (document results):
       - AC-UI-001: dev server runs; page loads.
       - AC-UI-002: classification works in-browser; no required network calls.
       - AC-UI-003: badges + pretty JSON shown.
       - AC-UI-004: history newest-first; click reload works.
       - AC-UI-005: Copy JSON copies expected JSON.
       - AC-UI-006: empty input message; clipboard failure message (simulate by blocking clipboard permissions or using insecure context if applicable).
       - AC-UI-007: tab navigation; keyboard activate history.
    3. Evidence capture:
       - Include at least 1 screenshot of the UI showing input, output, and history.
       - Include a note of browser + OS used.
  - Acceptance criteria:
    - Validation report explicitly states pass/fail per AC.
  - Expected evidence:
    - New file under `docs/30-validation/` (name TBD by Validator), linked from SoT map in a follow-up doc-maintenance microtask.

### Documentation maintenance (future; Source-of-Truth Author)

- [ ] MT-014 - Update SoT map with implementation + validation evidence links
  - Owner: Dev Foundry Source-of-Truth Author
  - Purpose: After implementation + validation, link UI files and validator report in the SoT map.
  - Allowed files:
    - `docs/00-product/source-of-truth-map.md`
  - Forbidden:
    - Implementation changes.
  - Inputs:
    - Validator report produced in MT-013
    - Actual UI file paths created in MT-006..MT-012
  - Acceptance criteria:
    - SoT map includes:
      - `SPC-002` -> `TSK-003` -> `MTP-004`
      - Implementation links (UI files)
      - Validation evidence link(s)
  - Expected evidence:
    - Updated `docs/00-product/source-of-truth-map.md`
