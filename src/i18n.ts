import type { Lang, ThemeId } from "./types";

export interface Strings {
  title: string;
  subtitle(games: number): string;
  addPlayerPlaceholder: string;
  addPlayer: string;
  addPlayerTitle: string;
  add: string;
  remove: string;
  newGame: string;
  newGameTitle: string;
  startOver: string;
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
  upperTotal: string;
  lowerTotal: string;
  total: string;
  turn: string;
  points: string;
  winsTitle(wins: number): string;
  removeTitle(name: string): string;
  removeConfirm(name: string, wins: number): string;
  unfinishedConfirm: string;
  allFilled: string;
  revealQuestion: string;
  reveal: string;
  highscore: string;
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
    addPlayerPlaceholder: "Name des Spielers…",
    addPlayer: "＋ Spieler",
    addPlayerTitle: "Neuer Spieler",
    add: "Hinzufügen",
    remove: "Entfernen",
    newGame: "🔄 Neues Spiel",
    newGameTitle: "Neues Spiel",
    startOver: "Neu starten",
    themeLabel: (theme) => (theme === "party" ? "🎨 Design: Party" : "📝 Design: Mark"),
    langLabel: "🌐 Deutsch",
    emptyLine1: "Füge oben Spieler hinzu und lass die Würfel rollen!",
    emptyLine2: "Gewürfelt wird in echt — hier wird nur aufgeschrieben. 🦉",
    winnerText: (names, score, plural) =>
      `${names} ${plural ? "gewinnen" : "gewinnt"} mit ${score} Punkten!`,
    playAgain: "Nochmal spielen!",
    category: "Kategorie",
    upperSection: "Lerchen ⬆️",
    lowerSection: "Eulen ⬇️",
    sum: "Summe",
    bonus: "Bonus",
    upperTotal: "Lerchen gesamt",
    lowerTotal: "Eulen gesamt",
    total: "GESAMT",
    turn: "🎲 ist dran",
    points: "Pkt.",
    winsTitle: (wins) => `${wins} ${wins === 1 ? "Spiel" : "Spiele"} gewonnen`,
    removeTitle: (name) => `${name} entfernen (löscht auch die Siege!)`,
    removeConfirm: (name, wins) =>
      `${name} entfernen? Die ${wins} 🏆 gehen für immer verloren!`,
    unfinishedConfirm: "Das aktuelle Spiel ist noch nicht fertig — trotzdem neu starten?",
    allFilled: "Alle Felder ausgefüllt!",
    revealQuestion: "Endergebnis aufdecken?",
    reveal: "🎉 Aufdecken",
    highscore: "🏆 Bestenliste",
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
    addPlayerPlaceholder: "Player name…",
    addPlayer: "＋ Player",
    addPlayerTitle: "New player",
    add: "Add",
    remove: "Remove",
    newGame: "🔄 New game",
    newGameTitle: "New game",
    startOver: "Start over",
    themeLabel: (theme) => (theme === "party" ? "🎨 Theme: Party" : "📝 Theme: Mark"),
    langLabel: "🌐 English",
    emptyLine1: "Add some players above and let the dice roll!",
    emptyLine2: "You roll real dice — this sheet just keeps the score. 🦉",
    winnerText: (names, score, plural) =>
      `${names} win${plural ? "" : "s"} with ${score} points!`,
    playAgain: "Play again!",
    category: "Category",
    upperSection: "Lerchen ⬆️",
    lowerSection: "Eulen ⬇️",
    sum: "Sum",
    bonus: "Bonus",
    upperTotal: "Lerchen total",
    lowerTotal: "Eulen total",
    total: "TOTAL",
    turn: "🎲 to roll",
    points: "pts",
    winsTitle: (wins) => `${wins} game${wins === 1 ? "" : "s"} won`,
    removeTitle: (name) => `Remove ${name} (deletes their win count!)`,
    removeConfirm: (name, wins) => `Remove ${name}? Their ${wins} 🏆 will be gone forever!`,
    unfinishedConfirm: "The current game is not finished — start over anyway?",
    allFilled: "All fields filled!",
    revealQuestion: "Reveal the final scores?",
    reveal: "🎉 Reveal",
    highscore: "🏆 Highscore",
    none: "none",
    gotIt: "got it!",
    struck: "struck",
    strikeBtn: "✗ Strike (0)",
    save: "Save",
    clear: "Clear entry",
    cancel: "Cancel",
  },
};
