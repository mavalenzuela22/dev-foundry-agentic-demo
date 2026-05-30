import './styles.css';
import { loadClassifierExports } from './requestClassifierInterop.js';

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatTime(ts) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleTimeString();
  }
}

const SAMPLE_TEXT =
  'Update the README documentation for security guidance. No code changes.';

const state = {
  classifyRequest: null,
  history: [],
  activeId: null,
  status: { kind: 'loading', message: 'Loading classifier…' }
};

function pick(obj, keys) {
  if (!obj || typeof obj !== 'object') return undefined;
  for (const k of keys) {
    if (k in obj) return obj[k];
  }
  return undefined;
}

function toBadgeValue(v) {
  if (v == null) return '';
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
    return String(v);
  }
  if (Array.isArray(v)) {
    const parts = v
      .slice(0, 4)
      .map((x) => (typeof x === 'string' ? x : JSON.stringify(x)))
      .filter(Boolean);
    return parts.length ? parts.join(', ') : '';
  }
  return '';
}

function inferBadges(result) {
  if (!result || typeof result !== 'object') return [];

  const badges = [];

  const primary = pick(result, [
    'route',
    'decision',
    'classification',
    'category',
    'type',
    'intent'
  ]);
  const confidence = pick(result, ['confidence', 'score', 'probability']);
  const risk = pick(result, ['risk', 'sensitivity', 'security', 'danger']);

  if (primary != null) {
    const val = toBadgeValue(primary);
    if (val) badges.push({ label: 'Class', value: val, tone: 'accent' });
  }

  if (confidence != null) {
    const val = toBadgeValue(confidence);
    if (val) badges.push({ label: 'Confidence', value: val, tone: 'neutral' });
  }

  if (risk != null) {
    const val = toBadgeValue(risk);
    if (val) badges.push({ label: 'Risk', value: val, tone: 'warn' });
  }

  // Add a few extra primitive badges (best-effort to stay useful if shape changes)
  for (const [k, v] of Object.entries(result)) {
    if (badges.length >= 6) break;
    if (
      k === 'route' ||
      k === 'decision' ||
      k === 'classification' ||
      k === 'category' ||
      k === 'type' ||
      k === 'intent' ||
      k === 'confidence' ||
      k === 'score' ||
      k === 'probability' ||
      k === 'risk' ||
      k === 'sensitivity' ||
      k === 'security' ||
      k === 'danger'
    ) {
      continue;
    }

    const val = toBadgeValue(v);
    if (!val) continue;

    const label = k.length > 16 ? `${k.slice(0, 16)}…` : k;
    badges.push({ label, value: val, tone: 'neutral' });
  }

  return badges;
}

function setStatus(kind, message) {
  state.status = { kind, message };

  const statusEl = document.getElementById('status-text');
  if (statusEl) statusEl.textContent = message;

  const dot = document.getElementById('status-dot');
  if (dot) dot.setAttribute('data-kind', kind);

  const btn = document.getElementById('classify-btn');
  if (btn) btn.disabled = kind === 'loading' || kind === 'classifying';

  const input = document.getElementById('request-input');
  if (input) input.disabled = kind === 'loading';
}

