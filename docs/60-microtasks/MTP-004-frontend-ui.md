# MTP-004: Frontend UI Browser-only MVP

## Status

COMPLETED PRODUCT MICRO-TASK PACK

## Purpose

Define and close the micro-task pack for the Foundry Request Board browser-only MVP UI.

This pack belongs to Foundry Request Board product behavior. It does not define Dev Foundry agent-system hardening, Alita prompt behavior, Flow Evidence Manifest behavior, MCP read-reduction behavior, or Orchestrator behavior.

## Governing Documents

- UI specification: `docs/40-specs/SPC-002-frontend-ui.md`
- Derived task: `docs/50-tasks/TSK-003-frontend-ui.md`
- Classifier dependency: `docs/40-specs/SPC-001-foundry-request-classification.md`
- Source-of-truth map: `docs/00-product/source-of-truth-map.md`

## Product Goal

Add a visually clear single-page browser UI where a user can:

- enter a change request;
- classify it locally in the browser;
- view type/risk/mode badges;
- inspect pretty JSON output;
- copy JSON;
- use an in-memory history list.

## MVP Constraints

- Browser-only classification.
- No backend HTTP API.
- No authentication.
- No persistence beyond in-memory history.
- No telemetry.
- No external service calls for classification.
- Vite is acceptable as local dev/build tooling.
- Avoid heavy UI frameworks for the MVP.
- Preserve the existing classifier behavior.

## Scope Layers

### Implementation scope

- `package.json`
- `package-lock.json`
- `index.html`
- `vite.config.js`, only if needed
- `ui/**`
- `src/requestClassifier.js`, only if required for browser compatibility and separately approved

### Source-of-truth and evidence scope

- `docs/40-specs/SPC-002-frontend-ui.md`
- `docs/50-tasks/TSK-003-frontend-ui.md`
- `docs/60-microtasks/MTP-004-frontend-ui.md`
- `docs/00-product/source-of-truth-map.md`
- `docs/30-validation/validator-mtp-004-ui-ac-ui-001-007.md`

### Forbidden scope

- backend services
- authentication
- persistence storage
- telemetry
- deployment infrastructure
- secrets
- environment files
- unrelated classifier behavior changes
- agent-system hardening docs
- agent prompt files

## Micro-tasks

### [x] MT-001 — Author SPC-002 frontend UI specification

Owner: Source-of-Truth Author

Purpose:

- Define MVP UI requirements, UX behavior, constraints, and acceptance criteria.

Allowed files:

- `docs/40-specs/SPC-002-frontend-ui.md`

Forbidden:

- implementation files
- tests
- package files
- dependency changes
- UI source files
- deployment files
- secrets

Acceptance criteria:

- Specification defines browser-only UI behavior.
- Specification includes MVP UX requirements.
- Specification defines no-backend constraint.
- Specification documents in-memory history.
- Specification defines validation-oriented acceptance criteria.

Evidence:

- `docs/40-specs/SPC-002-frontend-ui.md`

Status:

- Completed.

### [x] MT-002 — Author TSK-003 frontend UI task document

Owner: Source-of-Truth Author

Purpose:

- Translate the UI specification into product task boundaries and acceptance criteria.

Allowed files:

- `docs/50-tasks/TSK-003-frontend-ui.md`

Forbidden:

- implementation files
- tests
- package files
- dependency changes
- UI source files
- deployment files
- secrets

Acceptance criteria:

- Task references `SPC-002`.
- Task states implementation boundaries.
- Task identifies Vite/tooling as governance-sensitive.
- Task preserves the browser-only MVP constraint.

Evidence:

- `docs/50-tasks/TSK-003-frontend-ui.md`

Status:

- Completed.

### [x] MT-003 — Author MTP-004 frontend UI micro-task pack

Owner: Source-of-Truth Author

Purpose:

- Create an execution-ready product micro-task pack for the browser-only UI.

