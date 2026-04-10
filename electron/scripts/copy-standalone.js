#!/usr/bin/env node
// electron/scripts/copy-standalone.js
//
// Next.js standalone output (output: 'standalone') creates .next/standalone/
// with a minimal server.js + node_modules, but deliberately does NOT copy:
//   - public/           → must live at <standaloneRoot>/public/
//   - .next/static/     → must live at <standaloneRoot>/.next/static/
//
// This script copies those two directories into the standalone folder so that
// when electron-builder bundles resources/nextapp/ everything is in place.

'use strict';

const fs = require('fs');
const path = require('path');

const appDir = path.resolve(__dirname, '..', '..', 'app');
const standaloneDir = path.join(appDir, '.next', 'standalone');

if (!fs.existsSync(standaloneDir)) {
  console.error(
    'ERROR: .next/standalone does not exist.\n' +
      'Run "cd app && npm run build" first.'
  );
  process.exit(1);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy public/ → standalone/public/
const publicSrc = path.join(appDir, 'public');
if (fs.existsSync(publicSrc)) {
  const publicDest = path.join(standaloneDir, 'public');
  console.log(`Copying ${publicSrc} → ${publicDest}`);
  copyDir(publicSrc, publicDest);
} else {
  console.log('No public/ directory found — skipping.');
}

// Copy .next/static/ → standalone/.next/static/
const staticSrc = path.join(appDir, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
if (fs.existsSync(staticSrc)) {
  console.log(`Copying ${staticSrc} → ${staticDest}`);
  copyDir(staticSrc, staticDest);
} else {
  console.warn('WARNING: .next/static/ not found — the app may not render correctly.');
}

console.log('copy-standalone.js complete.');
