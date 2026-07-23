import type { RowDef } from "./types";
import { diceSvg } from "./dice";

export const ROWS: RowDef[] = [
  // Upper section
  {
    id: "ones", icon: diceSvg(1), section: "upper", kind: "upper", face: 1,
    label: { de: "Einser", en: "Ones" },
    hint: { de: "Summe aller 1er", en: "Sum of all 1s" },
  },
  {
    id: "twos", icon: diceSvg(2), section: "upper", kind: "upper", face: 2,
    label: { de: "Zweier", en: "Twos" },
    hint: { de: "Summe aller 2er", en: "Sum of all 2s" },
  },
  {
    id: "threes", icon: diceSvg(3), section: "upper", kind: "upper", face: 3,
    label: { de: "Dreier", en: "Threes" },
    hint: { de: "Summe aller 3er", en: "Sum of all 3s" },
  },
  {
    id: "fours", icon: diceSvg(4), section: "upper", kind: "upper", face: 4,
    label: { de: "Vierer", en: "Fours" },
    hint: { de: "Summe aller 4er", en: "Sum of all 4s" },
  },
  {
    id: "fives", icon: diceSvg(5), section: "upper", kind: "upper", face: 5,
    label: { de: "Fünfer", en: "Fives" },
    hint: { de: "Summe aller 5er", en: "Sum of all 5s" },
  },
  {
    id: "sixes", icon: diceSvg(6), section: "upper", kind: "upper", face: 6,
    label: { de: "Sechser", en: "Sixes" },
    hint: { de: "Summe aller 6er", en: "Sum of all 6s" },
  },
  // Lower section — house rule: 1 Pair & 2 Pairs (both count ALL eyes)
  {
    id: "onePair", icon: "👯", section: "lower", kind: "sum", max: 30,
    label: { de: "1 Paar", en: "1 Pair" },
    hint: {
      de: "Hausregel · mind. ein Paar · ALLE Augen zählen",
      en: "House rule · at least one pair · counts ALL eyes",
    },
  },
  {
    id: "twoPairs", icon: "👯‍♂️", section: "lower", kind: "sum", max: 30,
    label: { de: "2 Paare", en: "2 Pairs" },
    hint: {
      de: "Hausregel · zwei Paare · ALLE Augen zählen",
      en: "House rule · two pairs · counts ALL eyes",
    },
  },
  {
    id: "threeOfAKind", icon: "🎯", section: "lower", kind: "sum", max: 30,
    label: { de: "Dreierpasch", en: "Three of a Kind" },
    hint: { de: "3 gleiche · alle Augen zählen", en: "3 alike · counts all eyes" },
  },
  {
    id: "fourOfAKind", icon: "🔥", section: "lower", kind: "sum", max: 30,
    label: { de: "Viererpasch", en: "Four of a Kind" },
    hint: { de: "4 gleiche · alle Augen zählen", en: "4 alike · counts all eyes" },
  },
  {
    id: "fullHouse", icon: "🏠", section: "lower", kind: "fixed", fixedScore: 25,
    label: { de: "Full House", en: "Full House" },
    hint: { de: "3 + 2 gleiche = 25 Punkte", en: "3 + 2 of a kind = 25 points" },
  },
  {
    id: "smallStraight", icon: "➡️", section: "lower", kind: "fixed", fixedScore: 30,
    label: { de: "Kleine Straße", en: "Small Straight" },
    hint: { de: "4 aufeinanderfolgende = 30 Punkte", en: "4 in a row = 30 points" },
  },
  {
    id: "largeStraight", icon: "🚀", section: "lower", kind: "fixed", fixedScore: 40,
    label: { de: "Große Straße", en: "Large Straight" },
    hint: { de: "5 aufeinanderfolgende = 40 Punkte", en: "5 in a row = 40 points" },
  },
  {
    id: "powerOwl", icon: "👑", section: "lower", kind: "fixed", fixedScore: 50,
    label: { de: "Volle Eule", en: "Power Owl" },
    hint: { de: "5 gleiche = 50 Punkte", en: "5 of a kind = 50 points" },
  },
  {
    id: "chance", icon: "🍀", section: "lower", kind: "sum", max: 30,
    label: { de: "Chance", en: "Chance" },
    hint: { de: "Beliebiger Wurf · alle Augen zählen", en: "Any roll · counts all eyes" },
  },
];

export const UPPER_ROWS = ROWS.filter((r) => r.section === "upper");
export const LOWER_ROWS = ROWS.filter((r) => r.section === "lower");
export const UPPER_BONUS_THRESHOLD = 63;
export const UPPER_BONUS = 35;
