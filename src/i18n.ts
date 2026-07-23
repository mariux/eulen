import type { Lang, ThemeId } from "./types";

export interface Strings {
  title: string;
  subtitle(games: number): string;
  addPlayerPlaceholder: string;
  addPlayer: string;
  newGame: string;
  themeLabel(theme: ThemeId): string;
  langLabel: string;
  emptyLine1: string;
  emptyLine2: string;
  winnerText(names: string, score: number, plural: boolean): string;
  playAgain: string;
  category: string;
  upperSection: string;
  lowerSection: string;
  sum: string;
  bonus: string;
  bonusHint: string;
  upperTotal: string;
  lowerTotal: string;
  total: string;
  houseRule: string;
  turn: string;
  points: string;
  winsTitle(wins: number): string;
  removeTitle(name: string): string;
  removeConfirm(name: string, wins: number): string;
  unfinishedConfirm: string;
  none: string;
  gotIt: string;
  struck: string;
  strikeBtn: string;
  save: string;
  clear: string;
  cancel: string;
}

export const STRINGS: Record<Lang, Strings> = {
  de: {
    title: "Würfeln und Eulen",
    subtitle: (games) =>
      `Hausregeln: 1 Paar & 2 Paare · ${games} ${games === 1 ? "Spiel" : "Spiele"} gespielt`,
    addPlayerPlaceholder: "Neuer Spielername…",
    addPlayer: "＋ Spieler hinzufügen",
    newGame: "🔄 Neues Spiel",
    themeLabel: (theme) => (theme === "party" ? "🎨 Design: Party" : "📝 Design: Mark"),
    langLabel: "🌐 Deutsch",
    emptyLine1: "Füge oben Spieler hinzu und lass die Würfel rollen!",
    emptyLine2: "Gewürfelt wird in echt — hier wird nur aufgeschrieben. 🦉",
    winnerText: (names, score, plural) =>
      `${names} ${plural ? "gewinnen" : "gewinnt"} mit ${score} Punkten!`,
    playAgain: "Nochmal spielen!",
    category: "Kategorie",
    upperSection: "Oberer Teil ⬆️",
    lowerSection: "Unterer Teil ⬇️",
    sum: "Summe",
    bonus: "Bonus",
    bonusHint: "35 Punkte ab 63",
    upperTotal: "Oben gesamt",
    lowerTotal: "Unten gesamt",
    total: "GESAMT",
    houseRule: "Hausregel",
    turn: "🎲 ist dran",
    points: "Pkt.",
    winsTitle: (wins) => `${wins} ${wins === 1 ? "Spiel" : "Spiele"} gewonnen`,
    removeTitle: (name) => `${name} entfernen (löscht auch die Siege!)`,
    removeConfirm: (name, wins) =>
      `${name} entfernen? Die ${wins} 🏆 gehen für immer verloren!`,
    unfinishedConfirm: "Das aktuelle Spiel ist noch nicht fertig — trotzdem neu starten?",
    none: "keine",
    gotIt: "geschafft!",
    struck: "gestrichen",
    strikeBtn: "✗ Streichen (0)",
    save: "Speichern",
    clear: "Eintrag löschen",
    cancel: "Abbrechen",
  },
  en: {
    title: "Lerchen and rollin'",
    subtitle: (games) =>
      `House rules: 1 Pair & 2 Pairs · ${games} game${games === 1 ? "" : "s"} played`,
    addPlayerPlaceholder: "New player name…",
    addPlayer: "＋ Add player",
    newGame: "🔄 New game",
    themeLabel: (theme) => (theme === "party" ? "🎨 Theme: Party" : "📝 Theme: Mark"),
    langLabel: "🌐 English",
    emptyLine1: "Add some players above and let the dice roll!",
    emptyLine2: "You roll real dice — this sheet just keeps the score. 🦉",
    winnerText: (names, score, plural) =>
      `${names} win${plural ? "" : "s"} with ${score} points!`,
    playAgain: "Play again!",
    category: "Category",
    upperSection: "Upper Section ⬆️",
    lowerSection: "Lower Section ⬇️",
    sum: "Sum",
    bonus: "Bonus",
    bonusHint: "35 pts at 63+",
    upperTotal: "Upper total",
    lowerTotal: "Lower total",
    total: "TOTAL",
    houseRule: "house rule",
    turn: "🎲 to roll",
    points: "pts",
    winsTitle: (wins) => `${wins} game${wins === 1 ? "" : "s"} won`,
    removeTitle: (name) => `Remove ${name} (deletes their win count!)`,
    removeConfirm: (name, wins) => `Remove ${name}? Their ${wins} 🏆 will be gone forever!`,
    unfinishedConfirm: "The current game is not finished — start over anyway?",
    none: "none",
    gotIt: "got it!",
    struck: "struck",
    strikeBtn: "✗ Strike (0)",
    save: "Save",
    clear: "Clear entry",
    cancel: "Cancel",
  },
};
