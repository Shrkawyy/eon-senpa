# EON Senpa v2.1.6 — Mouse target without a box

- The old **BOT TARGET** marker, right-click event interception, dragging, and target-box controls have been removed. Right-click continues to work for the game.
- **Follow → Mouse** is the default, and **Follow / move** starts enabled. Place the mouse over the game field before requesting Spawn.
- The latest valid in-game mouse world coordinate is sent via normal spectator/cursor commands prior to a bot Spawn request. On confirmed spawn, bots navigate toward the cursor continuously (approximately every 40 ms while active).
- The server chooses each bot's initial spawn location. Client-side coordinates are a positioning request, not an override, and can be ignored.
- If you click **Spawn** from the bot panel, the last cursor position from inside the playing field is retained.
- No authentication, player-slot, WebSocket, or Dual FFA code was changed.
- `BOT DIAGNOSTICS` logs the distance between server-selected spawn and cursor when available, with no credentials.

## Test
1. Disable previous EON userscripts and install the new bundled script.
2. In Bot Controls, verify `Follow: Mouse (automatic, no box)` and `Follow / move` ON.
3. Move the mouse inside the field, then press Spawn. The bot will travel toward your mouse after the server spawns it.
4. Move the pointer in another direction and confirm follow. No turquoise box should ever appear.
5. If it doesn't work, export bot diagnostics and check login/connect/spawn statuses.

Tests are local JavaScript checks, not a live Senpa FFA session.
