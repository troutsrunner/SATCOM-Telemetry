'use strict';

// ---------------------------------------------------------------------------
// How this works
// ---------------------------------------------------------------------------
//
// PACKAGED (what end users run after installing):
//   electron-builder bundles the Next.js standalone build into
//   resources/nextapp/.  The standalone build (next build with
//   output:'standalone') produces a self-contained server.js plus a minimal
//   node_modules folder.  We require() that server.js directly in the Electron
//   main process, which runs it using Electron's *own* built-in Node.js
//   runtime — the end user never needs Node.js or npm installed.
//
// DEVELOPMENT (npm run dev inside electron/):
//   We spawn 'next dev' as a child process for hot-reloading.
//   Node.js / npm must be available on the developer's machine.
// ---------------------------------------------------------------------------

const { app, BrowserWindow, dialog, shell } = require('electron');
const { spawn } = require('child_process');
const net = require('net');
const http = require('http');
const path = require('path');

let mainWindow = null;
let devNextProcess = null; // only used in --dev mode
let serverPort = null;

const isDev = !app.isPackaged;

// ---------------------------------------------------------------------------
// Port utilities
// ---------------------------------------------------------------------------

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once('error', () => resolve(false));
    server.listen(port, '127.0.0.1', () => server.close(() => resolve(true)));
  });
}

async function findFreePort(start = 3000) {
  let port = start;
  while (!(await isPortFree(port))) {
    port += 1;
    if (port > 65535) throw new Error('No free port found.');
  }
  return port;
}

// ---------------------------------------------------------------------------
// Next.js server — production (packaged) mode
// ---------------------------------------------------------------------------
//
// Next's standalone build emits .next/standalone/server.js.
// electron-builder copies that folder to resources/nextapp/.
// We require() it here so it runs inside Electron's Node.js — no external
// node binary, no npm, nothing for the user to install.
//
function startStandaloneServer(port) {
  const serverPath = path.join(process.resourcesPath, 'nextapp', 'server.js');

  // The standalone server reads PORT and HOSTNAME from the environment.
  process.env.PORT = String(port);
  process.env.HOSTNAME = '127.0.0.1';

  console.log(`[electron] Loading standalone server: ${serverPath}`);
  try {
    require(serverPath);
  } catch (err) {
    throw new Error(
      `Failed to load the Next.js standalone server.\n` +
        `Expected path: ${serverPath}\n` +
        `Error: ${err.message}`
    );
  }
}

// ---------------------------------------------------------------------------
// Next.js server — development mode
// ---------------------------------------------------------------------------
//
// In development, spawn 'next dev' as a child process for hot-reloading.
//
function startDevServer(port) {
  const appPath = path.join(__dirname, '..', 'app');
  const isWindows = process.platform === 'win32';
  const npmCmd = isWindows ? 'npm.cmd' : 'npm';

  console.log(`[electron] Starting Next.js dev server on port ${port} (cwd: ${appPath})`);

  devNextProcess = spawn(npmCmd, ['run', 'dev', '--', '--port', String(port)], {
    cwd: appPath,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PORT: String(port) },
    shell: false,
  });

  devNextProcess.stdout.on('data', (d) => process.stdout.write(`[next] ${d}`));
  devNextProcess.stderr.on('data', (d) => process.stderr.write(`[next] ${d}`));
  devNextProcess.on('error', (err) =>
    console.error('[electron] Failed to start Next.js:', err.message)
  );
  devNextProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[electron] Next.js exited with code ${code}`);
    }
  });
}

// ---------------------------------------------------------------------------
// Wait for the HTTP server to be ready
// ---------------------------------------------------------------------------

function waitForServer(port, timeoutMs = 90000) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;

    function attempt() {
      const req = http.get(
        { hostname: '127.0.0.1', port, path: '/', timeout: 2000 },
        (res) => { res.destroy(); resolve(); }
      );
      req.on('error', () => {
        if (Date.now() >= deadline) {
          reject(
            new Error(
              `Next.js server did not become ready within ${timeoutMs / 1000}s.\n` +
                (isDev
                  ? 'Tip: run  cd app && npm install  if you have not yet.'
                  : 'The packaged server failed to start — check that the build ran successfully.')
            )
          );
        } else {
          setTimeout(attempt, 600);
        }
      });
      req.on('timeout', () => req.destroy());
    }

    // Give the server a moment before the first poll.
    setTimeout(attempt, isDev ? 1500 : 300);
  });
}

// ---------------------------------------------------------------------------
// Window
// ---------------------------------------------------------------------------

function createWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'SATCOM Telemetry',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  mainWindow.loadURL(`http://127.0.0.1:${port}`);

  // Open navigations targeting a new window in the OS default browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

// ---------------------------------------------------------------------------
// App lifecycle
// ---------------------------------------------------------------------------

app.whenReady().then(async () => {
  try {
    serverPort = await findFreePort(3000);

    if (isDev) {
      startDevServer(serverPort);
    } else {
      startStandaloneServer(serverPort);
    }

    await waitForServer(serverPort);
    createWindow(serverPort);
  } catch (err) {
    console.error('[electron] Startup error:', err.message);
    dialog.showErrorBox('SATCOM Telemetry — Startup Error', err.message);
    app.quit();
  }
});

// macOS: re-open window when dock icon is clicked with no windows open.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0 && serverPort !== null) {
    createWindow(serverPort);
  }
});

// Quit when all windows are closed (non-macOS).
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Kill the dev server child process on quit (not needed in packaged mode
// because the server runs in-process and exits with Electron).
app.on('before-quit', () => {
  if (devNextProcess && !devNextProcess.killed) {
    devNextProcess.kill('SIGTERM');
  }
});
