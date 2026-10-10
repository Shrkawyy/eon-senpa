# EON authentication and bot diagnostics (1.9.0)

- Uses the existing official Senpa Facebook/Discord popups. Does not manufacture sessions, bypass restrictions, or claim account bans without a specific server reason.
- Account status only says Verified after `GET /account/` accepts the supplied bearer token and returns a profile.
- Diagnostic events: popup opened/closed/timed out, OAuth callback, adoption HTTP status, refresh HTTP status, profile HTTP status and bot socket close reason. No request bodies, passwords, session cookies or JWT tokens are logged.
- The original `src/inline-2.js` was a recovered development shim that installed `window.fetch` interception and forged heartbeat/auth results. It is disabled. **If your EON app requires a legitimate EON access key, supply one through the service's approved login/license process.** No synthetic key is installed.
- HTTP 401 from account verification: token is invalid/expired/not accepted; not proof of a ban.
- HTTP 403 from OAuth adoption: server forbids adoption; may be session, cookie, permission, policy, or other reason; not proof of a ban.
- 4101 is labelled as connection banned by this recovered protocol; 4406 is an unspecified session rejection.
- Multiple Facebook popups share cookies in one browser. Ten UI slots are NOT proof of ten independent authenticated sessions. No additional authorization limits are lifted.
- Use **BOT DIAGNOSTICS -> Show logs**, filter **Account login only** or **Errors / disconnects only**, Export and inspect/redact before sharing.
- Test a single valid account and a single bot before testing additional accounts. If EON license/auth is missing or the server does not support parallel sessions, the recovered client may remain unusable.
- Static JavaScript syntax checking is not a live server test. No live authorization/ban status was checked.
