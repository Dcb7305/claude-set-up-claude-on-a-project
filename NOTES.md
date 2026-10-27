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
