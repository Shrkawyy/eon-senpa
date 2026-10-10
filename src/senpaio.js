/* Account lifecycle ported from Senpa /web/assets/main-CYoq09wt.js (2026-10-04):
 * 10 min renewal, 30 sec retry/skew, adoption retry 3x at 5 sec, wait before
 * authenticated requests, and one renewal/retry on HTTP 401. Separate bot
 * accounts keep explicit credentials instead of sharing the main cookie.
 * Game tokens are sent only to the Senpa API and the selected Senpa game socket.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory;
    else { root.createSenpaAccount = factory; root.SenpaAccount = factory(root); }
})(typeof window !== 'undefined' ? window : globalThis, function createAccount(env, options) {
    'use strict';
    options = options || {};
    const API = 'https://api.senpa.io';
    const REFRESH_MS = 600000, RETRY_MS = 30000, EXPIRY_SKEW_MS = 30000, ADOPT_RETRY_MS = 5000;
    const prefix = options.prefix || 'senpaio';
    const SESSION = prefix + ':session';
    const REFRESH = prefix + ':refresh';
    const ACCOUNT_ID = prefix + ':account-id';
    const listeners = new Set();
    let token = null, account = null, error = '', status = 'signed-out';
    let generation = 0, refreshTask = null, profileTask = null;
    let adoptTask = null, adoptedToken = null;
    let timer = null, popupTimer = null, popup = null, popupDeadline = 0, popupClosedAt = 0, popupProvider = '';
    // Diagnostics only: never expose authentication credentials or response bodies.
    function report(phase, status, detail = '') {
        try { options.onDiagnostic?.({phase, status, detail: String(detail).slice(0, 160)}); } catch {}
    }
    function explainStatus(status, operation) {
        if (status === 401) return operation + ': HTTP 401 — session/token not accepted. This is not proof of a ban.';
        if (status === 403) return operation + ': HTTP 403 — forbidden by Senpa. Possible session, policy or permission issue; not proof of a ban.';
        if (status === 429) return operation + ': HTTP 429 — too many requests. Wait before trying again.';
        if (status >= 500) return operation + ': HTTP ' + status + ' — Senpa server error.';
        return operation + ': HTTP ' + status + '.';
    }
    // Only the account whose login the user most recently opened owns the callback.
    const loginOwners = createAccount.loginOwners || (createAccount.loginOwners = new WeakMap());
    const read = key => { try { return env.localStorage.getItem(key); } catch { return null; } };
    const save = (key, value) => { try { value ? env.localStorage.setItem(key, value) : env.localStorage.removeItem(key); } catch {} };
    // The main account uses native cookie renewal. The old :explicit flag now
    // pins its identity instead of permanently disabling its renewal cookie.
    const explicitSession = !!options.isolated;
    let cookieAccountPinned = !explicitSession && read(prefix + ':explicit') === '1';
    const valid = value => typeof value === 'string' && /^[\w-]+\.[\w-]+\.[\w-]+$/.test(value) && value.length < 32768;
    function expiry(value) {
        try {
            let base = value.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const data = JSON.parse(env.atob(base.padEnd(Math.ceil(base.length / 4) * 4, '=')));
            return typeof data.exp === 'number' ? data.exp * 1000 : 0;
        } catch { return 0; }
    }
    function snapshot() { return { status, account, error, signedIn: !!token, verified: !!token && !!account }; }
    function needsRefresh(value) { return !!expiry(value) && expiry(value) <= Date.now() + EXPIRY_SKEW_MS; }
    function notify() { for (const listener of listeners) listener(snapshot()); }
    function schedule(delay = REFRESH_MS) {
        env.clearTimeout(timer);
        timer = env.setTimeout(() => refresh().catch(() => {}), delay);
    }
    function setToken(value) {
        token = valid(value) ? value : null;
        save(SESSION, token);
        status = token ? 'signed-in' : 'signed-out';
        if (!token) account = null;
        env.clearTimeout(timer);
        if (token) schedule();
        notify();
    }
    async function fetchAPI(path, options = {}) {
        const controller = new env.AbortController();
        const timeout = env.setTimeout(() => controller.abort(), 15000);
        try { return await env.fetch(API + path, { ...options, ...(explicitSession ? {credentials:'omit'} : {}), signal: controller.signal }); }
        finally { env.clearTimeout(timeout); }
    }
    function refreshOptions() {
        const refreshToken = read(REFRESH);
        return { method: 'POST', credentials: refreshToken ? 'omit' : 'include', ...(refreshToken ? {
            headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: refreshToken })
        } : {}) };
    }
    function accept(data, epoch) {
        if (epoch !== generation || !valid(data.access_token)) return false;
        if (typeof data.refresh_token === 'string') save(REFRESH, data.refresh_token);
        error = '';
        setToken(data.access_token);
        return true;
    }
    async function loadProfile() {
        if (!token) return null;
        if (profileTask) return profileTask;
        const epoch = generation;
        let current = token;
        const task = (async () => {
            try {
                // Native request ordering: adoption, in-flight renewal, then an
                // expiry check before the first authenticated API request.
                if (adoptTask) await adoptTask;
                if (refreshTask) await refreshTask;
                if (epoch !== generation || !token) return null;
                if (needsRefresh(token)) await renew();
                if (epoch !== generation || !token) return null;
                current = token;
                let response = await fetchAPI('/account/', { headers: { Authorization: 'Bearer ' + current } });
                if (epoch !== generation || token !== current) return null;
                // Renew once on a rejected access token. Separate accounts must
                // never fall back to the other account's browser cookies.
                if (response.status === 401 && (!explicitSession || read(REFRESH))) {
                    await renew();
                    if (epoch !== generation) return null;
                    current = token;
                    if (current) response = await fetchAPI('/account/', { headers: { Authorization: 'Bearer ' + current } });
                    if (epoch !== generation || token !== current) return null;
                }
                if (response.status === 401) {
                    report('PROFILE', 401, 'Account profile rejected after refresh attempt');
                    save(REFRESH, null);
                    error = explainStatus(401, 'Account verification') + ' Sign in again.';
                    setToken(null);
                    return null;
                }
                if (!response.ok) {
                    report('PROFILE', response.status, 'Account profile request failed');
                    throw Error(explainStatus(response.status, 'Account verification'));
                }
                const data = await response.json();
                if (epoch !== generation || token !== current) return null;
                if (data.error || data.cmd === 'reset-account-store') {
                    save(REFRESH, null); error = 'Senpa could not load this account. Sign in again.'; setToken(null); return null;
                }
                if (epoch === generation && token === current) {
                    account = data; error = '';
                    if (data.id != null) save(ACCOUNT_ID, String(data.id));
                    report('PROFILE', 200, 'Account verified by official Senpa API');
                    notify();
                }
                return data;
            } catch (failure) {
                if (epoch === generation && token === current) {
                    error = failure.name === 'AbortError' ? 'Account request timed out.' : failure.message;
                    report('PROFILE', 0, error);
                    if (token) schedule(RETRY_MS);
                    notify();
                }
                return null;
            }
        })();
        profileTask = task;
        try { return await task; } finally { if (profileTask === task) profileTask = null; }
    }
    // The shared renewal task must not wait for loadProfile: a profile 401 may
    // itself need renewal, which would otherwise wait on its own pending task.
    async function renew() {
        // Never renew a separate account using another account's browser cookie.
        if (explicitSession && !read(REFRESH)) {
            if (token && expiry(token) && expiry(token) <= Date.now()) {
                setToken(null); error = 'Session expired. Sign in again.'; notify();
            }
            if (token) schedule(expiry(token) ? Math.max(1000, expiry(token) - Date.now()) : 600000);
            return !!token;
        }
        if (refreshTask) return refreshTask;
        const epoch = generation;
        const task = (async () => {
            try {
                const request = refreshOptions();
                // An expired legacy isolated session may have no known identity.
                // Require one explicit login rather than loading a bot's cookie.
                const expectedId = account?.id ?? read(ACCOUNT_ID);
                if (cookieAccountPinned && !request.body && expectedId == null) throw Error('Sign in once to restore native session renewal for your main account.');
                const response = await fetchAPI('/auth/refresh', request);
                if (epoch !== generation) return false;
                if (response.status === 401) {
                    report('REFRESH', 401, 'Refresh token/cookie rejected');
                    save(REFRESH, null);
                    if (!token || needsRefresh(token)) setToken(null);
                    return false;
                }
                if (!response.ok) {
                    report('REFRESH', response.status, 'Session refresh failed');
                    // Native refresh preserves the current access token on a
                    // temporary HTTP failure and schedules another attempt.
                    if (token) schedule(RETRY_MS);
                    throw Error('Session refresh unavailable (HTTP ' + response.status + ').');
                }
                const data = await response.json();
                if (epoch !== generation) return false;
                if (cookieAccountPinned && !request.body && valid(data.access_token)) {
                    // Another OAuth popup can replace the shared API cookie.
                    // Confirm its account before applying it to the main client.
                    const profileResponse = await fetchAPI('/account/', {headers:{Authorization:'Bearer ' + data.access_token}});
                    if (!profileResponse.ok) throw Error('Could not verify the renewed main account (HTTP ' + profileResponse.status + ').');
                    const profile = await profileResponse.json();
                    if (epoch !== generation) return false;
                    if (profile.id == null || String(profile.id) !== String(expectedId)) throw Error('Browser login belongs to another account. Sign in to your main account again to renew it.');
                }
                if (!accept(data, epoch)) throw Error('Invalid session response.');
                report('REFRESH', 200, 'Session refreshed');
                return true;
            } catch (failure) {
                if (epoch === generation) {
                    error = failure.name === 'AbortError' ? 'Session request timed out. Try signing in again.' : failure.message;
                    report('REFRESH', 0, error);
                    if (token) schedule(RETRY_MS);
                    notify();
                }
                throw failure;
            }
        })();
        refreshTask = task;
        try { return await task; } finally { if (refreshTask === task) refreshTask = null; }
    }
    async function refresh() {
        const epoch = generation;
        try {
            if (adoptTask) await adoptTask;
            if (epoch !== generation) return false;
            const renewed = await renew();
            if (epoch === generation && token) await loadProfile();
            return renewed && !!token;
        } catch { return false; }
    }
    function adopt(value, epoch) {
        if (adoptedToken === value) return adoptTask || Promise.resolve(false);
        adoptedToken = value;
        const attempt = async retries => {
            if (epoch !== generation || token !== value) return false;
            try {
                const response = await fetchAPI('/auth/adopt', {
                    method:'POST', credentials:'include', headers:{Authorization:'Bearer ' + value}
                });
                if (epoch !== generation || token !== value) return false;
                if (response.ok) {
                    report('ADOPT', 200, 'OAuth session adopted successfully');
                    return accept(await response.json(), epoch);
                }
                if (response.status === 401 || response.status === 403) {
                    report('ADOPT', response.status, 'Official OAuth adoption was rejected; profile verification still required');
                    return false;
                }
                throw Error('Session adoption unavailable (HTTP ' + response.status + ').');
            } catch {
                if (epoch !== generation || token !== value) return false;
                if (!retries) { report('ADOPT', 0, 'OAuth adoption request failed after retries'); adoptedToken = null; return false; }
                await new Promise(resolve => env.setTimeout(resolve, ADOPT_RETRY_MS));
                return attempt(retries - 1);
            }
        };
        const task = attempt(3).finally(() => { if (adoptTask === task) adoptTask = null; });
        adoptTask = task;
        return task;
    }
    async function receiveToken(value) {
        const epoch = ++generation;
        refreshTask = profileTask = null;
        adoptTask = null; adoptedToken = null;
        account = null; save(REFRESH, null); save(ACCOUNT_ID, null);
        if (!explicitSession) { cookieAccountPinned = false; save(prefix + ':explicit', null); }
        error = '';
        setToken(value);
        status = 'verifying'; notify();
        report('CALLBACK', 0, 'Official OAuth callback received; verifying with Senpa');
        // Native adoption failure must not discard a usable OAuth access token.
        await adopt(value, epoch);
        if (epoch === generation) await loadProfile();
    }
    function clearPopup() {
        env.clearInterval(popupTimer); popupTimer = null;
        try { if (popup && !popup.closed) popup.close(); } catch {}
        popup = null;
        popupClosedAt = 0;
        if (loginOwners.get(env) === cancelLogin) loginOwners.delete(env);
    }
    function cancelLogin() {
        clearPopup(); status = token ? 'signed-in' : 'signed-out'; notify();
    }
    function login(provider = 'discord') {
        if (!['discord', 'facebook'].includes(provider)) throw Error('Unknown sign-in provider.');
        if (popup && !popup.closed && popupProvider === provider) { popup.focus?.(); return true; }
        loginOwners.get(env)?.();
        clearPopup();
        // Open synchronously from the button click, before any asynchronous work.
        popup = env.open(API + '/auth/' + provider, options.popupName || 'SenpaAccountLogin', 'popup,width=600,height=700');
        if (!popup) { error = 'Popup blocked. Allow popups for Senpa and try again.'; report('POPUP', 0, 'Browser blocked the OAuth login window'); notify(); return false; }
        loginOwners.set(env, cancelLogin); popupProvider = provider;
        popup.focus?.();
        status = 'signing-in'; error = ''; report('POPUP', 0, 'Opened official ' + provider + ' login window'); notify();
        popupDeadline = Date.now() + 600000;
        popupTimer = env.setInterval(() => {
            // Facebook can report the old WindowProxy as closed during redirects.
            // Keep the pending owner long enough for the trusted API callback.
            if (popup?.closed && !popupClosedAt) popupClosedAt = Date.now();
            if (!popup?.closed) popupClosedAt = 0;
            if (popupClosedAt && Date.now() - popupClosedAt >= 10000 && !error) {
                error = 'Waiting for Senpa to return the login result. If the window is gone, click login to retry.';
                report('POPUP', 0, 'Login popup closed without confirmed callback yet'); notify();
            }
            if (Date.now() >= popupDeadline) {
                clearPopup();
                status = token ? 'signed-in' : 'signed-out';
                error = 'Login window closed without a result. Open login again to retry.';
                report('POPUP', 0, 'OAuth callback not received before timeout'); notify();
                refresh().catch(() => {});
            }
        }, 500);
        return true;
    }
    function onMessage(event) {
        if (event.origin !== API || !popup || loginOwners.get(env) !== cancelLogin) return;
        // Match the native trusted-origin callback, while keeping two accounts
        // separate and requiring the exact popup unless its opener was severed.
        if (event.source !== popup && !(popup.closed && typeof event.source?.postMessage === 'function')) return;
        if (event.data?.type === 'senpa-auth-ready') {
            event.source.postMessage({ type: 'senpa-auth-hello' }, API);
        } else if (valid(event.data?.access_token)) {
            event.source.postMessage({ type: 'senpa-auth-done' }, API);
            const value = event.data.access_token;
            clearPopup();
            receiveToken(value).catch(() => {});
        }
    }
    async function logout() {
        ++generation; refreshTask = profileTask = adoptTask = null; adoptedToken = null;
        clearPopup();
        const options = refreshOptions();
        // A pinned main account cannot revoke an unverified shared cookie: it
        // may now belong to the bot account. Clearing its identity also prevents
        // a later reload from silently signing this account back in.
        const canRevoke = (!explicitSession && !cookieAccountPinned) || !!read(REFRESH);
        save(REFRESH, null); save(ACCOUNT_ID, null); error = ''; setToken(null);
        report('LOGOUT', 0, 'User requested local logout');
        try { if (canRevoke) await fetchAPI('/auth/logout', options); }
        catch { error = 'Signed out here; the server logout request failed.'; notify(); }
    }
    async function initialize() {
        const saved = read(SESSION);
        if (valid(saved) && (!expiry(saved) || expiry(saved) > Date.now() + 30000)) setToken(saved);
        else save(SESSION, null);
        await refresh();
    }
    function resume() { if (token && needsRefresh(token) && env.document.visibilityState !== 'hidden') refresh().catch(() => {}); }
    env.addEventListener('message', onMessage);
    env.addEventListener('online', resume);
    env.addEventListener('pageshow', resume);
    env.document.addEventListener('visibilitychange', resume);
    function isolateSession() {
        if (explicitSession || cookieAccountPinned) return;
        cookieAccountPinned = true; save(prefix + ':explicit', '1');
        if (account?.id != null) save(ACCOUNT_ID, String(account.id));
        // Freeze any in-flight cookie refresh before the other OAuth popup opens.
        ++generation; refreshTask = profileTask = adoptTask = null; adoptedToken = null;
        if (token && account?.id == null) loadProfile().catch(() => {});
    }
    return { login, logout, initialize, refresh, loadProfile, isolateSession, getToken: () => token, snapshot,
        subscribe(listener) { listeners.add(listener); listener(snapshot()); return () => listeners.delete(listener); },
        dispose() { ++generation; clearPopup(); env.clearTimeout(timer); listeners.clear();
            env.removeEventListener('message', onMessage); env.removeEventListener('online', resume);
            env.removeEventListener('pageshow', resume);
            env.document.removeEventListener('visibilitychange', resume); }
    };
});

