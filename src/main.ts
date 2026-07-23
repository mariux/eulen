import "./style.css";
import type { AppState, RowDef } from "./types";
import { ROWS, UPPER_ROWS, LOWER_ROWS, UPPER_BONUS, UPPER_BONUS_THRESHOLD } from "./rows";
import { STRINGS } from "./i18n";
import { diceSvg } from "./dice";
import {
  loadState,
  saveState,
  addPlayer,
  removePlayer,
  newGame,
  orderedPlayers,
  rankedPlayers,
  currentTurnPlayerId,
  upperSum,
  hasBonus,
  lowerSum,
  grandTotal,
  sheetComplete,
  gameFinished,
  winners,
  awardWinsIfFinished,
} from "./state";

const state: AppState = loadState();
let editing: { playerId: string; rowId: string } | null = null;

const app = document.getElementById("app")!;

function t() {
  return STRINGS[state.lang];
}

function commit(): void {
  const justFinished = awardWinsIfFinished(state);
  saveState(state);
  render();
  if (justFinished) launchConfetti();
}

// ---------- rendering ----------

function render(): void {
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.lang = state.lang;
  app.innerHTML = "";
  app.append(renderHeader(), renderPlayerBar());
  if (state.players.length === 0) {
    app.append(renderEmptyState());
  } else {
    if (gameFinished(state)) app.append(renderWinnerBanner());
    app.append(renderSheet());
  }
  if (editing) app.append(renderEditor());
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderHeader(): HTMLElement {
  const header = el("header", "header");
  const title = el("h1", "title");
  title.innerHTML = `<span class="die-spin">🎲</span> ${escapeHtml(t().title)} <span class="owl">🦉</span>`;
  const sub = el("p", "subtitle", t().subtitle(state.gamesPlayed));
  header.append(title, sub);
  return header;
}

function renderPlayerBar(): HTMLElement {
  const bar = el("section", "player-bar");

  for (const p of rankedPlayers(state)) {
    const chip = el("div", "player-chip");
    const name = el("span", "player-chip-name", p.name);
    const wins = el("span", "player-chip-wins", `🏆 ${p.wins}`);
    wins.title = t().winsTitle(p.wins);
    const remove = el("button", "player-chip-remove", "✕");
    remove.title = t().removeTitle(p.name);
    remove.addEventListener("click", () => {
      if (confirm(t().removeConfirm(p.name, p.wins))) {
        removePlayer(state, p.id);
        commit();
      }
    });
    chip.append(name, wins, remove);
    bar.append(chip);
  }

  const form = el("form", "add-player-form") as HTMLFormElement;
  const input = el("input", "add-player-input") as HTMLInputElement;
  input.placeholder = t().addPlayerPlaceholder;
  input.maxLength = 20;
  const btn = el("button", "btn btn-add", t().addPlayer);
  btn.type = "submit";
  form.append(input, btn);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return;
    addPlayer(state, name);
    commit();
  });
  bar.append(form);

  const reset = el("button", "btn btn-new-game", t().newGame);
  reset.addEventListener("click", () => {
    const inProgress =
      !gameFinished(state) &&
      state.players.some((p) => ROWS.some((r) => state.scores[p.id][r.id] !== null));
    if (inProgress && !confirm(t().unfinishedConfirm)) return;
    newGame(state);
    editing = null;
    commit();
  });
  bar.append(reset);

  const theme = el("button", "btn btn-theme", t().themeLabel(state.theme));
  theme.addEventListener("click", () => {
    state.theme = state.theme === "party" ? "mark" : "party";
    commit();
  });
  bar.append(theme);

  const lang = el("button", "btn btn-theme", t().langLabel);
  lang.addEventListener("click", () => {
    state.lang = state.lang === "de" ? "en" : "de";
    commit();
  });
  bar.append(lang);

  return bar;
}

function renderEmptyState(): HTMLElement {
  const box = el("div", "empty-state");
  const dice = el("div", "empty-dice");
  dice.innerHTML = [1, 2, 3, 4, 5].map(diceSvg).join(" ");
  box.append(dice, el("p", undefined, t().emptyLine1), el("p", "empty-hint", t().emptyLine2));
  return box;
}

function renderWinnerBanner(): HTMLElement {
  const banner = el("div", "winner-banner");
  const ws = winners(state);
  const names = ws.map((w) => w.name).join(" & ");
  const score = grandTotal(state.scores[ws[0].id]);
  banner.innerHTML = `<span class="winner-trophy">🏆</span>
    <span class="winner-text">${escapeHtml(t().winnerText(names, score, ws.length > 1))}</span>
    <span class="winner-trophy">🎉</span>`;
  const again = el("button", "btn btn-play-again", t().playAgain);
  again.addEventListener("click", () => {
    newGame(state);
    commit();
  });
  banner.append(again);
  return banner;
}

