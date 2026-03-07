#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

function run(cmd, cwd = ROOT) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function copyDir(src, dest, { ignore = [] } = {}) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (ignore.includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, { ignore });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

console.log('\nCleaning dist/');
const nodeExeSrc = path.join(DIST, 'node.exe');
const nodeExeTmp = path.join(ROOT, '_node.exe.tmp');
const hasNodeExe = fs.existsSync(nodeExeSrc);
if (hasNodeExe) fs.copyFileSync(nodeExeSrc, nodeExeTmp);
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST);
if (hasNodeExe) {
  fs.renameSync(nodeExeTmp, nodeExeSrc);
}

console.log('\nBuilding bundle');
run('npm run build --prefix bundles/overlay');

console.log('\nInstalling deps');
copyFile(path.join(ROOT, 'package.json'), path.join(DIST, 'package.json'));
copyFile(path.join(ROOT, 'package-lock.json'), path.join(DIST, 'package-lock.json'));
run('npm ci --omit=dev', DIST);
fs.rmSync(path.join(DIST, 'package.json'));
fs.rmSync(path.join(DIST, 'package-lock.json'));

console.log('\nCopying required files');

copyFile(path.join(ROOT, 'cfg', 'nodecg.json'), path.join(DIST, 'cfg', 'nodecg.json'));

// copy beatmaps.json and coming_up.json if exists
for (const file of ['beatmaps.json', 'coming_up.json']) {
  const src = path.join(ROOT, 'data', file);
  if (fs.existsSync(src)) {
    copyFile(src, path.join(DIST, 'data', file));
  }
}

const bundleSrc = path.join(ROOT, 'bundles', 'overlay');
const bundleDest = path.join(DIST, 'bundles', 'overlay');

copyDir(path.join(bundleSrc, 'graphics'), path.join(bundleDest, 'graphics'));
copyDir(path.join(bundleSrc, 'extension'), path.join(bundleDest, 'extension'));
copyFile(path.join(bundleSrc, 'package.json'), path.join(bundleDest, 'package.json'));

if (fs.existsSync(path.join(ROOT, 'scripts', 'start.bat'))) {
  copyFile(path.join(ROOT, 'scripts', 'start.bat'), path.join(DIST, 'start.bat'));
}
if (fs.existsSync(path.join(ROOT, 'scripts', 'start.sh'))) {
  copyFile(path.join(ROOT, 'scripts', 'start.sh'), path.join(DIST, 'start.sh'));
  fs.chmodSync(path.join(DIST, 'start.sh'), 0o755);
}

console.log(`\nBundled distribution ready at ${DIST}`);
