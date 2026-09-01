import { createHash } from 'node:crypto';
import { cpSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const dist = join(root, 'dist');
const files = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (!['sw.js', 'staticwebapp.config.json'].includes(entry.name)) files.push(full);
  }
}
walk(dist);
const digest = createHash('sha256');
for (const file of [...files].sort()) digest.update(relative(dist, file)).update(readFileSync(file));
const version = digest.digest('hex').slice(0, 12);
const shell = files.map(file => `/${relative(dist, file).replaceAll('\\\\', '/')}`).filter(url => !url.endsWith('404.html') && url !== '/social.png');
const worker = `const CACHE_PREFIX='tide-tile-';\nconst CACHE='tide-tile-${version}';\nconst SHELL=${JSON.stringify(shell)};\nself.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));\nself.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));\nself.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('/'))));return}event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}))) });\n`;
writeFileSync(join(dist, 'sw.js'), worker);
cpSync(join(root, 'staticwebapp.config.json'), join(dist, 'staticwebapp.config.json'));
console.log(`service worker cache tide-tile-${version}`);
