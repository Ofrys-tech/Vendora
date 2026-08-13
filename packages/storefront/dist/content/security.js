const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const SAFE_TAGS = new Set([
    'a',
    'b',
    'blockquote',
    'br',
    'code',
    'em',
    'h2',
    'h3',
    'h4',
    'i',
    'li',
    'ol',
    'p',
    'pre',
    'strong',
    'ul',
]);
const VOID_TAGS = new Set(['br']);
function decodeHtmlEntities(value) {
    return value.replace(/&(#x[0-9a-f]+|#\d+|amp|colon|gt|lt|quot);?/giu, (entity, body) => {
        const normalized = body.toLowerCase();
        if (normalized.startsWith('#')) {
            const codePoint = Number.parseInt(normalized.slice(normalized.startsWith('#x') ? 2 : 1), normalized.startsWith('#x') ? 16 : 10);
            return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : '\u0000';
        }
        return { amp: '&', colon: ':', gt: '>', lt: '<', quot: '"' }[normalized] ?? entity;
    });
}
export function isSafeUrl(value, allowRelative = true) {
    const normalized = decodeHtmlEntities(value)
        .trim()
        .replace(/[\u0000-\u001f\u007f\s]+/gu, '');
    if (!normalized)
        return false;
    try {
        const parsed = new URL(normalized, 'https://storefront.invalid');
        if (parsed.origin === 'https://storefront.invalid')
            return allowRelative;
        return SAFE_PROTOCOLS.has(parsed.protocol);
    }
    catch {
        return false;
    }
}
export function assertSafeUrl(value, allowRelative = true) {
    if (!isSafeUrl(value, allowRelative))
        throw new TypeError(`Unsafe URL: ${value}`);
    return value;
}
function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
function sanitizeTag(source) {
    if (source.startsWith('<!--'))
        return '';
    const closing = /^<\s*\/\s*([a-z][a-z0-9]*)\s*>$/iu.exec(source);
    if (closing) {
        const tag = closing[1].toLowerCase();
        return SAFE_TAGS.has(tag) && !VOID_TAGS.has(tag) ? `</${tag}>` : '';
    }
    const opening = /^<\s*([a-z][a-z0-9]*)([\s\S]*?)\s*\/?>$/iu.exec(source);
    if (!opening)
        return escapeHtml(source);
    const tag = opening[1].toLowerCase();
    if (!SAFE_TAGS.has(tag))
        return '';
    if (tag !== 'a')
        return `<${tag}>`;
    const attributes = opening[2] ?? '';
    const attributePattern = /\s+([a-z][a-z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/giy;
    const safeAttributes = [];
    let cursor = 0;
    let targetBlank = false;
    while (cursor < attributes.length) {
        attributePattern.lastIndex = cursor;
        const match = attributePattern.exec(attributes);
        if (!match) {
            if (attributes.slice(cursor).trim())
                return '<a>';
            break;
        }
        cursor = attributePattern.lastIndex;
        const name = match[1].toLowerCase();
        const value = match[2] ?? match[3] ?? '';
        if (name === 'href' && isSafeUrl(value))
            safeAttributes.push(`href="${escapeHtml(value)}"`);
        if (name === 'title')
            safeAttributes.push(`title="${escapeHtml(value)}"`);
        if (name === 'target' && value === '_blank') {
            targetBlank = true;
            safeAttributes.push('target="_blank"');
        }
    }
    if (targetBlank)
        safeAttributes.push('rel="noopener noreferrer"');
    return safeAttributes.length ? `<a ${safeAttributes.join(' ')}>` : '<a>';
}
export function sanitizeHtml(value) {
    let result = '';
    let cursor = 0;
    const tagPattern = /<!--[\s\S]*?-->|<\/?[a-z][^<>]*>/giu;
    for (const match of value.matchAll(tagPattern)) {
        const index = match.index;
        result += escapeHtml(value.slice(cursor, index));
        result += sanitizeTag(match[0]);
        cursor = index + match[0].length;
    }
    return result + escapeHtml(value.slice(cursor));
}
//# sourceMappingURL=security.js.map