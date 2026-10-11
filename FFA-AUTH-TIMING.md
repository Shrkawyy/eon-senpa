# EON Senpa — FFA auth-timing patch 2.0.2

This package uses the exact EON source from 2.0.1 and changes only `src/eonNativeMulti.js` and `src/eonSenpaioIntegration.js` (plus the bundled userscript and docs).

## Evidence and hypothesis

- EON uses one game WebSocket with native slots. Your FFA game handshake reported `granted slots=1`.
- ONYX uses *Primary* and *Secondary* game clients (two independent WebSockets). This is a different multibox architecture, not evidence that the same EON socket is allotted two slots.
- You also saw Senpa API 401 and 403, which can indicate invalid/expired sessions, not proof of ban.
- EON could open the main game socket before the saved Senpa session completed initial verification. If the server allocates slots at handshake, late login cannot increase that connection's allotment. The patch waits **up to 5.5 seconds** for a previously saved login (guest connects immediately), and offers a **manual reconnect** if verification completes after a single-slot handshake.

## Test

1. Disable prior EON/ONYX userscripts and install `Senpa-Recovered.user.js` from the ZIP. Back up the previous version.
2. Log in to Senpa through the official UI. Check that EON displays `Account verified`, not `Guest` or `Login pending`.
3. In Free For All, if a warning says the server assigned 1 slot before account verification, use the visible **Reconnect FFA after login** button. This disconnects the current player (with confirmation if alive) and creates exactly one new game socket.
4. Check `FFA Multi: N slot(s)` at the bottom. If it reports 2, press Tab to select the second native slot. If still 1 with a verified account, the server is allowing only one native slot on that connection.
5. Export diagnostic summary via `EonFFAMultiDiagnostics.exportJSON()` only after reviewing exported data. Do not share tokens or private IDs.

**Not implemented:** ONYX-style second simultaneous game connection, a server-limit override, automatic disconnection/reconnect while playing, or any fabricated second slot. Implementing full ONYX-style multibox separately would require client/render/camera/auth changes and server acceptance of a separately authorized session.

JavaScript syntax and local smoke tests are run separately. Live FFA slot allocation is not verified.
