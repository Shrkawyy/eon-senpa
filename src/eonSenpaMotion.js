(function (root) {
    'use strict';
    const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

    function enabled(client) {
        return !!client.app?.stage?.settings.adaptiveCellMotion;
    }

    // Restore the original gradual following, using time rather than frame count.
    // A fixed user-selected response avoids changing the feel with packet jitter.
    // Live play and replay share this response; replay timing remains separate.
    function packet(client) {
        if (!enabled(client)) return 0;
        const duration = Number(client.app.stage.settings.cellAnimationSpeed);
        return Number.isFinite(duration) && duration > 0 ? clamp(duration, 30, 300) : 145;
    }

    function sizeDuration(client, fallback = 145) {
        const value = Number(client.app.stage.settings.cellSizeAnimationSpeed);
        return Number.isFinite(value) && value > 0 ? clamp(value, 30, 300) : fallback;
    }

    function time(client, now) {
        return client?.isReplay && client.app.replayManager?.isReplay ?
            (client.app.replayManager.motionTime?.(now) ?? now) : now;
    }

    function advance(cell, now) {
        const motion = cell.motion;
        if (!motion || cell.destroyed) return false;
        const progress = -Math.expm1(-Math.max(0, now - motion.time) / motion.duration);
        const sizeProgress = -Math.expm1(-Math.max(0, now - motion.time) / (motion.sizeDuration || motion.duration));
        cell.x = motion.x + (cell.targetX - motion.x) * progress;
        cell.y = motion.y + (cell.targetY - motion.y) * progress;
        cell.r = motion.r + (cell.targetR - motion.r) * sizeProgress;
        // Settle only subpixel residuals; never predict beyond the server target.
        if (Math.abs(cell.targetX - cell.x) < .001) cell.x = cell.targetX;
        if (Math.abs(cell.targetY - cell.y) < .001) cell.y = cell.targetY;
        if (Math.abs(cell.targetR - cell.r) < .001) cell.r = cell.targetR;
        return true;
    }

    function target(cell, x, y, radius, now, duration, radiusDuration = duration) {
        if (duration > 0 && !cell.flags.isFood && !cell.destroyed) {
            advance(cell, now);
            // Identical snapshots must not restart the remaining transition.
            if (!cell.motion || x !== cell.targetX || y !== cell.targetY || radius !== cell.targetR || duration !== cell.motion.duration || radiusDuration !== cell.motion.sizeDuration) {
                const motion = cell.motion || (cell.motion = {});
                motion.x = cell.x; motion.y = cell.y; motion.r = cell.r;
                motion.time = now; motion.duration = duration;
                motion.sizeDuration = radiusDuration;
            }
        } else cell.motion = null;
        cell.targetX = x; cell.targetY = y; cell.targetR = radius;
    }

    // Retained for connection/replay callers; there is no packet-clock state now.
    root.EonSenpaMotion = {enabled, packet, sizeDuration, time, advance, target, reset:() => {}};
})(window);

