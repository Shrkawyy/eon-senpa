# EON Console diagnostics

Install `Senpa-Recovered.user.js` with Tampermonkey; disable older copies first. Open https://senpa.io/web and click **EON CONSOLE** in the bottom-right corner. Tabs: ALL LOGS / ERRORS / CONNECTIONS. EXPORT creates a JSON report.

The logger collects WebSocket open/close events and server-supplied close codes, request HTTP status for auth-related URLs (URL query strings stripped), console warnings/errors, and JavaScript errors. It does **not** collect packet bodies, cookies, request bodies or WebSocket messages. Exported logs should still be reviewed before sharing.

A server-defined WebSocket close code like 4406 is not inherently proof of a particular cause: confirm against server documentation or server logs. This is diagnostics only; it does not fix server-imposed limits or failed connections.

Files `index.html` and `vercel.json` stay in the root for Vercel.
