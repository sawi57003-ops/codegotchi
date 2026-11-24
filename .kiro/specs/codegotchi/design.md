# Design — Codegotchi

## Architecture
Static single-page app, no backend, no build step (like Pumpkin Patch).
Deployed on GitHub Pages from a public repo.

```
codegotchi/
  index.html        # egg device frame + canvas + meters + graveyard
  styles.css        # LCD green-grey palette, pixel font, device bezel
  app.js            # UI wiring, state machine, streak computation
  pet/
    sprites.js      # pixel-art frames per stage (Egg/Baby/Child/Teen/
                    #   Adult/Golden + sick + dead), drawn on canvas
    lines.js        # baked-in pet reactions (hungry, happy, sick, evolved)
  game/
    bugsquash.js    # 60-second Bug Squash mini-game
  data/
    github.js       # public events fetch + streak computation + fallback
  .kiro/            # specs, hooks, steering (Kiro usage evidence)
```

## Key decisions
- **Streak computation**: fetch `https://api.github.com/users/{user}/
  events/public?per_page=100`, take PushEvent dates, walk backwards from
  today counting consecutive days with >=1 push. Unauthenticated limit is
  60 req/hr — the app fetches at most once per load and caches in
  localStorage, so the limit is never approached.
- **State machine**: Egg → Baby → Child → Teen → Adult → Golden on streak
  thresholds; sick at 2 idle days; dead at 3 idle days. All transitions
  are pure functions of (streak, idleDays, lastFed) so they are trivially
  testable — the Kiro hook runs a 30-day simulation after every edit.
- **Pixel art**: hand-drawn sprite frames in JS arrays (no image assets
  to license, no external fetches at runtime besides the GitHub API).
- **No keys, no wallet, no account**: nothing to leak, nothing to pay.
- **Manual check-in**: if the GitHub API fails, a button "I worked today"
  records the day locally. The demo never breaks on network.

## Kiro usage (judges score this)
- Spec-driven development: requirements/design/tasks written first, then
  implemented (this directory).
- Steering docs: project conventions in .kiro/steering (naming, no-build-step
  rule, no-external-assets rule).
- Hooks: a Kiro hook that runs the 30-day lifecycle simulation (evolution,
  sickness, death, graveyard) after every state-machine edit.
- Custom agent: a "pet-tester" agent that simulates edge cases (API down,
  empty history, 100-day streak, timezone boundaries) and reports failures.
