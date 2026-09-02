import './style.css';
import './mobile.css';
import { dailySeed, label, makeBoard, rotate, solved, type Board, type GameState } from './game';

declare const __BUILD_VERSION__: string;

type SavedGame = { seed: string; name: string; guided: boolean; turns: number; state: GameState; rotations: number[] };
type SavedData = {
  muted?: boolean;
  best?: Record<string, number>;
  current?: SavedGame;
  daily?: Record<string, SavedGame>;
  archives?: Record<string, SavedGame>;
};
type BoardMode = 'daily' | 'archive' | 'demo';

const app = document.querySelector<HTMLDivElement>('#app')!;
let board: Board, turns = 0, selected = 0, demo = false, muted = false, state: GameState = 'playing';
let boardName = 'Today’s board', guided = false, tutorialStep = 0, best: Record<string, number> = {};
let boardMode: BoardMode = 'daily', countedRealVisit = false;
const FIXED_STEP_MS = 1000 / 60;
let last = performance.now(), lag = 0, simulationSteps = 0, frameRequest: number | undefined;
const escapeHtml = (value: string) => value.replace(/[&<>\"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[character]!));
const path = () => location.pathname.replace(/\/$/, '') || '/';
const isDemoRoute = () => path() === '/demo' || (path() === '/' && new URLSearchParams(location.search).get('demo') === '1');
const storageKey = () => `${demo ? 'demo:' : 'tide:'}tide-and-tile`;
const titleFor = (route: string) => route === '/privacy' ? 'Privacy — Tide & Tile' : route === '/terms' ? 'Terms — Tide & Tile' : isDemoRoute() ? 'Demo — Tide & Tile' : route === '/' ? 'Tide & Tile — Make a daily harbor route' : 'Page not found — Tide & Tile';
const descriptionFor = (route: string) => route === '/privacy' ? 'Read what Tide & Tile stores in this browser and how to remove it.' : route === '/terms' ? 'Read the terms for playing and reusing Tide & Tile.' : isDemoRoute() ? 'Try a guided four-turn Tide & Tile sample without changing daily progress.' : route === '/' ? 'Rotate water tiles to make a calm daily harbor route.' : 'Return to today’s Tide & Tile harbor puzzle.';

function readData(): SavedData { try { return JSON.parse(localStorage.getItem(storageKey()) || '{}'); } catch { return {}; } }
function writeData() {
  try {
    const saved = readData();
    const game = { seed: board.seed, name: boardName, guided, turns, state, rotations: board.tiles.map(tile => tile.rotation) } satisfies SavedGame;
    if (boardMode === 'demo') {
      localStorage.setItem(storageKey(), JSON.stringify({ muted, best, current: game } satisfies SavedData));
      return;
    }
    const daily = { ...(saved.daily || {}) }, archives = { ...(saved.archives || {}) };
    if (boardMode === 'daily') daily[board.seed] = game;
    if (boardMode === 'archive') archives[board.seed] = game;
    localStorage.setItem(storageKey(), JSON.stringify({ muted, best, daily, archives } satisfies SavedData));
  } catch { /* The game remains playable when storage is unavailable. */ }
}
function loadBoard(seed: string, name: string, isGuided: boolean, mode = boardMode) { boardMode = mode; board = makeBoard(seed, isGuided); boardName = name; guided = isGuided; turns = 0; state = 'playing'; selected = 0; writeData(); }
function restoreOrStart(seed: string, name: string, isGuided: boolean, mode: BoardMode) {
  boardMode = mode;
  const saved = readData(); muted = Boolean(saved.muted); best = saved.best || {};
  const modeGame = mode === 'demo' ? saved.current : mode === 'daily' ? saved.daily?.[seed] : saved.archives?.[seed];
  const legacyGame = saved.current?.seed === seed ? saved.current : undefined;
  const restored = modeGame || legacyGame;
  if (restored?.rotations.length === 16) {
    board = makeBoard(seed, restored.guided); boardName = name; guided = restored.guided;
    board.tiles = board.tiles.map((tile, index) => ({ ...tile, rotation: restored.rotations[index] }));
    turns = restored.turns; state = restored.state; return;
  }
  loadBoard(seed, name, isGuided, mode);
}

function nav() { return `<header><a class="skip" href="#main">Skip to main content</a><a class="wordmark" href="/" data-link>TIDE <i>&amp;</i> TILE</a><nav aria-label="Main navigation"><a href="/demo" data-link>Demo</a><a href="/#archive" data-link>Archive</a><a href="/privacy" data-link>Privacy</a></nav></header>`; }
function footer() { return `<footer><p>A daily harbor-route puzzle for short breaks.</p><p><a href="/privacy" data-link>Privacy</a> · <a href="/terms" data-link>Terms</a> · Built by Param Factory · ${escapeHtml(__BUILD_VERSION__)}</p><small>Harbor illustration is original AI-generated artwork.</small></footer>`; }
function documentPage(kind: 'privacy' | 'terms') {
  const privacy = kind === 'privacy';
  return `${nav()}<main id="main" tabindex="-1" class="legal"><h1>${privacy ? 'Privacy at Tide & Tile' : 'Terms for Tide & Tile'}</h1><p>${privacy ? 'Your game progress stays in this browser’s storage.' : 'Tide & Tile is open-source software under the MIT License.'}</p><h2>${privacy ? 'What we store' : 'What you may expect'}</h2><p>${privacy ? 'We store today’s board, practice boards, best turn counts, completion date, and sound choice in this browser’s storage. Demo data uses a separate browser key. Leaving demo mode deletes it. We do not use accounts, analytics, ads, or third-party requests.' : 'The game is free and provided as-is, without a promise of uninterrupted availability. The MIT License permits commercial use, copying, modification, distribution, sublicensing, and sale. Keep its copyright and permission notice with substantial copies.'}</p><h2>${privacy ? 'How to remove it' : 'Contact'}</h2><p>${privacy ? 'Use your browser’s site-data controls to remove Tide & Tile data.' : 'For a product question, contact Param Factory through its public site.'}</p></main>${footer()}`;
}
function notFoundPage() { return `${nav()}<main id="main" tabindex="-1" class="legal"><h1>This harbor page is missing</h1><p>The address does not match a Tide & Tile page.</p><a class="button primary" href="/" data-link>Return to today’s board</a></main>${footer()}`; }
function tipText() {
  if (state === 'won') return `Route complete in ${turns} turns.`;
  if (state === 'lost') return `The ${board.maxTurns}-turn limit is up. Restart to try a shorter route.`;
  if (boardMode === 'archive') return `Turn ${board.par} misplaced tiles. Every channel must form one dock-to-harbor route.`;
  if (tutorialStep === 1) return 'Start with the four marked tiles. Turn each blue channel toward the next tile.';
  if (tutorialStep === 2) return 'Check every shared edge. Each water end must meet its neighboring channel.';
  if (tutorialStep === 3) return 'Connect every tile from DOCK to HARBOR. Finish near the fewest turns.';
  return 'Use arrow keys to move, then Enter or Space to turn a tile.';
}
function medal() { return turns <= board.par ? 'Tide medal' : turns <= board.par + 4 ? 'Harbor medal' : 'Dock medal'; }
function endScreen() {
  if (state === 'playing') return '';
  const won = state === 'won';
  return `<dialog id="end-screen" class="end-screen" aria-labelledby="end-title" aria-describedby="end-summary"><p class="eyebrow">${won ? 'ROUTE COMPLETE' : 'TURN LIMIT REACHED'}</p><h2 id="end-title" tabindex="-1">${won ? 'The harbor is connected' : 'The route stayed open'}</h2><p id="end-summary">${won ? `${medal()}. ${turns} turns; fewest is ${board.par}.` : `You used ${turns} turns. This board allows ${board.maxTurns}.`}</p><p>${won ? `Best for this board: ${best[board.seed]} turns.` : 'Restart the same route and turn only the misplaced tiles.'}</p><div class="end-actions"><button id="play-again">${won ? 'Play this route again' : 'Try this route again'}</button>${won ? '<button id="end-share">Copy result</button>' : ''}</div></dialog>`;
}
function appPage() {
  const dailyIdentifier = boardMode === 'daily' ? `<p class="board-id">Board date: <strong id="board-id">${escapeHtml(board.seed)}</strong></p>` : '';
  return `${nav()}${demo ? `<aside class="demo-banner" aria-label="Demo status"><b>Demo — sample data, nothing is saved</b><button id="reset-demo">Reset demo</button><button id="start-real">Start for real</button></aside>` : ''}<main id="main" tabindex="-1"><section class="hero"><div><p class="eyebrow">DAILY HARBOR PUZZLE</p><h1>Make today’s harbor route</h1><p class="intro">For casual players who want a calm puzzle break with clear rules.</p><div class="actions"><a class="button primary" href="/?demo=1" data-link>Try it with sample data</a><span>Loads a guided board. It does not change your daily progress.</span></div><ul class="facts"><li>Free to play</li><li>Works offline after the first visit</li><li>Progress stays in this browser’s storage</li></ul></div><figure><img src="/harbor-table.webp" width="768" height="512" alt="A harbor puzzle table with blue water tiles and a chart." loading="eager" fetchpriority="high"><figcaption>Four tiles need one turn in the sample.</figcaption></figure></section><section class="game-zone" aria-labelledby="game-title"><div class="game-heading"><div><p class="eyebrow">${boardMode === 'demo' ? 'GUIDED SAMPLE' : boardMode === 'archive' ? 'ARCHIVE PRACTICE' : 'DAILY PUZZLE'}</p><h2 id="game-title">${escapeHtml(boardName)}</h2>${dailyIdentifier}</div><div class="statbar"><span>Turns <b id="turns">${turns}</b> / ${board.maxTurns}</span><span>Fewest <b id="par">${board.par}</b></span><span class="sound-control"><span>Sound: ${muted ? 'off' : 'on'}</span><button id="sound" aria-pressed="${muted}">${muted ? 'Turn sound on' : 'Turn sound off'}</button></span></div></div><p id="tip" class="tip" aria-live="polite">${tipText()}</p><div id="board" class="board${state === 'won' ? ' connected' : ''}" role="group" aria-label="Harbor tile board"></div><div class="game-actions"><button id="restart">Restart this board</button><button id="help">Show the next rule</button><button id="share" ${state === 'won' ? '' : 'disabled'}>Copy result</button>${boardMode === 'archive' ? '<button id="return-today">Return to today’s board</button>' : ''}</div><p id="result" class="result" aria-live="polite">${state === 'won' ? `Route complete. ${medal()}.` : ''}</p>${endScreen()}</section><section id="archive" class="archive"><div><p class="eyebrow">THREE PRACTICE ROUTES</p><h2>Archive boards</h2><p>Practice three routes at any time. They rise from 4 to 25 misplaced tiles.</p></div><div class="archive-buttons"><button data-archive="Dock lesson" data-seed="archive-dock">Play the 4-turn guided route <small>Dock lesson</small></button><button data-archive="Breakwater bend" data-seed="archive-breakwater">Practice 20-turn corners <small>Breakwater bend</small></button><button data-archive="Harbor circuit" data-seed="archive-circuit-0">Play the 25-turn scramble <small>Harbor circuit</small></button></div></section><section class="how"><h2>How to play Tide & Tile</h2><ol><li><b>Turn</b> a tile by tapping it or pressing Enter or Space.</li><li><b>Join</b> every channel into one continuous route.</li><li><b>Finish</b> at the fewest turns for Tide, within four more for Harbor, or later for Dock.</li></ol><p><b>What it does not do:</b> there are no timers, lives, accounts, or leaderboards. The turn limit gives each route a clear finish.</p></section></main>${footer()}`;
}

function renderBoard() {
  const element = document.querySelector<HTMLDivElement>('#board')!; element.innerHTML = ''; element.dataset.seed = board.seed;
  board.tiles.forEach((tile, index) => {
    const button = document.createElement('button'), needed = (tile.solution - tile.rotation + (tile.kind === 'straight' ? 2 : 4)) % (tile.kind === 'straight' ? 2 : 4);
    button.className = `tile rotation-${tile.rotation}${guided && needed > 0 ? ' misplaced' : ''}${index === board.dock.index ? ' dock' : ''}${index === board.harbor.index ? ' harbor' : ''}`; button.dataset.i = String(index); button.dataset.needed = String(needed);
    button.setAttribute('aria-label', `Row ${Math.floor(index / board.size) + 1}, column ${index % board.size + 1}: ${label(tile)}.${index === board.dock.index ? ' Dock tile.' : ''}${index === board.harbor.index ? ' Harbor tile.' : ''} Press to rotate.`);
    button.disabled = state !== 'playing';
    button.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><path class="channel ${tile.kind}" d="${tile.kind === 'straight' ? 'M50 0V100' : 'M50 0V50H100'}"/></svg>${index === board.dock.index ? '<span class="port-label">DOCK</span>' : ''}${index === board.harbor.index ? '<span class="port-label">HARBOR</span>' : ''}`;
    button.addEventListener('click', () => turnTile(index)); button.addEventListener('keydown', tileKeys); element.append(button);
  });
}
function tileKeys(event: KeyboardEvent) {
  const index = Number((event.currentTarget as HTMLElement).dataset.i), change: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: board.size, ArrowUp: -board.size };
  if (event.key in change) { event.preventDefault(); selected = Math.max(0, Math.min(board.tiles.length - 1, index + change[event.key])); document.querySelector<HTMLButtonElement>(`[data-i="${selected}"]`)?.focus(); }
}
function turnTile(index: number) {
  if (state !== 'playing') return;
  board = rotate(board, index); turns++; selected = index;
  if (solved(board)) { state = 'won'; best[board.seed] = Math.min(best[board.seed] ?? turns, turns); }
  else if (turns >= board.maxTurns) state = 'lost';
  writeData(); chirp(); renderGame();
  if (state === 'playing') requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-i="${selected}"]`)?.focus());
}
function copyResult() {
  const identifier = boardMode === 'daily' ? `\nBoard date: ${board.seed}` : '';
  const text = `Tide & Tile\nBoard: ${boardName}${identifier}\n${turns} turns · fewest ${board.par}\nOne continuous harbor route`;
  navigator.clipboard.writeText(text).then(() => { const result = document.querySelector('#result'); if (result) result.textContent = 'Result copied: game, board, turn count, fewest score, and route result.'; }).catch(() => { const result = document.querySelector('#result'); if (result) result.textContent = text; });
}
function resetCurrent(message = 'Board restarted.') { loadBoard(board.seed, boardName, guided); renderGame(); const result = document.querySelector('#result'); if (result) result.textContent = message; }
function chirp() {
  if (muted) return; const Context = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext; if (!Context) return;
  const context = new Context(), oscillator = context.createOscillator(), gain = context.createGain(); oscillator.frequency.value = state === 'won' ? 660 : 440; gain.gain.setValueAtTime(.035, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .06); oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .06);
}
function bind() {
  document.querySelectorAll<HTMLAnchorElement>('[data-link]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); const target = new URL(link.href), currentPath = path();
    if (demo && target.pathname !== '/demo') localStorage.removeItem('demo:tide-and-tile');
    history.pushState({}, '', target.href);
    if (target.pathname === currentPath && target.hash === '#archive') { document.querySelector('#archive')?.scrollIntoView(); return; }
    renderRoute(true); if (target.hash === '#archive') requestAnimationFrame(() => document.querySelector('#archive')?.scrollIntoView());
  }));
  document.querySelector('#restart')?.addEventListener('click', () => resetCurrent()); document.querySelector('#play-again')?.addEventListener('click', () => resetCurrent());
  document.querySelector('#help')?.addEventListener('click', () => { document.querySelector('#tip')!.textContent = 'A straight channel joins opposite edges. A corner joins neighboring edges. Every open end must meet another channel.'; });
  document.querySelector('#sound')?.addEventListener('click', () => { muted = !muted; writeData(); renderGame(); });
  document.querySelector('#share')?.addEventListener('click', copyResult); document.querySelector('#end-share')?.addEventListener('click', copyResult);
  document.querySelector('#reset-demo')?.addEventListener('click', () => { localStorage.removeItem('demo:tide-and-tile'); best = {}; loadBoard('sample-harbor', 'Sample board', true); renderGame(); });
  document.querySelector('#start-real')?.addEventListener('click', () => { localStorage.removeItem('demo:tide-and-tile'); history.pushState({}, '', '/'); renderRoute(true); });
  document.querySelector('#return-today')?.addEventListener('click', () => { restoreOrStart(dailySeed(), 'Today’s board', false, 'daily'); renderGame(); document.querySelector('#game-title')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
  document.querySelectorAll<HTMLButtonElement>('[data-archive]').forEach(button => button.addEventListener('click', () => { if (button.disabled) return; restoreOrStart(button.dataset.seed!, button.dataset.archive!, button.dataset.archive === 'Dock lesson', 'archive'); renderGame(); document.querySelector('#game-title')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }));
}
function openEndScreen() { const dialog = document.querySelector<HTMLDialogElement>('#end-screen'); if (dialog && !dialog.open) { dialog.showModal(); document.querySelector<HTMLElement>('#end-title')?.focus(); } }
function renderGame() { app.innerHTML = appPage(); renderBoard(); bind(); requestAnimationFrame(openEndScreen); }
function renderRoute(moveFocus = false) {
  const route = path(); document.title = titleFor(route);
  const canonicalRoute = isDemoRoute() ? '/demo' : route === '/' ? '/' : route;
  const description = descriptionFor(route);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://tide-and-tile.sociobot.in${canonicalRoute}`);
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', document.title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', description);
  if (route === '/privacy' || route === '/terms') app.innerHTML = documentPage(route.slice(1) as 'privacy' | 'terms');
  else if (route !== '/' && route !== '/demo') app.innerHTML = notFoundPage();
  else {
    demo = isDemoRoute();
    if (demo) { tutorialStep = 1; restoreOrStart('sample-harbor', 'Sample board', true, 'demo'); }
    else {
      const visitsKey = 'tide:tide-and-tile:visits', visits = Number(localStorage.getItem(visitsKey) || '0');
      if (!countedRealVisit) { tutorialStep = visits < 3 ? visits + 1 : 0; localStorage.setItem(visitsKey, String(visits + 1)); countedRealVisit = true; }
      restoreOrStart(dailySeed(), 'Today’s board', visits === 0, 'daily');
    }
    renderGame();
    if (moveFocus) requestAnimationFrame(() => { const heading = document.querySelector<HTMLElement>('h1'); heading?.setAttribute('tabindex', '-1'); heading?.focus(); });
    return;
  }
  bind(); if (moveFocus) requestAnimationFrame(() => { const heading = document.querySelector<HTMLElement>('h1'); heading?.setAttribute('tabindex', '-1'); heading?.focus(); });
}
function scheduleLoop() { frameRequest = requestAnimationFrame(loop); }
function loop(now: number) {
  frameRequest = undefined;
  if (document.hidden) {
    // A queued frame can arrive just as the browser hides the tab. Do not
    // consume either that frame or any elapsed time when this happens.
    lag = 0; last = now; document.body.dataset.simulationState = 'paused';
    return;
  }
  document.body.dataset.simulationState = 'running';
  lag += Math.min(100, now - last);
  while (lag >= FIXED_STEP_MS) { lag -= FIXED_STEP_MS; simulationSteps++; document.body.dataset.simulationSteps = String(simulationSteps); }
  last = now; scheduleLoop();
}
document.addEventListener('visibilitychange', () => {
  lag = 0; last = performance.now();
  if (document.hidden) {
    if (frameRequest !== undefined) cancelAnimationFrame(frameRequest);
    frameRequest = undefined; document.body.dataset.simulationState = 'paused';
    return;
  }
  document.body.dataset.simulationState = 'running';
  if (frameRequest === undefined) scheduleLoop();
});
window.addEventListener('popstate', () => renderRoute(true));
renderRoute(); scheduleLoop();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(registration => registration.update()).catch(() => {}));
