# Tasks — Codegotchi

- [ ] 1. Project skeleton
  - [ ] 1.1 Create public GitHub repo sawi57003-ops/codegotchi (MIT)
  - [ ] 1.2 Copy .kiro specs/steering into the repo root (NOT gitignored)
  - [ ] 1.3 index.html + styles.css shell: egg device frame, canvas mount,
    meters, graveyard section
- [ ] 2. Pet core
  - [ ] 2.1 Sprite frames per stage in pet/sprites.js (Egg/Baby/Child/
    Teen/Adult/Golden + sick + dead)
  - [ ] 2.2 State machine (streak/idle thresholds, evolution, sick, dead)
  - [ ] 2.3 Hook: 30-day lifecycle simulation after state-machine edits
- [ ] 3. GitHub data
  - [ ] 3.1 github.js: public events fetch + streak computation + cache
  - [ ] 3.2 Manual check-in fallback when the API is unreachable
  - [ ] 3.3 Username input (default sawi57003-ops)
- [ ] 4. Care and play
  - [ ] 4.1 Hunger/happiness meters + feed + reactions (pet/lines.js)
  - [ ] 4.2 Bug Squash mini-game (game/bugsquash.js, 60 seconds)
  - [ ] 4.3 Graveyard with epitaphs + new-egg flow
- [ ] 5. Polish
  - [ ] 5.1 Share button (copyable pet summary)
  - [ ] 5.2 Responsive layout (desktop + phone)
  - [ ] 5.3 Custom agent edge-case test: API down, empty history,
    100-day streak, timezone boundaries — zero failures
- [ ] 6. Ship
  - [ ] 6.1 Deploy to GitHub Pages, verify live
  - [ ] 6.2 Record <3 min demo video, upload to YouTube
  - [ ] 6.3 Publish blog post (Kiroween 2026 mention) for the Blog Bonus
  - [ ] 6.4 X post starting with #KiroweenHackathon26 (Social Blitz)
  - [ ] 6.5 Submit on Devpost (Resurrection, solo, Fngyuan) before
    5 Dec 2026 05:00 WIB
