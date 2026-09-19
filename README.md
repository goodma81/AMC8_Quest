# AMC 8 Quest

A daily math-practice game for kids, built around real AMC 8 / AJHSME
competition problems. Free to host on GitHub Pages, no build step, no
dependencies, no accounts.

**[Live demo](https://nssharpe.github.io/amc8-quest-template/)** (device-local
mode, generic players — make your own to customize).

## What the kids get

- A daily mission: pick a problem number (1–25, or 🎲 random) and solve one
  real competition problem against a timer. Higher numbers are harder and
  worth more XP.
- **41 contests, 1,025 problems**: every AMC 8 (1999–2026) and its predecessor
  the AJHSME (1985–1998).
- XP, levels with silly titles, an evolving pet with original SVG artwork
  (dragon, unicorn, robot, cat, fox, shark, dino, or penguin — 10 evolution
  stages each), and 15 trophies (streaks, speed solves, comebacks, the #25 "final
  boss"…).
- Per-player stats: solved count, accuracy, average time, day streak, hardest
  problem solved, and a per-number drilldown table.
- A configurable daily *goal* (default 1) — never a cap; extra problems are
  bonus rounds.
- Anti-cheese rules: refreshing resumes the same problem with the clock
  running, and quitting counts as a wrong answer (with 5 consolation XP).
- **Scratchpad**: a "✏️ Scratch" toggle turns the whole problem screen into a
  drawing surface (one finger/stylus draws, two fingers scroll, pressure-
  sensitive, palm rejection). Strokes get a contrasting halo so they read on
  the white problem card and the dark background alike; pen colors, eraser,
  undo, clear. Answer buttons are blocked while drawing; the drawing stays
  visible after "Done" so they can see their work while answering.

## How it works

- **One static page.** `index.html` is the whole app; `config.js` holds your
  family's settings (players, optional sync backend, optional parent
  password).
- **Problems are fetched live** from the
  [Art of Problem Solving wiki](https://artofproblemsolving.com/wiki/) API at
  the moment a problem starts. No copyrighted problem text is stored in this
  repo — only the answer letters (plain facts). Problems are © MAA.
- **Progress** is an append-only event log. Out of the box it lives in the
  browser's `localStorage` (per device). Optionally, add a free sync backend —
  a Google Form + Sheet on your own Google account — and progress follows the
  kids across every device. Offline play queues events and syncs later.
- **Grown-up settings** (optionally password-gated): the daily goal,
  "un-count a problem" — wipes one player's attempts at a specific problem so
  it can be served again (e.g. it displayed badly on a bad connection) — and
  per-player full resets. All are synced events, so they apply everywhere.
- **Resilient rendering.** Numbers, diagrams, and answer choices are images
  served by AoPS. The app waits for them (with retries) before revealing a
  problem; any that still fail on a weak connection are replaced by the
  readable LaTeX source text plus a reload banner, so information is never
  silently blank.

## Set up your own

1. Click **Use this template** on GitHub (or fork), name your repo.
2. Edit `config.js` — player names and colors, at minimum.
3. In the repo settings, enable **GitHub Pages** (deploy from branch, `/`).
4. Done — the game is live at `https://<you>.github.io/<repo>/` in
   device-local mode.
5. Optional but recommended: add cross-device sync and a parent password —
   follow **[SETUP.md](SETUP.md)** (15 minutes, all free), or hand
   **[AGENT_SETUP.md](AGENT_SETUP.md)** to an AI assistant (Claude, etc.) and
   let it do the whole thing.

## Game rules (XP, levels, pets, trophies)

- **Correct answer**: `20 + 4 × problem number` XP (so #1 = 24, #25 = 120).
- **Speed bonus**: a flat **+15 XP** on a correct answer solved under par, where
  **par = 30 + 6 × problem number seconds** (#1: 36 s, #10: 90 s, #25: 3 min).
  All-or-nothing, no extra credit for being faster. The timer starts when the
  problem screen opens and stops at "Lock it in". The bonus is deliberately
  worth a lot on easy problems (+63% on #1) and little on hard ones (+13% on
  #25) so kids sprint the easy stuff but aren't pushed to rush hard problems.
- **Wrong answer or give-up**: 5 consolation XP.
- **Levels**: the XP needed to reach the next level grows by 40 each level
  (80, 120, 160, …). Each level has a silly title (Math Egg → … → AMC
  Grandmaster).
- **Pets** evolve at levels 3, 6, 10, 15, 21, 28, 36, 45, and 55 — ten
  stages from Egg to LEGENDARY, sized so the final evolution lands near the
  end of the full 1,025-problem journey. The art is original SVG (in
  `assets/pets/`, generators in `tools/`), MIT-licensed like the code.
- **Changing pets**: a "change buddy" button on the dashboard swaps species
  for 50 XP (so it's a decision, not a daily whim); the app warns if the
  spend would drop a level.
- **Streak**: consecutive days with at least one attempt (right or wrong).
- **Problem selection**: picking a number serves a random *never-attempted*
  year for that number; once every year has been tried, missed problems come
  back for retry. A number is grayed out once all 41 of its problems are
  solved. "Random" picks uniformly among numbers that still have unsolved
  problems.
- **Trophies** (15): first solve, 10/50/100/250 solved, 3/7/30-day streaks,
  a correct answer under 60 s, solving a #20+, solving a #25, solving a
  problem you previously missed, 5 and 10 correct in a row, and solving a
  pre-1999 AJHSME problem.

All of these are small constants near the top of `index.html`
(`xpFor`, `speedParSec`, `xpCost`, `STAGE_LEVELS`, `BADGES`) if you want a
different curve.

## FAQ

**Is it really free?** Yes — GitHub Pages hosting is free, the AoPS wiki is
public, and the optional sync backend is a Google Form + Sheet on your own
Google account.

**Is progress private?** In device-local mode, completely. With sync enabled,
the response sheet must be "anyone with link can view" so the page can read
it — first names and answer history end up behind an unguessable URL. Use
nicknames if that bothers you.

**What about cheating?** The parent password keeps kids out of settings and
resets. Beyond that it's the honor system — profiles have no logins.

**New AMC 8 each year?** Append the new answer key string to `ANSWERS` in
`index.html` each January (scrape it from the AoPS wiki answer-key page).

## Credits & license

Problem content © Mathematical Association of America, displayed live from
the Art of Problem Solving wiki — thank them by buying their books. App code
is MIT licensed ([LICENSE](LICENSE)). Built with
[Claude Code](https://claude.com/claude-code).
