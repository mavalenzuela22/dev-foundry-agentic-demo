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
  status: { kind: 'loading', message: 'Loading classifier…' },
  currentPayload: null,
  currentJsonText: ''
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
  // Acceptance criteria expects: Type / Risk / Mode badges.
  // The classifier output shape may evolve, so this is a best-effort mapper.
  if (!result || typeof result !== 'object') {
    return {
      type: { label: 'Type', value: '—', tone: 'neutral' },
      risk: { label: 'Risk', value: '—', tone: 'neutral' },
      mode: { label: 'Mode', value: '—', tone: 'neutral' }
    };
  }

  const typeVal = toBadgeValue(
    pick(result, ['type', 'category', 'classification', 'route', 'intent', 'decision'])
  );
  const riskVal = toBadgeValue(
    pick(result, ['risk', 'sensitivity', 'security', 'danger', 'level'])
  );
  const modeVal = toBadgeValue(
    pick(result, ['mode', 'action', 'strategy', 'operation', 'policy'])
  );

  const riskTone =
    riskVal && /high|critical|severe/i.test(riskVal)
      ? 'warn'
      : riskVal && /low|none|minimal/i.test(riskVal)
        ? 'ok'
        : 'neutral';

  return {
    type: {
      label: 'Type',
      value: typeVal || '—',
      tone: typeVal ? 'accent' : 'neutral'
    },
    risk: {
      label: 'Risk',
      value: riskVal || '—',
      tone: riskVal ? riskTone : 'neutral'
    },
    mode: {
      label: 'Mode',
      value: modeVal || '—',
      tone: modeVal ? 'neutral' : 'neutral'
    }
  };
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

function setInputValidation(message) {
  const msg = String(message || '');
  const el = document.getElementById('input-validation');
  const input = document.getElementById('request-input');
  if (el) {
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
  }
  if (input) {
    if (msg) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }
}

