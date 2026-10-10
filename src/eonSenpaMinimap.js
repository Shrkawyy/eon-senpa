(function (root) {
    'use strict';
    // Senpa /web/assets/main-BYcEhCon.js: opcode 22, sy and Ky.
    // The server chooses which players to send for the current team tag. Do not
    // merge external chat positions or filter these records by tag/client ID.
    class Point {
        constructor(id, x, y, radius) {
            this.id = id;
            this.startX = this.x = this.endX = x;
            this.startY = this.y = this.endY = y;
            this.startRadius = this.radius = this.endRadius = radius;
            this.updateTime = 0; this.dt = 1; this.animating = false;
        }
        animate(now = root.performance.now()) {
            if (!this.animating) return;
            const t = Math.max(0, Math.min(1, (now - this.updateTime) / 3000));
            this.x = this.startX + (this.endX - this.startX) * t;
            this.y = this.startY + (this.endY - this.startY) * t;
            this.radius = this.startRadius + (this.endRadius - this.startRadius) * t;
            this.dt = t;
            if (t === 1) this.animating = false;
        }
        update(x, y, radius, now = root.performance.now()) {
            this.animate(now);
            this.startX = this.x; this.startY = this.y; this.startRadius = this.radius;
            this.endX = x; this.endY = y; this.endRadius = radius;
            this.updateTime = now;
            this.animating = this.startX !== x || this.startY !== y || this.startRadius !== radius;
            this.dt = +!this.animating;
        }
    }
    function receive(client, buffer, now = root.performance.now()) {
        const view = new DataView(buffer);
        if (view.byteLength < 2 || view.getUint8(0) !== 22) return false;
        const count = view.getUint8(1);
        // Validate the entire packet before changing state; an unknown player's
        // metadata can arrive later, and must not discard the following points.
        if (view.byteLength < 2 + count * 12) return false;
        const points = client.minimapPlayers ||= new Map();
        for (let i = 0, at = 2; i < count; i++, at += 12) {
            const id = view.getUint16(at, true), x = view.getInt32(at + 2, true);
            const y = view.getInt32(at + 6, true), radius = view.getUint16(at + 10, true);
            let point = points.get(id);
            if (!point) { point = new Point(id, x, y, radius); points.set(id, point); }
            point.update(x, y, radius, now);
        }
        return true;
    }
    class Minimap {
        constructor(app) {
            this.app = app;
            this.container = document.getElementById('minimap-container');
            this.canvas = document.getElementById('minimap');
            this.ctx = this.canvas.getContext('2d');
            this.gridCanvas = document.createElement('canvas');
            this.lastRenderTime = -Infinity;
            this.resize();
            root.addEventListener('resize', () => this.resize());
            app.settings.on('change:minimapSize', () => this.resize());
            const visibility = () => {
                this.container.style.display = app.settings.get('showMinimap') && app.settings.get('showHUD') ? 'flex' : 'none';
                this.lastRenderTime = -Infinity;
            };
            app.settings.on('change:showMinimap', visibility);
            app.settings.on('change:showHUD', visibility);
            visibility();
        }
        resize() {
            this.size = Number(this.app.settings.get('minimapSize')) || 200;
            this.dpr = Math.min(root.devicePixelRatio || 1, 3);
            const scale = Math.max(120, Math.min(this.size, Math.floor(.35 * Math.min(root.innerWidth, root.innerHeight)))) / this.size;
            Object.assign(this.container.style, {width:this.size + 'px', height:this.size + 'px',
                bottom:'10px', right:'10px', transform:'scale(' + scale + ')', transformOrigin:'bottom right'});
            this.canvas.width = this.canvas.height = this.size * this.dpr | 0;
            this.renderGrid();
            this.lastRenderTime = -Infinity;
        }
        renderGrid() {
            const canvas = this.gridCanvas, size = this.size, step = size / 5;
            canvas.width = canvas.height = size * this.dpr | 0;
            const ctx = canvas.getContext('2d');
            ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
            ctx.clearRect(0, 0, size, size);
            ctx.font = '300 13px Geogrotesque, Titillium Web, Ubuntu, sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#37474f';
            for (let row = 0; row < 5; row++) for (let col = 0; col < 5; col++) {
                ctx.fillText('ABCDE'[row] + (col + 1), step / 2 + col * step, step / 2 + row * step);
            }
        }
        draw(now = root.performance.now()) {
            if (!this.app.settings.get('showMinimap') || !this.app.settings.get('showHUD') || now - this.lastRenderTime < 50) return;
            this.lastRenderTime = now;
            const ctx = this.ctx, size = this.size, client = this.app.gameConnection.current;
            ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
            ctx.globalAlpha = 1;
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(this.gridCanvas, 0, 0, size, size);
            const width = client?.border && client.border.right - client.border.left;
            if (!(width > 0) || !client.minimapPlayers) return;
            const scale = size / width;
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.font = '400 12px ubuntu'; ctx.globalAlpha = .9;
            for (const [id, point] of client.minimapPlayers) {
                if (now - point.updateTime > 2000) { client.minimapPlayers.delete(id); continue; }
                const player = client.players.get(id)?.playerClient;
                const own = client.playerIds.includes(id);
                point.animate(now);
                // Senpa's arena coordinates start at zero; both native slots
                // keep their own point, regardless of the currently selected slot.
                const x = point.x * scale | 0, y = point.y * scale | 0;
                const radius = Math.max(3, point.radius * scale | 0);
                const color = Number.isInteger(player?.colorInt) && player.colorInt >= 0 && player.colorInt <= 0xffffff ?
                    '#' + player.colorInt.toString(16).padStart(6, '0') : '#ffffff';
                ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2, true); ctx.closePath();
                ctx.fillStyle = color; ctx.fill();
                if (own) {
                    ctx.beginPath(); ctx.arc(x, y, radius + 3, 0, Math.PI * 2, true); ctx.closePath();
                    ctx.lineWidth = 2; ctx.strokeStyle = color; ctx.stroke();
                }
                if (!player?.isBot && player?.nickname) ctx.fillText(player.nickname, x, y - radius);
            }
        }
    }
    root.EonSenpaMinimap = {Point, receive, Minimap};
})(window);

