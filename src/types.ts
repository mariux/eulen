export interface Player {
  id: string;
  name: string;
  wins: number;
}

export type ScoreSheet = Record<string, number | null>;

export type ThemeId = "party" | "mark";
export type Lang = "de" | "en";

export interface AppState {
  players: Player[];
  /** playerId -> rowId -> score (null = not yet entered) */
  scores: Record<string, ScoreSheet>;
  /** play order for the current game (player ids); index 0 starts */
  order: string[];
  /** final scores revealed -> wins awarded and sheet locked */
  revealed: boolean;
  gamesPlayed: number;
  theme: ThemeId;
  lang: Lang;
}

export type RowKind = "upper" | "fixed" | "sum";

export interface RowDef {
  id: string;
  label: Record<Lang, string>;
  /** inline HTML (emoji or SVG) */
  icon: string;
  hint: Record<Lang, string>;
  section: "upper" | "lower";
  kind: RowKind;
  /** face value for upper rows */
  face?: number;
  /** score for fixed rows (full house etc.) */
  fixedScore?: number;
  /** max for free sum rows */
  max?: number;
}
