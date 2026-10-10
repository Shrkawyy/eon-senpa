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