Allowed files:

- `docs/60-microtasks/MTP-004-frontend-ui.md`

Forbidden:

- implementation files
- tests
- package files
- dependency changes
- UI source files
- deployment files
- secrets

Acceptance criteria:

- Pack includes ordered micro-tasks.
- Pack separates documentation, governance, implementation, and validation work.
- Pack references `SPC-002` acceptance criteria.
- Pack keeps scope bounded to the MVP.

Evidence:

- `docs/60-microtasks/MTP-004-frontend-ui.md`

Status:

- Completed.

### [x] MT-004 — Update source-of-truth map with UI spine

Owner: Source-of-Truth Author

Purpose:

- Maintain traceability from the source-of-truth map to the UI spec, task, MTP, implementation, and evidence.

Allowed files:

- `docs/00-product/source-of-truth-map.md`

Forbidden:

- implementation files
- tests
- package files
- dependency changes
- deployment files
- secrets

Acceptance criteria:

- Source-of-truth map references `SPC-002`.
- Source-of-truth map references `TSK-003`.
- Source-of-truth map references `MTP-004`.

Evidence:

- `docs/00-product/source-of-truth-map.md`

Status:

- Completed.

### [x] MT-005 — Governance decision for Vite-based browser UI

Owner: Governance Agent

Purpose:

- Approve or block the bounded addition of Vite-based local dev/build tooling and browser UI files.

Review inputs:

- `docs/40-specs/SPC-002-frontend-ui.md`
- `docs/50-tasks/TSK-003-frontend-ui.md`
- `docs/60-microtasks/MTP-004-frontend-ui.md`

Approved implementation scope:

- `package.json`
- `package-lock.json`
- `index.html`
- `vite.config.js`, if needed
- `ui/**`

Approved dependency scope:

- Vite as dev dependency.

Forbidden:

- backend services
- React/Vue or other heavy frameworks
- telemetry
- external APIs
- secrets
- deployment infrastructure
- unrelated classifier behavior changes
- agent-system hardening changes

Acceptance criteria:

- Governance explicitly approves Vite-based browser UI scope.
- Governance confirms no backend requirement.
- Governance confirms classifier behavior should remain unchanged unless a browser compatibility issue requires separate bounded handling.

Evidence:

- Governance decision: APPROVED.
- Approved scope: browser-only Vite UI.
- Forbidden scope preserved.

Status:

- Completed.

### [x] MT-006 — Create Vite-based SPA scaffold

Owner: Code Author

Purpose:

- Add minimal Vite app structure and entrypoint for the browser-only UI.

Allowed files:

- `package.json`
- `package-lock.json`
- `index.html`
- `vite.config.js`, if needed
- `ui/**`

Conditional allowed file:

- `src/requestClassifier.js`, only if required for browser compatibility and separately justified.

Forbidden:

- backend services
- deployment files
- secrets
- `.env` files
- unrelated classifier logic changes
- additional dependencies beyond approved scope

Requirements:

- Add local dev/build/preview scripts.
- Add browser HTML entrypoint.
- Add UI source root.
- Confirm the classifier can be reached from the UI path or identify compatibility risks.

Acceptance criteria:

- `npm run dev` script exists.
- `npm run build` script exists.
- `npm run preview` script exists.
- UI scaffold renders a page.
- Classifier import path is identified.
- No backend is added.

Evidence:

- `package.json`
- `package-lock.json`
- `index.html`
- `ui/main.js`
- `ui/styles.css`
- Vite local tooling added as approved.

Status:

- Completed.

### [x] MT-007 — Implement MVP UI layout and styling

Owner: Code Author

Purpose:

- Implement the visible browser UI layout and styling for the MVP.

Allowed files:

- `ui/**`
- `index.html`, only if needed for UI shell integration

Forbidden:

- backend services
- new UI frameworks
- package/dependency changes
- unrelated classifier logic changes
- persistence
- telemetry
- secrets

