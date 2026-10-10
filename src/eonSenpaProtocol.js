(function (root) {
    'use strict';
    // Senpa v4, verified against /web/assets/main-BYcEhCon.js and /tracker.
    const TRACKER = 'https://api.senpa.io/tracker';
    const DEFAULT_BETA = 'wss://eu1.senpa.io:7104';
    let betaUrl = DEFAULT_BETA, trackerTask = null, trackerTime = 0, tabId = '';

    function officialUrl(value) {
        try {
            const url = new URL(value);
            return url.protocol === 'wss:' && /(^|\.)senpa\.io$/.test(url.hostname) &&
                !url.username && !url.password ? url : null;
        } catch { return null; }
    }
    function randomId() {
        return Array.from(root.crypto.getRandomValues(new Uint8Array(16)), n => n.toString(16).padStart(2, '0')).join('');
    }
    function pageOrigin() {
        try {
            if (root.self !== root.top) return 'iframe:' + (document.referrer ? new URL(document.referrer).host : 'unknown');
            return root.location.host + (root.location.pathname.startsWith('/web/mobile') ? '/mobile' : '');
        } catch { return 'iframe:unknown'; }
    }
    function connectionUrl(value) {
        const url = officialUrl(value);
        if (!url) return value;
        url.searchParams.set('po', pageOrigin());
        url.searchParams.set('tid', tabId || (tabId = randomId()));
        return url.href;
    }
    // Synchronize the pre-rendered dropdown with the server tracker without
    // recreating option nodes (the game attaches click handlers to those nodes).
    let serverListTask = null;
    function serverLabel(row) { return String(row.name || '').trim(); }
    function serverEndpoint(row) {
        const host = String(row.host || '').trim();
        const candidate = /^wss:\/\//i.test(host) ? host : 'wss://' + host;
        const url = officialUrl(candidate);
        return url && url.pathname === '/' && !url.search && !url.hash ? url.origin : null;
    }
    function findRow(rows, label) {
        const l = label.toLowerCase();
        const matches = rows.filter(row => row.region === 'EU' && serverEndpoint(row));
        const exact = matches.find(row => l.includes(serverLabel(row).toLowerCase()) && serverLabel(row).length > 2);
        if (exact) return exact;
        if (/free for all|\bffa\b|nemesis/.test(l))
            return matches.find(row => /nemesis/i.test(serverLabel(row))) ||
                   matches.find(row => /free.for.all|\bffa\b/i.test(serverLabel(row)));
        return null;
    }
    async function refreshServerOptions(app) {
        if (!serverListTask) serverListTask = (async () => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);
            try {
                const response = await root.fetch(TRACKER, {signal:controller.signal, credentials:'omit'});
                if (!response.ok) throw Error('Server tracker HTTP ' + response.status);
                const rows = await response.json();
                if (!Array.isArray(rows)) throw Error('Invalid server tracker payload');
                return rows;
            } finally { clearTimeout(timeout); }
        })().catch(error => { serverListTask = null; throw error; });
        const rows = await serverListTask;
        document.querySelectorAll('.server-option').forEach(option => {
            const row = findRow(rows, option.textContent || '');
            const endpoint = row && serverEndpoint(row);
            if (!endpoint) return;
            const previous = option.dataset.value;
            option.dataset.value = endpoint;
            if (app.player.serverUrl === previous) {
                app.player.serverUrl = endpoint;
                const selectedLabel = document.querySelector('.server-select-trigger .selected-text');
                if (option.classList.contains('selected') && selectedLabel) selectedLabel.textContent = option.textContent;
                app.lobby.persistState();
            }
        });
        return rows;
    }
    function selectBeta(rows) {
        if (!Array.isArray(rows)) throw new Error('Invalid Senpa server list');
        const server = rows.find(row => row.region === 'EU' && /^beta\s*2$/i.test(String(row.name).trim()));
        const url = server && officialUrl('wss://' + server.host);
        if (!url || url.pathname !== '/' || url.search || url.hash) throw new Error('Beta 2 is unavailable in the Senpa server list');
        return url.origin;
    }
    async function resolveBeta() {
        if (trackerTask && Date.now() - trackerTime < 60000) return trackerTask;
        trackerTime = Date.now();
        trackerTask = (async () => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);
            try {
                const response = await root.fetch(TRACKER, {signal:controller.signal, credentials:'omit'});
                if (!response.ok) throw new Error('Senpa server list HTTP ' + response.status);
                betaUrl = selectBeta(await response.json());
                try { root.localStorage.setItem('eon_beta2_host', betaUrl); } catch {}
                return betaUrl;
            } finally { clearTimeout(timeout); }
        })();
        try { return await trackerTask; }
        catch (error) { trackerTask = null; throw error; }
    }
    function isBeta(value) {
        const url = officialUrl(value);
        return url && [DEFAULT_BETA, betaUrl].includes(url.origin);
    }
    function setBetaOption(app, value, selected = isBeta(app.player.serverUrl)) {
        const option = document.querySelector('[data-senpa-server="beta2"]');
        if (option) option.dataset.value = value;
        if (selected) {
            app.player.serverUrl = value;
            document.querySelectorAll('.server-option').forEach(item => item.classList.toggle('selected', item === option));
            const label = document.querySelector('.server-select-trigger .selected-text');
            if (label) label.textContent = 'BETA 2 - EUROPE';
        }
    }
    function initialize(app) {
        // The official page persists this ID before opening its game socket.
        try {
            const savedHost = officialUrl(root.localStorage.getItem('eon_beta2_host'));
            const otherServer = Array.from(document.querySelectorAll('.server-option:not([data-senpa-server="beta2"])'))
                .some(option => option.dataset.value === savedHost?.origin);
            if (savedHost && !otherServer && savedHost.pathname === '/' && !savedHost.search && !savedHost.hash) betaUrl = savedHost.origin;
            const key = '_afc_uid', valid = /^[a-f0-9]{32}$/;
            let uid = root.localStorage.getItem(key) || '';
            if (!valid.test(uid)) uid = document.cookie.match(/(?:^|;\s*)_afc_uid=([a-f0-9]{32})(?:;|$)/)?.[1] || randomId();
            root.localStorage.setItem(key, uid);
            const domain = /(^|\.)senpa\.io$/.test(root.location.hostname) ? ';domain=.senpa.io' : '';
            document.cookie = key + '=' + uid + ';path=/' + domain + ';max-age=31536000;SameSite=Lax;Secure';
            if (!root.localStorage.getItem('eon_beta2_v4')) {
                app.player.serverUrl = betaUrl;
                root.localStorage.setItem('eon_beta2_v4', '1');
                app.lobby.persistState();
            }
        } catch { /* Storage may be disabled; the per-page socket ID still works. */ }
        const listed = Array.from(document.querySelectorAll('.server-option'))
            .some(option => option.dataset.value === app.player.serverUrl);
        setBetaOption(app, betaUrl, !listed || isBeta(app.player.serverUrl));
        if (!listed) app.lobby.persistState();
        refreshServerOptions(app).catch(error => {
            console.warn('[Senpa servers] Could not refresh server endpoints; using saved list:', error);
        });
    }
    function send(client, values) { client.sendMessage(Uint8Array.from(values).buffer); }
    function ready(client) { return client.isConnected && client.authCompleted && client.clientId !== null; }
    function nickname(value, id) { return value.trim() ? value.replace(/[\r\n]/g, '') : 'unnamed#' + id; }
    // Opcode 10 carries Senpa's team/name RGB, distinct from the cell RGB in
    // opcode 11/20. Only chat gates this color on hasReservedName.
    function nameColor(player, reservedOnly = false) {
        if (!player || (reservedOnly && !player.hasReservedName)) return null;
        const color = player.colorInt;
        return Number.isInteger(color) && color >= 0 && color <= 0xffffff ?
            '#' + color.toString(16).padStart(6, '0') : null;
    }

    // Native chat roles are in opcode 40, not in the player's nickname or color.
    const chatBadges = new Map([
        [0, {text:'[banned]', color:null}], [2, {text:'[VIP]', color:'yellow'}],
        [3, {text:'[YT]', color:'orange'}], [90, {text:'[Mod]', color:'lightblue'}],
        [100, {text:'[Admin]', color:'red'}]
    ]);
    function chatBadge(type) { return chatBadges.get(type) || null; }
    function notify(app, sender, message) {
        // A local notification in the chat UI; nothing is sent to other players.
        app.chatBox.addMessage(sender, message, 'native', undefined, undefined, new Date(), null, 1);
    }
    function receiveChat(client, buffer) {
        const view = new DataView(buffer), opcode = view.getUint8(0);
        if (view.byteLength < (opcode === 40 ? 6 : 4)) return;
        let at = 1, id, type, room = 0, length;
        if (opcode === 40) {
            id = view.getUint16(at, true); at += 2;
            type = view.getUint8(at++); room = view.getUint8(at++); length = view.getUint8(at++);
        } else {
            type = view.getUint8(at++); length = view.getUint16(at, true); at += 2;
        }
        if (at + length * 2 > view.byteLength) return;
        let message = '';
        for (let i = 0; i < length; i++, at += 2) message += String.fromCharCode(view.getUint16(at, true));
        if (client.isAuxiliary) {
            // Each helper owns its nickname and server notices. Do not let its
            // server response edit the main player's input, lobby or chat.
            if (opcode === 41 && type <= 2) {
                let nickname;
                if (type === 2) {
                    const separator = message.indexOf('|');
                    if (separator < 0) return;
                    nickname = message.slice(0, separator);
                    message = message.slice(separator + 1);
                    client.app.player.nickname1 = nickname;
                }
                client.serverMessage = message;
                client.events.emit('serverMessage', {type, message, nickname});
            }
            return;
        }
        if (opcode === 40) {
            const player = client.playerClients.get(id);
            client.app.chatBox.addMessage(player?.nickname || 'unnamed', message, 'native', String(id), undefined,
                new Date(), nameColor(player, true), type);
        } else if (type === 0) {
            client.serverMessage = message;
            let banner = document.getElementById('server-message');
            if (!banner) {
                banner = document.createElement('div'); banner.id = 'server-message';
                document.body.append(banner);
            }
            banner.textContent = message; banner.hidden = !message;
        } else if (type === 1) notify(client.app, 'SERVER', message);
        else if (type === 2) {
            const parts = message.split('|');
            notify(client.app, 'SERVER', parts[1] || '');
            client.app.player.nickname1 = parts[0];
            const input = document.querySelector('.input-p1'); if (input) input.value = parts[0];
            client.app.lobby.persistState();
        }
    }

    function patchClient(client) {
        if (client.__senpaProtocolBound) return client;
        client.__senpaProtocolBound = true;
        client.serverClientId = null;
        client.playerIds = [];
        // Player IDs identify world cells; tabIndex selects a server player slot.
        client.tabIndex = 0;
        let generation = 0, connecting = false, readyTimer = null, ended = true;
        const oldClose = client.close, oldOnMessage = client.onMessage;
        function finish() {
            if (ended) return;
            ended = true;
            connecting = false;
            clearTimeout(readyTimer);
            clearTimeout(client.connectionTimeout);
            client.connectionTimeout = null;
            client.onClose();
        }
        client.close = function () {
            generation++;
            oldClose.call(this);
            finish();
        };
        client.connect = async function (requestedUrl) {
            if (connecting || this.isConnected) return;
            const attempt = ++generation;
            connecting = true; ended = false;
            const current = () => attempt === generation && !ended;
            try {
                let target = requestedUrl;
                if (!this.isAuxiliary && !isBeta(target)) {
                    const option = Array.from(document.querySelectorAll('.server-option'))
                        .find(item => item.dataset.value === target);
                    if (option && /free for all|\bffa\b|nemesis/i.test(option.textContent)) {
                        try {
                            await refreshServerOptions(this.app);
                            if (!current()) return;
                            target = option.dataset.value;
                        } catch (error) {
                            console.warn('[Senpa FFA] Tracker unavailable:', error);
                            this.app.toasts?.show('FFA server list unavailable. Trying the saved address.', 'info', 5000);
                        }
                    }
                }
                if (isBeta(target) && !this.isAuxiliary) {
                    const selected = isBeta(this.app.player.serverUrl);
                    try { target = await resolveBeta(); }
                    catch (error) {
                        target = betaUrl;
                        this.app.toasts.show('Server list unavailable; trying the last known Beta 2 address.', 'info', 5000);
                    }
                    if (!current()) return;
                    setBetaOption(this.app, target, selected);
                }
                await this.app.authManager.authenticate(this);
                if (!current()) return;
                await this.initiate();
                if (!current()) return;
                this.connectionStartTime = Date.now();
                this.lastCloseCode = undefined;
                this.probeUrl = target;
                let address = connectionUrl(target);
                if (this.isAuxiliary && officialUrl(target)) {
                    const url = new URL(address);
                    url.searchParams.set('po', 'iframe:' + root.location.host);
                    url.searchParams.set('tid', this.auxiliaryTabId || (this.auxiliaryTabId = randomId()));
                    address = url.href;
                }
                root.game_server = officialUrl(target)?.host || target;
                this.socket = this.module.create(address, () => {
                    if (current()) { connecting = false; this.onOpen(); }
                }, () => { if (current()) finish(); }, data => {
                    if (current()) {
                        try { this.onMessage(data); }
                        catch (error) {
                            this.logger.error('[Senpa] Could not read a game packet:', error.message);
                            this.onError(error);
                            this.close();
                        }
                    }
                }, error => { if (current()) this.onError(error); });
                if (!this.socket) throw new Error('Senpa did not create a game connection');
                this.socket.binaryType = 'arraybuffer';
                this.socket.addEventListener?.('close', event => {
                    if (attempt !== generation) return;
                    const messages = {
                        4100:'The server kicked this connection.', 4101:'This connection is banned from the server.',
                        4102:'The server disconnected an inactive connection.', 4103:'Incorrect server password.',
                        4403:'Beta 2 is full.', 4404:'The server blocks this VPN/proxy connection.',
                        4405:'Too many connections. Close other game tabs and retry.'
                    };
                    const message = messages[event.code] || 'Game connection closed (code ' + event.code + ').';
                    this.lastCloseCode = event.code;
                    this.logger.warn('[Senpa]', message);
                    const label = this.isAuxiliary ? null : document.querySelector('.reconnect-message');
                    if (label) label.textContent = message;
                });
                this.connectionTimeout = setTimeout(() => {
                    if (current() && !this.isConnected) {
                        this.onError(new Error('Game connection timed out'));
                        this.close();
                    }
                }, 15000);
                this.events.emit('connecting', target);
            } catch (error) {
                if (current()) { this.onError(error); finish(); }
            }
        };
        client.onMessage = function (buffer) {
            const bytes = new Uint8Array(buffer);
            if (!bytes.length) return;
            if (bytes[0] === 44) { root.EonSenpaEmotes?.receive(this, buffer); return; }
            if (bytes[0] === 40 || bytes[0] === 41) {
                // Senpa ignores truncated chat packets instead of ending the socket.
                try { receiveChat(this, buffer); } catch (error) { if (!(error instanceof RangeError)) throw error; }
                return;
            }
            if (bytes[0] !== 0) return oldOnMessage.call(this, buffer);
            const view = new DataView(buffer);
            if (bytes.length < 8 || !bytes[7] || bytes.length < 8 + bytes[7] * 2) throw new Error('Incomplete Senpa player initialization');
            const size = view.getUint32(1, true);
            this.border = {left:0, top:0, right:size, bottom:size};
            this.minimapPlayers?.clear();
            this.serverClientId = view.getUint16(5, true);
            this.playerIds = Array.from({length:bytes[7]}, (_, index) => view.getUint16(8 + index * 2, true));
            this.initializePlayers?.(this.playerIds);
            this.clientId = this.playerIds[this.tabIndex];
            const alreadyReady = this.clientReady;
            this.authCompleted = this.clientReady = true;
            if (this.isReplay) return;
            this.sendPlayerInfo();
            if (!this.pingInterval) this.pingInterval = setInterval(() => {
                this.pingStartTime = this.app.stage.runtime;
                this.sendPing();
            }, 1000);
            if (!alreadyReady) readyTimer = setTimeout(() => {
                if (this.isConnected && this.clientReady) this.events.emit('ready');
            }, 200);
        };
        client.updatePlayerClients = function (reader) {
            for (let count = reader.readUInt8(); count--; ) {
                const id = reader.readUInt16(), isBot = !!reader.readUInt8();
                const name = nickname(reader.readUTF16StringLength(), id), tag = reader.readUTF16StringLength();
                const colorInt = reader.readUInt24(), hasReservedName = !!reader.readUInt8();
                const clanTag = reader.readUTF16StringLength();
                this.playerClients.set(id, {clientId:id, isBot, nickname:name, tag, colorInt, hasReservedName, clanTag});
            }
            for (let count = reader.readUInt8(); count--; ) {
                const id = reader.readUInt16(), flags = reader.readUInt8();
                // Consume every flagged field even if its parent record is missing.
                const player = this.playerClients.get(id) || {};
                if (flags & 1) player.nickname = nickname(reader.readUTF16StringLength(), id);
                if (flags & 2) player.tag = reader.readUTF16StringLength();
                if (flags & 4) { player.colorInt = reader.readUInt24(); player.hasReservedName = !!reader.readUInt8(); }
                if (flags & 8) player.clanTag = reader.readUTF16StringLength();
            }
            for (let count = reader.readUInt8(); count--; ) this.playerClients.delete(reader.readUInt16());
        };
        client.updatePlayers = function (reader) {
            for (let count = reader.readUInt8(); count--; ) {
                const playerId = reader.readUInt16(), clientId = reader.readUInt16();
                const colorInt = reader.readUInt24(), skin = reader.readUTF8StringLength(), hatId = reader.readUInt32();
                const playerClient = this.playerClients.get(clientId);
                if (playerClient) this.players.set(playerId, {playerId, clientId, colorInt, skin, hatId, playerClient});
            }
            for (let count = reader.readUInt8(); count--; ) {
                const id = reader.readUInt16(), flags = reader.readUInt8(), player = this.players.get(id) || {};
                if (flags & 1) player.colorInt = reader.readUInt24();
                if (flags & 2) player.skin = reader.readUTF8StringLength();
                if (flags & 4) player.hatId = reader.readUInt32();
            }
            for (let count = reader.readUInt8(); count--; ) this.players.delete(reader.readUInt16());
        };
        client.sendEmoji = function (slot) { return root.EonSenpaEmotes?.sendEmoji(this, slot); };
        client.sendChat = function (type, text) { return root.EonSenpaEmotes?.sendChat(this, type, text, this.app.nativeChatRoom); };
        client.sendSpawn = function () {
            if (!ready(this) || !this.isDead) return;
            this.feedState = false;
            this.sendMacroFeed?.(this.tabIndex, false);
            this.sendPlayerInfo();
            send(this, [0, this.tabIndex]);
        };
        client.sendSpectate = function () {
            if (!ready(this) || (this.hasAlivePlayers ?? !this.isDead)) return false;
            this.spectate.enabled = true;
            return true;
        };
        client.toggleSpectateMode = function () {
            // Senpa's X key switches the mode byte between 1 and 2. Keep it
            // across reconnects in this page, like the native input controller.
            this.app.spectateMode = this.app.spectateMode === 2 ? 1 : 2;
        };
        client.sendActionCursor = function () {
            const stage = this.app.stage;
            if (!ready(this) || this.isReplay || this.isDead || this.app.replayManager?.isReplay ||
                this.app.lobby?.isVisible || this.app.settingsMenu?.isVisible || !stage?.updateMouseWorldPosition) return false;
            // Sample the current mouse against the currently displayed camera.
            // WebSocket ordering puts this direction before the following split.
            // Keep the usual 40ms cadence; the action packet replaces its next tick.
            stage.updateMouseWorldPosition();
            if (!Number.isFinite(stage.mouse.worldX) || !Number.isFinite(stage.mouse.worldY)) return false;
            this.sendCursorPosition(stage.mouse.worldX, stage.mouse.worldY);
            return true;
        };
        client.sendSplit = function (amount = 1) {
            if (ready(this)) {
                this.sendActionCursor(); send(this, [22, this.tabIndex, amount]); this.app.controls?.actionSent('split');
                this.app.replayManager?.recordAction('split', this.tabIndex);
            }
        };
        client.sendFeed = function (unusedPlayerId, enabled, mode = false) {
            if (!ready(this)) return;
            this.feedState = enabled === true;
            if (enabled === true) this.sendActionCursor();
            send(this, enabled === true ? [23, this.tabIndex, 1, +!!mode] : [23, this.tabIndex, 0]);
        };
        client.sendCursorPosition = function (x, y) {
            if (!ready(this)) return;
            const alive = this.hasAlivePlayers ?? !this.isDead;
            if (!alive && !this.spectate.enabled) return;
            const spectating = !alive;
            const buffer = new ArrayBuffer(spectating ? 10 : 11), view = new DataView(buffer);
            view.setUint8(0, 20); view.setUint8(1, spectating ? (this.app.spectateMode === 2 ? 2 : 1) : 0);
            if (!spectating) view.setUint8(2, this.tabIndex);
            view.setInt32(spectating ? 2 : 3, x, true);
            view.setInt32(spectating ? 6 : 7, y, true);
            this.sendMessage(buffer);
            const now = performance.now(), stage = this.app.stage;
            if (stage) stage.nextSendCursorTime = now + Math.max(40, Number(stage.settings?.sendCursorInterval) || 40);
            this.app.controls?.cursorSent(this, now);
        };
        client.events.on('disconnected', () => {
            clearTimeout(readyTimer);
            client.emojiState = {until:0, pendingUntil:0, cooldownMs:0};
            client.serverClientId = null;
            client.playerIds = [];
            const banner = client.isAuxiliary ? null : document.getElementById?.('server-message');
            if (banner) { banner.textContent = ''; banner.hidden = true; }
        });
        root.EonNativeMulti?.attachClient(client);
        return client;
    }
    root.EonSenpaProtocol = {initialize, patchClient, connectionUrl, selectBeta, resolveBeta, nameColor, chatBadge, notify};
})(window);