function renderShell(rootEl) {
  rootEl.innerHTML = `
    <div class="page">
      <header class="header">
        <div class="brand">
          <div class="logo" aria-hidden="true">FR</div>
          <div class="brandText">
            <h1>Foundry Request Board</h1>
            <p class="subtitle">Classify a request. View results + session history.</p>
          </div>
        </div>
        <div class="statusPill" aria-live="polite">
          <span class="statusDot" data-kind="loading" id="status-dot"></span>
          <span id="status-text">Loading…</span>
        </div>
      </header>

      <main class="grid" role="main">
        <section class="card card--input" aria-label="Input">
          <div class="cardTop">
            <h2>Request</h2>
            <span class="pill">MVP</span>
          </div>

          <label class="field">
            <span class="fieldLabel">Paste or type a request</span>
            <textarea
              id="request-input"
              class="textarea"
              rows="10"
              placeholder="e.g. Please update the documentation and do not change any code."
              autocomplete="off"
              spellcheck="true"
            ></textarea>
          </label>

          <div class="actions">
            <button id="classify-btn" class="btn btnPrimary" type="button">Classify</button>
            <button id="sample-btn" class="btn btnGhost" type="button">Use sample</button>
            <button id="clear-btn" class="btn btnGhost" type="button">Clear</button>
          </div>

          <p class="hint">
            Tip: <span class="kbd">Ctrl</span> + <span class="kbd">Enter</span> to classify.
          </p>
        </section>

        <section class="card card--result" aria-label="Output">
          <div class="cardTop">
            <h2>Output</h2>
            <div id="result-badges" class="badgeRow" aria-label="Result badges">
              <span class="badge badge--neutral" aria-label="Type badge placeholder">
                <span class="badgeLabel">Type</span><span class="badgeValue">—</span>
              </span>
              <span class="badge badge--neutral" aria-label="Risk badge placeholder">
                <span class="badgeLabel">Risk</span><span class="badgeValue">—</span>
              </span>
              <span class="badge badge--neutral" aria-label="Mode badge placeholder">
                <span class="badgeLabel">Mode</span><span class="badgeValue">—</span>
              </span>
            </div>
          </div>

          <pre
            id="result-json"
            class="codeblock"
            aria-label="JSON viewer"
            aria-live="polite"
            tabindex="0"
          >No output yet.</pre>

          <div class="resultActions" aria-label="Output actions">
            <button
              id="copy-json-btn"
              class="btn btnGhost"
              type="button"
              aria-label="Copy JSON (coming soon)"
              title="Copy JSON (wiring coming in a later task)"
            >
              Copy JSON
            </button>
          </div>
        </section>

        <section class="card card--history" aria-label="History">
          <div class="cardTop">
            <h2>History</h2>
            <span class="meta" id="history-count">0</span>
          </div>

          <p class="hint" id="history-hint">Select an item to reload the output.</p>
          <ul id="history-list" class="historyList" aria-label="Session history"></ul>
          <div id="history-empty" class="emptyState">
            No history yet. Run a classification to see it here.
          </div>
        </section>
      </main>

      <footer class="footer">
        <span class="muted">Browser-only. No network calls.</span>
      </footer>
    </div>
  `;
}

function setResultView(payload) {
  const jsonEl = document.getElementById('result-json');
  const badgesEl = document.getElementById('result-badges');
  if (!jsonEl || !badgesEl) return;

  badgesEl.innerHTML = '';

  if (!payload) {
    jsonEl.textContent = '';
    return;
  }

  const { input, result, error } = payload;

  if (error) {
    const msg = String(error && error.stack ? error.stack : error);
    badgesEl.innerHTML =
      '<span class="badge badge--warn"><span class="badgeLabel">Error</span><span class="badgeValue">Check output</span></span>';
    jsonEl.innerHTML = escapeHtml(
      JSON.stringify({ input, error: msg }, null, 2)
    );
    return;
  }

  const badges = inferBadges(result);
  badgesEl.innerHTML = badges
    .map(
      (b) =>
        `<span class="badge badge--${b.tone}"><span class="badgeLabel">${escapeHtml(
          b.label
        )}</span><span class="badgeValue">${escapeHtml(b.value)}</span></span>`
    )
    .join('');

  jsonEl.innerHTML = escapeHtml(JSON.stringify({ input, result }, null, 2));
}

