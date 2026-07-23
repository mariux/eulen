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

/** A die that can be any value — shown with a question mark instead of pips. */
export function diceWildSvg(): string {
  return `<svg class="die-svg die-wild" viewBox="0 0 100 100" aria-label="any" role="img"><rect class="die-face" x="5" y="5" width="90" height="90" rx="20"/><text class="die-q" x="50" y="72" text-anchor="middle">?</text></svg>`;
}

/** A wildcard die that is struck through — it doesn't count toward the combo. */
export function diceStruckSvg(): string {
  return `<svg class="die-svg die-wild die-struck" viewBox="0 0 100 100" aria-label="does not count" role="img"><rect class="die-face" x="5" y="5" width="90" height="90" rx="20"/><text class="die-q" x="50" y="72" text-anchor="middle">?</text><line class="die-strike" x1="16" y1="84" x2="84" y2="16"/></svg>`;
}

type Slot = { face: number; wild: boolean; struck?: boolean };

const rnd = (n: number): number => Math.floor(Math.random() * n);
const oneToSix = (): number => 1 + rnd(6);

/** Pick `count` distinct values from 1..6. */
function distinctFaces(count: number): number[] {
  const pool = [1, 2, 3, 4, 5, 6];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

const grp = (face: number, times: number): Slot[] =>
  Array.from({ length: times }, () => ({ face, wild: false }));
const wilds = (times: number): Slot[] =>
  Array.from({ length: times }, () => ({ face: 0, wild: true }));

/**
 * One random hand that satisfies a lower-section combo. Required dice show a
 * (random, but valid) value; free dice are wildcards rendered as "?".
 */
function randomHand(rowId: string): Slot[] {
  switch (rowId) {
    case "onePair": {
      const [a] = distinctFaces(1);
      return [...grp(a, 2), ...wilds(3)];
    }
    case "twoPairs": {
      const [a, b] = distinctFaces(2);
      return [...grp(a, 2), ...grp(b, 2), ...wilds(1)];
    }
    case "threeOfAKind": {
      const [a] = distinctFaces(1);
      return [...grp(a, 3), ...wilds(2)];
    }
    case "fourOfAKind": {
      const [a] = distinctFaces(1);
      return [...grp(a, 4), ...wilds(1)];
    }
    case "fullHouse": {
      const [a, b] = distinctFaces(2);
      return [...grp(a, 3), ...grp(b, 2)];
    }
    case "smallStraight": {
      const start = 1 + rnd(3); // 1..3 -> runs 1-4, 2-5, 3-6
      // the 5th die is free AND doesn't count -> shown struck through
      return [
        ...[0, 1, 2, 3].map((k) => ({ face: start + k, wild: false })),
        { face: 0, wild: true, struck: true },
      ];
    }
    case "largeStraight": {
      const start = 1 + rnd(2); // 1..2 -> runs 1-5, 2-6
      return [0, 1, 2, 3, 4].map((k) => ({ face: start + k, wild: false }));
    }
    case "powerOwl": {
      const [a] = distinctFaces(1);
      return grp(a, 5);
    }
    case "chance":
    default:
      return Array.from({ length: 5 }, () => ({ face: oneToSix(), wild: false }));
  }
}

/** HTML for one random illustrative hand of a lower-section combo. */
export function patternHtml(rowId: string): string {
  return randomHand(rowId)
    .map((s) => (s.struck ? diceStruckSvg() : s.wild ? diceWildSvg() : diceSvg(s.face)))
    .join("");
}
