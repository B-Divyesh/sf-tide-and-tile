import { expect, test } from '@playwright/test';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

async function solveSample(page: import('@playwright/test').Page) {
  const needed = await page.locator('.tile').evaluateAll(tiles => tiles.map(tile => Number((tile as HTMLElement).dataset.needed)));
  for (let index = 0; index < needed.length; index++) for (let turn = 0; turn < needed[index]; turn++) await page.locator('.tile').nth(index).click();
}

async function boardSignature(page: import('@playwright/test').Page) {
  return page.locator('.tile').evaluateAll(tiles => tiles.map(tile => `${(tile as HTMLElement).dataset.needed}:${tile.getAttribute('aria-label')}`).join('|'));
}

test('@claim:demo-sandbox loads a guided sample and writes only demo storage', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('tide:tide-and-tile', JSON.stringify({ sentinel: 'real progress' })));
  await page.goto('/demo'); await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.locator('.tile').first().click();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.some(key => key.startsWith('demo:'))).toBeTruthy();
  expect(await page.evaluate(() => localStorage.getItem('tide:tide-and-tile'))).toBe('{"sentinel":"real progress"}');
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  expect(await page.evaluate(() => localStorage.getItem('demo:tide-and-tile'))).toBeNull();
});

test('@claim:privacy-local only makes same-origin requests during a complete demo run', async ({ page, baseURL }) => {
  const seen: string[] = []; page.on('request', request => seen.push(request.url()));
  await page.goto('/demo'); await solveSample(page);
  expect(seen.every(url => url.startsWith(baseURL!))).toBeTruthy();
});

test('@claim:keyboard-tiles rotates and moves across tiles with the keyboard', async ({ page }) => {
  await page.goto('/demo'); const first = page.locator('.tile').first(); await first.focus();
  const before = await first.getAttribute('aria-label'); await page.keyboard.press('Enter');
  await expect(page.locator('.tile').first()).not.toHaveAttribute('aria-label', before!);
  const afterEnter = await page.locator('.tile').first().getAttribute('aria-label'); await page.keyboard.press('Space');
  await expect(page.locator('.tile').first()).not.toHaveAttribute('aria-label', afterEnter!);
  await expect(page.locator('.tile').first()).toBeFocused();
  await page.keyboard.press('ArrowRight'); await expect(page.locator('.tile').nth(1)).toBeFocused();
});

test('@claim:daily-boundary always opens today and keeps archive progress separate', async ({ page }) => {
  await page.goto('/');
  const today = await page.locator('#board').getAttribute('data-seed');
  expect(today).toBe(await page.evaluate(() => new Date().toISOString().slice(0, 10)));
  await solveSample(page);
  await page.getByRole('button', { name: 'Play this route again' }).click();
  await page.getByRole('button', { name: /^Dock lesson/ }).click();
  await page.locator('.tile').first().click();
  await page.reload();
  await expect(page.locator('#game-title')).toHaveText('Today’s tide');
  await expect(page.locator('#board')).toHaveAttribute('data-seed', today!);
  await page.getByRole('button', { name: /^Dock lesson/ }).click();
  await expect(page.locator('#turns')).toHaveText('1');
  await page.getByRole('button', { name: 'Return to today’s board' }).click();
  await page.evaluate(() => {
    localStorage.setItem('tide:tide-and-tile', JSON.stringify({
      current: { seed: '1999-01-01', name: 'Yesterday’s tide', guided: false, turns: 1, state: 'playing', rotations: Array(16).fill(0) }
    }));
  });
  await page.reload();
  await expect(page.locator('#board')).toHaveAttribute('data-seed', today!);
});

test('@claim:archive-gate requires today’s exact UTC completion before rising archive practice', async ({ page }) => {
  await page.goto('/');
  const archiveButtons = page.locator('[data-archive]');
  await expect(archiveButtons.first()).toBeDisabled();
  await solveSample(page);
  await expect(archiveButtons.first()).toBeEnabled();
  await page.getByRole('button', { name: 'Play this route again' }).click();
  const expectedNames = ['Dock lesson', 'Breakwater bend', 'Harbor circuit'];
  const pars: number[] = [];
  for (const name of expectedNames) {
    await page.getByRole('button', { name: new RegExp(`^${name}`) }).click();
    pars.push(Number(await page.locator('#par').textContent()));
    await expect(page.locator('#tip')).toContainText(`${pars.at(-1)} misplaced`);
    await page.getByRole('button', { name: 'Return to today’s board' }).click();
  }
  expect(pars[0]).toBeLessThan(pars[1]); expect(pars[1]).toBeLessThan(pars[2]);
  await page.evaluate(() => {
    const key = 'tide:tide-and-tile'; const data = JSON.parse(localStorage.getItem(key) || '{}');
    data.completedDailyUtc = '1999-01-01'; localStorage.setItem(key, JSON.stringify(data));
  });
  await page.reload(); await expect(archiveButtons.first()).toBeDisabled();
});

