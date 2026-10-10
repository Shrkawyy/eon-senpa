## Latest patch: EON 1.9.0 — Auth & Bot Diagnostics

This patch replaces the previous bot-only console package. It verifies accounts via the official Senpa account endpoint before bot connections and diagnoses OAuth callback, adoption and account HTTP statuses. It does not circumvent account/server limits. Read `AUTH-BOT-DIAGNOSTICS.md` before testing.

**Important:** the recovered third-party `inline-2.js` test shim fabricated EON authorization and heartbeat responses, so it is **disabled** in the deployed script. A legitimate EON authorization may be necessary to run proprietary components. Keep a backup of the previous version and test locally first. Only the deployment script uses `src/` files. `original-files/` is a historical recovery backup, not loaded.

# Senpa Recovery — Personal Edition

Recovered from a Chrome DevTools/Tampermonkey export supplied by the owner. This repository contains a usable **self-contained userscript** and editable extracted source scripts.

## Install
1. Install Tampermonkey in your browser.
2. Open `Senpa-Recovered.user.js` (Raw view on GitHub), then install it in Tampermonkey.
3. Visit `https://senpa.io/web`. Disable any earlier Eon/Senpa script first to prevent duplicate injection.

## GitHub
Upload everything in this folder to a GitHub repository. Use the **Raw** URL of `Senpa-Recovered.user.js` for installation. A normal GitHub blob link is not an install URL.

## Editing
- `src/`: JavaScript modules extracted exactly from the embedded payload in execution order.
- `script-order.json`: their names and execution order.
- `original-files/`: potentially useful source snapshots from DevTools; not loaded automatically.
- `Senpa-Recovered.user.js`: the runtime build containing HTML/CSS, assets and JS modules; editing `src` alone does not update this built userscript.

## Limitations & precautions
- This is a recovered snapshot, not a verified reconstruction of the original GitHub repository.
- The userscript replaces the game's page with a custom client. It may break when Senpa APIs change.
- Some recovered logic includes `local-test` and a fetch response override from the source snapshot. Do not treat this as valid licensing/authentication, and review/remove test behavior before production use.
- Inspect source before publishing publicly, especially for account/session handling or embedded credentials.
- External game connectivity, spawning and gameplay cannot be tested offline.
- Do not run the other third-party/game scripts from DevTools as part of this userscript.

## FFA server refresh (recovery patch)
- The original dropdown contains hard-coded server endpoints. The patched protocol now queries `https://api.senpa.io/tracker` and refreshes known EU option addresses, including Nemesis/FFA, when a matching entry is returned.
- It keeps original option DOM nodes because the client binds click listeners directly to them.
- If the tracker is unavailable, it falls back to the previously saved endpoint, with a console warning.
- **Not live-verified**: the tracker response, live socket handshake and spawn must be tested in a browser before release. No server is created or started by the script.

## Experimental 10-account manager
- Ten separate account slots; each slot is assigned two helper connections.
- Login uses official Senpa OAuth popups; no passwords are requested by the userscript.
- A shared browser Facebook cookie may cause the same Facebook account to be selected repeatedly. Change Facebook identity in the popup if needed.
- This only adds client-side account management. It does **not** bypass Senpa server-side limits or guarantee 20 active connections. Test locally before deploying.
- The main account remains separate. Token storage is browser localStorage and should be treated as sensitive. Do not post it publicly.

## Session diagnostics update 1.8.1
- Clarifies that a **connection** may have up to two native player slots. Two connections give at most four player slots **if the server allocates them**, not four additional connections.
- Bot Connect now requires an explicit bot-account session rather than silently connecting as a guest.
- Code 4406 is displayed as a server session rejection: this update does not override the server or guarantee that simultaneous Facebook sessions are supported.
- A second Facebook sign-in in the same browser may invalidate a previous session. If this occurs, test with the game's ordinary official login and contact Senpa support; do not attempt to bypass server limits.
- Files still contain legacy `inline-2.js` code that mocks `eonauth.battlecell.io` calls. Audit ownership/authorization and remove it before public distribution if it is not yours to modify.
