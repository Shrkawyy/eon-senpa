(function (root) {
    'use strict';
    const account = root.SenpaAccount;
    const clients = new Set();
    let app = null, lastToken = null;
    function trusted(client) {
        try {
            const url = new URL(client.socket?.url || client.probeUrl);
            return url.protocol === 'wss:' && /(^|\.)senpa\.io$/.test(url.hostname);
        } catch { return false; }
    }
    function tokenFor(client) {
        if (!trusted(client)) return null;
        return client.isAuxiliary ? client.botAccount?.getToken() || null : account.getToken();
    }
    function string16(value, long = false) {
        value = String(value);
        value = value.slice(0, long ? 65535 : 255);
        const bytes = new Uint8Array((long ? 2 : 1) + value.length * 2);
        const view = new DataView(bytes.buffer);
        if (long) view.setUint16(0, value.length, true); else bytes[0] = value.length;
        const start = long ? 2 : 1;
        for (let i = 0; i < value.length; i++) view.setUint16(start + i * 2, value.charCodeAt(i), true);
        return bytes;
    }
    function packet(opcode, ...parts) {
        const result = new Uint8Array(1 + parts.reduce((sum, part) => sum + part.length, 0));
        result[0] = opcode;
        let at = 1;
        for (const part of parts) { result.set(part, at); at += part.length; }
        return result.buffer;
    }
    function string8(value) {
        value = String(value || '').slice(0, 255);
        return Uint8Array.from([value.length, ...Array.from(value, char => char.charCodeAt(0) & 255)]);
    }
    function patchClient(client) {
        if (client.__senpaAccountBound) return client;
        root.EonSenpaProtocol?.patchClient(client);
        if (!client.isAuxiliary) root.EonReplay?.attachClient(client);
        client.__senpaAccountBound = true;
        clients.add(client);
        client.sendAuth = function () {
            if (this.isConnected) this.sendMessage(packet(13, string16(tokenFor(this) || 'null', true)));
        };
        client.sendTeamTag = function () {
            if (!this.isConnected || !this.authCompleted || (this.hasAlivePlayers ?? this.isAlive) || this.isReplay) return;
            this.sendMessage(packet(11, string16(this.app.player.tag || '')));
        };
        client.sendPlayerInfo = function () {
            if (!this.authCompleted || this.isAlive) return;
            const player = this.app.player, token = tokenFor(this);
            const name = player.nickname1;
            this.sendMessage(packet(10, string16(name || ''), ...(token ? [string16(token, true)] : [])));
            this.sendTeamTag();
            for (let index = 0; index < Math.min(this.playerIds?.length || 0, 2); index++) {
                const skin = index === 0 ? player.skin1 : player.skin2;
                this.sendMessage(packet(21, Uint8Array.of(index), string8(skin), ...(token ? [string16(token, true)] : [])));
            }
        };
        client.events.on('ready', () => client.sendAuth());
        client.events.on('disconnected', () => clients.delete(client));
        return client;
    }
    function createPanel() {
        if (document.getElementById('senpa-account-panel')) return;
        const panel = document.createElement('section');
        panel.id = 'senpa-account-panel';
        panel.innerHTML = '<strong>Senpa account</strong><span id="senpa-account-status">Checking session…</span>' +
            '<div class="senpa-account-buttons"><button id="senpa-login-discord">Login with Discord</button>' +
            '<button id="senpa-login-facebook">Login with Facebook</button>' +
            '<button id="senpa-account-retry">Refresh account</button><button id="senpa-logout" hidden>Logout</button></div>' +
            '<small id="senpa-account-error" role="status"></small>';
        const parent = document.querySelector('.lobby-menu');
        parent?.classList.add('senpa-login-enabled');
        (parent || document.body).append(panel);
        const select = id => document.getElementById(id);
        select('senpa-login-discord').onclick = () => account.login('discord');
        select('senpa-login-facebook').onclick = () => account.login('facebook');
        select('senpa-account-retry').onclick = () => account.refresh();
        select('senpa-logout').onclick = () => account.logout();
        account.subscribe(state => {
            const profile = state.account;
            const name = profile?.name || profile?.username || profile?.nick || profile?.id;
            select('senpa-account-status').textContent = state.status === 'signing-in' ? 'Complete sign-in in the popup…' :
                state.signedIn ? 'Signed in' + (name ? ': ' + String(name) : state.error ? ' — profile unavailable' : ' — loading profile…') : 'Guest — not signed in';
            select('senpa-account-error').textContent = state.error || '';
            select('senpa-logout').hidden = !state.signedIn;
        });
    }
    let verificationTask = Promise.resolve();
    let sdkTask = null;
    function loadVerification() {
        if (root.turnstile) return Promise.resolve(root.turnstile);
        if (sdkTask) return sdkTask;
        sdkTask = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async = true;
            const timeout = setTimeout(() => { script.remove(); reject(Error('Verification service timed out.')); }, 15000);
            script.onload = () => { clearTimeout(timeout); root.turnstile ? resolve(root.turnstile) : reject(Error('Verification service unavailable.')); };
            script.onerror = () => { clearTimeout(timeout); script.remove(); reject(Error('Could not load Senpa verification.')); };
            document.head.append(script);
        }).catch(error => { sdkTask = null; throw error; });
        return sdkTask;
    }
    const verificationTasks = new WeakMap();
    function verify(client, valid, onCancel) {
        if (!valid()) return Promise.resolve({status:'cancelled'});
        return new Promise(resolve => {
            const overlay = document.createElement('div'); overlay.className = 'senpa-verification-overlay';
            const box = document.createElement('div'); box.className = 'senpa-verification-box';
            const title = document.createElement('p');
            title.textContent = client.isAuxiliary ? 'Cloudflare verification · ' + client.app.player.nickname1 : 'Cloudflare verification · main player';
            const message = document.createElement('p'); message.setAttribute('role', 'status');
            const widget = document.createElement('div');
            const retry = document.createElement('button'); retry.textContent = 'Retry verification'; retry.hidden = true;
            const cancel = document.createElement('button'); cancel.textContent = 'Cancel';
            box.append(title, message, widget, retry, cancel); overlay.append(box); document.body.append(overlay);
            let id, sdk, done = false, loading = false;
            const finish = value => {
                if (done) return; done = true;
                clearTimeout(timeout);
                if (id !== undefined) sdk?.remove(id);
                overlay.remove();
                const sent = typeof value === 'string' && !!value && valid();
                if (sent) client.sendCaptcha(1, value);
                resolve({status:sent ? 'sent' : 'cancelled'});
            };
            const fail = code => {
                if (done) return;
                message.textContent = 'Verification could not finish' + (code ? ' (' + String(code) + ')' : '') + '. Retry to continue.';
                retry.hidden = false;
            };
            const reset = () => { if (!done && valid() && id !== undefined) sdk.reset(id); };
            const render = async () => {
                if (done || loading || !valid()) return;
                loading = true; retry.hidden = true; message.textContent = 'Complete the Cloudflare check below.';
                try {
                    sdk = await loadVerification();
                    if (done || !valid()) { finish(); return; }
                    if (id !== undefined) sdk.remove(id);
                    widget.replaceChildren();
                    id = sdk.render(widget, {sitekey:'0x4AAAAAAACWFDYFT_opGqX8', theme:'dark', action:'game-connect',
                        retry:'never', callback:finish, 'expired-callback':reset, 'timeout-callback':reset,
                        'error-callback':code => { fail(code); return true; },
                        'unsupported-callback':() => fail('browser unsupported')});
                    if (done && id !== undefined) sdk.remove(id);
                } catch (error) { fail(error.message); }
                finally { loading = false; }
            };
            const timeout = setTimeout(() => finish(), 300000);
            onCancel(() => finish());
            cancel.onclick = () => finish(); retry.onclick = render;
            render();
        });
    }
    function solveVerification(client, data = client.captchaOptions || {}) {
        client.captchaOptions = data;
        if (!client.isConnected) return Promise.resolve({status:'cancelled'});
        if (data.loggedUsersOnly && !tokenFor(client)) {
            client.verificationPending = true;
            app?.toasts.show(client.isAuxiliary ? 'Sign in to the bot account, then reconnect the bots.' : 'Sign in to your Senpa account to complete verification.', 'info', 6000);
            return Promise.resolve({status:'login-required'});
        }
        const existing = verificationTasks.get(client);
        if (existing) return existing;
        const socket = client.socket;
        let cancelled = false, cancelUI;
        const valid = () => !cancelled && client.isConnected && client.socket === socket;
        const disconnected = () => { cancelled = true; cancelUI?.(); };
        client.events.on('disconnected', disconnected);
        client.verificationPending = true;
        const task = verificationTask.then(() => verify(client, valid, cancel => { cancelUI = cancel; if (!valid()) cancel(); }))
            .catch(error => { app?.toasts.show(error.message, 'error', 5000); return {status:'failed'}; })
            .then(result => { if (result.status === 'sent') client.captchaOptions = null; return result; })
            .finally(() => {
                verificationTasks.delete(client); client.verificationPending = false;
                (client.events.off || client.events.removeListener)?.call(client.events, 'disconnected', disconnected);
            });
        verificationTasks.set(client, task);
        verificationTask = task.then(() => undefined, () => undefined);
        return task;
    }
    function initialize(instance) {
        if (app) return;
        app = instance;
        root.EonSenpaProtocol?.initialize(app);
        for (const client of [...app.gameConnection.clients, ...(app.player.pendingConnections || [])]) patchClient(client);
        app.lobby.solveTurnstile = solveVerification;
        createPanel();
        let pendingStart = null;
        for (const [selector, action] of [['.btn-play', 'play'], ['.btn-spectate', 'spectate']]) {
            document.querySelector(selector)?.addEventListener('click', event => {
                if (app.gameConnection.current?.clientReady) { pendingStart = null; return; }
                event.preventDefault(); event.stopImmediatePropagation();
                const client = app.lobby.initClient(app.player.serverUrl);
                if (!client) return;
                if (pendingStart?.client === client) { pendingStart.action = action; return; }
                const request = pendingStart = {client, action};
                client.events.once('ready', () => {
                    if (pendingStart !== request) return;
                    pendingStart = null;
                    if (app.gameConnection.current !== client) return;
                    if (request.action === 'play') client.sendSpawn(); else client.sendSpectate();
                    app.lobby.hide();
                });
                client.events.once('disconnected', () => {
                    if (pendingStart === request) pendingStart = null;
                });
            }, true);
        }
        account.subscribe(() => {
            const token = account.getToken();
            if (token === lastToken) return;
            lastToken = token;
            for (const client of clients) {
                if (client.isAuxiliary) continue;
                if (client.isConnected) {
                    client.sendAuth();
                    if (client.authCompleted && client.isDead) client.sendPlayerInfo();
                    if (token && client.captchaOptions) solveVerification(client, client.captchaOptions);
                }
            }
        });
        account.initialize().catch(() => {});
        // initialize() restores the saved token synchronously. Session refresh
        // continues while this single connection completes its handshake.
        app.lobby.initClient(app.player.serverUrl);
    }
    root.EonSenpaIntegration = { patchClient, initialize, solveVerification };
})(window);

