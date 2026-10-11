> Historical notes from older versions. Target box feature was removed in v2.1.6. See MOUSE-FOLLOW-v2.1.6.md.

# EON v2.1.4 — Visuals & target-box fix

- The **blue Multi Ring** follows the currently selected FFA socket after Tab. It no longer remains on Primary.
- With **Use Cell Color Instead of Rings** enabled: selected player uses the saved WHITE picker ("Multi Cell Color (Inactive)"), the other uses the saved RED picker ("Multi Cell Color"). Blue selection ring still appears on the selected cell.
- Custom/server skins remain rendered. Colored fill underneath and a subtle tint on top help distinguish player ownership without replacing opaque skin imagery.
- `EonSenpaSkins.localSkin` now reads the owning socket instead of only the active socket, so switching Tab doesn't erase P1/P2 skins.
- Bot box right-click hit-testing works when a game HUD layer is above the canvas. UI regions cannot accidentally move it.
- Added **Place at cursor** fallback: move pointer over the game, click button to place at last mouse position. Keep **Follow / move** checked.
- This target guides bots after spawn; it **cannot** force the server-selected initial spawn point.

## Manual in-game test
1. Disable other EON scripts, enable v2.1.4, connect FFA, spawn both players.
2. Set **Multi Ring Color** blue, **Multi Cell Color** red, **Multi Cell Color (Inactive)** white. Tab between them; blue ring should follow selected socket.
3. Enable **Use Cell Color Instead of Rings**: selected cell has white tint, inactive cell red tint, both keep skins.
4. Bot Controls: target controls are shown near the TOP of the panel, above 10 accounts. Select **Target box (right-click)**, enable checkbox, then right-click/drag in game. Or move pointer over the game, then select **Place at cursor** (uses the last game pointer position, not the button position). Keep **Follow / move** checked.
5. Verify bot moves toward box AFTER its server-assigned spawn, and camera movement doesn't detach the box from its world coordinate.

Tested for JavaScript syntax and local mocked UI ownership/event behavior. Not verified against live Senpa servers.
