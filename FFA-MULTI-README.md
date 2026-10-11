# EON FFA native Multi — isolated patch 2.0.1

Only `src/eonNativeMulti.js` and `src/eonSenpaProtocol.js` are changed from the attached EON 2.0.0 sources. The bundled Tampermonkey userscript was rebuilt using those two source files. Login, EON license-screen removal, bot accounts, replay, main WASM protocol and Vercel files remain unchanged.

## Why this is diagnostic and not a forced unlock

Senpa's initial game handshake tells EON how many **native player slots** the server allocated. A single connection cannot reliably spawn a second native player when the server has allocated only one. This patch does not manufacture a second slot, add a second WebSocket, alter the server's packet format or bypass server restrictions.

## Test on FFA

1. Disable all other Senpa userscripts. Install the included `Senpa-Recovered.user.js` in Tampermonkey.
2. Log into Senpa normally. Connect to Free For All and press Play.
3. Look at the game HUD: `FFA Multi: N server slot(s)`. Press Tab to switch / spawn native player 2 **only when N >= 2**.
4. If N = 1, check your Senpa mode/account's supported multibox permissions: the server didn't give this connection a second slot. A client-only modification cannot guarantee one.
5. If N >= 2 but Multi is not spawning, open DevTools and run `EonFFAMultiDiagnostics.exportJSON()` to save a safe summary (no tokens, JWTs, cookies, or packet payloads). Send that file to diagnose the failure. `EonFFAMultiDiagnostics.status()` prints it without downloading.

The patch now records `SERVER_SLOTS`, `SELECT_SLOT`, `SPAWN_REQUEST`, `SPAWN_CONFIRMED`, `SPAWN_UNCONFIRMED`, and `DISCONNECT`. This does not claim that the server accepted a spawn merely because the client sent it.

## Validation

JavaScript syntax, archive integrity, and two-slot/one-slot switching and spawn unit tests performed locally. Live Senpa FFA server availability and protocol acceptance remain unverified.
