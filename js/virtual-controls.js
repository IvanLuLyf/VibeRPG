/**
 * 触屏虚拟摇杆 + NES/GBA 式按键（与键盘 J/K/G/H 对应）
 * 依赖 js/game/main.js 中的 applyDirectionKey / dispatch* 等全局函数
 */
(function () {
    const VGW = typeof GAME_VIEW_WIDTH !== "undefined" ? GAME_VIEW_WIDTH : 416;
    const VGH = typeof GAME_VIEW_HEIGHT !== "undefined" ? GAME_VIEW_HEIGHT : 352;

    const pad = { cx: 80, cy: VGH - 70, R: 56, knobR: 18, dead: 12 };

    const buttons = [
        { cx: VGW - 44, cy: VGH - 92, r: 28, action: "confirm", label: "A", sub: "J" },
        { cx: VGW - 96, cy: VGH - 58, r: 28, action: "b", label: "B", sub: "K" },
        { cx: 232, cy: VGH - 54, r: 22, action: "select", label: "SEL", sub: "G" },
        { cx: 292, cy: VGH - 112, r: 22, action: "start", label: "ST", sub: "H" }
    ];

    function touchUiWanted() {
        if (/\?touch=1\b/.test(location.search)) return true;
        if (/\?notouch=1\b/.test(location.search)) return false;
        try {
            if (matchMedia("(pointer: coarse)").matches) return true;
        } catch (e) {}
        return navigator.maxTouchPoints > 0 || window.innerWidth < 720;
    }

    function clientToCanvas(clientX, clientY) {
        const r = gameCanvas.getBoundingClientRect();
        const x = ((clientX - r.left) / r.width) * gameCanvas.width;
        const y = ((clientY - r.top) / r.height) * gameCanvas.height;
        return [x, y];
    }

    function inPad(x, y) {
        return Math.hypot(x - pad.cx, y - pad.cy) < pad.R + 36;
    }

    function hitButton(x, y) {
        for (let i = 0; i < buttons.length; i++) {
            const b = buttons[i];
            if (Math.hypot(x - b.cx, y - b.cy) < b.r + 6) return b;
        }
        return null;
    }

    const stick = {
        active: false,
        pointerId: null,
        knobDX: 0,
        knobDY: 0,
        vx: 0,
        vy: 0,
        timer: null,
        menuLastAt: 0
    };

    function stickRepeatAllowed() {
        return (
            typeof g_progress !== "undefined" &&
            g_progress.isLoadComplete() &&
            !g_menu.isDisplayed() &&
            !g_shop.shopDisplayed() &&
            !g_battle &&
            !g_titlescreen &&
            !g_textDisplay.textDisplayed() &&
            !g_worldmap.isAnimating()
        );
    }

    function vectorToKey() {
        const len = Math.hypot(stick.vx, stick.vy);
        if (len < 0.38) return null;
        if (Math.abs(stick.vx) > Math.abs(stick.vy)) {
            return stick.vx > 0 ? RIGHT_ARROW : LEFT_ARROW;
        }
        return stick.vy > 0 ? DOWN_ARROW : UP_ARROW;
    }

    function updateStickKnob(clientX, clientY) {
        const [x, y] = clientToCanvas(clientX, clientY);
        let dx = x - pad.cx;
        let dy = y - pad.cy;
        const dist = Math.hypot(dx, dy);
        const max = pad.R - 4;
        if (dist > max) {
            dx = (dx / dist) * max;
            dy = (dy / dist) * max;
        }
        stick.knobDX = dx;
        stick.knobDY = dy;
        const rawDist = Math.hypot(x - pad.cx, y - pad.cy);
        if (rawDist < pad.dead) {
            stick.vx = 0;
            stick.vy = 0;
        } else {
            stick.vx = (x - pad.cx) / pad.R;
            stick.vy = (y - pad.cy) / pad.R;
        }
    }

    function stickTick() {
        if (!stick.active) return;
        const key = vectorToKey();
        if (key === null) return;
        if (stickRepeatAllowed()) {
            applyDirectionKey(key, noopEvent());
            return;
        }
        const now = Date.now();
        if (now - stick.menuLastAt < 200) return;
        stick.menuLastAt = now;
        applyDirectionKey(key, noopEvent());
    }

    function stickPollIntervalMs() {
        return typeof FIELD_MOVE_POLL_MS !== "undefined" ? FIELD_MOVE_POLL_MS : 40;
    }

    function bumpComposite() {
        if (typeof window.invalidateComposite === "function") window.invalidateComposite();
    }

    function startStickTimer() {
        stopStickTimer();
        stick.timer = setInterval(stickTick, stickPollIntervalMs());
    }

    function stopStickTimer() {
        if (stick.timer) {
            clearInterval(stick.timer);
            stick.timer = null;
        }
    }

    function dispatchByAction(name) {
        switch (name) {
            case "confirm":
                dispatchConfirm(noopEvent());
                break;
            case "b":
                dispatchBButton(noopEvent());
                break;
            case "start":
                dispatchStart(noopEvent());
                break;
            case "select":
                dispatchSelect(noopEvent());
                break;
        }
    }

    function onPointerDown(e) {
        if (!touchUiWanted()) return;
        if (document.body && document.body.classList.contains("osrpg-prompt-open")) return;
        const [x, y] = clientToCanvas(e.clientX, e.clientY);
        const btn = hitButton(x, y);
        if (btn) {
            e.preventDefault();
            dispatchByAction(btn.action);
            bumpComposite();
            return;
        }
        if (inPad(x, y)) {
            e.preventDefault();
            stick.active = true;
            stick.pointerId = e.pointerId;
            stick.menuLastAt = 0;
            gameCanvas.setPointerCapture(e.pointerId);
            updateStickKnob(e.clientX, e.clientY);
            stickTick();
            startStickTimer();
            bumpComposite();
        }
    }

    function onPointerMove(e) {
        if (!stick.active || e.pointerId !== stick.pointerId) return;
        e.preventDefault();
        updateStickKnob(e.clientX, e.clientY);
        bumpComposite();
    }

    function onPointerUp(e) {
        if (stick.active && e.pointerId === stick.pointerId) {
            e.preventDefault();
            stick.active = false;
            stick.pointerId = null;
            stick.knobDX = 0;
            stick.knobDY = 0;
            stick.vx = 0;
            stick.vy = 0;
            stopStickTimer();
            bumpComposite();
            try {
                gameCanvas.releasePointerCapture(e.pointerId);
            } catch (err) {}
        }
    }

    function drawVirtualGameControls(ctx) {
        if (!ctx || !touchUiWanted()) return;
        if (document.body && document.body.classList.contains("osrpg-prompt-open")) return;

        ctx.save();
        ctx.globalAlpha = 0.42;

        ctx.beginPath();
        ctx.arc(pad.cx, pad.cy, pad.R, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(40,40,55,0.85)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pad.cx + stick.knobDX, pad.cy + stick.knobDY, pad.knobR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,220,240,0.9)";
        ctx.fill();

        ctx.globalAlpha = 0.5;
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let i = 0; i < buttons.length; i++) {
            const b = buttons[i];
            ctx.beginPath();
            ctx.arc(b.cx, b.cy, b.r, 0, Math.PI * 2);
            let fill = "rgba(200,80,90,0.75)";
            if (b.action === "confirm") fill = "rgba(90,140,255,0.75)";
            else if (b.action === "select" || b.action === "start") fill = "rgba(120,120,130,0.8)";
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.55)";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "rgba(255,255,255,0.95)";
            ctx.font = "bold 13px sans-serif";
            ctx.fillText(b.label, b.cx, b.cy - 5);
            ctx.font = "10px sans-serif";
            ctx.fillStyle = "rgba(255,255,255,0.75)";
            ctx.fillText(b.sub, b.cx, b.cy + 8);
        }

        ctx.restore();
    }

    window.drawVirtualGameControls = drawVirtualGameControls;

    window.initVirtualGameControls = function () {
        if (!window.gameCanvas || window.__virtualControlsInited) return;
        if (!touchUiWanted()) return;
        window.__virtualControlsInited = true;

        gameCanvas.addEventListener("pointerdown", onPointerDown, { passive: false });
        gameCanvas.addEventListener("pointermove", onPointerMove, { passive: false });
        gameCanvas.addEventListener("pointerup", onPointerUp, { passive: false });
        gameCanvas.addEventListener("pointercancel", onPointerUp, { passive: false });
        gameCanvas.addEventListener("contextmenu", (ev) => ev.preventDefault());
    };
})();