function renderSheet(): HTMLElement {
  const wrap = el("div", "sheet-wrap");
  const table = el("table", "sheet");
  const players = orderedPlayers(state);
  const turnId = currentTurnPlayerId(state);

  // header row
  const thead = el("thead");
  const headRow = el("tr");
  headRow.append(el("th", "row-label-head", t().category));
  const leaderIds = currentLeaderIds();
  for (const p of players) {
    const th = el("th", "player-head");
    const name = el("div", "player-head-name", p.name);
    const total = el("div", "player-head-total", `${grandTotal(state.scores[p.id])} ${t().points}`);
    if (leaderIds.has(p.id)) th.classList.add("leading");
    th.append(name, total);
    if (p.id === turnId) {
      th.classList.add("on-turn");
      th.append(el("div", "turn-badge", t().turn));
    }
    if (leaderIds.has(p.id)) th.append(el("div", "player-head-crown", "👑"));
    headRow.append(th);
  }
  thead.append(headRow);
  table.append(thead);

  const tbody = el("tbody");
  tbody.append(sectionRow(t().upperSection));
  for (const row of UPPER_ROWS) tbody.append(scoreRow(row, players, turnId));
  tbody.append(derivedRow(t().sum, "🧮", players, (pid) => `${upperSum(state.scores[pid])}`));
  tbody.append(bonusRow(players));
  tbody.append(
    derivedRow(t().upperTotal, "⬆️", players, (pid) => {
      const s = state.scores[pid];
      return `${upperSum(s) + (hasBonus(s) ? UPPER_BONUS : 0)}`;
    }),
  );
  tbody.append(sectionRow(t().lowerSection));
  for (const row of LOWER_ROWS) tbody.append(scoreRow(row, players, turnId));
  tbody.append(derivedRow(t().lowerTotal, "⬇️", players, (pid) => `${lowerSum(state.scores[pid])}`));
  tbody.append(totalRow(players));
  table.append(tbody);

  wrap.append(table);
  return wrap;
}

function currentLeaderIds(): Set<string> {
  const totals = state.players.map((p) => grandTotal(state.scores[p.id]));
  const best = Math.max(...totals, 0);
  if (best === 0) return new Set();
  return new Set(
    state.players.filter((p) => grandTotal(state.scores[p.id]) === best).map((p) => p.id),
  );
}

function sectionRow(label: string): HTMLElement {
  const tr = el("tr", "section-row");
  const td = el("td", undefined, label) as HTMLTableCellElement;
  td.colSpan = state.players.length + 1;
  tr.append(td);
  return tr;
}

function scoreRow(row: RowDef, players: ReturnType<typeof orderedPlayers>, turnId: string | null): HTMLElement {
  const tr = el("tr", "score-row");
  const label = el("td", "row-label");
  const labelMain = el("div", "row-label-main");
  labelMain.innerHTML = `<span class="row-icon">${row.icon}</span> ${row.label[state.lang]}`;
  if (row.id === "onePair" || row.id === "twoPairs") {
    labelMain.append(el("span", "house-rule-badge", t().houseRule));
  }
  label.append(labelMain, el("div", "row-hint", row.hint[state.lang]));
  tr.append(label);

  for (const p of players) {
    const value = state.scores[p.id][row.id];
    const td = el("td", "score-cell");
    if (p.id === turnId) td.classList.add("turn-col");
    const btn = el("button", "cell-btn");
    if (value === null) {
      btn.classList.add("cell-empty");
      btn.textContent = "·";
    } else if (value === 0) {
      btn.classList.add("cell-struck");
      btn.textContent = "✗";
    } else {
      btn.classList.add("cell-filled");
      btn.textContent = String(value);
    }
    btn.addEventListener("click", () => {
      editing = { playerId: p.id, rowId: row.id };
      render();
    });
    td.append(btn);
    tr.append(td);
  }
  return tr;
}

function derivedRow(
  label: string,
  icon: string,
  players: ReturnType<typeof orderedPlayers>,
  valueFor: (playerId: string) => string,
): HTMLElement {
  const tr = el("tr", "derived-row");
  const td = el("td", "row-label");
  td.innerHTML = `<span class="row-icon">${icon}</span> ${label}`;
  tr.append(td);
  for (const p of players) {
    tr.append(el("td", "derived-cell", valueFor(p.id)));
  }
  return tr;
}

function bonusRow(players: ReturnType<typeof orderedPlayers>): HTMLElement {
  const tr = el("tr", "derived-row bonus-row");
  const td = el("td", "row-label");
  td.innerHTML = `<span class="row-icon">🎁</span> ${t().bonus} <div class="row-hint">${t().bonusHint}</div>`;
  tr.append(td);
  for (const p of players) {
    const sheet = state.scores[p.id];
    const cell = el("td", "derived-cell");
    if (hasBonus(sheet)) {
      cell.textContent = `+${UPPER_BONUS} 🎉`;
      cell.classList.add("bonus-earned");
    } else {
      const sum = upperSum(sheet);
      const pct = Math.min(100, Math.round((sum / UPPER_BONUS_THRESHOLD) * 100));
      cell.innerHTML = `<div class="bonus-progress"><div class="bonus-progress-fill" style="width:${pct}%"></div></div><span class="bonus-progress-label">${sum}/${UPPER_BONUS_THRESHOLD}</span>`;
    }
    tr.append(cell);
  }
  return tr;
}

