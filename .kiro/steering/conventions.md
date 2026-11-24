# Steering — Codegotchi conventions

## Project rules
- No build step. Plain HTML/CSS/JS, no bundler, no framework.
- No external assets at runtime except the public GitHub API. No webfonts,
  no CDN scripts, no images to license.
- Game Boy palette only: #0f380f / #306230 / #8bac0f / #9bbc0f, plus
  stage accent colors defined in pet/sprites.js.
- All user-visible text in English (the demo audience is global);
  comments may be Indonesian.

## Code rules
- Pure logic lives in core.js and must stay DOM-free so the Kiro hook can
  test it in Node (module.exports guard at the bottom of every shared file).
- Every state transition (evolution, sickness, death) is a pure function
  of (streak, idleDays, fedToday, happiness). No hidden state.
- Never invent a GitHub streak: the streak comes from the public events
  API or from a manual check-in the user explicitly makes.
- The pet never auto-dies on a network error: API failure falls back to
  manual check-in mode.

## Testing rules
- After any edit to core.js, run `node .kiro/hooks/lifecycle-test.cjs`
  and fix failures before committing.
- Before a release, run the pet-tester agent checklist
  (.kiro/agents/pet-tester.md): API down, empty history, 100-day streak,
  timezone boundaries — zero failures.
