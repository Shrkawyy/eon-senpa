# EON FFA Multi 2.1.2 — world / color / death fix

Changes over v2.1.1:

- Shared two-socket scene view: merge complete visible cells from BOTH game sockets every frame, including viruses, food, and enemy cells. Deduplicate by server cell ID, preferring each socket's OWN player cell when seen in both worlds.
- Do not open Play / Spectate lobby on death of only one player. Keep game view while either FFA player remains alive; auto-switch to the surviving socket when Auto-Switch Cells is enabled. When both are dead the normal Show Menu on Death setting controls the menu.
- Dual FFA cell color settings now apply to cells across both sockets, not just native two-slot clients. Player 1 uses Multi Cell Color; Player 2 uses Multi Cell Color (Inactive), independently of Tab selection. With your settings, that is red #E60000 and white #FFFFFF. Turn on **Use Cell Color Instead of Rings**; solid local colors take precedence over an opaque skin.
- Tab switches camera/control without switching the underlying rendered world. Reduced missing viruses/other players caused by socket world changes. Does not change authentication, number of permitted connections, or bot/replay logic.
- Adds alivePlayers and a sanitized merged-world sample to `EonDualFFA.status()` and the JSON export.

## Testing
Disable old EON script, install v2.1.2, make sure **DUAL FFA ON** and both players are spawned. Turn on **Use Cell Color Instead of Rings** and set Multi Cell Color to #E60000 and inactive to #FFFFFF. Toggle Tab several times near players/viruses. Then let only Player 1 die (Play must remain hidden), then let Player 2 die (Play appears if Show Menu on Death enabled). Also repeat with reverse death order. Export diagnostics if anything fails.

Code-level checks pass; this build has not been live-tested against the Senpa server. The separate browser/extension `requestInterceptor.js` fetch error visible in earlier logs is outside this game's two-socket scene fix.
