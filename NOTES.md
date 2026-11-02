# Setup Notes

## CLAUDE.md choices
- Listed the three npm commands so Claude doesn't have to dig through package.json
- Described the routes/ + tests/ pattern so new code follows the existing structure
- Added a "Don't" section: no reading .env, no dependency changes or app code edits without asking
- Kept it short so Claude gets the key facts without noise

## Permission choices (.claude/settings.json)
- Allowed: npm test, npm run lint, npm run dev, git status, git diff — safe, run often, so no prompts needed
- Denied: reading/editing .env (secrets), git push (I review before pushing), rm -rf (too destructive)
- Everything else still asks first — a middle ground between speed and safety

## Verification and what I learned
- First test: Claude said my CLAUDE.md was 0 bytes. It wasn't saved to disk yet, so Claude
  read nothing. Lesson: Claude reads from disk, not the editor.
- It also loaded a CLAUDE.md from my parent folder (a different project), because Claude
  reads CLAUDE.md files up the folder tree. I renamed that file to stop the conflict.
- After fixing both, Claude answered "npm test" and ".env" straight from my CLAUDE.md
  without running any commands.

## Project 3: Wiring Claude into the repo

### MCP server: Context7 (.mcp.json)
- Added at project scope so everyone who clones the repo gets it
- Picked Context7 because it gives Claude current Express docs and needs no API key, so no secrets in a committed file
- Allowed only its two tools (resolve-library-id, query-docs). Both are read-only, and any new tool it adds will still ask first
- Verified: asked how Express handles errors; it called Context7 twice with no permission prompt

### Skill: add-endpoint
- Adding routes is the task this project repeats, so I wrote down the house rules from routes/users.js and the tests (Number() on IDs, JSON errors with an "error" key, data only through db/store, tests on both layers)
- The description uses words people actually say ("add a DELETE /users/:id", "new route"), since that's what makes it fire
- It didn't fire at first: the file was named SKILLS.md, and the opening --- was missing, so Claude couldn't read the description
- Verified: "Add a DELETE /users/:id" showed Skill(add-endpoint). Without the skill Claude only added route tests; with it, store tests too
- CLAUDE.md holds facts that are always loaded; the skill holds a procedure loaded only for endpoint work

### Command: /pr-summary
- Every project ends with a PR, so this is a prompt I'll run every time
- Matches the format of test.md. allowed-tools is read-only git (status, diff, log), so it can't commit or push

### Hook: require-tests.js (Stop)
- Standard: Claude can't say "done" while tests are failing
- A skill only asks Claude to run tests; a hook runs every time, so it can't be skipped
- Only runs when routes/, db/, tests/ or server.js changed. stop_hook_active prevents an endless loop
- Skipped a .env hook because the deny rules already cover that
- Verified: asked Claude to change the 404 message without updating tests. It said it hadn't run the tests and tried to finish; the hook ran npm test, caught the failure, and sent it back
- Also committing block-main-push.js: settings.json already pointed to it, but it was never committed

### Headless run (headless-run.md)
- claude -p "List every route... flag any that have no test." --allowedTools "Read,Grep,Glob"
- Read-only tools because it's a report: look at everything, change nothing
- It found all 4 routes and said it couldn't run npm test, which shows the scoping worked

### What I learned
- File names and folder depth must be exact. A nested folder and SKILLS.md broke things silently, with no error
- Test each piece by making it fire (or fail), not just by checking the file exists