# SATCOM Telemetry — Web App

This directory contains the Next.js web application. It can be run in a browser or packaged inside the Electron desktop wrapper (see `../electron/`).

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Production Build

```bash
npm run build   # outputs to .next/standalone/ (standalone mode enabled)
npm start
```

## Testing

```bash
npm test
npm run test:watch
```

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start hot-reloading development server |
| `build` | Production build (standalone output) |
| `start` | Serve the production build |
| `lint` | Run ESLint |
| `test` | Run Jest test suite |
| `test:watch` | Run Jest in watch mode |

## Notes for Desktop (Electron) Packaging

`next.config.ts` sets `output: 'standalone'`, which is required by the Electron wrapper. The standalone build produces a self-contained `server.js` that Electron runs directly using its own Node.js runtime — no system Node.js is needed on end-user machines.

See `../electron/` and the root `README.md` for full packaging instructions.
