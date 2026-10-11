# EON Senpa v2.1.8 — Hold right mouse to direct bots

This patch keeps existing FFA Dual, accounts, bot connections, and the regular spawn system. The server chooses initial spawn positions.

- The blank 45×45 turquoise indicator is **hidden by default**, shown on right mouse down in the game area, and moved with the pointer while held. No text is drawn.
- Releasing the right mouse button hides the indicator immediately and stops movement commands.
- **On right-click release** selector defaults to **Disconnect bot connections** (as requested). Choose **Stop movement only** to keep connections alive; this is recommended if you want to right-click repeatedly without reconnecting.
- Right-click in the bot panel, login form, settings, replay, or lobby will not trigger bot control.
- Losing window focus, tab visibility, or pointer cancellation ends the held state.
- The bot target is a world-coordinate **movement** target only: the server still determines actual spawn.
- Console: `[EON Bot RightHold] START` and `[EON Bot RightHold] RELEASE`.

## Test
1. Disable older EON userscripts, install `Senpa-Recovered.user.js` and open Senpa.
2. Sign into a bot account and connect/spawn a bot via bot panel. Select Follow: **Right-click hold (dragon box)** and Follow / move ON.
3. Hold right-click over the game: dragon box appears and bot follows. Move pointer while holding.
4. Release: box instantly hides, and (default) bot sockets disconnect; select Stop movement only if you prefer to keep them connected.

Not verified against live Senpa; tested locally for state transitions, movement gating and syntax.
