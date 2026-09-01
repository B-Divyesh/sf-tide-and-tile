import { execFileSync } from 'node:child_process';
import { defineConfig } from 'vite';

let revision = 'local';
try { revision = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim(); } catch { /* A source archive may not contain Git metadata. */ }

export default defineConfig({
  define: { __BUILD_VERSION__: JSON.stringify(`v1.1-${revision}`) },
  build: { target: 'es2022', sourcemap: false },
  publicDir: 'public'
});
