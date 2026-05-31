'use strict';

/**
 * Pure deterministic classifier for software change requests.
 *
 * Output shape:
 * {
 *   type: 'documentation' | 'code' | 'mixed' | 'unknown',
 *   risk: 'low' | 'medium' | 'unknown',
 *   mode: 'bounded_execution_ready' | 'needs_review',
 *   reason: string
 * }
 */

function detectDocumentationSignals(normalizedText) {
  // Require explicit documentation intent words to avoid false positives.
  // Examples: "update docs", "README", "documentation".
  const docPatterns = [
    /\bdoc(s|umentation)?\b/,
    /\bdocumentaci[oó]n\b/,
    /\breadme\b/,
    /\bchangelog\b/,
    /\bcontributing\b/,
    /\bmd\b/, // e.g., "update the .md file" (weak but explicit)
    /\bwiki\b/,
    /\buser guide\b/,
    /\bmanual\b/,
    /\badd examples\b/,
    /\bupdate (the )?(docs|documentation|readme)\b/,
    /\bfix typo\b/,
    /\btypo(s)?\b/
  ];

  return docPatterns.some((re) => re.test(normalizedText));
}

function detectCodeSignals(normalizedText) {
  // Any explicit non-documentation work should prevent documentation-only classification.
  // NOTE: security-related handling is implemented separately (see detectSecuritySignals)
  // to allow the doc-only security exception to take precedence.

  // Explicit negation phrases: do not treat these as code intent.
  // This prevents false positives from the standalone token "code" (e.g., "No code changes.").
  const negatedCodeIntentPatterns = [
    /\bno code changes\b/g,
    /\bno code change\b/g,
    /\bwithout code changes\b/g,
    /\bwithout code change\b/g,
    /\bsin cambios de c[oó]digo\b/g
  ];

  const codePatterns = [
    /\bcode\b/,
    /\bimplement\b/,
    /\brefactor\b/,
    /\bbug\b/,
    /\bfix\b/, // e.g., "fix the API" (mixed); doc-only requests can say "fix typo" handled above
    /\bfeature\b/,
    /\bapi\b/,
    /\bendpoint\b/,
    /\bui\b/,
    /\bfrontend\b/,
    /\bbackend\b/,
    /\bdatabase\b/,
    /\bsql\b/,
    /\bmigration\b/,
    /\btest(s)?\b/,
    /\bunit test(s)?\b/,
    /\bintegration test(s)?\b/,
    /\bperformance\b/,
    /\bconfig(uration)?\b/,
    /\bpackage\.json\b/,
    /\bdependency|dependencies\b/,
    /\bnpm\b|\bpnpm\b|\byarn\b/,
    /\bbuild\b/,
    /\bdeploy\b/,
    /\brelease\b/,
    /\bscript\b/,
    /\bcli\b/,
    /\btypescript\b/,
    /\bjavascript\b/,
    /\bnode\b/,
    /\breact\b/,
    /\bexpress\b/,
    /\bserver\b/,
    /\broute(s)?\b/,
    /\bcontroller(s)?\b/,
    /\bservice(s)?\b/,
    /\bmodel(s)?\b/
  ];

  // Avoid treating "fix typo" as code work
  let withoutFixTypo = normalizedText.replace(/\bfix typo(s)?\b/g, '');

  // Suppress code intent from explicit negation phrases.
  for (const re of negatedCodeIntentPatterns) {
    withoutFixTypo = withoutFixTypo.replace(re, '');
  }

  return codePatterns.some((re) => re.test(withoutFixTypo));
}

function detectSecuritySignals(normalizedText) {
  // Security signals per SPC-001 delta (case-insensitive substring match).
  const securitySignals = [
    'security',
    'seguridad',
    'ciberseguridad',
    'vulnerability',
    'vulnerabilidad',
    'hardening'
  ];

  return securitySignals.some((signal) => normalizedText.includes(signal));
}

function detectSecurityDocOnlyExceptionNegatives(normalizedText) {
  // If any of these appear, the doc-only security exception must NOT apply.
  // Use regexes with word boundaries where appropriate to reduce accidental matches.
  const negativePatterns = [
    /remediaci[oó]n/, // remediación / remediacion
    /\bvulnerabilidad\b/,
    /\bhardening\b/,
    /implementaci[oó]n/, // implementación / implementacion
    /\bendpoint\b/,
    /\bapi\b/,
    /\bauth\b/,
    /\bpermisos\b/
  ];

  return negativePatterns.some((re) => re.test(normalizedText));
}

function classifyRequest(requestText) {
  const text = typeof requestText === 'string' ? requestText : '';
  const normalized = text.toLowerCase();

  const hasDocSignals = detectDocumentationSignals(normalized);
  const hasCodeSignals = detectCodeSignals(normalized);
  const hasSecuritySignals = detectSecuritySignals(normalized);

  // Doc-only security exception MUST have precedence over security escalation.
  // Condition: doc intent + security signal + no negatives + no explicit code intent.
  if (
    hasDocSignals &&
    hasSecuritySignals &&
    !hasCodeSignals &&
    !detectSecurityDocOnlyExceptionNegatives(normalized)
  ) {
    return {
      type: 'documentation',
      risk: 'low',
      mode: 'bounded_execution_ready',
      reason:
        'Documentation-only security request (no remediation/implementation intent detected) is low risk and bounded execution ready.'
    };
  }

  // Default security escalation (unless exception applied above).
  if (hasSecuritySignals) {
    return {
      type: 'code',
      risk: 'medium',
      mode: 'needs_review',
      reason:
        'Security-related request detected; defaulting to code classification and needs_review for safety.'
    };
  }

  if (hasDocSignals && !hasCodeSignals) {
    return {
      type: 'documentation',
      risk: 'low',
      mode: 'bounded_execution_ready',
      reason:
        'Documentation-only changes are low risk when bounded to approved documentation files.'
    };
  }

  if (hasDocSignals && hasCodeSignals) {
    return {
      type: 'mixed',
      risk: 'medium',
      mode: 'needs_review',
      reason:
        'Request includes both documentation and non-documentation changes, so it is not documentation-only and requires review.'
    };
  }

  if (hasCodeSignals) {
    return {
      type: 'code',
      risk: 'medium',
      mode: 'needs_review',
      reason: 'Request includes non-documentation changes and requires review.'
    };
  }

  return {
    type: 'unknown',
    risk: 'unknown',
    mode: 'needs_review',
    reason:
      'Request is ambiguous and cannot be confidently classified as documentation-only; requires review.'
  };
}

// Browser/dev-server fallback: expose the classifier on a stable global.
// This supports scenarios where CJS->ESM interop fails under Vite dev.
if (typeof globalThis !== 'undefined') {
  const existing = globalThis.__foundryRequestClassifier;
  if (!existing || typeof existing !== 'object') {
    globalThis.__foundryRequestClassifier = {};
  }

  if (typeof globalThis.__foundryRequestClassifier.classifyRequest !== 'function') {
    globalThis.__foundryRequestClassifier.classifyRequest = classifyRequest;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    classifyRequest
  };
}
