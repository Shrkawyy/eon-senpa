(function (root) {
    'use strict';
    const ready = c => !!(c?.isConnected && c.clientReady && c.authCompleted);
    const endpoint = c => { try { return new URL(c?.probeUrl || c?.socket?.url).origin; } catch { return ''; } };
    const packet = (c, ...bytes) => c.sendMessage(Uint8Array.from(bytes).buffer);
    const slots = c => c?.tabs?.slice(0, 2) || [];
    const SPAWN_RETRY_MS = 2000, SPAWN_ATTEMPTS = 3, SPAWN_COOLDOWN_MS = 10000;
    function withSlot(client, index, action) {
        const previous = client.tabIndex, id = client.clientId;
        client.tabIndex = index; client.clientId = client.tabs[index].playerId;
        try { return action(); }
        finally { client.tabIndex = previous; client.clientId = id; }
    }

    // Like the supplied script, each extra connection has an isolated iframe
    // realm. Load only the existing protocol, not a second copy of the game UI.
    function isolatedProtocol(client) {
        client.initiate = async function () {
            const source = root.EonAssets?.protocolLoader?.();
            if (!source) throw Error('Reinstall the bundled userscript to load bot connections');
            const frame = document.createElement('iframe');
            frame.hidden = true; frame.title = 'Senpa helper protocol'; document.body.append(frame);
            const win = frame.contentWindow, timers = new Set(), intervals = new Set();
            const setT = win.setTimeout.bind(win), setI = win.setInterval.bind(win);
            let cancel, disposed = false;
            win.setTimeout = (fn, ms, ...args) => {
                const id = setT(() => { timers.delete(id); if (!disposed) typeof fn === 'function' ? fn(...args) : win.eval(fn); }, ms);
                timers.add(id); return id;
            };
            win.setInterval = (fn, ms, ...args) => { const id = setI(fn, ms, ...args); intervals.add(id); return id; };
            client.disposeProtocol = () => {
                if (disposed) return; disposed = true; cancel?.(Error('Connection cancelled'));
                for (const id of timers) win.clearTimeout(id);
                for (const id of intervals) win.clearInterval(id);
                frame.remove(); client.module = null;
            };
            win.game_server = new URL(client.app.player.serverUrl).host;
            win.webpackChunkeon_client = [];
            win.Function(source).call(win);
            const exports = {}, define = (target, values) => {
                for (const [name, get] of Object.entries(values)) Object.defineProperty(target, name, {get});
            };
            win.webpackChunkeon_client[0][1][458]({}, exports, {d:define});
            await new Promise((resolve, reject) => {
                cancel = reject;
                client.module = exports.A({wasmBinary:root.__EON_WASM_BINARY__,
                    onRuntimeInitialized:() => { cancel = null; resolve(); }, print:() => {}, printErr:message => reject(Error(message))});
            });
            client.alloc = function () {
                const track = win.CanvasCaptureMediaStreamTrack || (win.CanvasCaptureMediaStreamTrack = {});
                if (track?.contextBufferFactory) { this.module._alloc(9, track.contextBufferFactory); track.contextBufferFactory = null; }
            };
        };
    }

    // Helpers keep only their owned cells. No second renderer, camera, chat or
    // replay recorder runs, but every field (including WASM blobs) is consumed.
    function ownedWorld(reader) {
        const living = slots(this).filter(tab => tab.player.cells.length).map(tab => tab.index);
        const remove = id => { const cell = this.cells[id]; if (cell) { this.untrackOwnCell(cell); delete this.cells[id]; } };
        for (let n = reader.readUInt16(); n--; ) { reader.readUInt32(); remove(reader.readUInt32()); }
        for (let n = reader.readUInt16(); n--; ) {
            const id = reader.readUInt32(), x = reader.readInt32(), y = reader.readInt32(), r = reader.readUInt16(), type = reader.readUInt8();
            let playerId;
            if (type === 0) { playerId = reader.readUInt16(); reader.readUInt24(); }
            if (type === 2) reader.readUInt24();
            if (type === 5) {
                const data = new Uint8Array(reader.readUInt16());
                for (let i = 0; i < data.length; i++) data[i] = reader.readUInt8();
                this.allocArr(data);
            }
            if (this.playerIds.includes(playerId)) {
                remove(id);
                const cell = this.cells[id] = {id, playerId, x, y, r, mass:r * r / 100};
                this.trackOwnCell(cell);
            }
        }
        for (let n = reader.readUInt16(); n--; ) {
            const id = reader.readUInt32(), x = reader.readInt32(), y = reader.readInt32(), r = reader.readUInt16();
            if (this.cells[id]) Object.assign(this.cells[id], {x, y, r, mass:r * r / 100});
        }
        for (let n = reader.readUInt16(); n--; ) { const id = reader.readUInt32(); if (!id) break; remove(id); }
        this.alloc();
        if (reader.offset + 1 <= reader.view.byteLength) reader.readUInt8(); // Each command explicitly addresses its native slot.
        if (reader.offset + 4 <= reader.view.byteLength) this.border.right = this.border.bottom = reader.readUInt32();
        this.finishPlayersUpdate();
        for (const index of living) if (!this.tabs[index]?.player.cells.length) this.events.emit('helperSlotDied', index);
    }

    class Manager {
        constructor(app) {
            this.app = app;
            this.controls = {follow:true, split:false, feed:false, respawn:false};
            this.followMode = 'mouse'; this.targetId = null; this.targetRecord = null; this.targetConnection = null;
            // Target box is optional. Server picks the actual spawn location;
            // box holds a WORLD coordinate bots can move toward after spawning.
            this.boxEnabled = false; this.boxPoint = null; this.boxServer = null;
            this.boxDragging = false; this.boxElement = null;
            // Each account has isolated local token storage and its own two helper connections.
            this.accounts = Array.from({length:10}, (_, index) => root.createSenpaAccount(root, {
                prefix:'eon_bots_' + (index + 1), isolated:true,
                popupName:'SenpaBotAccountLogin_' + (index + 1),
                onDiagnostic:event => this.accountLog(index, event)
            }));
            let names = [];
            try { names = JSON.parse(localStorage.getItem('eon_bot_names') || '[]'); } catch {}
            this.bots = Array.from({length:20}, (_, index) => ({index,
                accountIndex:Math.floor(index / 2),
                name:typeof names?.[index] === 'string' ? names[index].slice(0, 24) : 'Bot ' + (index + 1),
                client:null, primary:null, status:'Disconnected', roamTargets:[],
                intent:null, nextSpawn:[0, 0], nextSplit:0, nextFeed:0, generation:0, packets:0, spawned:0}));
            this.botLogs = [];
            this.createUI();
            this.initializeTargetBox();
            this.accounts.forEach((account, accountIndex) => {
                let lastToken = null;
                account.subscribe(state => {
                    const current = account.getToken(), profile = state.account;
                    const row = this.panel.querySelector('[data-account-row="' + accountIndex + '"]');
                    if (!row) return;
                    row.querySelector('[data-account-status]').textContent = state.status === 'signing-in' ? 'Complete sign-in in popup…' :
                        state.verified ? 'Verified: ' + (profile?.name || profile?.username || profile?.id || 'Senpa account') :
                        state.signedIn ? 'Token received · verification pending' : 'Guest';
                    row.querySelector('[data-account-error]').textContent = state.error || '';
                    row.querySelector('[data-account-logout]').hidden = !state.signedIn;
                    if (current !== lastToken) {
                        if (lastToken && !current) this.disconnectAccount(accountIndex);
                        lastToken = current;
                        for (const bot of this.bots.filter(b => b.accountIndex === accountIndex)) if (ready(bot.client)) {
                            bot.client.sendAuth(); if (!bot.client.hasAlivePlayers) bot.client.sendPlayerInfo();
                        }
                    }
                });
                account.initialize().catch(() => {});
            });
            this.timer = setInterval(() => this.tick(), 40);
            root.addEventListener('pagehide', () => { this.disconnectAll(); this.accounts.forEach(account => account.dispose()); this.boxElement?.remove(); });
            root.addEventListener('keydown', event => {
                if (app.input.isRebinding || app.settingsMenu?.isVisible || event.ctrlKey || event.altKey || event.metaKey || this.typing(event.target)) return;
                const action = app.input.getAction(event.code || event.key);
                if (event.repeat && action?.startsWith('toggleBot')) { event.preventDefault(); event.stopImmediatePropagation(); return; }
                if (!this.handleAction(action)) return;
                event.preventDefault(); event.stopImmediatePropagation();
            }, true);
        }
        typing(target = document.activeElement) { return !!target?.matches?.('input:not([type=checkbox]):not([type=button]),textarea,select,[contenteditable="true"]'); }
        setControl(key, enabled) {
            if (!Object.hasOwn(this.controls, key)) return;
            this.controls[key] = !!enabled;
            for (const bot of this.bots) {
                if (key === 'respawn' && !enabled && bot.intent?.automatic) {
                    bot.intent = null; this.lifeStatus(bot);
                }
            }
            const input = this.panel?.querySelector('[data-option=' + key + ']');
            if (input) input.checked = this.controls[key];
        }
        // A world-anchored right-click target. The canvas can sit below transparent
        // game HUD layers, so hit-test through overlays while excluding UI controls.
        initializeTargetBox() {
            const box = this.boxElement = document.createElement('div');
            box.id = 'eon-bot-world-target'; box.hidden = true;
            box.setAttribute('aria-label','Bot follow destination');
            box.textContent = 'BOT TARGET';
            box.style.cssText = 'position:fixed;left:0;top:0;transform:translate(-50%,-50%);width:42px;height:42px;z-index:790;pointer-events:none;display:none;align-items:center;justify-content:center;border:2px solid #4ef0de;background:#08cfb522;box-shadow:0 0 0 2px #061b27,0 0 16px #24e6d67a;border-radius:7px;color:white;font:700 8px system-ui;white-space:nowrap;text-shadow:0 1px 3px #000';
            document.body.append(box);
            const stage = this.app.stage;
            const canvasRect = () => stage?.canvas?.getBoundingClientRect?.() ||
                {left:0,top:0,width:root.innerWidth,height:root.innerHeight,right:root.innerWidth,bottom:root.innerHeight};
            const blocked = target => !!target?.closest?.(
                'button,input,textarea,select,a,[contenteditable="true"],[role="dialog"],'+
                '#eon-bots-panel,#eon-dual-ffa-toggle,.lobby-overlay,.settings-overlay,'+
                '#settingsOverlay,#chatContainer,#leaderboard,#stats-hud,#minimap');
            const inGameArea = e => {
                const canvas = stage?.canvas, rect=canvasRect();
                if (!canvas || !Number.isFinite(e.clientX) || !Number.isFinite(e.clientY) ||
                    e.clientX < rect.left || e.clientX > rect.right ||
                    e.clientY < rect.top || e.clientY > rect.bottom || blocked(e.target)) return false;
                if (e.target === canvas || canvas.contains?.(e.target)) return true;
                // Game overlays may receive the click even though canvas is below.
                const stack = document.elementsFromPoint?.(e.clientX, e.clientY) || [];
                return stack.includes(canvas);
            };
            const maySelect = e => this.boxEnabled && inGameArea(e) && !document.hidden &&
                !this.app.settingsMenu?.isVisible && !this.app.lobby?.isVisible &&
                !this.app.replayManager?.isReplay && ready(this.app.gameConnection?.primary || this.app.gameConnection?.current);
            this.placeTargetAtScreen = (clientX,clientY) => {
                const camera=stage?.camera, rect=canvasRect();
                if (!camera || !Number.isFinite(camera.zoom) || camera.zoom <= 0 ||
                    !Number.isFinite(clientX) || !Number.isFinite(clientY)) return false;
                const point={x:camera.x + (clientX - (rect.left+rect.width/2))/camera.zoom,
                    y:camera.y + (clientY - (rect.top+rect.height/2))/camera.zoom};
                if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return false;
                const border=stage.border;
                if (border && Number.isFinite(border.left) && Number.isFinite(border.right) && border.right > border.left &&
                    Number.isFinite(border.top) && Number.isFinite(border.bottom) && border.bottom > border.top) {
                    point.x=Math.min(border.right,Math.max(border.left,point.x));
                    point.y=Math.min(border.bottom,Math.max(border.top,point.y));
                }
                this.boxPoint=point;
                this.boxServer=endpoint(this.app.gameConnection.primary || this.app.gameConnection.current);
                if (this.followMode !== 'box') this.setFollowMode('box');
                this.paintTargetBox();
                return true;
            };
            root.addEventListener('mousedown', e => {
                if (e.button !== 2 || !maySelect(e)) return;
                this.boxDragging=true;
                this.placeTargetAtScreen(e.clientX,e.clientY);
                e.preventDefault(); e.stopImmediatePropagation();
            },true);
            root.addEventListener('mousemove', e => {
                if (inGameArea(e)) this.lastGameCursor={x:e.clientX,y:e.clientY};
                if (!this.boxDragging) return;
                if (!(e.buttons & 2)) {this.boxDragging=false;return;}
                if (inGameArea(e)) this.placeTargetAtScreen(e.clientX,e.clientY);
            },true);
            root.addEventListener('mouseup', e => {
                if (e.button === 2) this.boxDragging=false;
            },true);
            root.addEventListener('blur',()=>{this.boxDragging=false;});
            root.addEventListener('contextmenu',e=>{
                if (maySelect(e) || (this.boxDragging && inGameArea(e))) {
                    e.preventDefault(); e.stopImmediatePropagation();
                }
            },true);
        }
        paintTargetBox() {
            const box = this.boxElement, point = this.boxPoint, stage = this.app.stage;
            const source = this.app.gameConnection?.primary || this.app.gameConnection?.current;
            const valid = this.boxEnabled && this.followMode === 'box' && point && stage?.camera &&
                this.boxServer && this.boxServer === endpoint(source) &&
                Number.isFinite(stage.camera.zoom) && stage.camera.zoom > 0;
            if (!valid) {if (box) {box.hidden = true; box.style.display='none';} return;}
            const rect=stage.canvas?.getBoundingClientRect?.() || {left:0,top:0,width:root.innerWidth,height:root.innerHeight};
            const x = rect.left+rect.width/2 + (point.x - stage.camera.x) * stage.camera.zoom;
            const y = rect.top+rect.height/2 + (point.y - stage.camera.y) * stage.camera.zoom;
            if (x < rect.left-50 || y < rect.top-50 || x > rect.left+rect.width+50 || y > rect.top+rect.height+50) {
                box.hidden = true; box.style.display='none'; return;
            }
            box.hidden = false;
            box.style.left=x+'px';box.style.top=y+'px';box.style.display='flex';
        }
        clearTargetBox() {
            this.boxPoint = null; this.boxServer = null; this.boxDragging = false;
            if (this.followMode === 'box') this.setFollowMode('mouse');
            this.paintTargetBox();
        }
        setFollowMode(mode) {
            if (!['mouse', 'player', 'random', 'box'].includes(mode)) return;
            this.followMode = mode;
            for (const bot of this.bots) bot.roamTargets = [];
            this.panel.querySelector('[data-follow-mode]').value = mode;
            if (mode === 'box') {
                this.boxEnabled = true;
                const checkbox = this.panel.querySelector('[data-target-box-enabled]');
                if (checkbox) checkbox.checked = true;
            }
            this.paintTargetBox();
            this.panel.querySelector('[data-player-picker]').hidden = mode !== 'player';
            if (mode === 'player') { this.refreshTargets(); this.playerTarget(); }
        }
        handleAction(action) {
            if (action === 'toggleBots') { this.toggle(); return true; }
            if (this.app.replayManager?.isReplay || document.hidden) return false;
            let message;
            if (action === 'toggleBotMode') {
                this.setFollowMode(this.followMode === 'random' ? 'mouse' : 'random');
                message = 'Bots: ' + (this.followMode === 'random' ? 'random movement' : 'follow mouse');
            } else {
                const key = {toggleBotSplit:'split', toggleBotFeed:'feed', toggleBotRespawn:'respawn'}[action];
                if (!key) return false;
                this.setControl(key, !this.controls[key]);
                message = 'Bots: ' + {split:'fast split', feed:'light feed', respawn:'auto respawn'}[key] + (this.controls[key] ? ' ON' : ' OFF');
            }
            this.app.toasts?.show(message, 'info', 1800);
            return true;
        }
        randomTarget(bot, tab, now) {
            if (!tab.player.cells.length) { bot.roamTargets[tab.index] = null; return null; }
            const border = bot.client.border;
            if (!border || ![border.left, border.top, border.right, border.bottom].every(Number.isFinite) ||
                border.right <= border.left || border.bottom <= border.top) return null;
            const {x, y} = tab.player;
            const radius = Math.max(0, ...tab.player.cells.map(cell => cell.r || 0));
            const padX = Math.min(radius + 120, (border.right - border.left) / 4);
            const padY = Math.min(radius + 120, (border.bottom - border.top) / 4);
            const target = bot.roamTargets[tab.index];
            if (target && now < target.until && Math.hypot(target.x - x, target.y - y) > Math.max(100, radius) &&
                target.x >= border.left + padX && target.x <= border.right - padX && target.y >= border.top + padY && target.y <= border.bottom - padY) return target;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.min(800 + Math.random() * 1600, Math.min(border.right - border.left, border.bottom - border.top) / 2);
            // Hold a destination for a few seconds rather than jittering each tick.
            return bot.roamTargets[tab.index] = {
                x:Math.max(border.left + padX, Math.min(border.right - padX, x + Math.cos(angle) * distance)),
                y:Math.max(border.top + padY, Math.min(border.bottom - padY, y + Math.sin(angle) * distance)),
                until:now + 2500 + Math.random() * 1500
            };
        }
        accountLog(accountIndex, event) {
            if (!Array.isArray(this.botLogs)) return;
            const clean = value => String(value ?? '').replace(/(?:eyJ[A-Za-z0-9_-]+\.){2}[A-Za-z0-9_-]+/g, '[redacted JWT]')
                .replace(/(?:access_token|authorization|password|sessionId|accessKey)\s*[:=]\s*[^\s&,;]+/gi, '$1=[redacted]').slice(0, 220);
            const entry = {time:new Date().toISOString(), account:accountIndex+1, bot:null, type:'AUTH',
                phase:clean(event.phase), status:event.status, message:clean(event.detail)};
            this.botLogs.push(entry);
            if (this.botLogs.length > 500) this.botLogs.shift();
            this.paintBotLogs();
        }
        botLog(bot, type, message, meta = {}) {
            const clean = v => String(v ?? '').replace(/(?:eyJ[A-Za-z0-9_-]+\.){2}[A-Za-z0-9_-]+/g, '[redacted JWT]').replace(/(?:access_token|authorization|password|sessionId|accessKey)\s*[:=]\s*[^\s&,;]+/gi, '$1=[redacted]').slice(0, 350);
            const event = {time:new Date().toISOString(), account:bot.accountIndex+1, bot:bot.index+1, type, message:clean(message)};
            if (Number.isInteger(meta.code)) event.code = meta.code;
            if (meta.reason) event.reason = clean(meta.reason);
            this.botLogs.push(event);
            if (this.botLogs.length > 500) this.botLogs.shift();
            this.paintBotLogs();
        }
        paintBotLogs() {
            const out = this.panel?.querySelector('[data-bot-logs]');
            if (!out || out.hidden) return;
            const filter = this.panel?.querySelector('[data-bot-filter]')?.value || 'all';
            const rows = this.botLogs.filter(e => filter === 'all' ||
                (filter === 'auth' && e.type === 'AUTH') ||
                (filter === 'problems' && (e.type === 'ERROR' || e.type === 'DISCONNECT' || (e.type === 'AUTH' && e.status >= 400))));
            out.textContent = rows.slice(-120).map(e => `[${e.time.slice(11,19)}] Account ${e.account}${e.bot == null ? '' : ' Bot ' + e.bot} · ${e.type}${e.phase ? ' ' + e.phase : ''}${e.status ? ' HTTP '+e.status : ''}: ${e.message}${e.code !== undefined ? ' (code '+e.code+')' : ''}${e.reason ? ' · '+e.reason : ''}`).join('\n') || 'No matching bot/login events yet';
            out.scrollTop = out.scrollHeight;
        }
        setStatus(bot, text) {
            if (bot.status !== text) {
                const important = /connect|socket|ready|spawn|verification|reject|limit|fail|time.?out|stopp|disconnect|error|login|sign in|unconfirm/i.test(text);
                if (important) this.botLog(bot, /fail|rejected|error|timeout|limit|unconfirm/i.test(text) ? 'ERROR' : 'STATE', text);
            }
            bot.status = text; this.render(bot);
        }
        setTargetStatus(text) {
            const label = this.panel?.querySelector('[data-target-status]');
            if (label && label.textContent !== text) label.textContent = text;
        }
        refreshTargets() {
            const main = (this.app.gameConnection.primary || this.app.gameConnection.current), select = this.panel.querySelector('[data-target-player]');
            if (this.targetConnection !== main) { this.targetId = null; this.targetRecord = null; this.targetConnection = main; }
            const ownHelpers = new Set(this.bots.map(bot => bot.client?.serverClientId).filter(id => id != null));
            const rows = [...(main?.playerClients || [])].filter(([id]) => !ownHelpers.has(id));
            rows.sort((a, b) => String(a[1].nickname).localeCompare(String(b[1].nickname)) || a[0] - b[0]);
            select.replaceChildren(new Option('Choose a player…', ''));
            for (const [id, player] of rows) select.add(new Option((player.nickname || 'Unnamed') + ' (#' + id + ')', String(id)));
            if (this.targetId !== null && !rows.some(([id]) => id === this.targetId)) select.add(new Option('Selected player unavailable (#' + this.targetId + ')', String(this.targetId)));
            select.value = this.targetId === null ? '' : String(this.targetId);
        }
        playerTarget(now = performance.now()) {
            const main = (this.app.gameConnection.primary || this.app.gameConnection.current);
            if (this.targetId === null) { this.setTargetStatus('Choose a player from the list.'); return null; }
            // Bind to the current identity, not just a reusable name or server ID.
            if (!ready(main) || main !== this.targetConnection || !this.targetRecord || main.playerClients.get(this.targetId) !== this.targetRecord ||
                this.bots.some(bot => bot.client?.serverClientId === this.targetId)) {
                this.setTargetStatus('Player left or connection changed · choose a player again.'); return null;
            }
            let point = null, largest = -1;
            for (const id in main.cells) {
                const cell = main.cells[id], player = main.players.get(cell.playerId);
                if (cell.destroyed || player?.clientId !== this.targetId) continue;
                const x = cell.targetX ?? cell.x, y = cell.targetY ?? cell.y, radius = cell.targetR ?? cell.r;
                if (Number.isFinite(x) && Number.isFinite(y) && radius > largest) { point = {x, y}; largest = radius; }
            }
            // Use only fresh positions actually supplied by the server's minimap.
            if (!point) for (const [id, position] of main.minimapPlayers) {
                if (main.players.get(id)?.clientId !== this.targetId || now - position.updateTime > 2000) continue;
                const radius = position.endRadius, x = position.endX, y = position.endY;
                if (radius > 0 && radius > largest && Number.isFinite(x) && Number.isFinite(y)) { point = {x, y}; largest = radius; }
            }
            this.setTargetStatus(point ? 'Following ' + this.targetRecord.nickname + ' (#' + this.targetId + ')' : 'Position unavailable · waiting for the player.');
            return point;
        }
        anchor() {
            const main = (this.app.gameConnection.primary || this.app.gameConnection.current);
            const cells = main?.player?.cells.length ? main.player.cells : main?.tabs?.flatMap(tab => tab.player.cells) || [];
            if (!cells.length) return null;
            return {x:cells.reduce((sum, c) => sum + (c.targetX ?? c.x), 0) / cells.length,
                y:cells.reduce((sum, c) => sum + (c.targetY ?? c.y), 0) / cells.length};
        }
        async connect(index) {
            const bot = this.bots[index], main = (this.app.gameConnection.primary || this.app.gameConnection.current);
            if (bot.client) return;
            if (!ready(main) || this.app.replayManager?.isReplay) { this.setStatus(bot, 'Connect your main player first'); return; }
            const account = this.accounts[bot.accountIndex];
            if (!account?.getToken()) {
                this.setStatus(bot, 'Sign in to Account ' + (bot.accountIndex + 1) + ' first');
                return;
            }
            // OAuth tokens alone are not evidence of a valid Senpa account.
            // Check the official account endpoint before sending the bot to a game server.
            if (!account.snapshot().verified) {
                const verified = await account.loadProfile();
                if (!verified) {
                    const detail = account.snapshot().error || 'Senpa account verification pending or rejected';
                    this.setStatus(bot, 'Cannot connect: ' + detail);
                    return;
                }
            }
            const target = endpoint(main);
            if (!target) { this.setStatus(bot, 'Main server address unavailable'); return; }
            const attempt = ++bot.generation;
            bot.primary = main; bot.packets = 0; bot.spawned = 0; bot.distance = null; bot.serverNotice = '';
            bot.nextSpawn = [0, 0]; bot.roamTargets = [];
            // Independent protocol/WASM state; never add helpers to GameConnection.
            const facade = {player:{...this.app.player, nickname1:bot.name, serverUrl:target, skin1:'', skin2:''},
                authManager:this.app.authManager, spectateMode:1, lobby:{isVisible:false},
                stage:{get runtime() { return performance.now(); }, settings:this.app.stage.settings},
                toasts:{show:text => this.setStatus(bot, text)}};
            const client = bot.client = new main.constructor(facade);
            client.isAuxiliary = true;
            client.botAccount = this.accounts[bot.accountIndex];
            root.EonSenpaIntegration.patchClient(client);
            isolatedProtocol(client);
            client.updateCells = ownedWorld;
            // These tiny cells do not belong to the renderer's object pool.
            client.removeCell = function (cell) { this.untrackOwnCell(cell); delete this.cells[cell.id]; };
            const receive = client.onMessage;
            client.onMessage = function (buffer) {
                bot.packets++;
                const op = new Uint8Array(buffer)[0];
                if ([10, 11, 21, 22, 40, 44].includes(op)) return;
                return receive.call(this, buffer);
            };
            const current = () => bot.generation === attempt && bot.client === client;
            client.events.on('connected', () => { if (current()) this.setStatus(bot, 'Socket open · waiting for server'); });
            client.events.on('serverMessage', notice => {
                if (!current()) return;
                if (typeof notice.nickname === 'string') {
                    // Accept the same replacement as the native client instead
                    // of sending the rejected name again on every spawn retry.
                    bot.name = notice.nickname;
                    bot.card.querySelector('input[type=text]').value = bot.name;
                    try { localStorage.setItem('eon_bot_names', JSON.stringify(this.bots.map(b => b.name))); } catch {}
                }
                bot.serverNotice = notice.message;
                this.render(bot);
            });
            client.events.on('ready', () => {
                if (!current()) return;
                const others = [main, ...this.bots.filter(b => b !== bot).map(b => b.client)].filter(Boolean);
                if (!client.playerIds.length || others.some(c => c.playerIds?.some(id => client.playerIds.includes(id)))) {
                    this.disconnect(index, 'Server did not assign independent players'); return;
                }
                clearTimeout(bot.timeout);
                this.setStatus(bot, 'Ready · ' + slots(client).length + ' native players');
                if (this.controls.respawn) this.spawn(index, true);
            });
            client.events.on('captcha', data => {
                if (!current()) return;
                clearTimeout(bot.timeout); this.setStatus(bot, 'Verification required');
                if (data.type === 1) this.app.lobby.solveTurnstile(client, data).then(result => {
                    if (current() && result?.status === 'login-required') { this.setStatus(bot, 'Bot account login required · sign in and reconnect'); return; }
                    if (current() && ['cancelled', 'failed'].includes(result?.status)) { this.disconnect(index, 'Verification incomplete · reconnect to retry'); return; }
                    if (current() && result?.status === 'sent') this.setStatus(bot, 'Verification sent to server');
                    if (current() && !ready(client)) bot.timeout = setTimeout(() => {
                        if (current() && !ready(client)) this.disconnect(index, 'Verification incomplete · reconnect manually');
                    }, 15000);
                });
            });
            client.events.on('spawned', slot => {
                if (!current()) return;
                bot.roamTargets[slot] = null;
                this.removeSpawnSlot(bot, slot, performance.now());
                bot.spawned++;
                const anchor = this.followMode === 'box' && this.boxPoint ? this.boxPoint : this.anchor();
                const player = client.tabs[slot].player;
                bot.distance = anchor ? Math.round(Math.hypot(player.x - anchor.x, player.y - anchor.y)) : null;
                if (this.followMode === 'box' && this.boxPoint) this.botLog(bot, 'SPAWN_LOCATION',
                    'Server-selected spawn · distance from target box ' + (bot.distance ?? 'unknown') + ' world units');
                this.lifeStatus(bot);
            });
            client.events.on('helperSlotDied', slot => {
                if (!current()) return;
                bot.roamTargets[slot] = null;
                bot.nextSpawn[slot] = performance.now() + 1500;
                this.lifeStatus(bot);
            });
            client.events.on('error', error => { if (current()) { this.botLog(bot, 'ERROR', error?.message || 'network error'); this.disconnect(index, 'Connection failed: ' + (error?.message || 'network error')); } });
            client.events.on('disconnected', () => {
                if (!current()) return;
                clearTimeout(bot.timeout); bot.client = null; bot.intent = null;
                setTimeout(() => client.disposeProtocol?.(), 0);
                const code = client.lastCloseCode;
                const detail = code === 4101 ? 'Server explicitly reported a banned connection (4101).' :
                    code === 4100 ? 'Server kicked this bot connection (4100).' :
                    code === 4405 ? 'Server connection limit (4405).' :
                    code === 4406 ? 'Server rejected session (4406); cause not confirmed.' :
                    code === 4404 ? 'Server blocked proxy/VPN connection (4404).' :
                    code ? 'Connection closed with code ' + code + '.' : 'Socket disconnected; no close code captured.';
                this.botLog(bot, 'DISCONNECT', detail, {code, reason:client.lastCloseReason});
                this.setStatus(bot, 'Disconnected');
                setTimeout(() => {
                    if (bot.generation === attempt && !bot.client && client.lastCloseCode) this.setStatus(bot,
                        client.lastCloseCode === 4101 ? 'Server reported connection banned (4101)' :
                        client.lastCloseCode === 4405 ? 'Server connection limit reached (4405)' :
                        client.lastCloseCode === 4406 ? 'Server rejected session (4406) · not proof of a ban' :
                        'Disconnected · code ' + client.lastCloseCode);
                }, 0);
            });
            this.setStatus(bot, 'Connecting…');
            bot.timeout = setTimeout(() => { if (current()) this.disconnect(index, 'Server handshake timed out'); }, 25000);
            try { await client.connect(target); } catch (error) { if (current()) this.disconnect(index, 'Connect failed: ' + (error?.message || String(error))); }
        }
        async connectAll() {
            if (this.connectingAll) return;
            this.connectingAll = true;
            const batch = this.batch = (this.batch || 0) + 1;
            try {
                for (const bot of this.bots) {
                    if (batch !== this.batch) break;
                    await this.connect(bot.index);
                    // Native handshake state is independent, but initialize sequentially.
                    if (bot.client && !ready(bot.client)) await new Promise(resolve => {
                        const timer = setTimeout(resolve, 26000);
                        const done = () => { clearTimeout(timer); resolve(); };
                        bot.client.events.once('ready', done); bot.client.events.once('disconnected', done);
                    });
                }
            } finally { this.connectingAll = false; }
        }
        disconnect(index, status = 'Disconnected') {
            const bot = this.bots[index], client = bot.client;
            bot.generation++; clearTimeout(bot.timeout);
            bot.client = null; bot.intent = null; bot.primary = null;
            if (client) this.botLog(bot, 'DISCONNECT', status, {code:client.lastCloseCode});
            client?.close();
            client?.disposeProtocol?.();
            this.setStatus(bot, status);
        }
        disconnectAccount(accountIndex) { this.bots.filter(b => b.accountIndex === accountIndex).forEach(b => this.disconnect(b.index)); }
        disconnectAll() { this.batch = (this.batch || 0) + 1; this.bots.forEach(bot => this.disconnect(bot.index)); }
        lifeStatus(bot) {
            const players = slots(bot.client), alive = players.filter(tab => tab.player.cells.length).length;
            this.setStatus(bot, 'Alive ' + alive + '/' + players.length +
                (bot.intent ? ' · spawning remaining player…' : bot.distance === null ? '' : ' · spawn distance ' + bot.distance));
        }
        spawn(index, automatic = false) {
            const bot = this.bots[index], client = bot.client;
            if (!ready(client) || bot.intent) return;
            const missing = slots(client).filter(tab => !tab.player.cells.length && (!automatic || performance.now() >= bot.nextSpawn[tab.index]));
            if (!missing.length) return;
            client.app.player.nickname1 = bot.name;
            client.app.player.tag = this.app.player.tag;
            client.sendSpectate();
            bot.intent = {slots:missing.map(tab => tab.index), started:performance.now(), sentAt:null, attempts:0, pausedAt:null, automatic};
            this.setStatus(bot, this.boxEnabled && this.boxPoint && this.followMode === 'box' ? 'Spawn requested · moving toward target box after spawn' : this.anchor() ? 'Attempting spawn near main player…' : 'Requesting spawn…');
        }
        removeSpawnSlot(bot, slot, now) {
            const intent = bot.intent;
            if (!intent || !intent.slots.includes(slot)) return;
            const current = intent.slots[0] === slot;
            intent.slots = intent.slots.filter(index => index !== slot);
            if (!intent.slots.length) bot.intent = null;
            // A repeated update for another living slot must not restart retries.
            else if (current) Object.assign(intent, {started:now, sentAt:null, attempts:0, pausedAt:null});
        }
        updateSpawn(bot, spawnPoint, now) {
            const c = bot.client, intent = bot.intent;
            if (!intent) return;
            if (!ready(c) || c.verificationPending || document.hidden) {
                if (intent.pausedAt === null) intent.pausedAt = now;
                return;
            }
            if (intent.pausedAt !== null) {
                const elapsed = now - intent.pausedAt;
                intent.started += elapsed;
                if (intent.sentAt !== null) intent.sentAt += elapsed;
                intent.pausedAt = null;
            }
            const slot = intent.slots[0], tab = c.tabs[slot];
            if (!tab || tab.player.cells.length) { this.removeSpawnSlot(bot, slot, now); return; }
            if (intent.sentAt !== null && now - intent.sentAt < SPAWN_RETRY_MS) return;
            if (intent.attempts >= SPAWN_ATTEMPTS) {
                // Let the other slot try even if this one was rejected. Auto
                // respawn remains enabled, with a cooldown instead of flooding.
                bot.nextSpawn[slot] = now + SPAWN_COOLDOWN_MS;
                this.removeSpawnSlot(bot, slot, now);
                this.setStatus(bot, 'Player ' + (slot + 1) + ' spawn unconfirmed · ' +
                    (bot.intent ? 'trying remaining player…' : this.controls.respawn ? 'auto retry after cooldown' : 'retry manually'));
                return;
            }
            withSlot(c, slot, () => {
                if (!c.hasAlivePlayers && spawnPoint) {
                    c.sendSpectate(); c.sendCursorPosition(spawnPoint.x, spawnPoint.y);
                    if (!intent.attempts && now - intent.started < Math.max(100, Math.min(400, c.ping || 100))) return;
                }
                intent.attempts++; intent.sentAt = now;
                this.setStatus(bot, 'Spawning player ' + (slot + 1) + ' · attempt ' + intent.attempts + '/' + SPAWN_ATTEMPTS);
                c.sendSpawn(); // Only owned cells from the server confirm success.
            });
        }
        tick() {
            this.paintTargetBox();
            if (!this.bots.some(bot => bot.client)) return;
            const main = (this.app.gameConnection.primary || this.app.gameConnection.current), now = performance.now();
            const replay = this.app.replayManager?.isReplay;
            // The lobby is normally visible before Play and after death. Helper
            // controls remain independent of the main player's spawn/menu state.
            const active = !document.hidden && !replay && !this.app.settingsMenu?.isVisible && !this.typing();
            const anchor = this.anchor();
            let target = null;
            if (this.followMode === 'box' && this.boxEnabled && this.boxPoint &&
                this.boxServer === endpoint(main)) target = this.boxPoint;
            else if (this.followMode === 'player') target = this.playerTarget(now);
            else if (active && this.followMode === 'mouse') {
                this.app.stage.updateMouseWorldPosition();
                const mouse = this.app.stage.mouse;
                if (Number.isFinite(mouse.worldX) && Number.isFinite(mouse.worldY)) target = {x:mouse.worldX, y:mouse.worldY};
            }
            const spawnPoint = this.followMode === 'box' ? target : anchor || (this.followMode === 'player' ? target : null);
            for (const bot of this.bots) {
                const c = bot.client;
                if (!c) continue;
                if (bot.primary !== main || !ready(main) || replay || endpoint(c) && endpoint(c) !== endpoint(main)) {
                    this.disconnect(bot.index, !ready(main) ? 'Stopped · main game disconnected' : 'Stopped · main game session or server changed'); continue;
                }
                this.updateSpawn(bot, spawnPoint, now);
                if (!ready(c) || c.verificationPending) continue;
                if (!bot.intent && this.controls.respawn && active) this.spawn(bot.index, true);
                const living = slots(c).filter(tab => tab.player.cells.length);
                if (!living.length) continue;
                const split = this.controls.split && now >= bot.nextSplit, feed = this.controls.feed && now >= bot.nextFeed;
                let splitSent = false, feedSent = false;
                for (const tab of living) withSlot(c, tab.index, () => {
                    const destination = this.followMode === 'random' ? (active && this.controls.follow ? this.randomTarget(bot, tab, now) : null) : target;
                    const following = active && destination && this.controls.follow;
                    c.sendCursorPosition(following ? destination.x : tab.player.x, following ? destination.y : tab.player.y);
                    if (following && split) { packet(c, 22, tab.index, 1); splitSent = true; }
                    // One eject per living slot, never macro-feed enable.
                    if (following && feed) { packet(c, 23, tab.index, 0); feedSent = true; }
                });
                if (splitSent) bot.nextSplit = now + 100;
                if (feedSent) bot.nextFeed = now + 300;
            }
        }
        toggle() { this.panel.hidden = !this.panel.hidden; if (!this.panel.hidden) { this.refreshTargets(); this.bots.forEach(b => this.render(b)); } }
        createUI() {
            const style = document.createElement('style');
            style.textContent = '#eon-bots-panel{position:fixed;right:16px;top:60px;z-index:1002;width:min(420px,calc(100vw - 32px));max-height:calc(100dvh - 80px);overflow:auto;padding:16px;background:#0d1524f5;color:#edf5ff;border:1px solid #3c708f;border-radius:12px;font:14px Arial;box-shadow:0 12px 40px #0008}#eon-bots-panel[hidden]{display:none}#eon-bots-panel header,#eon-bots-panel .bot-actions{display:flex;gap:8px;align-items:center;justify-content:space-between;margin-bottom:10px}#eon-bots-panel button{padding:7px 10px;color:#c8efff;background:#213a53;border:1px solid #42627d;border-radius:6px;cursor:pointer}#eon-bots-panel button:disabled{opacity:.4;cursor:default}#eon-bots-panel section{border-top:1px solid #304155;padding:12px 0}#eon-bots-panel input[type=text]{width:100%;padding:8px;box-sizing:border-box;color:white;background:#172235;border:1px solid #42627d;border-radius:6px}#eon-bots-panel .bot-status{display:block;min-height:32px;padding:8px 0;color:#8de6ff}#eon-bots-panel .bot-options{display:grid;grid-template-columns:1fr 1fr;gap:10px}#eon-bots-panel label{display:flex;gap:7px;align-items:center}#eon-bots-panel small{display:block;color:#9bb0c7;line-height:1.5;margin-top:12px}';
            document.head.append(style);
            const panel = this.panel = document.createElement('aside'); panel.id = 'eon-bots-panel'; panel.hidden = true;
            panel.setAttribute('aria-label', 'Bot controls');
            panel.innerHTML = '<header><strong>10 account slots · 2 connections × up to 2 players</strong><button data-close aria-label="Close bot controls">×</button></header><div class="bot-actions"><button data-connect>Connect all</button><button data-spawn>Spawn all players</button><button data-stop>Disconnect all</button></div><div data-cards></div><small>Show/hide shortcut: Settings → Controls → Bot Controls. Spawn near uses spectator positioning; only the server decides the initial location. Target box follows a world-coordinate destination after spawn. Fast split: 100 ms · Light feed: one eject / 300 ms. Bots keep working while your main player is dead, spectating, or in the lobby. Actions pause while typing or editing settings. Player mode waits when the server no longer supplies the selected player’s position.</small>';
            panel.querySelector('[data-close]').onclick = () => this.toggle();
            panel.querySelector('[data-connect]').onclick = () => this.connectAll();
            panel.querySelector('[data-spawn]').onclick = () => this.bots.forEach(b => this.spawn(b.index));
            panel.querySelector('[data-stop]').onclick = () => this.disconnectAll();
            const logSection = document.createElement('section');
            logSection.innerHTML = '<div class="bot-actions"><strong>BOT DIAGNOSTICS</strong><button type="button" data-bot-toggle>Show logs</button><button type="button" data-bot-export>Export</button><button type="button" data-bot-clear>Clear</button></div><label style="font-size:12px">Show <select data-bot-filter style="background:#172235;color:white;padding:5px;border:1px solid #42627d"><option value="all">Bot + login events</option><option value="auth">Account login only</option><option value="problems">Errors / disconnects only</option></select></label><pre data-bot-logs hidden style="white-space:pre-wrap;overflow:auto;max-height:240px;background:#07101d;color:#a5defa;border:1px solid #304155;padding:10px;font:11px/1.6 monospace"></pre><small>No passwords, tokens, cookies or API response bodies are collected.</small>';
            panel.insertBefore(logSection, panel.querySelector('[data-cards]'));
            const logs = logSection.querySelector('[data-bot-logs]');
            logSection.querySelector('[data-bot-filter]').onchange = () => this.paintBotLogs();
            logSection.querySelector('[data-bot-toggle]').onclick = e => { logs.hidden = !logs.hidden; e.currentTarget.textContent = logs.hidden ? 'Show logs' : 'Hide logs'; this.paintBotLogs(); };
            logSection.querySelector('[data-bot-clear]').onclick = () => {this.botLogs.length=0; this.paintBotLogs();};
            logSection.querySelector('[data-bot-export]').onclick = () => {
                const blob = new Blob([JSON.stringify({generatedAt:new Date().toISOString(), scope:'bot-only', events:this.botLogs},null,2)], {type:'application/json'});
                const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href=url; link.download='eon-bot-diagnostics.json'; link.click(); setTimeout(()=>URL.revokeObjectURL(url), 1000);
            };
            const accountSection = document.createElement('section');
            accountSection.innerHTML = '<strong>Account Manager (10 account slots)</strong><small>Login each account through Senpa official Facebook / Discord authentication. Each account must pass Senpa verification before bot Connect. Browser cookies are shared; 10 slots do not guarantee 10 independent sessions. Server limits still apply.</small>';
            for (let i = 0; i < this.accounts.length; i++) {
                const row = document.createElement('div');
                row.dataset.accountRow = String(i);
                row.style.cssText = 'padding:10px 0;border-bottom:1px solid #304155';
                row.innerHTML = '<strong>Account ' + (i + 1) + '</strong> · <span data-account-status>Guest</span> · up to 4 players (2 connections)' +
                    '<div class="bot-actions" style="margin-top:8px"><button data-account-login="facebook">Facebook login</button>' +
                    '<button data-account-login="discord">Discord login</button><button data-account-logout hidden>Logout</button>' +
                    '<button data-account-connect>Connect 2</button><button data-account-stop>Disconnect 2</button></div>' +
                    '<small data-account-error role="status"></small>';
                row.querySelectorAll('[data-account-login]').forEach(button => button.onclick = () => {
                    this.disconnectAccount(i);
                    root.SenpaAccount.isolateSession();
                    this.accounts[i].login(button.dataset.accountLogin);
                });
                row.querySelector('[data-account-logout]').onclick = () => {
                    this.disconnectAccount(i); this.accounts[i].logout();
                };
                row.querySelector('[data-account-connect]').onclick = async () => {
                    if (!this.accounts[i].getToken()) { const bots = this.bots.filter(b => b.accountIndex === i); bots.forEach(bot => this.setStatus(bot, 'Sign in to this account first')); return; }
                    for (const bot of this.bots.filter(b => b.accountIndex === i)) await this.connect(bot.index);
                };
                row.querySelector('[data-account-stop]').onclick = () => this.disconnectAccount(i);
                accountSection.append(row);
            }
            panel.querySelector('[data-cards]').before(accountSection);
            const follow = document.createElement('section');
            follow.innerHTML = '<label>Follow <select data-follow-mode aria-label="Follow mode"><option value="mouse">Mouse</option><option value="random">Random movement</option><option value="player">Selected player</option><option value="box">Target box (right-click)</option></select></label><div class="bot-actions" style="margin-top:10px;flex-wrap:wrap"><label><input type="checkbox" data-target-box-enabled> Right-click target box</label><button type="button" data-target-box-place>Place at cursor</button><button type="button" data-target-box-clear>Clear box</button></div><small>Enable box, then right-click and drag over the game. If your browser captures right-click, move the mouse over the game and choose Place at cursor. Bots follow it after server-selected spawn. The box cannot force spawn coordinates.</small><div data-player-picker hidden><div class="bot-actions" style="margin-top:10px"><select data-target-player aria-label="Player to follow" style="min-width:0;flex:1"><option value="">Choose a player…</option></select><button data-refresh-players>Refresh</button></div><small data-target-status>Choose a player from the list.</small></div><strong style="display:block;margin:12px 0">All bots</strong><div class="bot-options" data-shared-controls></div><small>Rebind shortcuts: Settings → Controls → Bots. Each player slot chooses its own destination in random mode.</small>';
            accountSection.before(follow);
            follow.querySelectorAll('select').forEach(select => { select.style.cssText += ';background:#172235;color:#edf5ff;border:1px solid #42627d;padding:7px;border-radius:6px;max-width:100%'; });
            follow.querySelector('[data-follow-mode]').onchange = event => {
                this.setFollowMode(event.target.value);
                event.target.blur();
            };
            follow.querySelector('[data-target-box-enabled]').onchange = e => {
                this.boxEnabled = e.target.checked;
                if (this.boxEnabled) this.setFollowMode('box');
                else if (this.followMode === 'box') this.setFollowMode('mouse');
                this.paintTargetBox();
                e.target.blur();
            };
            follow.querySelector('[data-target-box-place]').onclick = () => {
                const mouse=this.lastGameCursor;
                if (this.boxEnabled && mouse && this.placeTargetAtScreen?.(mouse.x,mouse.y)) {
                    this.app.toasts?.show('Bot target placed. Bots will navigate there after spawn.', 'info', 2000);
                } else this.app.toasts?.show('Enable the target box, move the mouse over the game, then click Place at cursor.', 'info', 2500);
            };
            follow.querySelector('[data-target-box-clear]').onclick = () => this.clearTargetBox();
            for (const [key, text] of [['follow','Follow / move'],['respawn','Auto respawn'],['split','Fast split'],['feed','Light feed']]) {
                const label = document.createElement('label'), input = document.createElement('input');
                input.type = 'checkbox'; input.dataset.option = key; input.checked = this.controls[key];
                input.onchange = () => { this.setControl(key, input.checked); input.blur(); };
                label.append(input, document.createTextNode(text)); follow.querySelector('[data-shared-controls]').append(label);
            }
            follow.querySelector('[data-refresh-players]').onclick = () => this.refreshTargets();
            follow.querySelector('[data-target-player]').onchange = event => {
                this.targetConnection = (this.app.gameConnection.primary || this.app.gameConnection.current);
                this.targetId = event.target.value === '' ? null : Number(event.target.value);
                this.targetRecord = this.targetConnection?.playerClients.get(this.targetId) || null;
                this.playerTarget(); event.target.blur();
            };
            for (const bot of this.bots) {
                const card = bot.card = document.createElement('section'); card.dataset.bot = bot.index;
                card.innerHTML = '<strong>Account ' + (bot.accountIndex + 1) + ' · Connection ' + (bot.index % 2 + 1) + ' (up to 2 players)</strong><input type="text" maxlength="24" aria-label="Bot name"><output class="bot-status" aria-live="polite"></output><div class="bot-actions"><button data-connect>Connect</button><button data-disconnect>Disconnect</button><button data-spawn>Spawn players</button></div><div class="bot-options"></div>';
                const notice = document.createElement('small'); notice.dataset.serverMessage = ''; notice.hidden = true;
                notice.setAttribute('role', 'status'); notice.style.cssText = 'color:#ffca80;overflow-wrap:anywhere;margin:0 0 10px';
                card.querySelector('output').after(notice);
                const name = card.querySelector('input'); name.value = bot.name;
                name.onchange = () => { bot.name = name.value.trim().slice(0, 24) || 'Bot ' + (bot.index + 1); name.value = bot.name;
                    try { localStorage.setItem('eon_bot_names', JSON.stringify(this.bots.map(b => b.name))); } catch {}
                    if (bot.client && !bot.client.hasAlivePlayers) { bot.client.app.player.nickname1 = bot.name; bot.client.sendPlayerInfo(); }
                };
                card.querySelector('[data-connect]').onclick = () => this.connect(bot.index);
                card.querySelector('[data-disconnect]').onclick = () => this.disconnect(bot.index);
                card.querySelector('[data-spawn]').onclick = () => this.spawn(bot.index);
                card.querySelector('.bot-options').remove();
                panel.querySelector('[data-cards]').append(card); this.render(bot);
            }
            document.body.append(panel);
        }
        render(bot) {
            if (!bot.card) return;
            bot.card.querySelector('output').textContent = bot.status;
            const notice = bot.card.querySelector('[data-server-message]');
            notice.textContent = bot.serverNotice ? 'SERVER: ' + bot.serverNotice : '';
            notice.hidden = !bot.serverNotice;
            bot.card.querySelector('[data-connect]').disabled = !!bot.client;
            bot.card.querySelector('[data-disconnect]').disabled = !bot.client;
            bot.card.querySelector('[data-spawn]').disabled = !ready(bot.client) || slots(bot.client).every(tab => tab.player.cells.length) || !!bot.intent;
        }
    }
    root.EonSenpaBots = {Manager, ownedWorld, initialize(app) { return app.bots || (app.bots = new Manager(app)); }};
})(window);

