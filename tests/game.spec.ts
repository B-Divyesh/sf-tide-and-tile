import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

async function solveSample(page: import('@playwright/test').Page) {
  const needed = await page.locator('.tile').evaluateAll(tiles => tiles.map(tile => Number((tile as HTMLElement).dataset.needed)));
  for (let index = 0; index < needed.length; index++) for (let turn = 0; turn < needed[index]; turn++) await page.locator('.tile').nth(index).click();
}

test('@claim:demo-sandbox loads a guided sample and writes only demo storage', async ({ page }) => {
  await page.goto('/demo'); await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.locator('.tile').first().click();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.length).toBeGreaterThan(0); expect(keys.every(key => key.startsWith('demo:'))).toBeTruthy();
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
  await page.keyboard.press('ArrowRight'); await expect(page.locator('.tile').nth(1)).toBeFocused();
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
  await page.goto('/demo'); expect(await page.locator('#board').getAttribute('data-seed')).toBe('sample-harbor');
  await page.getByRole('button', { name: 'Start for real' }).click(); await expect(page).toHaveURL('/');
  const signatures = new Set<string>();
  for (const name of ['Dock lesson', 'Breakwater bend', 'Harbor circuit']) {
    await page.getByRole('button', { name: new RegExp(`^${name}`) }).click();
    signatures.add((await page.locator('.tile').evaluateAll(tiles => tiles.map(tile => tile.getAttribute('aria-label')).join('|'))));
    await expect(page.locator('#game-title')).toHaveText(name);
  }
  expect(signatures.size).toBe(3);
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

test('@claim:response-policy ships CSP and immutable hashed-asset caching rules', async ({ request }) => {
  const config = await (await request.get('/staticwebapp.config.json')).json();
  expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
  expect(config.globalHeaders['Content-Security-Policy']).not.toContain("'unsafe-inline'");
  expect(config.routes).toContainEqual({ route: '/assets/*', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } });
  expect(config.routes).toContainEqual({ route: '/sw.js', headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } });
});

test('@claim:free-local-game plays without accounts, payments, timers, lives, or leaderboards', async ({ page }) => {
  await page.goto('/demo'); await expect(page.locator('form')).toHaveCount(0); await expect(page.getByText('Free to play')).toBeVisible();
  await expect(page.getByText(/there are no timers, lives, accounts, or leaderboards/i)).toBeVisible();
  const turns = await page.locator('#turns').textContent(); await page.waitForTimeout(1100); await expect(page.locator('#turns')).toHaveText(turns!);
});

test('390px first screen contains the full playable board and 44px controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/demo');
  const board = await page.locator('#board').boundingBox(); expect(board).not.toBeNull(); expect(board!.y).toBeLessThan(844); expect(board!.y + board!.height).toBeLessThanOrEqual(844);
  for (const name of ['Reset demo', 'Start for real', 'Sound on']) { const box = await page.getByRole('button', { name }).boundingBox(); expect(box!.height).toBeGreaterThanOrEqual(44); }
});

test('accessibility scan has no serious or critical violations', async ({ page }) => {
  await page.goto('/demo'); await page.addScriptTag({ content: readFileSync('node_modules/axe-core/axe.min.js', 'utf8') });
  const result = await page.evaluate(async () => await (window as typeof window & { axe: { run: (element?: unknown, options?: unknown) => Promise<{ violations: Array<{ impact: string }> }> } }).axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } }));
  expect(result.violations.filter(violation => ['serious', 'critical'].includes(violation.impact))).toEqual([]);
});
