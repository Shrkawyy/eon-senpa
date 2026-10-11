# Dual FFA experimental addon

- The existing EON native 1/2-slot mode is preserved.
- On FFA, press the **DUAL FFA OFF** toggle (bottom left) to enable a **separate second socket** from the main verified account.
- Press **Tab** to request/connect and spawn the second player; press again to change control.
- Other servers continue to use native server-allocated slots.
- The option is OFF by default and can be disabled to disconnect just the second socket.
- The server can refuse a second connection; this is not bypassed.
- Diagnostics from the browser Console: `EonDualFFA.status()` and `EonDualFFA.exportJSON()`. No tokens are included.
- This has NOT been verified against the live FFA server; only syntax/unit checks are possible here.
- If the server denies the socket (4405/4406 etc), it will **not** retry automatically. Disable then enable the switch to retry manually.
- The inactive socket's owned cells are drawn as a best-effort overlay; experimental render/kill handling may need server testing.
- Back up the previous userscript and disable the old copy before testing.

- Bot helper accounts always follow the stable primary game session even if Tab selects player 2.
- Replay disconnects both live game sockets before playback starts.
- If the account is not verified, Dual FFA never attempts secondary connection.
- On secondary close, capture the server's actual close code when the socket supplies it.