function renderHistory() {
  const listEl = document.getElementById('history-list');
  const emptyEl = document.getElementById('history-empty');
  const countEl = document.getElementById('history-count');

  if (countEl) countEl.textContent = String(state.history.length);

  if (!listEl || !emptyEl) return;

  if (state.history.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = 'block';
    return;
  }

  emptyEl.style.display = 'none';

  listEl.innerHTML = state.history
    .map((item) => {
      const isActive = item.id === state.activeId;
      const title = item.input.trim().replace(/\s+/g, ' ').slice(0, 120);
      const subtitle = `${formatTime(item.ts)} • ${
        item.badges?.[0]?.value ? item.badges[0].value : 'Result'
      }`;

      return `
        <li class="historyItem" data-id="${escapeHtml(item.id)}">
          <button type="button" class="historyButton" aria-pressed="${
            isActive ? 'true' : 'false'
          }">
            <div class="historyTitle">${escapeHtml(title || '(empty)')}</div>
            <div class="historyMeta">${escapeHtml(subtitle)}</div>
          </button>
        </li>
      `;
    })
    .join('');
}

function getActiveItem() {
  if (!state.activeId) return null;
  return state.history.find((h) => h.id === state.activeId) || null;
}

function setActiveHistory(id) {
  state.activeId = id;
  const active = getActiveItem();
  if (active) setResultView(active);
  renderHistory();
}

async function classifyNow(text) {
  if (!state.classifyRequest) {
    setStatus('error', 'Classifier not loaded');
    return;
  }

  const trimmed = String(text || '').trim();
  if (!trimmed) {
    setStatus('idle', 'Enter a request to classify');
    return;
  }

  setStatus('classifying', 'Classifying…');

  try {
    const result = state.classifyRequest(trimmed);
    const item = {
      id: makeId(),
      ts: Date.now(),
      input: trimmed,
      result,
      badges: inferBadges(result)
    };

    state.history = [item, ...state.history].slice(0, 50);
    state.activeId = item.id;

    setResultView(item);
    renderHistory();
    setStatus('ready', 'Ready');
  } catch (err) {
    const payload = { id: makeId(), ts: Date.now(), input: trimmed, error: err };
    state.history = [payload, ...state.history].slice(0, 50);
    state.activeId = payload.id;

    setResultView(payload);
    renderHistory();
    setStatus('error', 'Classification error');
  }
}

function bindEvents() {
  const input = document.getElementById('request-input');
  const classifyBtn = document.getElementById('classify-btn');
  const sampleBtn = document.getElementById('sample-btn');
  const clearBtn = document.getElementById('clear-btn');
  const historyList = document.getElementById('history-list');

  if (sampleBtn && input) {
    sampleBtn.addEventListener('click', () => {
      input.value = SAMPLE_TEXT;
      input.focus();
      setStatus('ready', 'Sample inserted');
    });
  }

  if (clearBtn && input) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      input.focus();
      setResultView(null);
      setStatus('ready', 'Cleared');
    });
  }

  if (classifyBtn && input) {
    classifyBtn.addEventListener('click', () => classifyNow(input.value));
  }

  if (input) {
    input.addEventListener('keydown', (e) => {
      const isEnter = e.key === 'Enter';
      const isAccel = e.ctrlKey || e.metaKey;
      if (isEnter && isAccel) {
        e.preventDefault();
        classifyNow(input.value);
      }
    });
  }

  if (historyList) {
    historyList.addEventListener('click', (e) => {
      const btn = e.target?.closest?.('button.historyButton');
      if (!btn) return;
      const li = btn.closest('li.historyItem');
      const id = li?.getAttribute('data-id');
      if (!id) return;
      setActiveHistory(id);
    });
  }
}

async function init() {
  const app = document.getElementById('app');
  if (!app) throw new Error('Missing #app root element');

  renderShell(app);
  bindEvents();
  setStatus('loading', 'Loading classifier…');

  try {
    const { classifyRequest } = await loadClassifierExports();
    state.classifyRequest = classifyRequest;
    setStatus('ready', 'Ready');

    // Seed result panel with a friendly hint
    setResultView({
      input: '(hint)',
      result: { message: 'Paste a request and click “Classify”.' }
    });
  } catch (err) {
    setStatus('error', 'Classifier failed to load');
    setResultView({ input: '(init)', error: err });
  }
}

init();
