// Interop helper: load CJS classifier into the browser (Vite-bundled).
// NOTE: src/requestClassifier.js is CommonJS (module.exports).
// Vite can import CJS and expose exports on the default export.

export async function loadClassifierExports() {
  const mod = await import('../src/requestClassifier.js');

  // Resolution order:
  // 1) named export (true ESM)
  // 2) default export wrapping CJS module.exports (Vite interop)
  // 3) global fallback (dev-server interop edge cases)
  const classifyRequest =
    (mod && typeof mod.classifyRequest === 'function' && mod.classifyRequest) ||
    (mod && mod.default && typeof mod.default.classifyRequest === 'function'
      ? mod.default.classifyRequest
      : undefined) ||
    (typeof globalThis !== 'undefined' &&
    globalThis.__foundryRequestClassifier &&
    typeof globalThis.__foundryRequestClassifier.classifyRequest === 'function'
      ? globalThis.__foundryRequestClassifier.classifyRequest
      : undefined);

  if (typeof classifyRequest !== 'function') {
    throw new Error(
      'Could not resolve classifyRequest export from src/requestClassifier.js (CJS/ESM interop failed)'
    );
  }

  return { classifyRequest };
}
