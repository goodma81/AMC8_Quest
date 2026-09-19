# AMC 8 Quest — setup instructions for AI agents

You are an AI assistant (Claude Code, or similar) helping a user deploy their
own copy of AMC 8 Quest, a static daily-math-practice game for kids. This
file is your complete task specification. A human-oriented version exists in
SETUP.md; prefer this file.

## What you are building

A public GitHub repository, deployed on GitHub Pages, containing this
template's files with a customized `config.js`. Optionally (strongly
recommended), a Google Form + Sheet backend on the **user's own Google
account** for cross-device progress sync.

## Information to collect from the user first

1. Player names (and optionally preferred colors) — one or more.
2. Whether they want cross-device sync (needs their Google account).
3. A parent password for the settings screen (they choose it; you only store
   its SHA-256 hash).
4. A GitHub repository name.

## Step 1 — Repository

- Copy all files from this template into a new **public** repo on the user's
  GitHub account (`gh repo create <name> --public ...`, or the GitHub "Use
  this template" flow).
- Edit `config.js` → `players`: one entry per player. Keys are permanent
  lowercase ids; `name` is the display name; `color` must have ≥ 4.5:1 WCAG
  contrast against `#1f2148` (safe choices: `#53c8ff`, `#ff9ce0`, `#ffb84d`,
  `#3ddc97`, `#b28bff`).
- Enable GitHub Pages: `gh api -X POST repos/<owner>/<repo>/pages -f
  "source[branch]=main" -f "source[path]=/"`. Poll
  `repos/<owner>/<repo>/pages/builds/latest` until `status == "built"`.
- Verify the site loads and shows the configured player cards.

Without sync configured the app runs in device-local mode (home-screen chip
shows 💾). That is a valid, working end state if the user skips sync.

## Step 2 — Sync backend (optional)

The backend is: writes = HTTP POST to a Google Form; storage = the Form's
linked response spreadsheet; reads = the spreadsheet's gviz JSONP endpoint.
The app ships all logic; you only provision the Google artifacts and fill in
three config values.

If you cannot drive the user's browser, give them SETUP.md Part 2 and ask
for the resulting three values instead. Otherwise:

1. In the user's logged-in browser, create a Google Form titled
   `AMC8 Quest Sync (do not delete)` with EXACTLY three questions, all
   **Short answer**, titled `kid`, `type`, `info` (delete the default
   multiple-choice question — tip: converting a question's type via the
   dropdown can be finicky to automate; creating one Short answer question
   and duplicating it twice is more reliable).
2. Publish the form with responder access **Anyone with the link**, no
   sign-in required.
3. Responses tab → Link to Sheets → create a new spreadsheet.
4. Set the spreadsheet's sharing to **Anyone with the link: Viewer**. Warn
   the user this makes player names + answer history readable at an
   unguessable URL, and get their OK.
5. Extract the public form id and entry ids: fetch the form's public
   `viewform` URL (no auth needed once published) and parse
   `FB_PUBLIC_LOAD_DATA_` — each question is `[.., label, .., ..,
   [[entryId, ...]]]` — or grep `entry.(\d+)` occurrences in page source.
   Map them by their question labels (`kid`, `type`, `info`); do not assume
   ordering.
6. Fill `config.js` → `sync`:
   ```js
   sync: {
     form: "https://docs.google.com/forms/d/e/<PUBLIC_FORM_ID>/formResponse",
     fields: { kid: "entry.<id1>", type: "entry.<id2>", info: "entry.<id3>" },
     sheet: "<SPREADSHEET_ID>",
   },
   ```

### Verification (do not skip)

From any browser context on a DIFFERENT origin than docs.google.com:

- **Write test**: `fetch(FORM_RESPONSE_URL, {method:'POST', mode:'no-cors',
  body: new URLSearchParams({[kidField]:'test', [typeField]:'test',
  [infoField]:'{"id":"setup-test"}'})})` must resolve, and a row must appear
  in the spreadsheet within ~5 s.
- **Read test**: inject `<script
  src="https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?tqx=responseHandler:CB&headers=1">`
  with a global `CB` — it must fire with the test row visible. If it never
  fires, the sheet is not link-viewable.
- The test row is harmless (the app validates and ignores rows whose `kid`
  is not a configured player id and whose payload doesn't match an event
  schema), but you may delete it.
- Finally load the deployed game: the chip must read "☁️ progress synced".
  Play one problem end-to-end and confirm a row lands in the sheet.

## Step 3 — Parent password (optional)

Compute `SHA-256(password)` as lowercase hex (64 chars) and set
`config.js` → `parentPasswordHash`. In a browser:
`crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw))`. Tell the
user this is a child-gate, not real security — the hash is public.

## Facts about the app you may need

- Progress = append-only event log. Event types: `answer` `{id,y,n,a,ok,t,d}`,
  `pet` `{id,pet,d}`, `reset` `{id,d}`, `daily` `{id,daily,d}` (kid=`*` for
  `daily`). Rows are `[timestamp, kid, type, info-JSON]`. Events are deduped
  by `id`; XP is recomputed from a formula, never trusted from data.
- Problems are fetched at runtime from
  `artofproblemsolving.com/wiki/api.php?action=parse&origin=*` (CORS open,
  rate-limited after ~4 rapid requests — the app retries with backoff).
  Never copy problem text into the repo: AMC problems are © MAA; the repo
  stores only answer letters.
- Contests covered: 1985–1998 AJHSME + 1999–2026 AMC 8 (2021 canceled).
  Each January, append the new year's 25-letter answer key to `ANSWERS` in
  `index.html`, scraped from the wiki page `YYYY AMC 8 Answer Key` (respect
  the ~3 s/request rate limit).
- Do not rename the three form fields or reorder `ANSWERS`; do not make the
  response sheet private after setup; player ids in `config.js` are
  load-bearing once progress exists.
