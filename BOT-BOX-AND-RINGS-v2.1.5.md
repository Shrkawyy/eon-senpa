# EON Senpa v2.1.5 — target box and ring-mode correction

- When **Use Cell Color Instead of Rings** is ON, NO multibox outline is drawn. Cell colors stay white for active and red for inactive; skins remain in the renderer. When OFF, rings are drawn normally.
- Fixed right-click hit detection: uses the game canvas boundary rectangle and ignores HUD stacking that used to hide the canvas from `elementsFromPoint`.
- Right-click via `pointerdown`, `mousedown`, and `contextmenu` fallback; drag with right button to reposition. `Place at cursor` remains available.
- The marker now shows even if no server endpoint string has been resolved, and avoids intercepting clicks in dialogs and input controls.
- Bot panel shows status messages and Console emits `[EON Bot Target]` when a box is placed or placement fails. Logs exclude credentials.
- Spawn location is chosen by the server; once a bot is alive and **Follow / move** is enabled, it moves toward the target.

## Test
1. Disable the previous EON userscript and install the new one.
2. In Settings, turn ON **Use Cell Color Instead of Rings**: no cyan rings should appear. Toggle OFF to restore rings.
3. Open game and bot panel; enable **Right-click target box** (which selects Follow: Target box). Close panel, right-click once inside playing area. A turquoise square labeled BOT TARGET appears. Hold right-click and drag to move it.
4. If not visible, move the cursor inside game; reopen bot panel, click **Place at cursor** and read the status just below the box controls.
5. If bots are connected and spawned, verify Follow / move is ON. They move toward the square; it does not change initial Spawn location.

Tests cover JS parse and mocked events, not live Senpa connections.
