# Project: Express Users API

## What this is
A small Express REST API. Entry point is `server.js`. Data is stored
in memory (`db/store.js`), so nothing persists between restarts.

## Commands
- `npm run dev` — start the API on http://localhost:3000 (auto-restarts on save)
- `npm test` — run tests with Node's built-in test runner; run after any code change
- `npm run lint` — run ESLint; run before committing

## Structure
- `routes/` — one file per resource (`users.js`, `health.js`)
- `db/store.js` — shared data helper; routes should use this, not store data themselves
- `tests/` — test files named after the route they cover (e.g. `users.test.js`)

## Conventions
- New resource = new file in `routes/` + a matching test in `tests/`
- Keep route handlers thin; put data logic in `db/`
- Follow the existing ESLint rules in `.eslintrc.json`

## Don't
- Never read, print, or edit `.env` (real secrets live there). Use `.env.example` for config reference.
- Don't add or change dependencies in `package.json` without asking first
- Don't modify app code unless I ask
