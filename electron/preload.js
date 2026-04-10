'use strict';

/**
 * Preload script — runs in the renderer process before page scripts load.
 *
 * The renderer communicates entirely over HTTP with the local Next.js server,
 * so no Node.js / Electron APIs need to be bridged. We expose only a minimal
 * read-only object so that page code can detect it is running inside Electron
 * if needed (e.g. to hide "open in browser" prompts).
 */

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  /** e.g. 'darwin' | 'win32' | 'linux' */
  platform: process.platform,
  /** Always true when running inside the Electron shell */
  isElectron: true,
});
