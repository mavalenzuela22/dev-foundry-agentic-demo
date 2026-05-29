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
    /\bsecurity\b/,
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
  const withoutFixTypo = normalizedText.replace(/\bfix typo(s)?\b/g, '');
  return codePatterns.some((re) => re.test(withoutFixTypo));
}

function classifyRequest(requestText) {
  const text = typeof requestText === 'string' ? requestText : '';
  const normalized = text.toLowerCase();

  const hasDocSignals = detectDocumentationSignals(normalized);
  const hasCodeSignals = detectCodeSignals(normalized);

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

module.exports = {
  classifyRequest
};
