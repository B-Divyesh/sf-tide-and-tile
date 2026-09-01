import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const base = 'https://tide-and-tile.sociobot.in';
const browser = await chromium.launch({ headless: true });
const evidence = {};

async function addAxe(page) {
  await page.evaluate(readFileSync('node_modules/axe-core/axe.min.js', 'utf8'));
  return page.evaluate(async () => {
    const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } });
    return result.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, nodes: nodes.length }));
  });
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base });
  const page = await context.newPage();
  const requests = [];
  const responses = [];
  const errors = [];
  page.on('request', request => requests.push({ method: request.method(), url: request.url(), type: request.resourceType() }));
  page.on('response', response => responses.push({ status: response.status(), url: response.url() }));
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));

  const response = await page.goto(base, { waitUntil: 'networkidle' });
  const cold = {
    status: response.status(),
    title: await page.title(),
    h1Count: await page.locator('h1').count(),
    h1: await page.locator('h1').innerText(),
    intro: await page.locator('.intro').innerText(),
    primary: await page.locator('.primary').innerText(),
    primaryVisible: await page.locator('.primary').isVisible(),
    boardVisible: await page.locator('#board').isVisible(),
    mainTag: await page.locator('main').count(),
    lang: await page.locator('html').getAttribute('lang'),
  };

  await page.locator('.primary').click();
  await page.waitForURL(`${base}/demo`);
  const initialTurns = await page.locator('#turns').innerText();
  const firstTile = page.locator('.tile').first();
  await firstTile.focus();
  const initialLabel = await firstTile.getAttribute('aria-label');
  await page.keyboard.press('KeyX');
  const invalidKeyUnchanged = (await firstTile.getAttribute('aria-label')) === initialLabel && (await page.locator('#turns').innerText()) === initialTurns;
  await page.keyboard.press('Enter');
  const enterRotated = (await firstTile.getAttribute('aria-label')) !== initialLabel;
  await page.getByRole('button', { name: 'Restart this board' }).click();
  await firstTile.focus();
  const beforeSpace = await firstTile.getAttribute('aria-label');
  await page.keyboard.press('Space');
  const spaceRotated = (await firstTile.getAttribute('aria-label')) !== beforeSpace;
  await page.getByRole('button', { name: 'Restart this board' }).click();

  await page.evaluate(() => document.activeElement?.blur());
  const tabSequence = [];
  for (let index = 0; index < 30; index++) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      text: document.activeElement?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 60),
      className: document.activeElement?.className,
    }));
    tabSequence.push(focused);
    if (String(focused.className).includes('tile')) break;
  }
  const outline = await page.locator(':focus').evaluate(element => {
    const style = getComputedStyle(element);
    return { outlineColor: style.outlineColor, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  await page.keyboard.press('ArrowRight');
  const arrowFocusIndex = await page.locator('.tile').evaluateAll(tiles => tiles.findIndex(tile => tile === document.activeElement));

  const needed = await page.locator('.tile').evaluateAll(tiles => tiles.map(tile => Number(tile.dataset.needed)));
  for (let index = 0; index < needed.length; index++) {
    for (let turn = 0; turn < needed[index]; turn++) await page.locator('.tile').nth(index).click();
  }
  await page.getByRole('dialog').waitFor({ state: 'visible' });
  const win = {
    dialog: await page.getByRole('dialog').isVisible(),
    title: await page.getByRole('dialog').getByRole('heading').innerText(),
    text: await page.getByRole('dialog').innerText(),
    turns: await page.locator('#turns').innerText(),
  };
  await page.getByRole('button', { name: 'Copy result' }).last().click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  await page.screenshot({ path: '.factory/evidence/verify-2/live-win-desktop.png', fullPage: false });
  const storedAfterWin = await page.evaluate(() => ({ ...localStorage }));
  await page.reload({ waitUntil: 'networkidle' });
  const restored = {
    dialogVisible: await page.getByRole('dialog').isVisible(),
    turns: await page.locator('#turns').innerText(),
    dialogText: await page.getByRole('dialog').innerText(),
  };
  await page.getByRole('button', { name: 'Play this route again' }).click();
  const restart = {
    turns: await page.locator('#turns').innerText(),
    dialogCount: await page.getByRole('dialog').count(),
    state: await page.locator('#share').isDisabled(),
  };
  for (let turn = 0; turn < 12; turn++) await page.locator('.tile').last().click();
  await page.getByRole('dialog').waitFor({ state: 'visible' });
  const loss = {
    dialog: await page.getByRole('dialog').isVisible(),
    title: await page.getByRole('dialog').getByRole('heading').innerText(),
    text: await page.getByRole('dialog').innerText(),
    turns: await page.locator('#turns').innerText(),
  };
  await page.screenshot({ path: '.factory/evidence/verify-2/live-loss-desktop.png', fullPage: false });
  await page.getByRole('button', { name: 'Try this route again' }).click();

  const routeAxe = {};
  for (const route of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    routeAxe[route] = await addAxe(page);
  }
  evidence.desktop = { cold, invalidKeyUnchanged, enterRotated, spaceRotated, tabSequence, outline, arrowFocusIndex, win, clipboard, storedAfterWin, restored, restart, loss, routeAxe, requests, responses, errors };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  const board = await page.locator('#board').boundingBox();
  const controls = {};
  for (const name of ['Reset demo', 'Start for real', 'Sound on', 'Restart this board', 'Show the next rule']) controls[name] = await page.getByRole('button', { name }).boundingBox();
  const beforeTap = await page.locator('.tile').first().getAttribute('aria-label');
  await page.locator('.tile').first().tap();
  const touchRotated = (await page.locator('.tile').first().getAttribute('aria-label')) !== beforeTap;
  const geometry = {
    viewport: await page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth })),
    board,
    boardInFirstViewport: board.y + board.height <= 844,
    controls,
    touchRotated,
    h1Visible: await page.locator('h1').isVisible(),
    primaryVisible: await page.locator('.primary').isVisible(),
  };
  await page.screenshot({ path: '.factory/evidence/verify-2/live-demo-mobile.png', fullPage: false });
  evidence.mobile = { geometry, axe: await addAxe(page), errors };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  evidence.reducedMotion = await page.evaluate(() => ({
    matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    tileTransition: getComputedStyle(document.querySelector('.tile svg')).transitionDuration,
    figureTransform: getComputedStyle(document.querySelector('figure')).transform,
  }));
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  await context.setOffline(true);
  const response = await page.reload({ waitUntil: 'domcontentloaded' });
  evidence.offline = {
    responseStatus: response?.status() ?? null,
    headingVisible: await page.getByRole('heading', { name: 'Make today’s harbor route' }).isVisible(),
    boardVisible: await page.locator('#board').isVisible(),
    errors,
  };
  await context.close();
}

await browser.close();
console.log(JSON.stringify(evidence, null, 2));
