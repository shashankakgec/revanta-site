// Shared helpers. No dependencies.

/** Escape text for use in HTML text nodes and double-quoted attributes. */
export const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Serialize an object for an inline <script type="application/ld+json"> block. */
export const jsonForScript = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

/** Strip tags from trusted copy, for plain-text uses such as JSON-LD answers. */
export const plain = (html = '') =>
  String(html)
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