Requirements:

- Header with app name and tagline.
- Input card with textarea and classification action.
- Output card with badges and pretty JSON.
- History panel.
- Responsive layout.
- Modern card-based visual style.

Acceptance criteria:

- UI reflects the layout and visual requirements in `SPC-002`.
- UI is usable on typical desktop browser width.
- UI degrades reasonably for narrower layouts.
- No external service calls are required.

Evidence:

- `ui/main.js`
- `ui/styles.css`
- Browser screenshot evidence was later captured in validation records.

Status:

- Completed with limitation accepted.

Limitation:

- Initial closure did not include authoritative repo-wide diff proof. Later validation evidence focused on runtime behavior and static inspection of relevant UI files.

### [x] MT-008 — Wire classification and output rendering

Owner: Code Author

Purpose:

- Connect the UI to the classifier and render classification results.

Allowed files:

- `ui/**`

Forbidden:

- network calls for classification
- backend services
- package changes
- dependency changes
- unrelated classifier behavior changes
- persistence
- telemetry

Requirements:

- Classify button triggers classification.
- UI renders returned `type`, `risk`, and `mode`.
- UI renders pretty JSON output.
- UI handles sync or async classifier interop safely if needed.
- JSON shown must match the classifier result.

Acceptance criteria:

- Meets `SPC-002` AC-UI-002.
- Meets `SPC-002` AC-UI-003.
- Classification works locally in the browser.

Evidence:

- `ui/main.js`
- `ui/requestClassifierInterop.js`
- Summary: classification execution path wired to render badges and JSON output.

Status:

- Completed.

### [x] MT-009 — Implement in-memory history

Owner: Code Author

Purpose:

- Track recent classifications during the current browser session.

Allowed files:

- `ui/**`

Forbidden:

- localStorage
- sessionStorage
- backend persistence
- telemetry
- dependency changes
- package changes

Requirements:

- Append successful classification entries to in-memory history.
- Sort history newest-first.
- Click a history entry to restore input and output.
- Do not require persistence after refresh.

Acceptance criteria:

- Meets `SPC-002` AC-UI-004.
- History is in-memory only.
- Clicking an item restores the prior classification view.

Evidence:

- `ui/main.js`
- `ui/styles.css`
- Static review confirmed in-memory history behavior.

Status:

- Completed.

### [x] MT-010 — Implement Copy JSON and error handling

Owner: Code Author

Purpose:

- Allow the user to copy current JSON output and handle expected UI error states.

Allowed files:

- `ui/**`

Forbidden:

- clipboard polyfill dependencies unless separately approved
- backend services
- package changes
- telemetry
- persistence

Requirements:

- Copy JSON button copies the currently displayed JSON.
- Empty input produces a visible validation message.
- Clipboard failure produces visible feedback and recovery guidance.
- Unexpected errors are shown without corrupting prior successful history.

Acceptance criteria:

- Meets `SPC-002` AC-UI-005.
- Meets `SPC-002` AC-UI-006.
- No additional dependencies are introduced.

Evidence:

- `ui/main.js`
- `ui/styles.css`
- Copy and error behavior implemented in the UI layer.

Status:

- Completed.

### [x] MT-011 — Accessibility and responsive behavior pass

Owner: Code Author

Purpose:

- Add baseline accessibility and responsive behavior required by the MVP.

Allowed files:

- `ui/**`
- `index.html`, only if needed for semantic labels or metadata

Forbidden:

- new dependencies
- UI framework adoption
- backend services
- telemetry
- persistence
- unrelated classifier logic changes

Requirements:

- Textarea and buttons have accessible labels.
- History items are keyboard-activatable.
- Status/output regions provide appropriate feedback.
- Information is not conveyed only by color.
- Layout remains usable on narrower screens.

Acceptance criteria:

