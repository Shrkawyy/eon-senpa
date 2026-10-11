# EON Dual FFA v2.1.1 (test build)

On first install DUAL FFA defaults ON, but it **does not** create Player 2 until the user presses Tab on FFA. The bottom-left toggle switches OFF/ON and remembers the user's choice.

Player 1 and Player 2 both appear on the HUD when Dual FFA is enabled. Player 2 will show `press Tab`, `connecting`, or actual cells/mass. It never falsely implies a connected player.

The optional secondary now uses its own transport `tid`, similar to a second browser tab, while using the **same officially authenticated Senpa account**. There is no fake account, slot count, key, CAPTCHA solution, or server-limit bypass. Server acceptance is still required.

How to test: disable earlier EON scripts; install the new userscript; log in to Senpa; choose Free For All; verify `DUAL FFA ON`; press Tab once; wait for either `P2 ready` or a failure. Use `EonDualFFA.status()` in DevTools or `EonDualFFA.exportJSON()` to export an anonymized report. If the server rejects a second socket, note the exact close code, do not repeatedly reconnect.

If you see `Player 2 · 0 cells · press Tab`, that is an *inactive UI placeholder*, not a successful connection. If Player 2 is ready and remains at zero cells, inspect the spawn diagnostic event.

No live connection test was performed. Back up your previously working EON version before trying this build.
