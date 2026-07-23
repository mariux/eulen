import type { AppState, Player, ScoreSheet } from "./types";
import { ROWS, UPPER_ROWS, LOWER_ROWS, UPPER_BONUS, UPPER_BONUS_THRESHOLD } from "./rows";

const STORAGE_KEY = "eulen-v1";

export function emptySheet(): ScoreSheet {
  const sheet: ScoreSheet = {};
  for (const row of ROWS) sheet[row.id] = null;
  return sheet;
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      // make sure every player has a sheet and every sheet has every row
      for (const p of parsed.players) {
        parsed.scores[p.id] = { ...emptySheet(), ...(parsed.scores[p.id] ?? {}) };
      }
      parsed.theme ??= "party";
      parsed.lang ??= "de";
      // keep the play order consistent with the player list
      const order = (parsed.order ?? []).filter((id) => parsed.players.some((p) => p.id === id));
      for (const p of parsed.players) if (!order.includes(p.id)) order.push(p.id);
      parsed.order = order;
      return parsed;
    }
  } catch {
    // corrupted storage -> start fresh
  }
  return { players: [], scores: {}, order: [], winsAwarded: false, gamesPlayed: 0, theme: "party", lang: "de" };
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addPlayer(state: AppState, name: string): Player {
  const player: Player = {
    id: `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    name,
    wins: 0,
  };
  state.players.push(player);
  state.scores[player.id] = emptySheet();
  state.order.push(player.id);
  return player;
}

export function removePlayer(state: AppState, playerId: string): void {
  state.players = state.players.filter((p) => p.id !== playerId);
  state.order = state.order.filter((id) => id !== playerId);
  delete state.scores[playerId];
}

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/** Reset all sheets and draw a random starting order. */
export function newGame(state: AppState): void {
  for (const p of state.players) state.scores[p.id] = emptySheet();
  shuffle(state.order);
  state.winsAwarded = false;
}

/** Players in play order (sheet columns). */
export function orderedPlayers(state: AppState): Player[] {
  const byId = new Map(state.players.map((p) => [p.id, p]));
  return state.order.map((id) => byId.get(id)).filter((p): p is Player => p !== undefined);
}

/** Player chips: most wins first, ties alphabetical. */
export function rankedPlayers(state: AppState): Player[] {
  return [...state.players].sort(
    (a, b) => b.wins - a.wins || a.name.localeCompare(b.name, state.lang),
  );
}

export function filledCount(sheet: ScoreSheet): number {
  return ROWS.reduce((n, r) => n + (sheet[r.id] !== null ? 1 : 0), 0);
}

/**
 * Whose turn is it? First player in play order with the fewest entries —
 * anyone who already wrote down more throws is skipped until the rest
 * caught up.
 */
export function currentTurnPlayerId(state: AppState): string | null {
  const players = orderedPlayers(state);
  if (players.length === 0 || gameFinished(state)) return null;
  const counts = players.map((p) => filledCount(state.scores[p.id]));
  const min = Math.min(...counts);
  return players[counts.indexOf(min)].id;
}

// ---- derived values ----

export function upperSum(sheet: ScoreSheet): number {
  return UPPER_ROWS.reduce((sum, r) => sum + (sheet[r.id] ?? 0), 0);
}

export function hasBonus(sheet: ScoreSheet): boolean {
  return upperSum(sheet) >= UPPER_BONUS_THRESHOLD;
}

export function lowerSum(sheet: ScoreSheet): number {
  return LOWER_ROWS.reduce((sum, r) => sum + (sheet[r.id] ?? 0), 0);
}

export function grandTotal(sheet: ScoreSheet): number {
  return upperSum(sheet) + (hasBonus(sheet) ? UPPER_BONUS : 0) + lowerSum(sheet);
}

export function sheetComplete(sheet: ScoreSheet): boolean {
  return ROWS.every((r) => sheet[r.id] !== null);
}

export function gameFinished(state: AppState): boolean {
  return state.players.length > 0 && state.players.every((p) => sheetComplete(state.scores[p.id]));
}

/** Highest total wins; ties mean several winners. */
export function winners(state: AppState): Player[] {
  if (!gameFinished(state)) return [];
  const best = Math.max(...state.players.map((p) => grandTotal(state.scores[p.id])));
  return state.players.filter((p) => grandTotal(state.scores[p.id]) === best);
}

/** Award wins exactly once per finished game. Returns true if awarded now. */
export function awardWinsIfFinished(state: AppState): boolean {
  if (state.winsAwarded || !gameFinished(state)) return false;
  for (const w of winners(state)) w.wins += 1;
  state.winsAwarded = true;
  state.gamesPlayed += 1;
  return true;
}
