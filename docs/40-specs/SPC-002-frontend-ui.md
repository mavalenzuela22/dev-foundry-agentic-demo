# SPC-002: Interactive Web UI Frontend (Browser-only MVP)

## Goal

Add a visually attractive single-page web UI to the Foundry Request Board app so a user can paste/type a request and run the existing deterministic classifier directly in the browser (no backend HTTP API) and review recent results.

## Non-goals (MVP)

- No backend HTTP API and no server-side execution.
- No persistence beyond in-memory history (no localStorage/sessionStorage).
- No authentication, multi-user features, or sharing.
- No telemetry/analytics.
- No requirement to adopt an external component library; the EPAM UUI site is **visual inspiration only**.

## Mode

Greenfield feature on a brownfield repository (hybrid).

## Constraints (non-negotiable for MVP)

- **No backend required** for the MVP: classification runs **100% in the browser**.
- UI must use the existing classifier logic (module: `src/requestClassifier.js`, function: `classifyRequest(requestText)`), bundled for the browser.
- No persistence requirement for MVP: history is **in-memory only**.
- Avoid requiring an external component library (inspiration only: https://uui.epam.com/).

## Users and primary use case

- **User**: developer/operator using Foundry Request Board to triage a change request.
- **Primary flow**:
  1. Enter request text.
  2. Click **Classify**.
  3. See key badges (type/risk/mode) + pretty JSON output.
  4. Optionally copy JSON.
  5. Optionally click a prior history item to reload.

## UX requirements (MVP)

### Layout

Single-page app with a modern, card-based layout:

- Header: app name + short tagline.
- Main content area (two-column on desktop; single-column on narrow screens):
  - **Input card**
    - Text area for request text (multi-line).
    - (Optional) language toggle (see “Optional UX”).
    - Primary button: **Classify**.
    - Secondary action: **Clear** (optional).
  - **Output card**
    - Badge row (type, risk, mode).
    - JSON output viewer (pretty-printed) for the current result.
    - Button: **Copy JSON**.
- Sidebar / history panel:
  - List of recent classifications, newest first.
  - Each item shows a short preview (first N chars), plus key badges or icons.
  - Clicking an item reloads its input text + output.

### Visual design

- “Vistoso” / modern: spacing, typography hierarchy, subtle shadows, rounded corners.
- Avoid external UI kit dependency for MVP; custom CSS is acceptable.
- Responsive: usable on typical laptop width; degrades to single column on mobile widths.

### Accessibility (baseline)

- Keyboard navigable:
  - Tab order reaches input, buttons, history items.
  - History items are accessible (e.g., `<button>` or ARIA role) and activatable via Enter/Space.
- Readable contrast for text; no essential info conveyed only by color.
- Text area and buttons have accessible labels.

### Optional UX (explicitly optional for MVP)

- Language toggle:
  - If included: only changes placeholder/help text labels (not classifier behavior) unless explicitly specified later.
  - If not included: omit without penalty.
- Light/dark theme toggle:
  - If included: persist theme preference is **out-of-scope** for MVP.

## Functional requirements

### FR-001 Classify request in browser

- When user clicks **Classify** (or presses Ctrl/Cmd+Enter if implemented), UI calls `classifyRequest(requestText)`.
- UI renders the returned object as:
  - Badge summary (type/risk/mode)
  - Pretty-printed JSON output

### FR-002 In-memory history

- Every successful classification appends an entry to an in-memory list.
- Ordering: newest first.
- Clicking a history entry restores:
  - input text
  - displayed classification

Suggested history entry shape (implementation detail; may vary):
- `timestamp`
- `inputText`
- `result` (classifier output)

### FR-003 Copy JSON to clipboard

- **Copy JSON** copies the current output JSON string to the clipboard.
- On success: show non-intrusive feedback (toast, inline message, or button text change).

### FR-004 Input validation

- If input is empty/whitespace:
  - do not call classifier
  - show a clear inline validation message

### FR-005 Error handling

- Clipboard copy failure:
  - show an error message with a recovery hint (e.g., “Copy failed; select and copy manually”).

## Error handling (consolidated)

- Empty/invalid input: inline validation; do not classify.
- Clipboard errors: visible feedback + recovery hint.
- Unexpected runtime errors (defensive):
  - show a generic non-technical error message in the output card
  - keep the previous successful result in history (do not corrupt history state)

## Non-functional requirements

- Fast interaction (no perceived delay for typical request texts).
- No network calls required for classification.
- Keep bundle size reasonable for a demo; avoid heavy dependencies.

## Performance constraints

- Classification of typical request texts (a few KB) should feel instantaneous (< ~100ms on a typical laptop).
- UI interactions (typing, scrolling history) should remain smooth with at least ~50 history entries.

## Security notes

- No secrets: do not include API keys/tokens in the frontend.
- No required network calls for the MVP classification flow.
  - If Vite dev server performs live reload / asset fetches, that is acceptable; the app must not call external services.
- Avoid rendering untrusted input as HTML. Treat request text as plain text.

## Tech decisions (governed)

### TD-001 Packaging strategy: 4B bundler/dev server

- Chosen strategy: **4B = use bundler/dev server; prefer Vite**.
- Expected scripts (to be implemented later; not created by this spec):
  - `npm run dev`
  - `npm run build`
  - `npm run preview`

**Governance note:** adding Vite changes build tooling and `package.json` and must receive Governance approval at execution time.

### TD-002 Browser execution

- Classifier module must be bundled for browser execution (no Node-only APIs).

### TD-003 CommonJS -> ESM compatibility note (implementation guidance)

The existing classifier is CommonJS (`src/requestClassifier.js`). Vite’s browser pipeline is ESM-first.

Implementation guidance (one acceptable approach):

- Keep `src/requestClassifier.js` intact for Node/Jest compatibility.
- Add a small ESM wrapper module for the UI, e.g. `ui/lib/requestClassifier.browser.mjs` (name/location may vary), which imports/adapts the CommonJS export to an ESM `export function classifyRequest(...)`.
- If direct import of the CommonJS module works in Vite without wrapper, wrapper may be skipped; however, the solution must preserve Node/Jest compatibility.

This is guidance, not a hard requirement on exact filenames.

## Out of scope (MVP)

- Any backend HTTP API or server-side classification.
- Persistence beyond runtime memory:
  - localStorage/sessionStorage persistence is a **stretch goal** (explicitly out-of-scope for MVP).
- Authentication, multi-user, sharing.
- ML-based classification.
- Advanced analytics/telemetry.

## Acceptance criteria

AC-UI-001 Single-page UI exists and runs locally
- A user can start a dev server (bundler) and open the UI in a browser.

AC-UI-002 Classification works fully in browser
- With dev tools network tab open, classification works without any required API calls.

AC-UI-003 Output rendering
- After classification, UI shows:
  - type badge
  - risk badge
  - mode badge
  - pretty JSON result matching the classifier output

AC-UI-004 History behavior
- After multiple classifications:
  - history shows entries newest-first
  - clicking an entry restores the input and output

AC-UI-005 Copy JSON behavior
- Copy button copies exactly the JSON shown for the current output.

AC-UI-006 Error states
- Empty input produces a visible validation message.
- Clipboard failure produces a visible error message.

AC-UI-007 Basic accessibility
- User can tab through interactive elements and activate history entries via keyboard.

## Traceability

- Depends on classifier spec/behavior: `docs/40-specs/SPC-001-foundry-request-classification.md`
