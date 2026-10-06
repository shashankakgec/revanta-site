// Inline SVG assets. Square caps and mitred joins give the set a drafted, engineered feel.

const STROKE =
  'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"';

const paths = {
  acquire:
    '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.6"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  convert: '<path d="M3 4h18l-7 8.5V20l-4-2v-5.5z"/>',
  automate:
    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><path d="M10 6.5h4.5a2 2 0 0 1 2 2V14"/>',
  crm: '<rect x="3" y="4" width="18" height="6"/><rect x="3" y="14" width="18" height="6"/><path d="M7 10v4M17 10v4"/>',
  data: '<path d="M4 3v17h17"/><path d="M8 15l4-4 3 3 5-6"/>',
  search: '<circle cx="10" cy="10" r="6.5"/><path d="M15 15l6 6"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  lock: '<rect x="5" y="11" width="14" height="9"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
};

export const icon = (name, cls = 'icon') =>
  `<svg class="${cls}" viewBox="0 0 24 24" ${STROKE} aria-hidden="true" focusable="false">${paths[name]}</svg>`;

/** Brand mark: an "R" drawn as a schematic, ending in a signal node. */
export const mark = (cls = 'brand__mark') =>
  `<svg class="${cls}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">` +
  `<path d="M9 26V6h8.5a5.25 5.25 0 0 1 0 10.5H9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/>` +
  `<path d="M17 16.5l6 9.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/>` +
  `<rect x="21" y="24" width="5" height="5" fill="var(--signal)"/>` +
  `</svg>`;

// Schematic micro-diagrams. 160 x 84 viewBox. Paths with class="stub" are the connector stubs
// that join neighbouring nodes in the horizontal layout; they are hidden in the stacked layout.
// Intentionally contains no numbers, axes or fake data.
const vis = (inner) =>
  `<svg viewBox="0 0 160 84" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true" focusable="false">${inner}</svg>`;

export const visuals = {
  traffic: vis(
    '<path d="M4 10C48 10 70 42 112 42M4 30C48 30 70 42 112 42M4 54C48 54 70 42 112 42M4 74C48 74 70 42 112 42"/>' +
      '<path class="stub" d="M116 42H160"/>' +
      '<g fill="currentColor" stroke="none"><circle cx="4" cy="10" r="2.2"/><circle cx="4" cy="30" r="2.2"/><circle cx="4" cy="54" r="2.2"/><circle cx="4" cy="74" r="2.2"/></g>' +
      '<rect x="108" y="38" width="8" height="8" fill="var(--signal)" stroke="none"/>',
  ),
  page: vis(
    '<path class="stub" d="M0 42H28"/>' +
      '<rect x="28" y="6" width="104" height="72" rx="3"/>' +
      '<path d="M28 18H132"/>' +
      '<g fill="currentColor" stroke="none"><circle cx="36" cy="12" r="1.5"/><circle cx="42" cy="12" r="1.5"/><circle cx="48" cy="12" r="1.5"/></g>' +
      '<rect x="40" y="26" width="80" height="9" rx="2"/><rect x="40" y="40" width="80" height="9" rx="2"/>' +
      '<rect x="40" y="56" width="34" height="11" rx="2" fill="var(--signal)" stroke="none"/>' +
      '<path class="stub" d="M132 42H160"/>',
  ),
  flow: vis(
    '<path class="stub" d="M0 42H20"/>' +
      '<rect x="20" y="34" width="16" height="16" rx="2"/>' +
      '<path d="M36 42H56L72 22H96M56 42L72 62H96"/>' +
      '<rect x="96" y="14" width="16" height="16" rx="2"/><rect x="96" y="54" width="16" height="16" rx="2"/>' +
      '<path d="M112 22H124L134 42M112 62H124L134 42"/>' +
      '<rect x="134" y="36" width="12" height="12" rx="2" fill="var(--signal)" stroke="none"/>' +
      '<path class="stub" d="M146 42H160"/>',
  ),
  network: vis(
    '<path class="stub" d="M0 42H28"/>' +
      '<path d="M32 42L72 14M32 42L72 42M32 42L72 70M72 14L116 42M72 42L116 42M72 70L116 42"/>' +
      '<circle cx="30" cy="42" r="3.5" fill="currentColor" stroke="none"/>' +
      '<g fill="var(--navy-900)"><circle cx="72" cy="14" r="3.5"/><circle cx="72" cy="42" r="3.5"/><circle cx="72" cy="70" r="3.5"/></g>' +
      '<circle cx="118" cy="42" r="7" stroke="var(--signal)" stroke-width="1.5"/>' +
      '<path class="stub" d="M125 42H160"/>',
  ),
  steps: vis(
    '<path class="stub" d="M0 42H24V72"/>' +
      '<path d="M24 72H48V58H72V44H96V30H120V16H148"/>' +
      '<rect x="148" y="12" width="8" height="8" fill="var(--signal)" stroke="none"/>',
  ),
};
