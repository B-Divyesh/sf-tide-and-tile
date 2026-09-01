import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('@claim:demo-sandbox loads a guided sample and writes only demo storage', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.locator('.tile').first().click();
  const keys=await page.evaluate(()=>Object.keys(localStorage));
  expect(keys.every(key=>key.startsWith('demo:'))).toBeTruthy();
});

test('@claim:privacy-local only makes same-origin requests during demo play', async ({ page, baseURL }) => {
  const seen:string[]=[]; page.on('request',request=>seen.push(request.url()));
  await page.goto('/demo'); await page.locator('.tile').first().click();
  expect(seen.every(url=>url.startsWith(baseURL!))).toBeTruthy();
});

test('@claim:keyboard-tiles rotates a focused tile with Enter', async ({ page }) => {
  await page.goto('/demo'); const cell=page.locator('.tile').first(); await cell.focus();
  const before=await cell.getAttribute('aria-label'); await page.keyboard.press('Enter');
  await expect(cell).not.toHaveAttribute('aria-label',before!);
});

test('@claim:restart-resets restarts a scrambled sample board', async ({ page }) => {
  await page.goto('/demo'); await page.locator('.tile').first().click();
  await page.getByRole('button',{name:'Restart this board'}).click();
  await expect(page.getByText('Board restarted.')).toBeVisible();
  await expect(page.getByText('Turns 0')).toBeVisible();
});

test('@claim:offline-reload works offline after the first visit', async ({ browser, baseURL }) => {
  const context=await browser.newContext(); const page=await context.newPage();
  await page.goto(`${baseURL}/demo`); await page.waitForTimeout(600); await page.reload(); await page.waitForTimeout(300);
  await context.setOffline(true); await page.reload();
  await expect(page.getByRole('heading',{name:'Make today’s harbor route'})).toBeVisible();
  await context.close();
});

test('accessibility scan has no serious or critical violations', async ({ page }) => {
  await page.goto('/demo');
  await page.addScriptTag({ content: readFileSync('node_modules/axe-core/axe.min.js', 'utf8') });
  const result=await page.evaluate(async()=>await (window as any).axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa'] } }));
  expect(result.violations.filter((v:any)=>['serious','critical'].includes(v.impact))).toEqual([]);
});