function totalRow(players: ReturnType<typeof orderedPlayers>): HTMLElement {
  const tr = el("tr", "total-row");
  const td = el("td", "row-label");
  td.innerHTML = `<span class="row-icon">💯</span> ${t().total}`;
  tr.append(td);
  for (const p of players) {
    const cell = el("td", "total-cell", String(grandTotal(state.scores[p.id])));
    if (sheetComplete(state.scores[p.id])) cell.classList.add("complete");
    tr.append(cell);
  }
  return tr;
}

// ---------- score editor overlay ----------

function renderEditor(): HTMLElement {
  const { playerId, rowId } = editing!;
  const player = state.players.find((p) => p.id === playerId);
  const row = ROWS.find((r) => r.id === rowId);
  const overlay = el("div", "overlay");
  if (!player || !row) return overlay;

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeEditor();
  });

  const dialog = el("div", "dialog");
  const title = el("h2", "dialog-title");
  title.innerHTML = `${row.icon} ${row.label[state.lang]} <span class="dialog-player">· ${escapeHtml(player.name)}</span>`;
  const hint = el("p", "dialog-hint", row.hint[state.lang]);
  dialog.append(title, hint);

  const setScore = (value: number | null) => {
    state.scores[playerId][rowId] = value;
    closeEditor(false);
    commit();
  };

  if (row.kind === "upper") {
    const chips = el("div", "chip-grid");
    for (let count = 0; count <= 5; count++) {
      const score = count * (row.face ?? 0);
      const chip = el("button", "chip");
      chip.innerHTML =
        count === 0
          ? `<b>✗</b><small>${t().none}</small>`
          : `<b>${score}</b><small>${count}× ${diceSvg(row.face ?? 1)}</small>`;
      chip.addEventListener("click", () => setScore(score));
      chips.append(chip);
    }
    dialog.append(chips);
  } else if (row.kind === "fixed") {
    const chips = el("div", "chip-grid chip-grid-fixed");
    const hit = el("button", "chip chip-hit");
    hit.innerHTML = `<b>✓ ${row.fixedScore}</b><small>${t().gotIt}</small>`;
    hit.addEventListener("click", () => setScore(row.fixedScore!));
    const miss = el("button", "chip chip-miss");
    miss.innerHTML = `<b>✗ 0</b><small>${t().struck}</small>`;
    miss.addEventListener("click", () => setScore(0));
    chips.append(hit, miss);
    dialog.append(chips);
  } else {
    const form = el("form", "sum-form") as HTMLFormElement;
    const input = el("input", "sum-input") as HTMLInputElement;
    input.type = "number";
    input.min = "0";
    input.max = String(row.max ?? 30);
    input.placeholder = `0–${row.max ?? 30}`;
    const current = state.scores[playerId][rowId];
    if (current !== null) input.value = String(current);
    const ok = el("button", "btn btn-ok", t().save);
    ok.type = "submit";
    const strike = el("button", "btn btn-strike", t().strikeBtn);
    strike.type = "button";
    strike.addEventListener("click", () => setScore(0));
    form.append(input, ok, strike);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = Number(input.value);
      if (!Number.isInteger(v) || v < 0 || v > (row.max ?? 30)) {
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 400);
        return;
      }
      setScore(v);
    });
    dialog.append(form);
    queueMicrotask(() => input.focus());
  }

  const footer = el("div", "dialog-footer");
  if (state.scores[playerId][rowId] !== null) {
    const clear = el("button", "btn btn-clear", t().clear);
    clear.addEventListener("click", () => setScore(null));
    footer.append(clear);
  }
  const cancel = el("button", "btn btn-cancel", t().cancel);
  cancel.addEventListener("click", () => closeEditor());
  footer.append(cancel);
  dialog.append(footer);

  overlay.append(dialog);
  return overlay;
}

function closeEditor(rerender = true): void {
  editing = null;
  if (rerender) render();
}

// ---------- confetti ----------

function launchConfetti(): void {
  const colors = ["#ff5d8f", "#ffd166", "#06d6a0", "#118ab2", "#9b5de5", "#ff9f1c"];
  const holder = el("div", "confetti-holder");
  document.body.append(holder);
  for (let i = 0; i < 120; i++) {
    const piece = el("div", "confetti");
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    holder.append(piece);
  }
  setTimeout(() => holder.remove(), 6000);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

render();