test('@claim:progressive-lessons shows three different lessons on the first three real visits', async ({ page }) => {
  const lessons: string[] = [];
  for (let visit = 0; visit < 4; visit++) {
    await page.goto('/'); lessons.push((await page.locator('#tip').textContent())!);
  }
  expect(new Set(lessons.slice(0, 3)).size).toBe(3);
  expect(lessons[0]).toContain('marked tiles');
  expect(lessons[1]).toContain('shared edge');
  expect(lessons[2]).toContain('DOCK to HARBOR');
  expect(lessons[3]).toContain('arrow keys');
});

test('@claim:restart-resets returns the board and turn count to their initial state', async ({ page }) => {
  await page.goto('/demo'); const initial = await page.locator('.tile').first().getAttribute('aria-label'); await page.locator('.tile').first().click();
  await page.getByRole('button', { name: 'Restart this board' }).click();
  await expect(page.getByText('Board restarted.')).toBeVisible(); await expect(page.locator('#turns')).toHaveText('0'); await expect(page.locator('.tile').first()).toHaveAttribute('aria-label', initial!);
});

test('@claim:continuous-route requires one connected dock-to-harbor route', async ({ page }) => {
  await page.goto('/demo'); await solveSample(page);
  await expect(page.getByRole('dialog')).toBeVisible(); await expect(page.getByRole('dialog')).toContainText('The harbor is connected');
  await expect(page.getByRole('dialog')).toContainText('Tide medal. 4 turns; fewest is 4.');
});

test('@claim:end-screens reaches real win and loss screens and restarts from each', async ({ page }) => {
  await page.goto('/demo'); await solveSample(page);
  await expect(page.getByRole('dialog', { name: 'The harbor is connected' })).toBeVisible();
  await page.getByRole('button', { name: 'Play this route again' }).click(); await expect(page.locator('#turns')).toHaveText('0');
  for (let turn = 0; turn < 12; turn++) await page.locator('.tile').last().click();
  await expect(page.getByRole('dialog', { name: 'The route stayed open' })).toBeVisible(); await expect(page.getByRole('dialog')).toContainText('12 turns');
  await page.getByRole('button', { name: 'Try this route again' }).click(); await expect(page.locator('#turns')).toHaveText('0');
});

test('@claim:progress-persistence restores a completed board, best score, and sound setting', async ({ page }) => {
  await page.goto('/demo'); await page.getByRole('button', { name: 'Sound on' }).click(); await solveSample(page); await page.reload();
  await expect(page.getByRole('dialog', { name: 'The harbor is connected' })).toBeVisible(); await expect(page.locator('#turns')).toHaveText('4');
  await expect(page.getByRole('dialog')).toContainText('Best for this seed: 4 turns.'); await expect(page.getByRole('button', { name: 'Sound off' })).toHaveAttribute('aria-pressed', 'true');
});

test('@claim:advertised-modes loads sample, daily, and all three distinct archive routes', async ({ page }) => {
  await page.goto('/demo'); expect(await page.locator('#board').getAttribute('data-seed')).toBe('sample-harbor'); const signatures = new Set<string>([await boardSignature(page)]);
  await page.getByRole('button', { name: 'Start for real' }).click(); await expect(page).toHaveURL('/');
  signatures.add(await boardSignature(page)); await solveSample(page); await page.getByRole('button', { name: 'Play this route again' }).click();
  for (const name of ['Dock lesson', 'Breakwater bend', 'Harbor circuit']) {
    await page.getByRole('button', { name: new RegExp(`^${name}`) }).click();
    signatures.add(await boardSignature(page));
    await expect(page.locator('#game-title')).toHaveText(name);
    await page.getByRole('button', { name: 'Return to today’s board' }).click();
  }
  expect(signatures.size).toBe(5);
});

test('@claim:copy-result copies only the seed, turns, fewest score, and route result', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']); await page.goto('/demo'); await solveSample(page);
  await page.locator('#end-share').click();
  await expect(page.locator('#result')).toHaveText(/Result copied/);
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('Tide & Tile sample-harbor\n4 turns · fewest 4\nOne continuous harbor route');
});

