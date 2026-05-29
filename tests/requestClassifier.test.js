'use strict';

const { classifyRequest } = require('../src/requestClassifier');

describe('classifyRequest', () => {
  test('classifies documentation-only request as low risk and bounded execution ready', () => {
    const result = classifyRequest('Please update the README and fix typos in the documentation.');

    expect(result).toEqual(
      expect.objectContaining({
        type: 'documentation',
        risk: 'low',
        mode: 'bounded_execution_ready'
      })
    );
    expect(result.reason.toLowerCase()).toContain('documentation-only');
    expect(result.reason.toLowerCase()).toContain('low risk');
    expect(result.reason.toLowerCase()).toContain('bounded');
  });

  test('does not classify mixed doc + code request as documentation-only', () => {
    const result = classifyRequest(
      'Update docs for the API and implement the new endpoint in the server.'
    );

    expect(result.type).toBe('mixed');
    expect(result.risk).not.toBe('low');
    expect(result.mode).toBe('needs_review');
  });

  test('classifies unknown or ambiguous request as unknown', () => {
    const result = classifyRequest('Make it better.');

    expect(result.type).toBe('unknown');
    expect(result.risk).toBe('unknown');
    expect(result.mode).toBe('needs_review');
  });
});
