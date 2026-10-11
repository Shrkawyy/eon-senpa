# EON Senpa v2.1.3 — FFA video comparison and bot target box

## Video observations
Video runs approximately 65s: FFA (Nemesis) gameplay is shown first; around 40s the server menu selects Zephyr / Dual. Those are different server modes. The FFA client runs a separate secondary socket, but this does **not** make server-specific movement/spawn rules equivalent to Dual.

## Changes
- Optional **Right-click target box** in bot panel. Check it, then right-click/drag on the game canvas to place a world-anchored box. Keep **Follow / move** on.
- Bots on a verified/accepted connection will attempt spectator positioning near the box at spawn, then move toward the target on live cells after spawn (assuming normal game movement is allowed). It cannot force the server's initial spawn point.
- The target persists as a world position while the camera moves, and clears if you choose **Clear box**. Marker is hidden if off screen or its originating server changes.
- Preserve existing bot login/auth/connection behavior and EON Dual FFA toggles.
- In FFA's two-socket renderer, deduped common non-owned cell IDs always prefer the **primary** socket snapshot, rather than changing preference on every Tab. This can reduce visible flicker but cannot display offscreen entities the server didn't send.

## Test
1. Disable previous EON script before installing this version. Connect to FFA; confirm both players work before testing bots.
2. Open Bot Controls > check **Right-click target box**. Right-click and drag over the game canvas. A turquoise target square should remain at that world location during camera movement.
3. Keep **Follow / move** checked. Connect an authorized bot account, Spawn; record the bot's initial location versus its subsequent movement toward the box.
4. Compare FFA Tab world visibility with v2.1.2. If the bot does not move, export **BOT DIAGNOSTICS**; don't include tokens or cookies.

No live server or end-to-end UI test was performed here. This does not change Senpa server limits or bypass authentication.
