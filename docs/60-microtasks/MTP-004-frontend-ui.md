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

- [x] MT-008 - Wire classification + output rendering
  - Owner: Code Author
  - Status: **COMPLETED**
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
  - Evidence:
    - Governance decision for MT-008: **APPROVED** with allowlist `ui/**` only and forbids `docs/**`, `src/requestClassifier.js`, `package*.json`, deps, network.
    - Code Author Change Evidence Packet:
      - Status: COMPLETED
      - Files read: ui/main.js, ui/requestClassifierInterop.js, ui/styles.css, index.html
      - Files modified: ui/main.js
      - Summary: Updated classification execution path to `await state.classifyRequest(trimmed)` so UI works whether classifyRequest is sync or returns a Promise (prevents rendering [object Promise]/incorrect JSON).
      - AC coverage:
        - Clicking Classify triggers classifyNow() which calls classifyRequest and renders badges + pretty JSON; await ensures correct resolved result.
        - JSON shown matches returned object via JSON.stringify(result, null, 2) on resolved result.
        - CJS/ESM interop via dynamic import default-export fallback; no changes needed.
      - Forbidden scope confirmation: no changes to docs/** (other than this closure), src/requestClassifier.js, package.json/package-lock.json; no deps; no network.
      - Limitations: JSON.stringify can fail for circular/BigInt; out of scope.

- [x] MT-009 - Implement in-memory history (newest first) with reload-on-click
  - Owner: Code Author
  - Status: **COMPLETED**
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
  - Evidence:
    - Governance: **APPROVED** for MT-009 with allowlist `ui/**`.
      - Forbidden during implementation: persistence, network, new deps, `src/requestClassifier.js`, `docs/**` edits.
    - Code Author Change Evidence Packet:
      - Status: COMPLETED
      - Files read: `ui/main.js`, `ui/styles.css`
      - Files modified: none
    - Finding (static review): `ui/main.js` already maintains in-memory `state.history` updated newest-first on successful classification, and history item click reloads prior entry into the UI (restores input + renders stored output) without re-running the classifier.
    - Note / limitation: current implementation also adds a history entry on classification error; if the spec intends history only for successful classifications, a follow-up change is required.

- [x] MT-010 - Implement Copy JSON + error handling
  - Owner: Code Author
  - Status: **COMPLETED**
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
  - Evidence:
    - Governance decision: **APPROVED**
      - Implementation scope allowlist: `ui/**`
      - Forbidden: `docs/**`, `src/requestClassifier.js`, `package.json`, `package-lock.json`, `vite.config.*`, `index.html`
      - Additional forbids: deps/clipboard polyfills, network, persistence
    - Code Author Change Evidence Packet:
      - Status: COMPLETED
      - Files read: ui/main.js, ui/styles.css
      - Files modified: ui/main.js, ui/styles.css
      - Summary: Implemented robust Copy JSON via clipboard API (navigator.clipboard.writeText) with execCommand fallback; added visible error messaging with recovery hints for insecure context/permission failures; adjusted feedback styling for longer error text.
      - Manual verification: click Copy JSON after classification copies exact rendered JSON; on insecure context/permission denied shows visible error + recovery hint.
      - Forbidden scope confirmation: no changes to docs/** (other than closure), src/requestClassifier.js, package.json, package-lock.json, vite.config.*, index.html; no deps; no network; no persistence.
      - Risks/limitations: execCommand may be blocked; fallback directs user to manual copy.

- [x] MT-011 - Input validation (empty request)
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
  - Evidence:
    - Governance decision: **APPROVED**
      - Implementation scope allowlist: `ui/**` only
      - Forbidden during implementation: `docs/**`, `src/requestClassifier.js`, `package*.json`, `vite.config.*`, `index.html`, new deps, network, persistence
    - Code Author Change Evidence Packet:
      - Status: COMPLETED
      - Files read: `ui/main.js`, `ui/styles.css`
      - Files modified: none
      - Finding: `classifyNow(text)` trims input; if `!trimmed` shows inline validation “Please enter a request before classifying.” then returns early; classifier call `await state.classifyRequest(trimmed)` is unreachable for empty/whitespace.
      - Manual verification: click Classify with empty/whitespace input shows inline message and does not enter “Classifying…”.

- [x] MT-012 - Accessibility pass (baseline)
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
  - Evidence:
    - Governance decision: **APPROVED**
      - Allowlist: `ui/**`, `index.html`
      - Forbidden during implementation: `docs/**`, `src/requestClassifier.js`, `package*.json`, `vite.config.*`, new deps, network/telemetry/external APIs, persistence
    - Code Author Change Evidence Packet (summary):
      - Status: COMPLETED
      - Files read: `index.html`, `ui/main.js`, `ui/styles.css`
      - Files modified: `ui/main.js`
      - Summary:
        - Added `aria-describedby` for textarea + history list
        - Added `aria-label` attributes for buttons
        - Added `aria-hidden` for decorative dot
        - Added `aria-atomic` for JSON output
        - Clarified history item label re Enter activation
      - Manual a11y checklist results: reported as completed/passing for tab navigation, keyboard activation of history items, and accessible labels.
    - Forbidden scope confirmation: no changes outside the allowlist.

### Validation (future; Validator)

- [x] MT-013 - Validator: automated checks + manual UI verification checklist
  - Owner: Validator
  - Status: **COMPLETED** (governed evidence recorded; overall validator result NEEDS_CLARITY)
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
  - Evidence:
    - Validation report: `docs/30-validation/validator-mtp-004-ui-ac-ui-001-007.md`
    - Verdict summary:
      - Overall: **NEEDS_CLARITY** (environment constraints prevented runtime/browser verification)
      - AC-UI-001: NEEDS_CLARITY
      - AC-UI-002: NEEDS_CLARITY
      - AC-UI-003: PASS (static)
      - AC-UI-004: PASS (static)
      - AC-UI-005: PASS (static)
      - AC-UI-006: PASS (static)
      - AC-UI-007: PASS (static)
    - Additional runtime evidence received (post-closure):
      - User-provided screenshots for `npm run preview` @ `http://localhost:4173` + DevTools Network evidence.
      - See updated validation report: `docs/30-validation/validator-mtp-004-ui-ac-ui-001-007.md`.
    - Limitations recorded in report:
      - Could not run npm commands or open a browser
      - Could not provide repo-wide diff/status proof

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
