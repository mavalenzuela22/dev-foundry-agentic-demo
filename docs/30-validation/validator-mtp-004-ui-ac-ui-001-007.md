# Validation Report: MTP-004 MT-013 — Frontend UI (AC-UI-001..AC-UI-007)

- Governing spec: `docs/40-specs/SPC-002-frontend-ui.md`
- Micro-task pack: `docs/60-microtasks/MTP-004-frontend-ui.md`
- Micro-task: **MT-013 — Validator: automated checks + manual UI verification checklist**

## Scope

Validate (as evidence) whether the implemented UI meets `SPC-002` acceptance criteria **AC-UI-001..AC-UI-007**.

## Environment / execution constraints (limitation)

Initial verdicts were based on **read-only static inspection** of repository files. The validator could not independently:

- run `npm` commands (e.g., `npm test`, `npm run build`, `npm run dev`)
- open a browser to perform manual UI verification
- produce authoritative repo-wide allowlist proof (no `git diff` / `git status` evidence)

However, **post-run runtime evidence** (screenshots) was provided by the user for AC-UI-001 and AC-UI-002. See **Evidence sources**.

## Evidence sources

User-provided runtime evidence (attachments):

- Command used: `npm run preview`
- App URL: `http://localhost:4173`
- Browser screenshot: `/attachments/2cf157bc-446a-4b0b-84b0-cd09922127f2/image_20260530_215515_2843KB.png`
- OS screenshot (device identifiers redacted/omitted): `/attachments/2cf157bc-446a-4b0b-84b0-cd09922127f2/image_20260530_215525_4110KB.png`
- App + DevTools Network screenshot: `/attachments/2cf157bc-446a-4b0b-84b0-cd09922127f2/image_20260530_215546_40170KB.png`

## Static evidence reviewed

Files reviewed (static only):

- `package.json`
- `index.html`
- `ui/main.js`
- `ui/requestClassifierInterop.js`
- `ui/styles.css`
- `src/requestClassifier.js`

## Acceptance criteria verdicts (per AC)

| AC ID | Verdict | Basis |
|---|---|---|
| AC-UI-001 | PASS | User-provided runtime evidence: `npm run preview` serving `http://localhost:4173` + browser/OS screenshots (see Evidence sources). |
| AC-UI-002 | PASS | User-provided DevTools Network evidence (Fetch/XHR filter) shows no requests during/after Classify (see Evidence sources). |
| AC-UI-003 | PASS | Static inspection confirms badges + pretty JSON rendered from classifier result. |
| AC-UI-004 | PASS | Static inspection confirms newest-first history + reload-on-click without re-running classifier. |
| AC-UI-005 | PASS | Static inspection confirms Copy JSON uses the currently displayed JSON text state. |
| AC-UI-006 | PASS | Static inspection confirms empty-input message and clipboard failure messaging with recovery hint. |
| AC-UI-007 | PASS | Static inspection confirms baseline a11y hooks (labels, keyboard-activatable history, aria-live/atomic). |

## Per-AC notes and required missing evidence

### AC-UI-001 — Dev server runs; page loads

- Verdict: **PASS**
- Runtime evidence (user-provided):
  - Command: `npm run preview`
  - URL: `http://localhost:4173`
  - Browser: Google Chrome 148.0.7778.216 (arm64) — screenshot: `/attachments/2cf157bc-446a-4b0b-84b0-cd09922127f2/image_20260530_215515_2843KB.png`
  - OS: macOS Tahoe 26.4.1 on MacBook Pro 13-inch M2 2022 (serial number not recorded) — screenshot: `/attachments/2cf157bc-446a-4b0b-84b0-cd09922127f2/image_20260530_215525_4110KB.png`
  - App visible running at `localhost:4173` — screenshot: `/attachments/2cf157bc-446a-4b0b-84b0-cd09922127f2/image_20260530_215546_40170KB.png`

### AC-UI-002 — Classification works in-browser; no required network calls

- Verdict: **PASS**
- Static confirmation (from prior inspection):
  - Classification path appears to be local-only (dynamic import of `../src/requestClassifier.js`).
  - No Fetch/XHR/WebSocket usage observed in the classification path.
- Runtime evidence (user-provided):
  - App running at `http://localhost:4173` (via `npm run preview`).
  - Chrome DevTools **Network** tab with **Fetch/XHR** filter shows an empty request list during/after Classify, indicating no network calls are required for classification.
  - Screenshot: `/attachments/2cf157bc-446a-4b0b-84b0-cd09922127f2/image_20260530_215546_40170KB.png`

### AC-UI-003 — Badges + pretty JSON shown

- Verdict: **PASS (static)**
- Basis: badges and formatted JSON are rendered directly from the classifier result via stringification in UI.

### AC-UI-004 — History newest-first; click reload works

- Verdict: **PASS (static)**
- Basis: in-memory history is maintained newest-first; clicking a history entry restores prior input/output without re-running classification.

### AC-UI-005 — Copy JSON copies expected JSON

- Verdict: **PASS (static)**
- Basis: Copy JSON uses the same state text used for the currently rendered JSON output.

### AC-UI-006 — Empty input message; clipboard failure message

- Verdict: **PASS (static)**
- Basis: empty/whitespace input short-circuits with a visible message; clipboard failure results in visible error messaging plus recovery hint.

### AC-UI-007 — Baseline accessibility

- Verdict: **PASS (static)**
- Basis: textarea/buttons are labeled; history items are buttons (keyboard activatable); aria-live/atomic patterns are present for output.

## Risks / gaps (due to constraints)

- Validator still cannot independently reproduce runtime behavior; AC-UI-001/002 rely on user-provided screenshots (paths recorded above).
- Cannot prove repo-wide allowlist compliance without `git diff`/`git status` evidence.

## Validator read-only evidence packet (normalized)

- Overall result: **PASS** (based on static inspection + user-provided runtime screenshots)
- AC verdicts:
  - AC-UI-001: PASS (user-provided `npm run preview` @ `http://localhost:4173` + browser/OS + runtime UI screenshot; see Evidence sources)
  - AC-UI-002: PASS (user-provided DevTools Network screenshot showing no Fetch/XHR requests during/after Classify; see Evidence sources)
  - AC-UI-003: PASS (static) — badges + pretty JSON stringified directly from classifier result
  - AC-UI-004: PASS (static) — history newest-first and reload-on-click restores input/output without re-running classifier
  - AC-UI-005: PASS (static) — Copy JSON uses state.currentJsonText (exact JSON shown)
  - AC-UI-006: PASS (static) — empty input validation message; clipboard failure message with recovery hint
  - AC-UI-007: PASS (static) — baseline a11y: textarea/buttons labeled; history items are buttons and keyboard-activatable; aria-live/atomic used
- Static confirmation: no fetch/XHR/WebSocket used in classification path; classifier loaded locally via dynamic import `../src/requestClassifier.js`
- Risks/gaps: cannot prove runs locally or network-tab behavior without runtime; cannot prove allowlist compliance repo-wide without git diff/status.
