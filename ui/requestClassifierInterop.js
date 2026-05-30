// Interop helper: load CJS classifier into the browser (Vite-bundled).
// NOTE: src/requestClassifier.js is CommonJS (module.exports). We must not edit it.
// Vite can import CJS and expose exports on the default export.

export async function loadClassifierExports() {
  const mod = await import('../src/requestClassifier.js');

  // Prefer direct named export if Vite provides it, else use default wrapper.
  // For CJS, Vite typically maps module.exports to `default`.
  const cjs = mod && mod.default ? mod.default : mod;

  if (!cjs || typeof cjs.classifyRequest !== 'function') {
    throw new Error(
      'Could not resolve classifyRequest export from src/requestClassifier.js (CJS/ESM interop failed)'
    );
  }

  return {
    classifyRequest: cjs.classifyRequest
  };
}
