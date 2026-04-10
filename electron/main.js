'use strict';

const { app, BrowserWindow, dialog, shell } = require('electron');
const { spawn } = require('child_process');
const net = require('net');
const http = require('http');
const path = require('path');

let mainWindow = null;
let nextProcess = null;
let serverPort = null;

const isDev = process.argv.includes('--dev');

// ---------------------------------------------------------------------------
// Port utilities
// ---------------------------------------------------------------------------

/**
 * Checks whether a given TCP port is free by trying to bind to it briefly.
 * Resolves true if free, false if in use.
 */
function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once('error', () => resolve(false));
    server.listen(port, '127.0.0.1', () => server.close(() => resolve(true)));
  });
}

/**
 * Finds the first free TCP port starting from `start`.
 */
async function findFreePort(start = 3000) {
  let port = start;
  while (!(await isPortFree(port))) {
    port += 1;
    if (port > 65535) throw new Error('No free port found.');
  }
  return port;
}

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

/**
 * Returns the absolute path to the Next.js app directory.
 * - In a packaged build the app is bundled into Electron's resources folder.
 * - In development it lives alongside this file at ../app.
 */
function getAppPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'nextapp');
  }
  return path.join(__dirname, '..', 'app');
}

// ---------------------------------------------------------------------------
// Next.js server management
// ---------------------------------------------------------------------------

/**
 * Spawns the Next.js server (dev or production) on the given port.
 */
function startNextServer(port) {
  const appPath = getAppPath();
  const isWindows = process.platform === 'win32';
  const npmCmd = isWindows ? 'npm.cmd' : 'npm';

  // In dev mode run the hot-reloading dev server; otherwise serve the built output.
  const scriptArgs = isDev
    ? ['run', 'dev', '--', '--port', String(port)]
    : ['run', 'start', '--', '--port', String(port)];

  console.log(
    `[electron] Starting Next.js ${isDev ? 'dev' : 'production'} server` +
      ` on port ${port} (cwd: ${appPath})`
  );

  nextProcess = spawn(npmCmd, scriptArgs, {
    cwd: appPath,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PORT: String(port) },
    shell: false,
  });

  nextProcess.stdout.on('data', (data) =>
    process.stdout.write(`[next] ${data}`)
  );
  nextProcess.stderr.on('data', (data) =>
    process.stderr.write(`[next] ${data}`)
  );
  nextProcess.on('error', (err) =>
    console.error('[electron] Failed to start Next.js process:', err.message)
  );
  nextProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[electron] Next.js process exited with code ${code}`);
    }
  });
}

/**
 * Polls http://localhost:{port} until the server responds (any status code),
 * or until the timeout expires.
 */
function waitForServer(port, timeoutMs = 90000) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;

    function attempt() {
      const req = http.get(
        { hostname: '127.0.0.1', port, path: '/', timeout: 2000 },
        (res) => {
          res.destroy();
          resolve();
        }
      );
      req.on('error', () => {
        if (Date.now() >= deadline) {
          reject(
            new Error(
              `Next.js server did not become ready within ${timeoutMs / 1000}s.\n` +
                (isDev
                  ? 'Make sure dependencies are installed: cd app && npm install'
                  : 'Make sure the app is built first: cd app && npm run build')
            )
          );
        } else {
          setTimeout(attempt, 600);
        }
      });
      req.on('timeout', () => req.destroy());
    }

    // Give the spawned process a moment to start before the first check.
    setTimeout(attempt, 1500);
  });
}

// ---------------------------------------------------------------------------
// Window creation
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

  // Open any links that target a new window in the system browser instead.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ---------------------------------------------------------------------------
// App lifecycle
// ---------------------------------------------------------------------------

app.whenReady().then(async () => {
  try {
    serverPort = await findFreePort(3000);
    startNextServer(serverPort);
    await waitForServer(serverPort);
    createWindow(serverPort);
  } catch (err) {
    console.error('[electron] Startup error:', err.message);
    dialog.showErrorBox(
      'SATCOM Telemetry — Startup Error',
      err.message
    );
    app.quit();
  }
});

// Re-create the window on macOS when the dock icon is clicked and no windows
// are open (standard macOS convention).
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0 && serverPort !== null) {
    createWindow(serverPort);
  }
});

// On non-macOS platforms quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Terminate the Next.js server when the Electron app is about to exit.
app.on('before-quit', () => {
  if (nextProcess && !nextProcess.killed) {
    nextProcess.kill('SIGTERM');
  }
});