test('@claim:hidden-pause pauses fixed simulation steps while the page is hidden', async ({ page }) => {
  await page.goto('/demo');
  const hidden = await page.evaluate(async () => {
    let simulatedHidden = false;
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => simulatedHidden });
    simulatedHidden = true; document.dispatchEvent(new Event('visibilitychange'));
    const start = Number(document.body.dataset.simulationSteps || '0');
    const simulationState = document.body.dataset.simulationState;
    await new Promise(resolve => setTimeout(resolve, 350));
    const end = Number(document.body.dataset.simulationSteps || '0');
    simulatedHidden = false; document.dispatchEvent(new Event('visibilitychange'));
    return { start, end, simulationState };
  });
  expect(hidden.simulationState).toBe('paused');
  expect(hidden.end - hidden.start).toBe(0);
  await expect.poll(async () => Number(await page.locator('body').getAttribute('data-simulation-steps'))).toBeGreaterThan(hidden.end);
});

test('@claim:frame-rate keeps the fixed game loop near 60 frames per second', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const session = await page.context().newCDPSession(page); await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.goto('/demo');
  const fps = await page.evaluate(async () => {
    const samples: number[] = []; let previous = performance.now();
    await new Promise<void>(resolve => { const frame = (now: number) => { samples.push(now - previous); previous = now; if (samples.length >= 90) resolve(); else requestAnimationFrame(frame); }; requestAnimationFrame(frame); });
    return 1000 / (samples.slice(10).reduce((sum, value) => sum + value, 0) / samples.slice(10).length);
  });
  expect(fps).toBeGreaterThanOrEqual(55);
  const steps = Number(await page.locator('body').getAttribute('data-simulation-steps')); expect(steps).toBeGreaterThan(60);
});

test('@claim:offline-reload works offline after the first visit', async ({ browser, baseURL }) => {
  const context = await browser.newContext(); const page = await context.newPage();
  await page.goto(`${baseURL}/demo`); await page.evaluate(() => navigator.serviceWorker.ready); await page.reload();
  await context.setOffline(true); await page.reload(); await expect(page.getByRole('heading', { name: 'Make today’s harbor route' })).toBeVisible();
  await context.close();
});

test('@claim:service-worker-update removes an older deploy cache', async ({ browser, baseURL }) => {
  const context = await browser.newContext(); const page = await context.newPage(); await page.goto(`${baseURL}/demo`); await page.evaluate(() => navigator.serviceWorker.ready);
  await page.evaluate(async () => { await caches.open('tide-tile-stale-deploy'); const registration = await navigator.serviceWorker.getRegistration(); await registration?.unregister(); });
  await page.reload(); await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).includes('tide-tile-stale-deploy'))).toBe(false);
  const worker = await (await page.request.get('/sw.js')).text(); expect(worker).toMatch(/tide-tile-[a-f0-9]{12}/); await context.close();
});

test('@claim:response-policy ships CSP and immutable hashed-asset caching rules', async ({ request, baseURL }) => {
  const config = JSON.parse(readFileSync('staticwebapp.config.json', 'utf8'));
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
  expect(config.globalHeaders['Content-Security-Policy']).not.toContain("'unsafe-inline'");
  expect(config.routes).toContainEqual({ route: '/assets/*', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } });
  expect(config.routes).toContainEqual({ route: '/sw.js', headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } });
  if (baseURL?.startsWith('https://')) {
    const pageResponse = await request.get('/'); expect(pageResponse.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
    const html = await pageResponse.text(), asset = html.match(/src="(\/assets\/[^"]+\.js)"/)![1];
    expect((await request.get(asset)).headers()['cache-control']).toContain('immutable');
    expect((await request.get('/sw.js')).headers()['cache-control']).toContain('no-store');
  }
});

test('@claim:free-local-game plays without accounts, payments, timers, lives, or leaderboards', async ({ page }) => {
  await page.goto('/demo'); await expect(page.locator('form')).toHaveCount(0); await expect(page.getByText('Free to play')).toBeVisible();
  await expect(page.getByText(/there are no timers, lives, accounts, or leaderboards/i)).toBeVisible();
  const turns = await page.locator('#turns').textContent(); await page.waitForTimeout(1100); await expect(page.locator('#turns')).toHaveText(turns!);
});

test('@claim:mobile-controls keeps the full board and 44px controls usable by touch at 390px', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const page = await context.newPage(); await page.goto(`${baseURL}/demo`);
  const board = await page.locator('#board').boundingBox(); expect(board).not.toBeNull(); expect(board!.y).toBeLessThan(844); expect(board!.y + board!.height).toBeLessThanOrEqual(844);
  await page.locator('.tile').first().tap(); await expect(page.locator('#turns')).toHaveText('1');
  for (const element of await page.locator('a, button').all()) { const box = await element.boundingBox(); if (box) { expect(box.height).toBeGreaterThanOrEqual(44); expect(box.width).toBeGreaterThanOrEqual(44); } }
  await context.close();
});

