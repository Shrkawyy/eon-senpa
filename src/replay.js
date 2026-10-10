(function (root) {
    'use strict';
    const FPS = 25, CAPACITY = 10 * FPS, MAX_FILE = 64 * 1024 * 1024;
    const ACTIONS = ['split', 'feed-start', 'feed-stop', 'switch'];
    const ACTION_LABELS = ['Split', 'Feed start', 'Feed stop', 'Switch'];
    const INPUTS = ['split', 'doubleSplit', 'tripleSplit', 'maxSplit', 'macroFeed', 'switchPlayer'];
    const INPUT_LABELS = ['Split', 'Double split', 'Triple split', 'Max split', 'Feed', 'Switch'];
    const RATES = [.25, .5, .75, 1, 1.5, 2], MAX_ACTIONS = 30000, MAX_PENDING_ACTIONS = 128;
    const coordinate = n => Number.isFinite(n) && Math.abs(n) <= 1e7;
    const validKey = key => typeof key === 'string' && key.length <= 32 && /^(?:Key[A-Z]|Digit[0-9]|Numpad[A-Za-z0-9]+|F(?:[1-9]|1[0-9]|2[0-4])|Arrow(?:Up|Down|Left|Right)|Shift(?:Left|Right)|Control(?:Left|Right)|Alt(?:Left|Right)|Space|Tab|Enter|Backspace|Escape|CapsLock|Insert|Delete|Home|End|PageUp|PageDown|Minus|Equal|BracketLeft|BracketRight|Backslash|Semicolon|Quote|Comma|Period|Slash|Backquote|Mouse[0-4])$/.test(key);
    const keyLabel = key => ({Mouse0:'LMB',Mouse1:'MMB',Mouse2:'RMB',Mouse3:'Mouse 4',Mouse4:'Mouse 5',ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→'}[key] || key.replace(/^Key|^Digit/, '').replace(/^Numpad/, 'Num '));
    function validateInputs(rows, count) {
        if (!Array.isArray(rows) || rows.length > MAX_ACTIONS) throw Error('Invalid replay inputs');
        rows.forEach((row, i) => {
            if (!Array.isArray(row) || row.length !== 4 || !Number.isInteger(row[0]) || row[0] < 0 || row[0] >= count ||
                (i && row[0] < rows[i - 1][0]) || !Number.isInteger(row[1]) || row[1] < 0 || row[1] >= INPUTS.length ||
                !validKey(row[2]) || !Number.isInteger(row[3]) || row[3] < 0 || row[3] > 15) throw Error('Invalid replay input');
        });
    }
    function validateTraining(training, count) {
        if (!training || training.v !== 1 || !Array.isArray(training.samples) || !Array.isArray(training.actions) ||
            training.samples.length > count || training.actions.length > MAX_ACTIONS || typeof training.truncated !== 'boolean' ||
            Object.keys(training).some(key => !['v', 'samples', 'actions', 'truncated'].includes(key))) throw Error('Invalid replay training data');
        const validTick = n => Number.isInteger(n) && n >= 0 && n < count;
        training.samples.forEach((row, i) => {
            if (!Array.isArray(row) || row.length !== 6 || !validTick(row[0]) || (i && row[0] <= training.samples[i - 1][0]) ||
                !row.slice(1, 5).every(coordinate) || !Number.isFinite(row[5]) || row[5] < .0001 || row[5] > 100) throw Error('Invalid replay cursor/camera sample');
        });
        training.actions.forEach((row, i) => {
            if (!Array.isArray(row) || row.length !== 3 || !validTick(row[0]) || (i && row[0] < training.actions[i - 1][0]) ||
                !Number.isInteger(row[1]) || row[1] < 0 || row[1] >= ACTIONS.length || !Number.isInteger(row[2]) || row[2] < 0 || row[2] > 15) throw Error('Invalid replay action');
        });
        return training;
    }
    class Ring {
        constructor(size) { this.items = Array(size); this.start = this.length = 0; }
        push(item) {
            const index = (this.start + this.length) % this.items.length;
            this.items[index] = item;
            if (this.length < this.items.length) this.length++;
            else this.start = (this.start + 1) % this.items.length;
        }
        toArray() { return Array.from({length:this.length}, (_, i) => this.items[(this.start + i) % this.items.length]); }
    }
    class Writer {
        constructor(op) { this.bytes = [op]; }
        u8(n) { this.bytes.push(n & 255); return this; }
        u16(n) { return this.u8(n).u8(n >> 8); }
        u32(n) { return this.u16(n).u16(n >>> 16); }
        rgb(n) { return this.u8(n >> 16).u8(n >> 8).u8(n); }
        text(value, wide = true) {
            const s = String(value || '').slice(0, 255); this.u8(s.length);
            for (let i = 0; i < s.length; i++) wide ? this.u16(s.charCodeAt(i)) : this.u8(s.charCodeAt(i));
            return this;
        }
        get buffer() { return Uint8Array.from(this.bytes).buffer; }
    }
    class Reader {
        constructor(buffer) { this.view = new DataView(buffer); this.at = 0; }
        u8() { return this.view.getUint8(this.at++); }
        u16() { const n = this.view.getUint16(this.at, true); this.at += 2; return n; }
        u32() { const n = this.view.getUint32(this.at, true); this.at += 4; return n; }
        rgb() { return this.u8() * 65536 + this.u8() * 256 + this.u8(); }
        text(wide = true) { let s = ''; for (let n = this.u8(); n--; ) s += String.fromCharCode(wide ? this.u16() : this.u8()); return s; }
        done() { if (this.at !== this.view.byteLength) throw Error('Invalid replay packet length'); }
    }
    function encodeClients(rows, modern = true) {
        const w = new Writer(10).u8(rows.length);
        for (const c of rows) {
            w.u16(c.clientId).u8(c.isBot ? 1 : 0).text(c.nickname).text(c.tag).rgb(c.colorInt);
            if (modern) w.u8(c.hasReservedName ? 1 : 0).text(c.clanTag);
        }
        return w.u8(0).u8(0).buffer;
    }
    function encodePlayers(rows, modern = true) {
        const w = new Writer(11).u8(rows.length);
        for (const p of rows) {
            w.u16(p.playerId).u16(p.clientId).rgb(p.colorInt).text(p.skin, false);
            if (modern) w.u32(p.hatId || 0);
        }
        return w.u8(0).u8(0).buffer;
    }
    function decodeRows(buffer, op, modern = false) {
        const r = new Reader(buffer), rows = [];
        if (r.u8() !== op) throw Error('Invalid replay player packet');
        for (let n = r.u8(); n--; ) {
            if (op === 10) rows.push({clientId:r.u16(), isBot:!!r.u8(), nickname:r.text(), tag:r.text(),
                colorInt:r.rgb(), hasReservedName:modern ? !!r.u8() : true, clanTag:modern ? r.text() : ''});
            else rows.push({playerId:r.u16(), clientId:r.u16(), colorInt:r.rgb(), skin:r.text(false), hatId:modern ? r.u32() : 0});
        }
        if (r.u8() || r.u8()) throw Error('Expected a complete replay player snapshot');
        r.done(); return rows;
    }
    function chunks(rows, encoder) {
        const result = [];
        for (let i = 0; i < rows.length || i === 0; i += 255) result.push(encoder(rows.slice(i, i + 255)));
        return result;
    }
    function metadata(client) {
        return {clients:chunks([...client.playerClients.values()], encodeClients),
            players:chunks([...client.players.values()], encodePlayers)};
    }
    function worldSnapshot(client) {
        const cells = Object.values(client.cells).filter(c => !c.destroyed), w = new Writer(20).u16(0).u16(cells.length);
        for (const c of cells) {
            const type = c.replayType ?? (c.flags.isVirus ? 1 : c.flags.isEject ? 2 : c.flags.isFood ? 3 : 0);
            w.u32(c.id).u32(c.targetX).u32(c.targetY).u16(c.targetR).u8(type);
            if (type === 0) w.u16(c.playerId).rgb(c.colorInt);
            if (type === 2) w.rgb(c.colorInt);
            if (type === 5) { w.u16(c.replayBlob?.length || 0); for (const byte of c.replayBlob || []) w.u8(byte); }
        }
        return w.u16(0).u16(0).u8(client.tabIndex).u32(client.border.right).buffer;
    }
    // Validate the structural boundary before applying optional active-slot/map data.
    function worldEnd(buffer) {
        const r = new Reader(buffer);
        if (r.u8() !== 20) throw Error('Invalid replay world packet');
        for (let n = r.u16(); n--; ) { r.u32(); r.u32(); }
        for (let n = r.u16(); n--; ) {
            r.u32(); r.u32(); r.u32(); r.u16(); const type = r.u8();
            if (type === 0) { r.u16(); r.rgb(); }
            else if (type === 2) r.rgb();
            else if (type === 5) { for (let count = r.u16(); count--; ) r.u8(); }
            else if (![1, 3, 4].includes(type)) throw Error('Unsupported replay cell type');
        }
        for (let n = r.u16(); n--; ) { r.u32(); r.u32(); r.u32(); r.u16(); }
        for (let n = r.u16(); n--; ) r.u32();
        const remaining = buffer.byteLength - r.at;
        if (![0, 1, 2, 5, 6].includes(remaining)) throw Error('Invalid replay world trailer');
        return r.at;
    }
    function recordedWorld(buffer, client) {
        const end = worldEnd(buffer), result = new Uint8Array(end + 5);
        result.set(new Uint8Array(buffer, 0, end)); result[end] = client.tabIndex;
        new DataView(result.buffer).setUint32(end + 1, client.border.right, true);
        return result.buffer;
    }
    function base64(buffer) {
        const bytes = new Uint8Array(buffer); let result = '';
        for (let i = 0; i < bytes.length; i += 8192) result += String.fromCharCode(...bytes.subarray(i, i + 8192));
        return btoa(result);
    }
    function unbase64(text) { return Uint8Array.from(atob(text), c => c.charCodeAt(0)).buffer; }
    function validate(entry) {
        const p = entry.packets, v = new DataView(p.preinfo);
        if (v.byteLength < 10 || v.getUint8(0) !== 0 || !v.getUint8(7) || v.byteLength < 8 + v.getUint8(7) * 2) throw Error('Invalid replay initialization');
        if (!p.worldUpdate.length || p.worldUpdate.length > 15000 || !p.newWorldUpdates.length || p.newWorldUpdates.length !== p.keyframeTicks.length || p.keyframeTicks[0] !== 0) throw Error('Invalid replay frames');
        for (const buffer of [...p.worldUpdate, ...p.newWorldUpdates]) worldEnd(buffer);
        p.keyframeTicks.forEach((tick, i) => {
            if (!Number.isInteger(tick) || tick < 0 || tick >= p.worldUpdate.length || (i && tick <= p.keyframeTicks[i - 1])) throw Error('Invalid replay keyframe');
        });
        decodeRows(p.newClientUpdate, 10); decodeRows(p.newPlayerUpdate, 11);
        if (entry.metadata) {
            if (!entry.metadata.length || entry.metadata[0].tick !== 0 || entry.metadata.length > p.worldUpdate.length) throw Error('Invalid replay metadata');
            entry.metadata.forEach((m, i) => {
                if (!Number.isInteger(m.tick) || m.tick < 0 || m.tick >= p.worldUpdate.length || (i && m.tick <= entry.metadata[i - 1].tick)) throw Error('Invalid metadata frame');
                for (const b of m.clients) decodeRows(b, 10, true);
                for (const b of m.players) decodeRows(b, 11, true);
            });
        }
        if (entry.training !== undefined) validateTraining(entry.training, p.worldUpdate.length);
        if (entry.inputs !== undefined) validateInputs(entry.inputs, p.worldUpdate.length);
        return entry;
    }
    function createExport(entry) {
        const p = entry.packets, parts = ['REPLAY', entry.img, String(entry.time), base64(p.preinfo), String(p.worldUpdate.length),
            ...p.worldUpdate.map(base64), String(p.newWorldUpdates.length), ...p.newWorldUpdates.map(base64),
            base64(p.newClientUpdate), base64(p.newPlayerUpdate), 'KEYFRAMES', p.keyframeTicks.join(',')];
        // Native readers ignore trailing fields. Preserve modern clan/color/skin updates in Eon as well.
        if (entry.metadata) parts.push('EON1', base64(new TextEncoder().encode(JSON.stringify(entry.metadata.map(m =>
            ({tick:m.tick, clients:m.clients.map(base64), players:m.players.map(base64)})))).buffer));
        if (entry.training) {
            validateTraining(entry.training, p.worldUpdate.length);
            parts.push('EONT1', base64(new TextEncoder().encode(JSON.stringify(entry.training)).buffer));
        }
        if (entry.inputs) {
            validateInputs(entry.inputs, p.worldUpdate.length);
            parts.push('EONK1', base64(new TextEncoder().encode(JSON.stringify(entry.inputs)).buffer));
        }
        return parts.join('|');
    }
    function parse(text) {
        if (typeof text !== 'string' || text.length > MAX_FILE || !text.startsWith('REPLAY|')) throw Error('Invalid .senpa replay');
        const parts = text.split('|'); let at = 1;
        const take = () => { if (at >= parts.length) throw Error('Incomplete replay'); return parts[at++]; };
        const count = () => { const n = Number(take()); if (!Number.isInteger(n) || n < 1 || n > 15000) throw Error('Invalid replay length'); return n; };
        const entry = {img:take(), time:Number(take()) || Date.now(), packets:{preinfo:unbase64(take())}};
        const p = entry.packets;
        p.worldUpdate = Array.from({length:count()}, () => unbase64(take()));
        p.newWorldUpdates = Array.from({length:count()}, () => unbase64(take()));
        p.newClientUpdate = unbase64(take()); p.newPlayerUpdate = unbase64(take());
        p.keyframeTicks = p.newWorldUpdates.map((_, i) => i);
        if (parts[at] === 'KEYFRAMES') { at++; p.keyframeTicks = take().split(',').map(Number); }
        if (parts[at] === 'EON1') {
            at++; entry.metadata = JSON.parse(new TextDecoder().decode(unbase64(take()))).map(m =>
                ({tick:m.tick, clients:m.clients.map(unbase64), players:m.players.map(unbase64)}));
        }
        if (parts[at] === 'EONT1') {
            at++; const payload = take();
            if (payload.length > 4 * 1024 * 1024) throw Error('Replay training data is too large');
            entry.training = JSON.parse(new TextDecoder().decode(unbase64(payload)));
        }
        if (parts[at] === 'EONK1') {
            at++; const payload = take();
            if (payload.length > 4 * 1024 * 1024) throw Error('Replay input data is too large');
            entry.inputs = JSON.parse(new TextDecoder().decode(unbase64(payload)));
        }
        return validate(entry);
    }
    class ReplayManager {
        constructor(app) {
            this.app = app; this.isReplay = false; this.paused = false; this.tick = 0; this.opacity = 1;
            this.clear(); this.list = []; this.dbTask = this.openDB();
            this.dbTask.catch(() => {}); this.initializeUI();
        }
        get paused() { return !!this._paused; }
        set paused(value) {
            value = !!value;
            if (value === this.paused) return;
            const now = performance.now();
            this.motionAnchor = this.motionTime(now); this.motionAnchorAt = now;
            if (value) this.pausedAt = now;
            else if (Number.isFinite(this.nextPacketAt)) this.nextPacketAt += now - this.pausedAt;
            this._paused = value;
        }
        get playbackRate() { return this._playbackRate || 1; }
        set playbackRate(value) {
            value = Number(value);
            if (!RATES.includes(value) || value === this.playbackRate) return;
            const now = performance.now(), at = this.paused ? this.pausedAt : now, old = this.playbackRate;
            this.motionAnchor = this.motionTime(now); this.motionAnchorAt = now;
            if (this.paused) this.motionAnchorAt = this.pausedAt;
            if (Number.isFinite(this.nextPacketAt)) this.nextPacketAt = at + (this.nextPacketAt - at) * old / value;
            this._playbackRate = value;
            if (this.rateSelect) this.rateSelect.value = String(value);
        }
        motionTime(realNow = performance.now()) {
            if (!this.isReplay || !Number.isFinite(this.motionAnchorAt)) return realNow;
            return this.motionAnchor + ((this.paused ? this.pausedAt : realNow) - this.motionAnchorAt) * this.playbackRate;
        }
        clear(preinfo = null) {
            this.preinfo = preinfo; this.frames = new Ring(CAPACITY); this.sequence = 0;
            this.meta = null; this.metaDirty = true;
            this.pendingActions = []; this.pendingInputs = []; this.trainingTruncated = false;
        }
        recordInput(event, action) {
            const client = this.app?.gameConnection?.current, code = INPUTS.indexOf(action);
            const key = /^mouse|^pointer/.test(event?.type || '') ? 'Mouse' + event.button : event?.code;
            const target = event?.target;
            if (this.isReplay || !this.preinfo || code < 0 || !validKey(key) || event.repeat ||
                !client?.hasAlivePlayers || client.isReplay || !client.isConnected || !client.authCompleted || root.document?.hidden ||
                !Number.isInteger(client.tabIndex) || client.tabIndex < 0 || client.tabIndex > 15 ||
                this.app.lobby?.isVisible || this.app.settingsMenu?.isVisible ||
                ['INPUT','TEXTAREA','SELECT'].includes(target?.tagName) || target?.isContentEditable) return false;
            if (this.pendingInputs.length >= MAX_PENDING_ACTIONS) { this.trainingTruncated = true; return false; }
            this.pendingInputs.push([code, key, client.tabIndex]); return true;
        }
        recordAction(kind, slot) {
            const code = ACTIONS.indexOf(kind);
            if (this.isReplay || !this.preinfo || code < 0 || !Number.isInteger(slot) || slot < 0 || slot > 15) return false;
            if (this.pendingActions.length >= MAX_PENDING_ACTIONS) { this.trainingTruncated = true; return false; }
            this.pendingActions.push([code, slot]); return true;
        }
        captureTraining() {
            const stage = this.app?.stage, mouse = stage?.mouse, camera = stage?.camera;
            if (!mouse || !camera || ![mouse.worldX, mouse.worldY, camera.x, camera.y].every(coordinate) ||
                !Number.isFinite(camera.zoom) || camera.zoom < .0001 || camera.zoom > 100) return null;
            return [mouse.worldX, mouse.worldY, camera.x, camera.y].map(n => Math.round(n * 100) / 100)
                .concat(Math.round(camera.zoom * 1e6) / 1e6);
        }
        attach(client) {
            if (client.__replayCapture) return;
            client.__replayCapture = true;
            this.makeClient = () => root.EonSenpaProtocol.patchClient(new client.constructor(this.app));
            const receive = client.onMessage, manager = this;
            client.onMessage = function (buffer) {
                const result = receive.call(this, buffer);
                if (!manager.isReplay) {
                    try { manager.capture(this, buffer); }
                    catch (error) { manager.clear(); manager.notice('Replay recording stopped: ' + error.message, 'error'); }
                }
                return result;
            };
            client.events.on('disconnected', () => { if (!this.isReplay) this.clear(); });
        }
        capture(client, buffer) {
            const op = new Uint8Array(buffer)[0];
            if (op === 0) { this.clear(buffer.slice(0)); return; }
            if (op === 10 || op === 11) this.metaDirty = true;
            if (op !== 20 || !this.preinfo) return;
            if (!client.hasAlivePlayers) { if (this.frames.length || this.pendingActions.length || this.pendingInputs.length) this.clear(this.preinfo); return; }
            if (this.metaDirty || !this.meta) { this.meta = metadata(client); this.metaDirty = false; }
            this.frames.push({packet:recordedWorld(buffer, client), meta:this.meta, sample:this.captureTraining(),
                actions:this.pendingActions.splice(0),
                inputs:this.pendingInputs.splice(0),
                keyframe:this.sequence++ % FPS === 0 ? worldSnapshot(client) : null});
        }
        snapshot() {
            let frames = this.frames.toArray(), first = frames.findIndex(f => f.keyframe);
            if (!this.preinfo || first < 0) throw Error('Play for a moment before saving a replay.');
            frames = frames.slice(first);
            const meta = frames[0].meta, entry = {time:Date.now(), img:this.thumbnail(), metadata:[], inputs:[],
                training:{v:1, samples:[], actions:[], truncated:this.trainingTruncated}, packets:{
                preinfo:this.preinfo.slice(0), worldUpdate:frames.map(f => f.packet), newWorldUpdates:[], keyframeTicks:[],
                newClientUpdate:encodeClients(meta.clients.flatMap(b => decodeRows(b, 10, true)).slice(0, 255), false),
                newPlayerUpdate:encodePlayers(meta.players.flatMap(b => decodeRows(b, 11, true)).slice(0, 255), false)}};
            frames.forEach((frame, tick) => {
                if (frame.keyframe) { entry.packets.newWorldUpdates.push(frame.keyframe); entry.packets.keyframeTicks.push(tick); }
                if (!tick || frame.meta !== frames[tick - 1].meta) entry.metadata.push({tick, ...frame.meta});
                if (frame.sample) entry.training.samples.push([tick, ...frame.sample]);
                for (const action of frame.actions) {
                    if (entry.training.actions.length < MAX_ACTIONS) entry.training.actions.push([tick, ...action]);
                    else entry.training.truncated = true;
                }
                for (const input of frame.inputs || []) {
                    if (entry.inputs.length < MAX_ACTIONS) entry.inputs.push([tick, ...input]);
                    else entry.training.truncated = true;
                }
            });
            return entry;
        }
        thumbnail() {
            try {
                const canvas = document.createElement('canvas'); canvas.width = 240; canvas.height = 135;
                canvas.getContext('2d').drawImage(this.app.stage.canvas, 0, 0, 240, 135);
                return canvas.toDataURL('image/png');
            } catch { return ''; }
        }
        async saveSnapshot() {
            if (this.isReplay) return;
            try {
                const entry = this.snapshot(), key = new Date().toISOString() + '-' + root.crypto.randomUUID();
                await this.write({key, time:entry.time, img:entry.img, frames:entry.packets.worldUpdate.length, data:createExport(entry)});
                root.EonSenpaProtocol.notify(this.app, 'CLIENT', 'Replay saved!');
                if (this.isOpen) await this.refresh();
                return key;
            } catch (error) { this.notice(error.message, 'error'); }
        }
        openDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('eon_native_replays', 2);
                request.onupgradeneeded = () => {
                    const db = request.result;
                    if (!db.objectStoreNames.contains('replays')) db.createObjectStore('replays', {keyPath:'key'});
                    if (!db.objectStoreNames.contains('metadata')) {
                        const index = db.createObjectStore('metadata', {keyPath:'key'});
                        request.transaction.objectStore('replays').openCursor().onsuccess = event => {
                            const cursor = event.target.result;
                            if (!cursor) return;
                            const {data, ...meta} = cursor.value; index.put(meta); cursor.continue();
                        };
                    }
                };
                request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); resolve(request.result); };
                request.onerror = () => reject(Error('Replay storage is unavailable.'));
            });
        }
        async transaction(mode, operation, storeName = 'replays') {
            const db = await this.dbTask;
            return new Promise((resolve, reject) => {
                const tx = db.transaction(storeName, mode), request = operation(tx.objectStore(storeName));
                tx.oncomplete = () => resolve(request.result);
                tx.onerror = tx.onabort = () => reject(Error('Could not store/load the replay. Check browser storage.'));
            });
        }
        async write(entry, remove = false) {
            const db = await this.dbTask;
            return new Promise((resolve, reject) => {
                const tx = db.transaction(['replays', 'metadata'], 'readwrite');
                if (remove) { tx.objectStore('replays').delete(entry.key); tx.objectStore('metadata').delete(entry.key); }
                else {
                    const {data, ...meta} = entry;
                    tx.objectStore('replays').put(entry); tx.objectStore('metadata').put(meta);
                }
                tx.oncomplete = () => resolve(entry.key);
                tx.onerror = tx.onabort = () => reject(Error('Could not save the replay. Check browser storage.'));
            });
        }
        async play(key) {
            if (this.loadingReplay) return;
            this.loadingReplay = true;
            try {
                const saved = await this.transaction('readonly', store => store.get(key));
                if (!saved) throw Error('Replay not found.');
                this.run(parse(saved.data));
            } catch (error) { this.notice(error.message, 'error'); }
            finally { this.loadingReplay = false; }
        }
        async deleteAll() {
            if (!this.list.length || this.deletingAll || !root.confirm('Are you sure you want to delete all replays?')) return;
            this.deletingAll = true; this.deleteAllButton.disabled = true;
            try {
                const db = await this.dbTask;
                await new Promise((resolve, reject) => {
                    const tx = db.transaction(['replays', 'metadata'], 'readwrite');
                    tx.objectStore('replays').clear(); tx.objectStore('metadata').clear();
                    tx.oncomplete = resolve;
                    tx.onerror = tx.onabort = () => reject(Error('Could not delete the replays.'));
                });
                await this.refresh();
            } catch (error) { this.notice(error.message, 'error'); }
            finally { this.deletingAll = false; this.deleteAllButton.disabled = !this.list.length; }
        }
        run(entry) {
            validate(entry);
            if (!this.makeClient) throw Error('Wait for the game client to initialize.');
            clearInterval(this.interval);
            this.isReplay = true;
            this.app.input.handleWindowBlur();
            this.app.gameConnection.current?.close();
            if (this.client) this.app.gameConnection.removeConnection(this.client);
            this.app.lobby.hideReconnect();
            this.client?.cleanup();
            this.client = this.makeClient(); this.client.isReplay = true;
            this.client.allocArr = () => {};
            this.app.gameConnection.addConnection(this.client);
            this.currentReplay = entry; this.fallbackMeta = null; this.paused = false;
            this._playbackRate = 1; this.motionAnchor = this.motionAnchorAt = performance.now();
            this.loopStart = 0; this.loopEnd = entry.packets.worldUpdate.length - 1; this.loopEnabled = false;
            this.recordedCamera = !!entry.training?.samples.length; this.showRecordedCursor = true;
            this.prepareTraining();
            this.closeLibrary(); this.app.lobby.hide();
            document.body.classList.add('watching-replay');
            // Native replay tools read #packets even if it is hidden. Expose it
            // only during playback so they can distinguish a replay from live play.
            this.packetProgress?.remove();
            this.packetProgress = document.createElement('input');
            this.packetProgress.type = 'hidden'; this.packetProgress.id = 'packets';
            this.bar.append(this.packetProgress);
            this.setControlsHidden(false); this.seek(0); this.syncPause();
            this.interval = setInterval(() => {
                try {
                    this.advancePlayback(performance.now());
                } catch (error) { this.stop(); this.notice('Could not play this replay: ' + error.message, 'error'); }
            }, 1000 / FPS);
        }
        advancePlayback(now) {
            if (!this.isReplay || this.paused || now < this.nextPacketAt) return;
            const packets = this.currentReplay.packets.worldUpdate, step = 1000 / FPS / this.playbackRate;
            const end = this.loopEnabled ? this.loopEnd + 1 : packets.length;
            // Publish the final packet for a full callback before looping, so
            // recording scripts can observe the end and stop their recorder.
            if (this.tick >= end) { this.seek(this.loopEnabled ? this.loopStart : 0); return; }
            const due = Math.min(end - this.tick, Math.floor((now - this.nextPacketAt) / step) + 1);
            const next = this.nextPacketAt + due * step;
            if (due > FPS) {
                // Restore from the nearest keyframe after a long suspended tab.
                this.seek(this.tick + due - 1);
            } else {
                for (let n = 0; n < due; n++) {
                    this.applyMetadata(this.tick);
                    this.client.onMessage(packets[this.tick++]);
                }
                if (due) this.updateBar();
            }
            this.nextPacketAt = next;
        }
        resetWorld() {
            const c = this.client;
            c.cleanup();
            for (const cell of c.cellsToBeRemoved.splice(0)) c.cellPool.release(cell);
            c.cellsToBeRendered.length = 0;
            c.onMessage(this.currentReplay.packets.preinfo);
            c.isReplay = true; c.clientReady = true;
            this.appliedMeta = null;
        }
        applyMetadata(tick) {
            const entry = this.currentReplay;
            let m = entry.metadata?.[0];
            for (const candidate of entry.metadata || []) { if (candidate.tick > tick) break; m = candidate; }
            if (!m) m = this.fallbackMeta ||= {clients:[encodeClients(decodeRows(entry.packets.newClientUpdate, 10))],
                players:[encodePlayers(decodeRows(entry.packets.newPlayerUpdate, 11))]};
            if (m === this.appliedMeta) return;
            const c = this.client; c.playerClients.clear(); c.players.clear();
            for (const buffer of [...m.clients, ...m.players]) c.onMessage(buffer);
            for (const cell of Object.values(c.cells)) {
                const player = c.players.get(cell.playerId);
                if (player) { cell.skin = player.skin; cell.nickname = player.playerClient.nickname; }
            }
            this.appliedMeta = m;
        }
        seek(index) {
            const p = this.currentReplay.packets;
            index = Math.max(0, Math.min(p.worldUpdate.length - 1, Math.floor(Number(index) || 0)));
            this.tick = index + 1;
            let key = 0;
            p.keyframeTicks.forEach((tick, i) => { if (tick <= index) key = i; });
            this.resetWorld(); this.applyMetadata(p.keyframeTicks[key]);
            this.client.onMessage(p.newWorldUpdates[key]);
            // Keyframes represent the world after their tick. Imported native files
            // may omit the active-slot trailer, so replay that tick as Senpa does.
            for (let i = p.keyframeTicks[key]; i <= index; i++) {
                this.applyMetadata(i); this.client.onMessage(p.worldUpdate[i]);
            }
            for (const cell of Object.values(this.client.cells)) {
                cell.x = cell.targetX; cell.y = cell.targetY; cell.r = cell.targetR;
                cell.motion = null;
                // Seeking shows an already-existing world, even while the virtual
                // animation clock is paused. Do not leave rebuilt cells invisible.
                cell.fadeInStartTime = null; cell.animationProgress = cell.globalAlpha = 1;
            }
            for (const cell of this.client.cellsToBeRemoved.splice(0)) this.client.cellPool.release(cell);
            root.EonSenpaMotion.reset(this.client);
            this.client.updatePlayerPosition(); this.app.stage.updateCamera();
            const camera = this.app.stage.camera;
            camera.x = camera.target.x; camera.y = camera.target.y;
            const now = performance.now();
            this.motionAnchor = this.motionTime(now); this.motionAnchorAt = now;
            this.pausedAt = now; this.nextPacketAt = now + 1000 / FPS / this.playbackRate;
            this.applyTrainingCamera(this.app.stage);
            this.updateBar();
        }
        setLoopBoundary(which) {
            const index = Math.max(0, this.tick - 1);
            if (which === 'start') { this.loopStart = index; this.loopEnd = Math.max(index, this.loopEnd); }
            else { this.loopEnd = index; this.loopStart = Math.min(index, this.loopStart); }
            this.updateBar();
        }
        trainingSample() {
            const samples = this.currentReplay?.training?.samples;
            if (!this.isReplay || !samples?.length) return null;
            const tick = Math.max(0, this.tick - 1);
            let low = 0, high = samples.length - 1;
            while (low < high) { const mid = Math.ceil((low + high) / 2); if (samples[mid][0] <= tick) low = mid; else high = mid - 1; }
            const from = samples[low], to = samples[low + 1];
            if (from[0] > tick) return null;
            const at = this.paused ? this.pausedAt : performance.now(), step = 1000 / FPS / this.playbackRate;
            const fraction = to && to[0] === tick + 1 && from[0] === tick && Number.isFinite(this.nextPacketAt)
                ? Math.max(0, Math.min(1, 1 - (this.nextPacketAt - at) / step)) : 0;
            return from.map((value, index) => index && to ? value + (to[index] - value) * fraction : value);
        }
        applyTrainingCamera(stage) {
            if (!this.recordedCamera) return false;
            const sample = this.trainingSample(); if (!sample) return false;
            const camera = stage.camera;
            camera.x = camera.target.x = sample[3]; camera.y = camera.target.y = sample[4];
            camera.zoom = camera.target.zoom = sample[5]; return true;
        }
        drawTrainingOverlay(stage) {
            this.updateInputHistory();
            if (!this.showRecordedCursor) return;
            const sample = this.trainingSample(); if (!sample) return;
            const ctx = stage.ctx, density = stage.settings.pixelDensityFactor || 1, scale = stage.camera.zoom * density;
            const x = stage.canvasCenter.x + (sample[1] - stage.camera.x) * scale;
            const y = stage.canvasCenter.y + (sample[2] - stage.camera.y) * scale;
            const name = this.app.settings.get('themeCursor'), info = root.EonAssets?.cursorInfo?.(name);
            if (this.cursorName !== name) {
                this.cursorName = name; this.cursorImage = null;
                if (info) { this.cursorImage = new Image(); this.cursorImage.src = root.EonAssets.cursor(name); }
            }
            ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
            if (info && this.cursorImage?.complete && this.cursorImage.naturalWidth) {
                ctx.drawImage(this.cursorImage, x - info.hotX * density, y - info.hotY * density, info.width * density, info.height * density);
            } else if (!info) {
                ctx.translate(x, y); ctx.scale(density, density);
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 20); ctx.lineTo(5, 15); ctx.lineTo(9, 23);
                ctx.lineTo(13, 21); ctx.lineTo(9, 13); ctx.lineTo(17, 13); ctx.closePath();
                ctx.fillStyle = '#fff'; ctx.strokeStyle = '#111'; ctx.lineWidth = 1.5; ctx.fill(); ctx.stroke();
            }
            ctx.restore();
        }
        inputHistoryRows(frame) {
            const rows = this.inputEvents || []; let low = 0, high = rows.length;
            while (low < high) { const mid = (low + high) >> 1; if (rows[mid].tick <= frame) low = mid + 1; else high = mid; }
            return rows.slice(Math.max(0, low - 6), low).filter(row => frame - row.tick < FPS * 2.5).reverse();
        }
        updateInputHistory() {
            if (!this.inputHistory) return;
            if (!this.isReplay || !this.showInputHistory) { if (!this.inputHistory.hidden) this.inputHistory.hidden = true; return; }
            const now = this.paused ? this.pausedAt : performance.now(), step = 1000 / FPS / this.playbackRate;
            const fraction = Number.isFinite(this.nextPacketAt) ? Math.max(0, Math.min(1, 1 - (this.nextPacketAt - now) / step)) : 0;
            const frame = Math.max(0, this.tick - 1) + fraction, rows = this.inputHistoryRows(frame);
            const signature = rows.map(row => row.id).join(',');
            if (signature !== this.inputHistorySignature) {
                this.inputHistorySignature = signature; this.inputHistory.replaceChildren();
                for (const row of rows) {
                    const item = document.createElement('div'); item.className = 'replay-input-entry';
                    const key = document.createElement('kbd'); key.textContent = row.key || row.label;
                    const label = document.createElement('span'); label.textContent = (row.key ? row.label + ' · ' : '') + 'P' + (row.slot + 1);
                    item.append(key, label); this.inputHistory.append(item);
                }
            }
            this.inputHistory.hidden = !rows.length;
            rows.forEach((row, index) => {
                const age = (frame - row.tick) / FPS, item = this.inputHistory.children[index];
                item.style.opacity = String(Math.min(1, (2.5 - age) / .6));
                item.style.transform = `translateX(${-Math.max(0, 1 - age / .12) * 12}px)`;
            });
        }
        setControlsHidden(hidden) {
            this.bar.hidden = !this.isReplay || hidden;
            if (this.showControlsButton) this.showControlsButton.hidden = !this.isReplay || !hidden;
            if (!hidden) this.drawTimeline();
        }
        prepareTraining() {
            const training = this.currentReplay.training, available = !!training?.samples.length;
            const inputs = this.currentReplay.inputs;
            this.inputEvents = inputs?.length ? inputs.map((row, id) => ({id,tick:row[0],label:INPUT_LABELS[row[1]],key:keyLabel(row[2]),slot:row[3]})) :
                (training?.actions || []).map((row,id) => ({id,tick:row[0],label:ACTION_LABELS[row[1]],key:null,slot:row[2]}));
            this.inputHistorySignature = null; this.showInputHistory = false;
            if (this.inputToggle) {
                this.inputToggle.checked = false; this.inputToggle.disabled = !this.inputEvents.length;
                this.inputToggle.title = inputs?.length ? 'Recorded gameplay button presses' : 'This replay contains actions only; original key names were not recorded.';
            }
            if (this.rateSelect) this.rateSelect.value = '1';
            if (!this.trainingStatus) return;
            this.cameraToggle.disabled = this.cursorToggle.disabled = !available;
            this.cameraToggle.checked = this.recordedCamera; this.cursorToggle.checked = available;
            this.trainingStatus.textContent = !training ? 'No training data in this replay' :
                `${training.actions.length} sent actions · ${available ? 'Cursor + camera recorded' : 'No cursor/camera samples'}${training.truncated ? ' · Action limit reached' : ''}`;
            this.timeline.title = training ? 'Click to seek to a sent action' : 'No training data in this replay';
        }
        drawTimeline() {
            if (!this.timeline || !this.currentReplay) return;
            const canvas = this.timeline, width = Math.max(1, Math.round(canvas.clientWidth)), height = 36;
            const ratio = Math.min(2, root.devicePixelRatio || 1);
            if (canvas.width !== width * ratio || canvas.height !== height * ratio) { canvas.width = width * ratio; canvas.height = height * ratio; }
            const ctx = canvas.getContext('2d'); ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.clearRect(0, 0, width, height);
            const count = this.currentReplay.packets.worldUpdate.length, position = tick => 4 + tick / Math.max(1, count - 1) * (width - 8);
            if (this.loopEnabled) {
                ctx.fillStyle = '#a78bfa26'; ctx.fillRect(position(this.loopStart), 0, Math.max(2, position(this.loopEnd) - position(this.loopStart)), height);
            }
            const colors = ['#c4a2ff', '#67e8bc', '#f6bd67', '#69bfff'];
            // At most one mark per action lane and pixel; imported clips stay cheap to draw.
            const seen = new Set();
            for (const action of this.currentReplay.training?.actions || []) {
                const x = Math.round(position(action[0])), key = x * 4 + action[1];
                if (seen.has(key)) continue; seen.add(key);
                ctx.fillStyle = colors[action[1]]; ctx.fillRect(x - 1, action[1] * 8 + 2, 3, 6);
            }
            ctx.fillStyle = '#ffffff'; ctx.fillRect(position(this.tick - 1), 0, 1, height);
        }
        timelineAction(event) {
            const actions = this.currentReplay?.training?.actions;
            if (!actions?.length) return null;
            const rect = this.timeline.getBoundingClientRect(), count = this.currentReplay.packets.worldUpdate.length;
            const tick = Math.max(0, Math.min(count - 1, (event.clientX - rect.left - 4) / Math.max(1, rect.width - 8) * (count - 1)));
            return actions.reduce((closest, action) => Math.abs(action[0] - tick) < Math.abs(closest[0] - tick) ? action : closest);
        }
        stop() {
            if (!this.isReplay) return;
            clearInterval(this.interval); this.interval = null;
            this.app.input.handleWindowBlur();
            this.client.cleanup(); this.app.gameConnection.removeConnection(this.client);
            this.client = null; this.currentReplay = this.fallbackMeta = null;
            this.isReplay = false; this.paused = false; this.clear();
            document.body.classList.remove('watching-replay');
            this.packetProgress?.remove(); this.packetProgress = null;
            this.bar.hidden = true;
            if (this.showControlsButton) this.showControlsButton.hidden = true;
            if (this.inputHistory) { this.inputHistory.hidden = true; this.inputHistory.replaceChildren(); }
            this.app.lobby.show(); this.app.lobby.initClient(this.app.player.serverUrl);
        }
        notice(message, type = 'info') { this.app.toasts.show(message, type, 3500); }
        initializeUI() {
            this.overlay = document.getElementById('replaysOverlay');
            this.grid = document.getElementById('replaysGrid');
            const toolbar = document.createElement('div'); toolbar.className = 'replay-toolbar';
            const removeAll = this.deleteAllButton = document.createElement('button');
            removeAll.id = 'replay-delete-all'; removeAll.className = 'replay-delete-all';
            removeAll.textContent = 'Delete all'; removeAll.disabled = true; removeAll.onclick = () => this.deleteAll();
            const upload = document.createElement('button'); upload.textContent = 'Import .senpa';
            const input = document.createElement('input'); input.type = 'file'; input.accept = '.senpa'; input.multiple = true; input.hidden = true;
            upload.onclick = () => input.click();
            input.onchange = async () => {
                for (const file of input.files) {
                    try {
                        if (file.size > MAX_FILE) throw Error('Replay file is too large.');
                        const data = await file.text(), entry = parse(data);
                        await this.write({key:new Date().toISOString() + '-' + root.crypto.randomUUID(), time:entry.time,
                            img:entry.img, frames:entry.packets.worldUpdate.length, data});
                    } catch (error) { this.notice(file.name + ': ' + error.message, 'error'); }
                }
                input.value = ''; await this.refresh();
            };
            const help = this.help = document.createElement('span');
            toolbar.append(upload, input, removeAll, help); this.overlay.querySelector('.replays-body').prepend(toolbar);
            document.querySelector('.btn-replays').onclick = () => this.openLibrary();
            document.getElementById('btnCloseReplays').onclick = () => this.closeLibrary();
            this.overlay.addEventListener('click', event => { if (event.target === this.overlay) this.closeLibrary(); });
            this.bar = document.createElement('div'); this.bar.id = 'replay-bar'; this.bar.hidden = true;
            this.bar.innerHTML = '<strong>REPLAY</strong><button id="replay-pause">Pause</button>' +
                '<label>Speed <select id="replay-rate" aria-label="Playback speed"><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label>' +
                '<span id="replay-time"></span><label class="replay-opacity-label">Opacity <input id="replay-opacity" type="range" min="10" max="100" value="100"></label>' +
                '<button id="replay-stop">Exit replay</button><button id="replay-hide-controls">Hide controls</button>' +
                '<div class="replay-track"><canvas id="replay-events" aria-label="Sent action timeline"></canvas><input id="replay-progress" aria-label="Replay position" type="range" min="0" step="1"></div>' +
                '<div class="replay-training-controls"><button id="replay-loop-start" title="Set segment start to the current frame">Set A</button><button id="replay-loop-end" title="Set segment end to the current frame">Set B</button>' +
                '<button id="replay-loop" aria-pressed="false">Loop A–B</button><span id="replay-loop-range"></span>' +
                '<label><input id="replay-camera" type="checkbox"> Recorded camera</label><label><input id="replay-cursor" type="checkbox" checked> Recorded cursor</label><label><input id="replay-input-history" type="checkbox"> Input history</label></div>' +
                '<div class="replay-training-caption"><span class="replay-action-key"><i>Split</i><i>Feed start</i><i>Feed stop</i><i>Switch</i></span><span id="replay-training-status"></span></div>' +
                '<div id="replay-action-status"></div>';
            document.body.append(this.bar);
            this.showControlsButton = document.createElement('button'); this.showControlsButton.id = 'replay-show-controls';
            this.showControlsButton.textContent = 'Show controls'; this.showControlsButton.hidden = true;
            this.showControlsButton.onclick = () => this.setControlsHidden(false);
            this.bar.querySelector('#replay-hide-controls').onclick = () => this.setControlsHidden(true);
            this.inputHistory = document.createElement('div'); this.inputHistory.id = 'replay-inputs'; this.inputHistory.hidden = true;
            this.inputHistory.setAttribute('aria-label', 'Recorded gameplay inputs');
            document.body.append(this.showControlsButton, this.inputHistory);
            this.inputToggle = this.bar.querySelector('#replay-input-history');
            this.inputToggle.onchange = () => { this.showInputHistory = this.inputToggle.checked; this.updateInputHistory(); };
            this.progress = this.bar.querySelector('#replay-progress');
            this.rateSelect = this.bar.querySelector('#replay-rate'); this.rateSelect.onchange = () => { this.playbackRate = this.rateSelect.value; };
            this.trainingStatus = this.bar.querySelector('#replay-training-status'); this.timeline = this.bar.querySelector('#replay-events');
            this.cameraToggle = this.bar.querySelector('#replay-camera'); this.cursorToggle = this.bar.querySelector('#replay-cursor');
            this.cameraToggle.onchange = () => { this.recordedCamera = this.cameraToggle.checked; this.applyTrainingCamera(this.app.stage); };
            this.cursorToggle.onchange = () => { this.showRecordedCursor = this.cursorToggle.checked; };
            this.bar.querySelector('#replay-loop-start').onclick = () => this.setLoopBoundary('start');
            this.bar.querySelector('#replay-loop-end').onclick = () => this.setLoopBoundary('end');
            this.bar.querySelector('#replay-loop').onclick = () => {
                this.loopEnabled = !this.loopEnabled;
                if (this.loopEnabled && (this.tick - 1 < this.loopStart || this.tick - 1 > this.loopEnd)) this.seek(this.loopStart);
                this.updateBar();
            };
            this.timeline.onclick = event => { const action = this.timelineAction(event); if (action) this.seek(action[0]); };
            this.timeline.onpointermove = event => {
                const action = this.timelineAction(event);
                if (action) this.timeline.title = `${(action[0] / FPS).toFixed(2)}s · ${ACTION_LABELS[action[1]]} · P${action[2] + 1}`;
            };
            if (root.ResizeObserver) new root.ResizeObserver(() => this.drawTimeline()).observe(this.timeline);
            this.bar.querySelector('#replay-pause').onclick = () => { this.paused = !this.paused; this.syncPause(); };
            this.bar.querySelector('#replay-stop').onclick = () => this.stop();
            let wasPaused = false;
            this.progress.onpointerdown = () => { wasPaused = this.paused; this.paused = true; this.syncPause(); };
            this.progress.oninput = () => { this.paused = true; this.seek(this.progress.value); };
            this.progress.onchange = () => { this.paused = wasPaused; this.syncPause(); };
            this.bar.querySelector('#replay-opacity').oninput = event => { this.opacity = Number(event.target.value) / 100; };
            document.addEventListener('keydown', event => {
                if (event.key !== 'Escape') return;
                if (this.isOpen || this.isReplay) {
                    event.preventDefault(); event.stopImmediatePropagation();
                    if (this.isOpen) this.closeLibrary(); else this.stop();
                }
            }, true);
        }
        syncPause() { this.bar.querySelector('#replay-pause').textContent = this.paused ? 'Play' : 'Pause'; }
        updateBar() {
            const count = this.currentReplay.packets.worldUpdate.length;
            this.progress.max = count - 1; this.progress.value = this.tick - 1;
            this.updateInputHistory();
            // A one-based packet count reaches the total on the last frame.
            // Update it before the time label's DOM mutation notifies observers.
            if (this.packetProgress) {
                this.packetProgress.max = String(count);
                this.packetProgress.value = String(this.tick);
            }
            this.bar.querySelector('#replay-time').textContent = (this.tick / FPS).toFixed(1) + ' / ' + (count / FPS).toFixed(1) + 's';
            const loop = this.bar.querySelector('#replay-loop');
            if (loop) {
                loop.setAttribute('aria-pressed', String(this.loopEnabled));
                this.bar.querySelector('#replay-loop-range').textContent = `${(this.loopStart / FPS).toFixed(2)}–${((this.loopEnd + 1) / FPS).toFixed(2)}s`;
                const recent = (this.currentReplay.training?.actions || []).filter(action => action[0] <= this.tick - 1 && action[0] >= this.tick - FPS - 1).slice(-4);
                this.bar.querySelector('#replay-action-status').textContent = recent.length ? recent.map(action =>
                    `${(action[0] / FPS).toFixed(2)}s ${ACTION_LABELS[action[1]]} P${action[2] + 1}`).join(' · ') : 'No sent actions in the last second';
                this.drawTimeline();
            }
        }
        openLibrary() {
            this.help.textContent = 'Save Replay: ' + (this.app.input.keybinds.saveReplay || 'Unassigned') + ' · Settings → Controls';
            this.isOpen = true; this.overlay.style.display = 'flex'; this.refresh();
        }
        closeLibrary() { this.isOpen = false; this.overlay.style.display = 'none'; }
        async refresh() {
            try {
                this.list = (await this.transaction('readonly', store => store.getAll(), 'metadata')).sort((a, b) => b.time - a.time);
                this.deleteAllButton.disabled = !this.list.length || this.deletingAll;
                this.grid.replaceChildren();
                if (!this.list.length) { const empty = document.createElement('p'); empty.textContent = 'No saved replays. Use Save Replay while playing to save the last 10 seconds.'; this.grid.append(empty); }
                for (const saved of this.list) {
                    const card = document.createElement('article'); card.className = 'replay-card';
                    card.tabIndex = 0; card.setAttribute('role', 'group');
                    card.setAttribute('aria-label', 'Replay ' + new Date(saved.time).toLocaleString() + '. Press Enter to play.');
                    card.onclick = () => this.play(saved.key);
                    card.onkeydown = event => {
                        if (event.target === card && (event.key === 'Enter' || event.key === ' ')) {
                            event.preventDefault(); event.stopPropagation(); if (!event.repeat) this.play(saved.key);
                        }
                    };
                    const thumb = document.createElement('div'); thumb.className = 'replay-thumb-wrap';
                    if (/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(saved.img)) {
                        const img = document.createElement('img'); img.className = 'replay-thumb'; img.src = saved.img; img.alt = 'Replay preview'; thumb.append(img);
                    }
                    const info = document.createElement('div'); info.className = 'replay-info';
                    info.textContent = new Date(saved.time).toLocaleString() + ' · ' + (saved.frames / FPS).toFixed(1) + 's';
                    const actions = document.createElement('div'); actions.className = 'replay-actions';
                    const playHint = document.createElement('span'); playHint.className = 'replay-play-hint';
                    playHint.textContent = '▶'; playHint.setAttribute('aria-hidden', 'true');
                    const download = document.createElement('button'); download.textContent = '↓';
                    download.title = 'Download'; download.setAttribute('aria-label', 'Download');
                    download.onclick = async event => {
                        event.stopPropagation();
                        try {
                        const entry = await this.transaction('readonly', store => store.get(saved.key));
                        if (!entry) throw Error('Replay not found.');
                        const url = URL.createObjectURL(new Blob([entry.data], {type:'text/plain'})), a = document.createElement('a');
                        a.href = url; a.download = saved.key.replace(/:/g, '-') + '.senpa'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
                        } catch (error) { this.notice(error.message, 'error'); }
                    };
                    const remove = document.createElement('button'); remove.className = 'replay-del-btn'; remove.textContent = '×';
                    remove.title = 'Delete'; remove.setAttribute('aria-label', 'Delete');
                    remove.onclick = async event => {
                        event.stopPropagation();
                        if (!root.confirm('Delete this replay?')) return;
                        try { await this.write(saved, true); await this.refresh(); }
                        catch (error) { this.notice(error.message, 'error'); }
                    };
                    actions.append(download, remove); card.append(thumb, playHint, info, actions); this.grid.append(card);
                }
            } catch (error) { this.grid.textContent = error.message; }
        }
    }
    root.EonReplay = {ReplayManager, Ring, parse, createExport, validate, worldEnd, worldSnapshot, metadata, encodeClients, encodePlayers,
        initialize(app) { return app.replayManager ||= new ReplayManager(app); },
        attachClient(client) { client.app.replayManager?.attach(client); }};
})(window);