- Meets `SPC-002` AC-UI-007.
- Baseline keyboard navigation is available.
- Responsive behavior is present.

Evidence:

- `ui/main.js`
- `ui/styles.css`
- Static validation later confirmed accessibility hooks.

Status:

- Completed.

### [x] MT-012 — Final product traceability update

Owner: Source-of-Truth Author

Purpose:

- Ensure product source-of-truth references point to the implemented UI and evidence.

Allowed files:

- `docs/00-product/source-of-truth-map.md`
- `docs/60-microtasks/MTP-004-frontend-ui.md`

Forbidden:

- implementation changes
- tests
- package/dependency changes
- runtime configuration
- deployment files
- secrets

Requirements:

- Link UI spec, task, MTP, implementation files, and validation evidence.
- Preserve separation between product UI work and agent-system hardening.

Acceptance criteria:

- Product traceability is clear.
- No implementation scope is reopened.
- No agent-system hardening is mixed into product documentation.

Evidence:

- `docs/00-product/source-of-truth-map.md`
- `docs/60-microtasks/MTP-004-frontend-ui.md`

Status:

- Completed.

### [x] MT-013 — Validate UI acceptance criteria AC-UI-001 through AC-UI-007

Owner: Validator

Purpose:

- Validate the browser-only UI against `SPC-002` acceptance criteria.

Allowed read scope:

- `package.json`
- `index.html`
- `ui/main.js`
- `ui/requestClassifierInterop.js`
- `ui/styles.css`
- `src/requestClassifier.js`
- `docs/40-specs/SPC-002-frontend-ui.md`
- `docs/50-tasks/TSK-003-frontend-ui.md`
- `docs/60-microtasks/MTP-004-frontend-ui.md`

Allowed evidence scope:

- `docs/30-validation/validator-mtp-004-ui-ac-ui-001-007.md`

Forbidden:

- file modifications by Validator
- implementation changes
- package/dependency changes
- deployment changes
- secrets
- agent-system docs

Validation requirements:

- Validate AC-UI-001 through AC-UI-007.
- State whether validation is static, runtime, or user-run.
- Record any limitations honestly.
- Include evidence for browser runtime behavior when user-provided.

Acceptance criteria:

- Validation report records pass/fail per acceptance criterion.
- Runtime/browser evidence is recorded when available.
- Limitations are explicit.
- No false claim is made that agents executed commands if evidence was user-run.

Evidence:

- `docs/30-validation/validator-mtp-004-ui-ac-ui-001-007.md`
- Runtime evidence was provided by user screenshots and browser observation.
- Validation report records AC-UI-001 through AC-UI-007 as passing based on static inspection plus user-provided runtime evidence.

Status:

- Completed.

## Validation Evidence Summary

Primary validation record:

- `docs/30-validation/validator-mtp-004-ui-ac-ui-001-007.md`

Validated acceptance criteria:

- AC-UI-001: UI exists and runs locally.
- AC-UI-002: classification works in browser without required API calls.
- AC-UI-003: output renders badges and JSON.
- AC-UI-004: history behavior works.
- AC-UI-005: Copy JSON behavior exists.
- AC-UI-006: error states exist.
- AC-UI-007: baseline accessibility exists.

Validation limitations:

- Some evidence was user-run.
- Agents did not claim independent browser execution unless explicitly supported by evidence.
- Repo-wide diff proof was not always available in early runs, so scope validation was evidence-based.

## Final Outcome

MTP-004 is complete.

The Foundry Request Board browser-only UI MVP was implemented and validated sufficiently for demo use.

## Current Product Surface

Implemented UI capabilities:

- request input
- local browser classification
- type/risk/mode badges
- pretty JSON output
- copy JSON
- in-memory history
- responsive card-based layout
- no required backend API for classification

## Not Included in MVP

- authentication
- persistence
- backend API
- telemetry
- multi-user features
- cloud services
- advanced analytics
- CI/CD
- deployment automation