function setCopyFeedback(kind, message) {
  const el = document.getElementById('copy-feedback');
  if (!el) return;
  el.textContent = String(message || '');
  el.setAttribute('data-kind', kind || '');
  if (message) {
    window.clearTimeout(setCopyFeedback._t);
    setCopyFeedback._t = window.setTimeout(() => {
      const el2 = document.getElementById('copy-feedback');
      if (!el2) return;
      el2.textContent = '';
      el2.setAttribute('data-kind', '');
    }, 1600);
  }
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

          <label class="field" for="request-input">
            <span class="fieldLabel" id="request-input-label">Paste or type a request</span>
            <textarea
              id="request-input"
              class="textarea"
              rows="10"
              placeholder="e.g. Please update the documentation and do not change any code."
              autocomplete="off"
              spellcheck="true"
              aria-labelledby="request-input-label"
              aria-describedby="input-validation"
            ></textarea>
            <div id="input-validation" class="inlineValidation" role="status" aria-live="polite" style="display:none"></div>
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
            <div id="result-badges" class="badgeRow" aria-label="Result badges"></div>
          </div>

          <pre
            id="result-json"
            class="codeblock"
            aria-label="JSON viewer"
            aria-live="polite"
            tabindex="0"
          >No output yet.</pre>

          <div class="resultActions" aria-label="Output actions">
            <div id="copy-feedback" class="copyFeedback" role="status" aria-live="polite"></div>
            <button
              id="copy-json-btn"
              class="btn btnGhost"
              type="button"
              aria-label="Copy JSON"
              title="Copy JSON"
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

function renderBadges(result) {
  const badgesEl = document.getElementById('result-badges');
  if (!badgesEl) return;

  const badges = inferBadges(result);
  const items = [badges.type, badges.risk, badges.mode].filter(Boolean);

  badgesEl.innerHTML = items
    .map((b) => {
      const tone = b.tone || 'neutral';
      const label = escapeHtml(b.label || '');
      const value = escapeHtml(b.value || '');
      return `
        <span class="badge badge--${tone}" aria-label="${label}: ${value}">
          <span class="badgeLabel">${label}</span>
          <span class="badgeValue">${value}</span>
        </span>
      `;
    })
    .join('');
}

function setResultView(payload) {
  const jsonEl = document.getElementById('result-json');
  if (!jsonEl) return;

  state.currentPayload = payload || null;

  if (!payload) {
    state.currentJsonText = '';
    jsonEl.textContent = 'No output yet.';
    renderBadges(null);
    return;
  }

  const { result, error } = payload;

  if (error) {
    const msg = String(error && error.stack ? error.stack : error);
    state.currentJsonText = JSON.stringify({ error: msg }, null, 2);
    jsonEl.textContent = state.currentJsonText;
    renderBadges(null);
    return;
  }

  // AC-UI-003: JSON viewer must match the classifier output object exactly.
  state.currentJsonText = JSON.stringify(result, null, 2);
  jsonEl.textContent = state.currentJsonText;
  renderBadges(result);
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
    .map((item, idx) => {
      const isActive = item.id === state.activeId;
      const title = item.input.trim().replace(/\s+/g, ' ').slice(0, 120);
      const subtitle = `${formatTime(item.ts)} • Activate to load`;

      const badgeInfo = inferBadges(item.result);
      const previewBadges = [badgeInfo.type, badgeInfo.risk, badgeInfo.mode]
        .filter(Boolean)
        .map((b) => {
          const tone = b.tone || 'neutral';
          return `
            <span class="miniBadge miniBadge--${tone}">
              <span class="miniBadgeLabel">${escapeHtml(b.label)}:</span>
              <span class="miniBadgeValue">${escapeHtml(b.value)}</span>
            </span>
          `;
        })
        .join('');

      const ariaLabel = `History item ${idx + 1}. ${title || 'Empty request'}.`;

      return `
        <li class="historyItem" data-id="${escapeHtml(item.id)}">
          <button
            type="button"
            class="historyButton"
            aria-pressed="${isActive ? 'true' : 'false'}"
            aria-label="${escapeHtml(ariaLabel)}"
          >
            <div class="historyTitle">${escapeHtml(title || '(empty)')}</div>
            <div class="historyBadges" aria-hidden="true">${previewBadges}</div>
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
  if (active) {
    const input = document.getElementById('request-input');
    if (input) input.value = active.input || '';
    setResultView(active);
    setInputValidation('');
  }
  renderHistory();
}

async function classifyNow(text) {
  if (!state.classifyRequest) {
    setStatus('error', 'Classifier not loaded');
    return;
  }

  const trimmed = String(text || '').trim();
  if (!trimmed) {
    setInputValidation('Please enter a request before classifying.');
    setStatus('idle', 'Enter a request to classify');
    return;
  }

  setInputValidation('');
  setCopyFeedback('', '');
  setStatus('classifying', 'Classifying…');

  try {
    const result = state.classifyRequest(trimmed);
    const item = {
      id: makeId(),
      ts: Date.now(),
      input: trimmed,
      result
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
      setInputValidation('');
      setStatus('ready', 'Sample inserted');
    });
  }

  if (clearBtn && input) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      input.focus();
      setInputValidation('');
      setCopyFeedback('', '');
      setResultView(null);
      setStatus('ready', 'Cleared');
    });
  }

  const copyBtn = document.getElementById('copy-json-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const text = String(state.currentJsonText || '');
      if (!text) {
        setCopyFeedback('error', 'Nothing to copy');
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopyFeedback('ok', 'Copied');
      } catch {
        try {
          // Fallback for restricted environments
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand('copy');
          document.body.removeChild(ta);
          if (!ok) throw new Error('execCommand copy failed');
          setCopyFeedback('ok', 'Copied');
        } catch {
          setCopyFeedback('error', 'Copy failed');
        }
      }
    });
  }

  if (classifyBtn && input) {
    classifyBtn.addEventListener('click', () => classifyNow(input.value));
  }

  if (input) {
    input.addEventListener('input', () => {
      // Clear inline validation as the user types.
      const v = String(input.value || '').trim();
      if (v) setInputValidation('');
    });

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
      result: {
        message: 'Paste a request and click “Classify”.',
        note: 'Tip: Ctrl/⌘ + Enter to classify.'
      }
    });
  } catch (err) {
    setStatus('error', 'Classifier failed to load');
    setResultView({ error: err });
  }
}

init();
