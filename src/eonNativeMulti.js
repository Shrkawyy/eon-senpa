(function (root) {
    'use strict';
    const emptyPlayer = () => ({x:0, y:0, totalMass:0, totalSize:0, cells:[], colorInt:0});

    // Exactly one network client. The server's player slots are plain state,
    // sharing its socket, world, authentication, and packet decoder.
    class GameConnection {
        constructor() { this.client = null; }
        get current() { return this.client; }
        get clients() { return this.client ? [this.client] : []; }
        get length() { return this.client ? 1 : 0; }
        get totalPlaying() { return this.client?.tabs.filter(tab => tab.player.cells.length).length || 0; }
        addConnection(client) {
            if (this.client && this.client !== client) throw new Error('A game connection already exists');
            this.client = client;
        }
        removeConnection(client) { if (this.client === client) this.client = null; }
        forEachClient(callback) { if (this.client) callback(this.client); }
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
            if (this.tabs.length < 2) return false;
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
                if (!tab.wasAlive && alive) this.events.emit('spawned', tab.index);
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
            cleanup.call(this);
            this.tabs = []; placeholder = emptyPlayer(); pendingTab = null;
            this.spectate.enabled = false;
        };
        client.fullSync = function () {
            for (const tab of this.tabs) tab.wasAlive = false;
            fullSync.call(this);
        };
    }

    function updateCamera(stage) {
        const client = stage.app.gameConnection.current;
        if (client) {
            client.updatePlayerPosition();
            // Senpa averages every owned cell across all slots, not each slot's
            // center. A newly spawned cell has the same weight as one split cell.
            let x = 0, y = 0, count = 0;
            for (const {player} of client.tabs) {
                for (const cell of player.cells) { x += cell.x; y += cell.y; count++; }
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
        }
        container.innerHTML = html;
    }
    root.EonNativeMulti = {GameConnection, attachClient, updateCamera, updateStats};
})(window);

