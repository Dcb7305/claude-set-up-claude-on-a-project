# Project: Express Users API

## What this is
A small Express REST API. Entry point is `server.js`. Data is stored
in memory (`db/store.js`), so nothing persists between restarts.

## Commands
- `npm run dev` — start the API on http://localhost:3000 (auto-restarts on save)
- `npm test` — run tests with Node's built-in test runner; run after any code change
- `npm run lint` — run ESLint; run before committing
- Single file: `node --test tests/users.test.js`
- Single test by name: `node --test --test-name-pattern="returns 404"`

## Architecture
- `server.js` builds the Express app and exports it; it only calls `listen()`
  when run directly (`require.main === module`). Tests import `app` and hit it
  with supertest, so no real port is opened.
- Port comes from the `PORT` env var, default 3000.

## Structure
- `routes/` — one file per resource (`users.js`, `health.js`)
- `db/store.js` — shared data helper; routes should use this, not store data themselves
- `tests/` — test files named after the route they cover (e.g. `users.test.js`)

## Conventions
- New resource = new file in `routes/` + ideally a matching test file in `tests/`
  (the `/health` test currently lives in `users.test.js`)
- Keep route handlers thin; put data logic in `db/`
- Follow the existing ESLint rules in `.eslintrc.json`

## Gotchas
- CommonJS only (`require`/`module.exports`); ESLint uses `sourceType: "script"`, so `import` will fail lint.
- Store IDs are numbers, so routes convert with `Number(req.params.id)` before calling the store.
- `store.getAllUsers()` returns the live array, not a copy.
- CI (`.github/workflows/ci.yml`) runs `npm run lint` then `npm test` on Node 22.

## Don't
- Never read, print, or edit `.env` (real secrets live there). Use `.env.example` for config reference.
- Don't add or change dependencies in `package.json` without asking first
- Don't modify app code unless I ask
