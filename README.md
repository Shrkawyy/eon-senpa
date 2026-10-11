# EON Senpa - Dual FFA 2.1.0 (Experimental)

# EON Senpa — License-screen removed (v2.0.0)

This fork removes the **legacy EON access-key dialog and license heartbeat** from the locally deployed userscript. It does **not** forge a license, replace server responses, change Senpa login, or relax any server-enforced limits.

## Deploy

1. Upload the contents of this folder at the **root** of your GitHub repository.
2. Deploy on Vercel with **Framework Preset: Other**, **Root Directory: repository root**.
3. Open `https://<your-project>.vercel.app/`, or import `Senpa-Recovered.user.js` directly into Tampermonkey.
4. Disable old copies of the EON userscript before testing. Launch `https://senpa.io/web`.

## What was changed

- `src/test.js`: removed old `Rn` license manager, access-key form, validation calls and five-second EON heartbeat; an inert compatibility adapter keeps old `authManager.authenticate/removeClient` hooks from crashing.
- `src/inline-2.js`: remains nonfunctional. No fake auth/heartbeat and no `window.fetch` interception.
- `Senpa-Recovered.user.js`: rebuilt embedded payload from the source files, v2.0.0.
- Existing Facebook/Discord Senpa official login, bot controls, bot-only diagnostics and source files otherwise preserved.
- Old `original-files/` DevTools snapshots omitted from this publishable archive to avoid unintentionally deploying the earlier key implementation.

## Important limitations

- **This does not authenticate a Senpa account**: continue using Facebook/Discord sign-in on Senpa. HTTP 401/403, WebSocket 4406 or other server-side restrictions are not corrected by deleting the old EON licensing layer.
- **Multiple login slots do not establish independent Facebook/Discord sessions** in one browser. No promise of 4 players per account or 10 concurrent accounts.
- Static JavaScript syntax / packaging checks are not a successful live Senpa connection test.
- **BOT DIAGNOSTICS** is intended to show bot events and safe error details. Do not publicly share account tokens or unredacted network logs.
