# Codegotchi

A virtual pet that lives on your **GitHub streak**. The 1996 pocket pet,
reborn: it eats when you commit, plays when you ship, gets sick when you
skip days, and dies if you abandon it.

**Kiroween 2026 — Resurrection entry.** Live demo:
https://sawi57003-ops.github.io/codegotchi/

## How it works

| Streak | Stage |
|---|---|
| 0 days | Egg |
| 1–2 | Baby |
| 3–6 | Child |
| 7–13 | Teen |
| 14–29 | Adult |
| 30+ | Golden |

- **Feed** with a commit (or a manual check-in) to fill hunger.
- **Play Bug Squash** (60 seconds) to raise happiness.
- **2 idle days** → sick. **3+ idle days** → the pet dies and joins the
  Graveyard with an epitaph. Hatch a new egg to start over.
- The pet reads your **public** GitHub activity — no login, no token. If
  GitHub is unreachable, manual check-in mode keeps the pet alive.

## Run it

No build step, no backend. Open `index.html` in a browser, or:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## How it was built (Kiro)

- **Spec-driven**: requirements, design, and tasks were written first in
  `.kiro/specs/codegotchi/` and the app was implemented against them.
- **Steering**: project conventions in `.kiro/steering/conventions.md`.
- **Hooks**: `.kiro/hooks/lifecycle-test.cjs` simulates a 30-day lifecycle
  (evolution, sickness, death, graveyard) after every state-machine edit.
  Run it with `node .kiro/hooks/lifecycle-test.cjs`.
- **Custom agent**: `.kiro/agents/pet-tester.md` defines the pet-tester
  agent that checks edge cases (API down, empty history, 100-day streak,
  timezone boundaries).

## License

MIT. Codegotchi is an original work inspired by the 1996 pocket virtual
pet; it is not affiliated with Bandai.
