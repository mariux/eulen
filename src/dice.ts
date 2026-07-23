const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[30, 30], [70, 70]],
  3: [[30, 30], [50, 50], [70, 70]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
  6: [[30, 30], [70, 30], [30, 50], [70, 50], [30, 70], [70, 70]],
};

/** Inline SVG die face with proper pips (the Unicode ⚀–⚅ glyphs render tiny). */
export function diceSvg(face: number): string {
  const dots = (PIPS[face] ?? [])
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10"/>`)
    .join("");
  return `<svg class="die-svg" viewBox="0 0 100 100" aria-label="${face}" role="img"><rect class="die-face" x="5" y="5" width="90" height="90" rx="20"/><g class="die-pips">${dots}</g></svg>`;
}
