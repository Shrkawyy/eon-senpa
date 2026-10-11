(function (root) {
    'use strict';
    const emptyPlayer = () => ({x:0, y:0, totalMass:0, totalSize:0, cells:[], colorInt:0});
    // Passive, main-player-only diagnostics. Never create extra sockets or
    // invent player slots: only the game server can allocate them.
    function isFFA(client) {
        if (!client || client.isAuxiliary) return false;
        const option = Array.from(document.querySelectorAll('.server-option'))
            .find(item => item.dataset.value === client.app?.player?.serverUrl &&
                /free\s*for\s*all|\bffa\b|nemesis/i.test(item.textContent || ''));
        return !!option || /free\s*for\s*all|\bffa\b|nemesis/i.test(
            document.querySelector('.server-select-trigger .selected-text')?.textContent || '');
    }
    // Diagnostics never read the actual JWT, access keys or cookies.
    function accountState() {
        const state = root.SenpaAccount?.snapshot?.() || {};
        return {verified:!!state.verified, signedIn:!!state.signedIn,
            status:String(state.status || 'unknown'),
            error:state.error ? String(state.error).slice(0, 130) : ''};
    }
    function showReconnectOffer(client) {
        if (!isFFA(client) || !client.clientReady || client.tabs?.length !== 1 ||
            !accountState().verified || client.eonSlotAuthVerified || client.eonOfferedReconnect) return;
        client.eonOfferedReconnect = true;
        record(client, 'AUTH_FINISHED_AFTER_HANDSHAKE', 'Account verified after the server allocated 1 slot');
        let notice = document.getElementById('eon-ffa-auth-reconnect');
        if (notice) notice.remove();
        notice = document.createElement('div');
        notice.id = 'eon-ffa-auth-reconnect';
        notice.style.cssText = 'position:fixed;left:12px;top:65px;z-index:2000;padding:10px 12px;background:#101b2a;color:#e8f1fb;border:1px solid #2a586b;border-radius:8px;max-width:285px;font:13px sans-serif;box-shadow:0 8px 25px #0009';
        const label = document.createElement('div');
        label.textContent = 'FFA gave 1 slot before login verification finished. You can reconnect to try negotiating slots again.';
        label.style.marginBottom = '8px';
        const action = document.createElement('button');
        action.textContent = 'Reconnect FFA after login';
        action.style.cssText = 'background:#1d597d;border:1px solid #398bb0;color:white;border-radius:5px;padding:6px 8px;cursor:pointer';
        action.addEventListener('click', () => {
            if (client.tabs.some(tab => tab.player.cells.length > 0) &&
                !root.confirm('Reconnecting will disconnect your current player. Continue?')) return;
            notice.remove();
            root.EonFFAMultiDiagnostics.reconnectAfterLogin();
        });
        const dismiss = document.createElement('button');
        dismiss.textContent = 'Dismiss';
        dismiss.style.cssText = 'margin-left:8px;background:transparent;color:#b0bdc9;border:0;cursor:pointer';
        dismiss.addEventListener('click', () => notice.remove());
        notice.append(label,action,dismiss);
        document.body.append(notice);
    }
    function record(client, event, detail = '') {
        if (client.isAuxiliary) return;
        const entries = client.eonMultiHistory || (client.eonMultiHistory = []);
        const item = {time:new Date().toISOString(), event, detail:String(detail).slice(0, 180),
            slots:client.tabs?.length || 0, selectedSlot:(client.tabIndex ?? 0) + 1};
        entries.push(item);
        if (entries.length > 120) entries.shift();
        console.info('[EON Multi]', event, item.detail, 'slots=' + item.slots);
    }
    root.EonFFAMultiDiagnostics = {
        status() {
            const client = root.app?.gameConnection?.current;
            const session = accountState();
            if (!client) return {connected:false, reason:'No active game connection', mainAccount:session};
            return {connected:!!client.isConnected, serverSlots:client.tabs?.length || 0,
                selectedSlot:(client.tabIndex ?? 0) + 1, modeFFA:isFFA(client),
                aliveSlots:client.tabs?.filter(t => t.player.cells.length > 0).length || 0,
                mainAccount:session, verifiedWhenSlotsGranted:client.eonSlotAuthVerified ?? null,
                closeCode:client.lastCloseCode ?? null, closeReason:client.lastCloseReason || '',
                selectedServer:client.probeUrl || null,
                note:client.tabs?.length === 1 ? 'Server allocated one slot on this connection. Optional Dual FFA may request a separate second socket.' : null,
                events:(client.eonMultiHistory || []).slice()};
        },
        authChanged() {
            const client = root.app?.gameConnection?.current;
            if (!client || client.isAuxiliary) return;
            if (accountState().verified) showReconnectOffer(client);
        },
        reconnectAfterLogin() {
            const app = root.app, client = app?.gameConnection?.current;
            if (!app || !client || !client.isConnected) return false;
            if (!accountState().verified) { app.toasts?.show('Log in and verify your Senpa account first.', 'info', 4000); return false; }
            if (client.eonReconnectRequested) return false;
            client.eonReconnectRequested = true;
            record(client, 'MANUAL_RECONNECT', 'Reconnecting after main account verification');
            const url = app.player.serverUrl;
            // Do not spawn an additional simultaneous socket. Close the old
            // connection and let lobby remove it before opening the new one.
            client.events.once('disconnected', () => root.setTimeout(() => {
                if (!app.gameConnection.current && !app.replayManager?.isReplay)
                    app.lobby.initClient(url);
            }, 60));
            client.close();
            return true;
        },
        exportJSON() {
            const json = JSON.stringify(this.status(), null, 2);
            const url = URL.createObjectURL(new Blob([json], {type:'application/json'}));
            const a = document.createElement('a');
            a.href = url; a.download = 'eon-ffa-multi-diagnostics.json'; a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
    };

    // One primary game connection, with an optional independently negotiated
    // FFA secondary. Never invent player slots, credentials or protocol IDs.
    class GameConnection {
        constructor() { this._clients = []; this._active = null; }
        get current() { return this._active || this.primary || this._clients[0] || null; }
        get primary() { return this._clients.find(c => !c.isEonSecondary) || null; }
        get secondary() { return this._clients.find(c => c.isEonSecondary) || null; }
        get clients() { return this._clients.slice(); }
        get length() { return this._clients.length; }
        get totalPlaying() { return this._clients.reduce((n,c) => n + (c.tabs?.filter(t => t.player.cells.length).length || 0), 0); }
        addConnection(client) {
            if (this._clients.includes(client)) return;
            if (this._clients.length >= 2 || (!client.isEonSecondary && this.primary) ||
                (client.isEonSecondary && (!this.primary || this.secondary)))
                throw new Error('Only one primary and one authorized secondary connection are supported');
            this._clients.push(client);
            if (!this._active) this._active = client;
        }
        setActive(client) {
            if (!this._clients.includes(client) || !client.clientReady) return false;
            if (this._active !== client) {
                this._active?.stopAllFeeding?.();
                this._active = client;
                const stage = client.app?.stage;
                if (stage) stage.nextStatsTime = 0;
            }
            return true;
        }
        removeConnection(client) {
            const n = this._clients.indexOf(client);
            if (n < 0) return;
            this._clients.splice(n, 1);
            if (this._active === client) this._active = this.primary || this._clients[0] || null;
        }
        forEachClient(callback) { this.clients.forEach(callback); }
    }

    function attachClient(client) {
        client.tabs = [];
        let placeholder = emptyPlayer();
        let macroHeld = false, macroTab = null, pendingTab = null, pendingUntil = 0;
        Object.defineProperty(client, 'player', {configurable:true, get() { return this.tabs[this.tabIndex]?.player || placeholder; }});
        Object.defineProperty(client, 'hasAlivePlayers', {configurable:true, get() { return this.tabs.some(tab => tab.player.cells.length > 0); }});
        client.initializePlayers = function (ids) {
            this.stopAllFeeding();
            this.tabs = ids.map((playerId, index) => ({index, playerId, player:emptyPlayer(), wasAlive:false}));
            this.tabIndex = 0;
            this.clientId = ids[0] ?? null;
            this.spectate.enabled = false;
            pendingTab = null;
            this.eonSlotAuthVerified = accountState().verified;
            record(this, 'SERVER_SLOTS', this.tabs.length + ' native player slot(s) granted; main-account=' +
                (this.eonSlotAuthVerified ? 'verified' : accountState().signedIn ? 'pending' : 'guest'));
            if (!this.isEonSecondary && this.tabs.length === 1) root.setTimeout(() => showReconnectOffer(this), 200);
            // A one-slot handshake cannot be turned into two players locally.
            // Explain the real limitation rather than issuing invalid spawn packets.
            if (this.tabs.length < 2 && isFFA(this) && !this.isEonSecondary && !root.EonDualFFA?.enabled()) {
                this.app.toasts?.show('FFA Multi unavailable: server allocated only ' +
                    this.tabs.length + ' player slot. Check the FFA mode/account.', 'info', 6500);
            }
        };
        client.findClientOrigin = function (playerId) { return this.tabs.find(tab => tab.playerId === playerId) || null; };
        client.trackOwnCell = function (cell) {
            const tab = this.findClientOrigin(cell.playerId);
            if (!tab) return;
            if (!tab.player.cells.includes(cell)) tab.player.cells.push(cell);
            tab.player.colorInt = cell.colorInt;
        };
        client.untrackOwnCell = function (cell) {
            const cells = this.findClientOrigin(cell.playerId)?.player.cells;
            const index = cells?.indexOf(cell) ?? -1;
            if (index !== -1) cells.splice(index, 1);
        };
        client.updatePlayerPosition = function () {
            for (const {player} of this.tabs) {
                player.x = player.y = player.totalMass = player.totalSize = 0;
                for (const cell of player.cells) {
                    player.x += cell.x; player.y += cell.y;
                    player.totalMass += cell.mass; player.totalSize += cell.r;
                }
                if (player.cells.length) { player.x /= player.cells.length; player.y /= player.cells.length; }
            }
        };
        client.sendMacroFeed = function (index, enabled) {
            if (this.isConnected && this.authCompleted && this.tabs[index]) {
                this.sendMessage(Uint8Array.from([23, index, 1, +!!enabled]).buffer);
                this.app.controls?.actionSent(enabled ? 'feedStart' : 'feedStop');
                this.app.replayManager?.recordAction(enabled ? 'feed-start' : 'feed-stop', index);
            }
        };
        client.stopAllFeeding = function () {
            if (macroTab !== null) this.sendMacroFeed(macroTab, false);
            macroHeld = false; macroTab = null;
        };
        client.syncMacroFeed = function (held, cursorFresh = false) {
            if (!held || !this.isConnected || !this.authCompleted || this.isReplay || this.app.replayManager?.isReplay ||
                this.app.lobby?.isVisible || this.app.settingsMenu?.isVisible || root.document?.hidden) return this.stopAllFeeding();
            if (!macroHeld || macroTab !== this.tabIndex) {
                if (macroTab !== null) this.sendMacroFeed(macroTab, false);
                macroTab = this.tabIndex;
                if (!cursorFresh) this.sendActionCursor?.();
                this.sendMacroFeed(macroTab, true);
            }
            macroHeld = true;
        };
        client.setActiveTab = function (index, {spawn = false, fromServer = false} = {}) {
            if (!this.clientReady || !this.tabs[index]) return false;
            const changed = this.tabIndex !== index;
            this.tabIndex = index;
            this.clientId = this.tabs[index].playerId;
            if (!fromServer) { pendingTab = index; pendingUntil = Date.now() + 1500; }
            if (changed) record(this, 'SELECT_SLOT', 'Player ' + (index + 1));
            if (spawn && this.isDead) this.sendSpawn();
            // Tell the server immediately which slot is active, even if the mouse
            // has not moved since the key press.
            const mouse = this.app.stage?.mouse;
            if (!fromServer && mouse) {
                this.app.stage.updateMouseWorldPosition?.();
                this.sendCursorPosition(mouse.worldX, mouse.worldY);
            }
            this.syncMacroFeed(!!this.app.input?.isMacroFeedActive, !fromServer && !!mouse);
            if (changed) this.events.emit('activePlayerChanged', index);
            if (changed && !fromServer) this.app.replayManager?.recordAction('switch', index);
            if (this.app.stage) this.app.stage.nextStatsTime = 0;
            return true;
        };
        client.switchPlayer = function () {
            if (!this.clientReady) { record(this, 'SWITCH_IGNORED', 'Connection not ready'); return false; }
            if (this.tabs.length < 2 && root.EonDualFFA?.enabled() && isFFA(this))
                return root.EonDualFFA.switchTab(this.app);
            if (this.tabs.length < 2) {
                record(this, 'NO_SECOND_SLOT', 'Server allocated ' + this.tabs.length + ' slot(s)');
                const now = Date.now();
                if (!this.eonMultiNoticeAt || now - this.eonMultiNoticeAt > 5000) {
                    this.eonMultiNoticeAt = now;
                    this.app.toasts?.show('Cannot switch to Multi: this server connection has only ' +
                        this.tabs.length + ' player slot.', 'info', 4500);
                }
                return false;
            }
            // Match Senpa's togglePlayer: select the next slot and spawn it only
            // when that slot has no live cells yet.
            return this.setActiveTab((this.tabIndex + 1) % this.tabs.length, {spawn:true});
        };
        client.applyServerTab = function (index) {
            const selected = this.tabs[this.tabIndex];
            const selectedDied = selected?.wasAlive && !selected.player.cells.length;
            if (pendingTab !== null && index !== pendingTab && Date.now() < pendingUntil && !selectedDied) return;
            pendingTab = null;
            if (index !== this.tabIndex) this.setActiveTab(index, {fromServer:true});
        };
        client.finishPlayersUpdate = function () {
            this.updatePlayerPosition();
            // Native spectating ends when an owned cell actually appears.
            if (this.hasAlivePlayers) this.spectate.enabled = false;
            let anyDied = false, selectedDied = false;
            for (const tab of this.tabs) {
                const alive = tab.player.cells.length > 0;
                if (tab.wasAlive && !alive) { anyDied = true; if (tab.index === this.tabIndex) selectedDied = true; }
                if (!tab.wasAlive && alive) {
                    if (this.eonPendingSpawns) this.eonPendingSpawns.delete(tab.index);
                    record(this, 'SPAWN_CONFIRMED', 'Player ' + (tab.index + 1));
                    this.events.emit('spawned', tab.index);
                }
                tab.wasAlive = alive;
            }
            const living = this.tabs.filter(tab => tab.wasAlive);
            // Senpa's autoSwitchCells defaults to true. Only an actual death of
            // the selected player switches control; choosing an empty slot to
            // spawn it manually must keep that selection.
            if (selectedDied && living.length && !this.isReplay && this.app.stage?.settings?.autoSwitchCells !== false) {
                const next = living.find(tab => tab.index > this.tabIndex) || living[0];
                this.setActiveTab(next.index);
            }
            if (anyDied && !living.length) {
                this.stopAllFeeding();
                // Native Player.onDeath resets the selection for the next life.
                const changed = this.tabIndex !== 0;
                this.tabIndex = 0; this.clientId = this.tabs[0]?.playerId ?? null;
                pendingTab = null;
                if (changed) this.events.emit('activePlayerChanged', 0);
                this.events.emit('died');
            }
        };
        const close = client.close, cleanup = client.cleanup, fullSync = client.fullSync;
        client.close = function () { this.stopAllFeeding(); close.call(this); };
        client.cleanup = function () {
            this.stopAllFeeding();
            record(this, 'DISCONNECT', this.lastCloseCode ? 'Close code ' + this.lastCloseCode : 'Connection closed');
            this.eonPendingSpawns?.clear();
            cleanup.call(this);
            this.tabs = []; placeholder = emptyPlayer(); pendingTab = null;
            this.spectate.enabled = false;
        };
        client.fullSync = function () {
            record(this, 'WORLD_RESYNC', 'Reset player world state');
            for (const tab of this.tabs) tab.wasAlive = false;
            fullSync.call(this);
        };
        // Record whether a spawn was *confirmed by a world cell*; sending a
        // packet is not proof that a new player was accepted by the server.
        client.eonPendingSpawns = new Map();
        client.eonSpawnSent = function (index) {
            record(this, 'SPAWN_REQUEST', 'Player ' + (index + 1));
            const stamp = Date.now(); this.eonPendingSpawns.set(index, stamp);
            setTimeout(() => {
                if (this.eonPendingSpawns?.get(index) !== stamp) return;
                this.eonPendingSpawns.delete(index);
                if (this.isConnected && this.tabs[index] && !this.tabs[index].player.cells.length)
                    record(this, 'SPAWN_UNCONFIRMED', 'Player ' + (index + 1) + ' did not receive a cell within 5 seconds');
            }, 5000);
        };
    }

    function updateCamera(stage) {
        const client = stage.app.gameConnection.current;
        if (client) {
            stage.app.gameConnection.forEachClient(c => c.updatePlayerPosition());
            // Senpa averages every owned cell across all slots, not each slot's
            // center. A newly spawned cell has the same weight as one split cell.
            let x = 0, y = 0, count = 0;
            for (const connection of stage.app.gameConnection.clients) {
                for (const {player} of connection.tabs) {
                    for (const cell of player.cells) { x += cell.x; y += cell.y; count++; }
                }
            }
            if (count) {
                stage.camera.target.x = x / count;
                stage.camera.target.y = y / count;
                stage.camera.x += (stage.camera.target.x - stage.camera.x) / (31 - stage.settings.cameraSpeed);
                stage.camera.y += (stage.camera.target.y - stage.camera.y) / (31 - stage.settings.cameraSpeed);
            } else {
                stage.camera.x = (29 * stage.camera.x + client.spectate.x) / 30;
                stage.camera.y = (29 * stage.camera.y + client.spectate.y) / 30;
            }
        }
        stage.camera.zoom += (stage.camera.target.zoom - stage.camera.zoom) / 8;
    }
    function updateStats(stage, delta) {
        const container = document.getElementById('stats-hud');
        if (!container) return;
        const client = stage.app.gameConnection.current;
        let html = '<div class="stat-badge">' + Math.round(1000 / delta) + ' FPS</div>';
        if (client?.clientReady) {
            client.updatePlayerPosition();
            html += '<div class="stat-badge">' + Math.round(client.ping) + 'ms</div>';
            for (const tab of client.tabs) {
                const mass = tab.player.totalMass < 1000 ? Math.floor(tab.player.totalMass) : (tab.player.totalMass / 1000).toFixed(1) + 'k';
                html += '<span class="stat-badge native-player-tab' + (tab.index === client.tabIndex ? ' active' : '') +
                    '">Player ' + (tab.index + 1) + ' · ' + mass + ' · ' + tab.player.cells.length + ' cells</span>';
            }
            if (isFFA(client)) {
                const auth = accountState(), dual = stage.app.gameConnection.secondary;
                const label = dual ? ' · Dual FFA: ' + (dual.clientReady ? '2 sockets ready' : 'connecting') : '';
                html += '<span class="stat-badge">FFA Multi: ' + client.tabs.length + ' server slot(s)' + label + ' · ' +
                    (auth.verified ? 'Account verified' : auth.signedIn ? 'Login pending' : 'Guest') + '</span>';
            }
        }
        container.innerHTML = html;
    }
    root.EonNativeMulti = {GameConnection, attachClient, updateCamera, updateStats};
})(window);

