/* ============================================================
   AMC 8 Quest — family configuration
   This is the ONLY file you need to edit. See SETUP.md for
   step-by-step instructions (or AGENT_SETUP.md to have an AI
   assistant do it for you).
   ============================================================ */
window.QUEST_CONFIG = {

  /* ---- 1. Players ----------------------------------------
     One entry per person. The key (left side) is a permanent
     internal id — lowercase letters only, never change it once
     someone has progress. `name` is what's shown on screen and
     `color` is their card color (pick something readable on a
     dark navy background). */
  players: {
    player1: { name: "Player 1", color: "#53c8ff" },
    player2: { name: "Player 2", color: "#ff9ce0" },
    // more color ideas: "#ffb84d" (orange), "#3ddc97" (mint), "#b28bff" (violet)
  },

  /* ---- 2. Cross-device sync (optional) --------------------
     Leave these empty and everything still works — progress
     just stays on each device. To sync progress across phones,
     tablets, and computers, follow the "Sync backend" section
     of SETUP.md, then fill in:
       form:   the Google Form's /formResponse URL
       fields: the entry.NNNNN id for each of the 3 questions
       sheet:  the linked response spreadsheet's id            */
  sync: {
    form: "",
    fields: { kid: "", type: "", info: "" },
    sheet: "",
  },

  /* ---- 3. Parent password (optional) ----------------------
     SHA-256 hash of the grown-up-settings password. Empty means
     no password prompt. To generate: open your browser's
     DevTools console on the game page and run

       await (async p => [...new Uint8Array(await crypto.subtle.digest(
         'SHA-256', new TextEncoder().encode(p)))]
         .map(b => b.toString(16).padStart(2,'0')).join(''))('YOUR-PASSWORD')

     then paste the result here. (This keeps kids out; it is not
     high security — the hash is public in this file.)          */
  parentPasswordHash: "",
};
