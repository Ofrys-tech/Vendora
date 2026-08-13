import { isSafeUrl, sanitizeHtml } from '../src/index';
import { describe, expect, it } from 'vitest';

describe('content security boundary', () => {
  it('accepts relative and explicitly safe URL protocols', () => {
    expect(isSafeUrl('/catalog/item?from=home')).toBe(true);
    expect(isSafeUrl('https://example.test/help')).toBe(true);
    expect(isSafeUrl('mailto:help@example.test')).toBe(true);
    expect(isSafeUrl('tel:+12025550123')).toBe(true);
    expect(isSafeUrl('/relative', false)).toBe(false);
  });

  it('rejects executable, data, encoded, and control-character URLs', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('java\nscript:alert(1)')).toBe(false);
    expect(isSafeUrl('javascript&colon;alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeUrl('&#999999999;')).toBe(false);
    expect(isSafeUrl('')).toBe(false);
  });

  it('keeps allowlisted markup and strips unsafe tags, attributes, and URLs', () => {
    const sanitized = sanitizeHtml(`
      <h2>Title</h2>
      <p onclick="alert(1)">Body <strong>safe</strong></p>
      <script>alert(1)</script>
      <img src=x onerror="alert(1)">
      <a href="javascript:alert(1)" target="_blank">bad</a>
      <a href="https://example.test" title="Help" target="_blank">good</a>
    `);

    expect(sanitized).toContain('<h2>Title</h2>');
    expect(sanitized).toContain('<p>Body <strong>safe</strong></p>');
    expect(sanitized).not.toContain('<script');
    expect(sanitized).not.toContain('<img');
    expect(sanitized).not.toContain('onclick');
    expect(sanitized).not.toContain('javascript:');
    expect(sanitized).toContain(
      '<a href="https://example.test" title="Help" target="_blank" rel="noopener noreferrer">good</a>',
    );
  });
});
