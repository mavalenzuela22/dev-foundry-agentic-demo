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

function renderShell(rootEl) {
  rootEl.innerHTML = `
    <div class="page">
      <header class="header">
        <div class="brand">
          <div class="logo" aria-hidden="true">FR</div>
          <div>
            <h1>Foundry Request Board</h1>
            <p class="subtitle">Vite SPA scaffold (browser-only)</p>
          </div>
        </div>
      </header>

      <main class="grid">
        <section class="card">
          <h2>Input (placeholder)</h2>
          <p class="muted">Upcoming: textarea + classify button.</p>
          <div class="pill">MT-006 scaffold</div>
        </section>

        <section class="card">
          <h2>Classifier proof</h2>
          <p class="muted">Runs a sample classification using <code>src/requestClassifier.js</code>.</p>
          <pre id="classifier-output" class="codeblock" aria-live="polite"></pre>
        </section>

        <section class="card">
          <h2>History (placeholder)</h2>
          <p class="muted">Upcoming: in-memory session history.</p>
          <ul class="list">
            <li>Placeholder item A</li>
            <li>Placeholder item B</li>
            <li>Placeholder item C</li>
          </ul>
        </section>
      </main>

      <footer class="footer">
        <span class="muted">No network calls. Runs 100% in the browser.</span>
      </footer>
    </div>
  `;
}

async function runClassifierProof() {
  const outEl = document.getElementById('classifier-output');
  if (!outEl) return;

  try {
    const { classifyRequest } = await loadClassifierExports();

    const sample =
      'Update the README documentation for security guidance. No code changes.';

    const result = classifyRequest(sample);
    outEl.innerHTML = escapeHtml(JSON.stringify({ sample, result }, null, 2));
  } catch (err) {
    outEl.textContent = `Classifier import failed:\n${String(err && err.stack ? err.stack : err)}`;
  }
}

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app root element');

renderShell(app);
runClassifierProof();
