/**
 * Deploy the client build to the gh-pages branch.
 * Usage: npm run deploy   (from the repo root)
 */
import { execSync } from 'node:child_process';
import { cpSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'client', 'dist');
const run = (cmd, cwd = root) => execSync(cmd, { stdio: 'inherit', cwd });

const REPO = 'https://github.com/AvishekChy77/bd-doctors.git';
const BASE = '/bd-doctors/';

console.log('▶ building client with base', BASE);
process.env.BASE_PATH = BASE;
run(`npm --prefix client run build`, root);

// SPA fallback + disable Jekyll
cpSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));
writeFileSync(path.join(dist, '.nojekyll'), '');

console.log('▶ pushing to gh-pages');
rmSync(path.join(dist, '.git'), { recursive: true, force: true });
run('git init -b gh-pages', dist);
run('git add -A', dist);
run('git commit -m "deploy"', dist);
run(`git push -f ${REPO} gh-pages`, dist);
rmSync(path.join(dist, '.git'), { recursive: true, force: true });

console.log('✅ deployed → https://avishekchy77.github.io/bd-doctors/');