test('mobile text at 200% keeps controls and content inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/demo');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
  await expect(page.getByRole('heading', { name: 'Make today’s harbor route' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Restart this board' })).toBeVisible();
});

test('legal terms match MIT rights and legal Archive links return to the home archive', async ({ page }) => {
  await page.goto('/terms'); await expect(page.getByText(/MIT License permits commercial use, copying, modification, distribution, sublicensing, and sale/i)).toBeVisible();
  const archive = page.getByRole('link', { name: 'Archive' }); await expect(archive).toHaveAttribute('href', '/#archive');
  await archive.click(); await expect(page).toHaveURL('/#archive'); await expect(page.getByRole('heading', { name: 'Archive boards' })).toBeVisible();
  await page.goto('/privacy'); const privacyArchive = page.getByRole('link', { name: 'Archive' }); await expect(privacyArchive).toHaveAttribute('href', '/#archive'); await privacyArchive.click(); await expect(page).toHaveURL('/#archive');
});

test('service worker precache remains below 2 MiB and omits social preview art', async ({ request }) => {
  const worker = await (await request.get('/sw.js')).text();
  const shell = JSON.parse(worker.match(/const SHELL=(\[[^;]+\]);/)![1]) as string[];
  expect(shell).not.toContain('/social.png');
  const bytes = shell.reduce((sum, url) => sum + statSync(join('dist', url)).size, 0);
  expect(bytes).toBeLessThan(2 * 1024 * 1024);
});

test('all app routes and the end dialog have no serious or critical axe violations', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ bypassCSP: true }); const page = await context.newPage();
  for (const route of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(`${baseURL}${route}`); await page.addScriptTag({ content: readFileSync('node_modules/axe-core/axe.min.js', 'utf8') });
    const result = await page.evaluate(async () => await (window as typeof window & { axe: { run: (element?: unknown, options?: unknown) => Promise<{ violations: Array<{ impact: string }> }> } }).axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } }));
    expect(result.violations.filter(violation => ['serious', 'critical'].includes(violation.impact)), route).toEqual([]);
  }
  await page.goto(`${baseURL}/demo`); await solveSample(page); await page.addScriptTag({ content: readFileSync('node_modules/axe-core/axe.min.js', 'utf8') });
  const dialogResult = await page.evaluate(async () => await (window as typeof window & { axe: { run: (element?: unknown, options?: unknown) => Promise<{ violations: Array<{ impact: string }> }> } }).axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } }));
  expect(dialogResult.violations.filter(violation => ['serious', 'critical'].includes(violation.impact))).toEqual([]);
  await context.close();
});

test('the completed route draws once and reduced motion shortens it to an instant state', async ({ browser, baseURL }) => {
  const animatedContext = await browser.newContext(); const animated = await animatedContext.newPage(); await animated.goto(`${baseURL}/demo`); await solveSample(animated);
  await expect(animated.locator('#board')).toHaveClass(/connected/); expect(await animated.locator('.channel').first().evaluate(element => getComputedStyle(element).animationName)).toBe('harbor-flow'); await animatedContext.close();
  const context = await browser.newContext({ reducedMotion: 'reduce' }); const reduced = await context.newPage(); await reduced.goto(`${baseURL}/demo`); await solveSample(reduced);
  const duration = await reduced.locator('.channel').first().evaluate(element => getComputedStyle(element).animationDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001); await context.close();
});

test('routes load without console errors and the standalone 404 keeps shared navigation', async ({ page }) => {
  const errors: string[] = []; page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); }); page.on('pageerror', error => errors.push(error.message));
  for (const route of ['/', '/demo', '/privacy', '/terms']) { await page.goto(route); await expect(page.locator('main')).toBeVisible(); await expect(page.locator('h1')).toHaveCount(1); }
  await page.goto('/404.html');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible(); await expect(page.locator('footer')).toContainText('v1.2-repair');
  expect(errors).toEqual([]);
});

test('claim manifest has one exact tagged regression for every declared promise', async () => {
  const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string; test: string }>;
  expect(new Set(claims.map(claim => claim.id)).size).toBe(claims.length);
  const source = `${readFileSync('tests/game.spec.ts', 'utf8')}\n${readFileSync('src/game.test.ts', 'utf8')}`;
  for (const claim of claims) {
    expect(claim.test).toContain(`@claim:${claim.id}`);
    expect(source.match(new RegExp(`@claim:${claim.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'))).toHaveLength(1);
  }
});
