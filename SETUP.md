# Setting up AMC 8 Quest for your family

Total time: ~5 minutes for the basic version, ~15 with cross-device sync.
Everything is free. (Prefer to delegate? Give [AGENT_SETUP.md](AGENT_SETUP.md)
to an AI assistant.)

## Part 1 — Basic setup (required)

1. **Copy the repo.** On the template's GitHub page click **Use this
   template → Create a new repository** (any name, must be public for free
   Pages hosting).

2. **Add your players.** Edit `config.js` (the pencil icon on GitHub works
   fine). In the `players` block, add one line per person:

   ```js
   players: {
     maya: { name: "Maya", color: "#53c8ff" },
     leo:  { name: "Leo",  color: "#ffb84d" },
   },
   ```

   The left-hand key is a permanent id — don't change it after someone has
   progress. Colors should be bright/light (they sit on dark navy).

3. **Turn on GitHub Pages.** Repo **Settings → Pages → Source: Deploy from a
   branch → Branch: main, folder: / (root) → Save**.

4. Wait a minute, then open `https://<your-username>.github.io/<repo-name>/`.
   The game works now — progress saves per device ("💾" chip on the home
   screen).

## Part 2 — Cross-device sync (optional, recommended)

Progress syncs through a Google Form (writes) and its response Sheet (reads)
on **your** Google account. Nothing else can write to your sheet except by
that form, and the app never sees your Google credentials.

1. **Create the form.** Go to [forms.new](https://forms.new). Title it
   something like "AMC8 Quest Sync (do not delete)". Add exactly **three
   questions, all "Short answer" type**, titled: `kid`, `type`, `info`.
   Delete any default multiple-choice question.

2. **Publish it.** Click **Publish**, with responder access **Anyone with the
   link** (the default on personal accounts). Don't require sign-in.

3. **Link a response sheet.** Responses tab → **Link to Sheets** → Create a
   new spreadsheet.

4. **Share the sheet read-only.** Open the new spreadsheet → **Share** →
   General access: **Anyone with the link → Viewer** → Done. (Required so the
   game page can read it. It will contain player names, answer letters, and
   timestamps.)

5. **Collect the three IDs** for `config.js`:
   - **Form URL**: on the form's editor click ⋮ → **Get pre-filled link**,
     type anything into all three boxes, click **Get link → Copy link**. The
     copied URL looks like
     `https://docs.google.com/forms/d/e/LONG_ID/viewform?...entry.111=...&entry.222=...&entry.333=...`
   - `form` is that URL up through the long id, with the ending changed to
     `/formResponse`:
     `https://docs.google.com/forms/d/e/LONG_ID/formResponse`
   - `fields` are the three `entry.NNNNN` numbers, **in the order you filled
     the boxes**: first = `kid`, second = `type`, third = `info`.
   - `sheet` is the id from the spreadsheet's URL:
     `https://docs.google.com/spreadsheets/d/THIS_PART/edit`.

6. **Fill in `config.js`:**

   ```js
   sync: {
     form: "https://docs.google.com/forms/d/e/LONG_ID/formResponse",
     fields: { kid: "entry.111", type: "entry.222", info: "entry.333" },
     sheet: "SPREADSHEET_ID",
   },
   ```

7. Reload the game — the home-screen chip should now say **"☁️ progress
   synced"**. Solve a problem and watch a row appear in your sheet.

## Part 3 — Parent password (optional, recommended)

Protects the grown-up settings (daily goal + progress resets) from curious
kids.

1. Open your deployed game, press F12 (DevTools) → Console, and paste
   (replacing `YOUR-PASSWORD`):

   ```js
   await (async p => [...new Uint8Array(await crypto.subtle.digest(
     'SHA-256', new TextEncoder().encode(p)))]
     .map(b => b.toString(16).padStart(2,'0')).join(''))('YOUR-PASSWORD')
   ```

2. Copy the 64-character result into `config.js` as `parentPasswordHash`.

## Troubleshooting

- **Chip says "offline"** → the sheet isn't link-viewable, or an id in
  `sync` is wrong. Re-check Part 2 steps 4–6.
- **Rows appear in the form's Responses tab but not the sheet** → you skipped
  step 3 (Link to Sheets).
- **Problem won't load** → the AoPS wiki rate-limits briefly; the app retries
  automatically, or use the retry button.
- **A new AMC 8 happened** → each January, add the new year's answer key
  (25 letters, from the `YYYY AMC 8 Answer Key` page on the AoPS wiki) to the
  `ANSWERS` table in `index.html`.
