/* Game bootstrap (maps, input, boot). Loads after engine + js/game/*.js per index.html. */
let g_game = null;
let g_player = null;
let g_worldmap = null;
let g_titlescreen = true;
const g_textDisplay = new TextDisplay();
const g_menu = new MainMenu();
const g_shop = new Shop();
let g_battle = null;
let g_fullscreen = false;
const g_progress = new Progress();

const g_elements = gameCanvas ? [gameCanvas] : [];

/** Boot splash: logo → cover + progress bar → title (avoids stuck “加载完成” overlay). */
const BOOT_LOGO_MS = 1000;
let g_bootLoaderActive = true;
let g_bootLoadFinished = false;
let g_bootLoaderFatal = false;
let g_bootLoaderErrorText = "";
let g_bootStartTime = 0;
let g_bootEnded = false;

function drawBootProgressBar(pct) {
    const x = 56;
    const y = GAME_VIEW_HEIGHT - 36;
    const w = GAME_VIEW_WIDTH - 112;
    const h = 10;
    const clamped = Math.max(0, Math.min(1, pct));
    textCtx.fillStyle = "rgba(0,0,0,0.55)";
    textCtx.fillRect(x, y, w, h);
    textCtx.strokeStyle = "rgba(255,255,255,0.35)";
    textCtx.lineWidth = 1;
    textCtx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    const fillW = Math.max(0, (w - 4) * clamped);
    const g = textCtx.createLinearGradient(x, y, x + w, y);
    g.addColorStop(0, "#4ade80");
    g.addColorStop(1, "#22c55e");
    textCtx.fillStyle = g;
    textCtx.fillRect(x + 2, y + 2, fillW, h - 4);
}

function drawPoweredByLogo(elapsedMs) {
    const t = elapsedMs / BOOT_LOGO_MS;
    const alpha = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;
    textCtx.fillStyle = `rgba(0,0,0,${0.92 * Math.min(1, alpha)})`;
    textCtx.fillRect(0, 0, GAME_VIEW_WIDTH, GAME_VIEW_HEIGHT);
    textCtx.globalAlpha = Math.min(1, alpha);
    textCtx.fillStyle = "#f8fafc";
    textCtx.textAlign = "center";
    textCtx.textBaseline = "middle";
    textCtx.font =
        '600 20px system-ui, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif';
    textCtx.fillText(BunnyRPG.t("boot.powered_by"), GAME_VIEW_WIDTH / 2, GAME_VIEW_HEIGHT / 2 - 12);
    textCtx.font =
        '500 13px system-ui, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif';
    textCtx.fillStyle = "rgba(248,250,252,0.75)";
    textCtx.fillText("BunnyRPG", GAME_VIEW_WIDTH / 2, GAME_VIEW_HEIGHT / 2 + 14);
    textCtx.globalAlpha = 1;
    textCtx.textAlign = "left";
    textCtx.textBaseline = "alphabetic";
}

function drawNakamonCoverAndProgress() {
    const ts = typeof g_imageData !== "undefined" && g_imageData.images && g_imageData.images.titlescreen;
    const img = ts && ts.img;
    textCtx.fillStyle = "#0a0a12";
    textCtx.fillRect(0, 0, GAME_VIEW_WIDTH, GAME_VIEW_HEIGHT);
    if (img && img.complete && img.naturalWidth > 0) {
        textCtx.drawImage(img, 0, 0, GAME_VIEW_WIDTH, GAME_VIEW_HEIGHT);
        textCtx.fillStyle = "rgba(0,0,0,0.35)";
        textCtx.fillRect(0, 0, GAME_VIEW_WIDTH, GAME_VIEW_HEIGHT);
    }
    textCtx.fillStyle = "#fff";
    textCtx.textAlign = "center";
    textCtx.textBaseline = "top";
    textCtx.font =
        '700 28px system-ui, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif';
    textCtx.fillStyle = "rgba(255,255,255,0.96)";
    textCtx.fillText(BunnyRPG.t("boot.title"), GAME_VIEW_WIDTH / 2, 24);
    textCtx.font =
        '500 14px system-ui, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif';
    textCtx.fillStyle = "rgba(255,255,255,0.8)";
    textCtx.fillText(BunnyRPG.t("boot.loading"), GAME_VIEW_WIDTH / 2, 58);
    textCtx.textAlign = "left";
    drawBootProgressBar(g_progress.getPercentLoaded());
}

function drawBootFatal() {
    textCtx.fillStyle = "#1a0508";
    textCtx.fillRect(0, 0, GAME_VIEW_WIDTH, GAME_VIEW_HEIGHT);
    textCtx.fillStyle = "#fecaca";
    textCtx.font =
        '500 13px system-ui, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif';
    textCtx.textBaseline = "top";
    const msg =
        g_bootLoaderErrorText ||
        BunnyRPG.t("boot.load_fail_prefix") +
            g_progress.getList().join("\n");
    const lines = String(msg).split("\n");
    let y = 24;
    for (let i = 0; i < lines.length && i < 12; i++) {
        textCtx.fillText(lines[i], 16, y);
        y += 18;
    }
}

function endBootAndShowTitle() {
    if (g_bootEnded) return;
    g_bootEnded = true;
    g_bootLoaderActive = false;
    textCtx.clearRect(0, 0, GAME_VIEW_WIDTH, GAME_VIEW_HEIGHT);
    if (g_game) g_game.showTitleScreen();
    invalidateComposite();
}

function bootLoaderFrame(now) {
    if (!g_bootLoaderActive) return;
    if (!g_bootStartTime) g_bootStartTime = now;
    const elapsed = now - g_bootStartTime;

    if (g_bootLoaderFatal) {
        textCtx.save();
        textCtx.clearRect(0, 0, GAME_VIEW_WIDTH, GAME_VIEW_HEIGHT);
        drawBootFatal();
        textCtx.restore();
        invalidateComposite();
        requestAnimationFrame(bootLoaderFrame);
        return;
    }

    if (g_bootLoadFinished && elapsed >= BOOT_LOGO_MS) {
        endBootAndShowTitle();
        return;
    }

    textCtx.save();
    textCtx.clearRect(0, 0, GAME_VIEW_WIDTH, GAME_VIEW_HEIGHT);
    if (elapsed < BOOT_LOGO_MS) {
        drawPoweredByLogo(elapsed);
        drawBootProgressBar(g_progress.getPercentLoaded());
    } else {
        drawNakamonCoverAndProgress();
    }
    textCtx.restore();
    invalidateComposite();
    requestAnimationFrame(bootLoaderFrame);
}

async function loadXmlAsync(xmlUrl) {
    const res = await fetch(xmlUrl);
    if (!res.ok) throw new Error(`Failed to load ${xmlUrl}: HTTP ${res.status}`);
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "application/xml");
    if (doc.querySelector("parsererror")) throw new Error(`Invalid XML: ${xmlUrl}`);
    return doc;
}

function loadImages() {
    for (const imgRef in g_imageData.images) {
        const ref = g_imageData.images[imgRef];
        const url = ref.url;
        const img = new Image();
        ref.img = img;
        g_progress.addResource(url, img);
        img.onload = () => {
            g_progress.setLoaded(url);
            if (ref.load) ref.load();
        };
        img.src = url;
    }
}

function applyLoadedMap(mapData, mapId, tileset, mapXml) {
    let map = null;
    if (mapId === 0) {
        g_worldmap = new WorldMap(mapXml, tileset, mapData.music);
        map = g_worldmap.getSubMap(0);
    } else {
        map = new SubMap(mapXml, tileset, mapData.overWorld, mapData.music);
        g_worldmap.addSubMap(mapId, map);
    }
    if (mapData.load) mapData.load();

    const defaultZone = mapData.zone;
    if (mapData.randomEncounters) {
        for (let x = 0; x < map.getXLimit(); x++) {
            for (let y = 0; y < map.getYLimit(); y++) {
                const square = map.getSquareAt(x, y);
                if (square.passable()) {
                    square.onEnter = function () {
                        if (Math.random() < BATTLE_FREQ) {
                            keyBuffer = 0;
                            g_battle = new Battle();
                            let zone = this.getZone();
                            if (!zone) zone = defaultZone;
                            g_battle.setupRandomEncounter(zone, mapData.background, mapData.battleMusic);
                            g_battle.draw();
                        }
                    };
                }
            }
        }
    }

    const submap = g_worldmap.getSubMap(mapId);
    if (mapData.entrances) {
        for (let j = 0; j < mapData.entrances.length; j++) {
            const entrance = mapData.entrances[j];
            const square = submap.getSquareAt(entrance.fromX, entrance.fromY);
            square.onEnter = (function (ent) {
                return function () {
                    g_worldmap.goToMap(
                        g_player,
                        ent.toMapId,
                        ent.toX,
                        ent.toY,
                        ent.toScrollX,
                        ent.toScrollY,
                        ent.facing
                    );
                    if (ent.onEnter) ent.onEnter();
                };
            })(entrance);
        }
    }

    if (mapData.exit) {
        const doExit = () => {
            g_worldmap.goToMap(
                g_player,
                mapData.exit.toMapId,
                mapData.exit.toX,
                mapData.exit.toY,
                mapData.exit.toScrollX,
                mapData.exit.toScrollY,
                mapData.exit.facing
            );
        };

        const xLimit = map.getXLimit();
        const yLimit = map.getYLimit();
        if (mapData.exit.at === "edges") {
            for (let x = 0; x < xLimit; x++) {
                for (let y = 0; y < yLimit; y++) {
                    if (x === 0 || y === 0 || x === xLimit - 1 || y === yLimit - 1) {
                        submap.getSquareAt(x, y).onEnter = doExit;
                    }
                }
            }
        } else if (mapData.exit.at === "bottom") {
            const yb = yLimit - 1;
            for (let xb = 0; xb < xLimit; xb++) submap.getSquareAt(xb, yb).onEnter = doExit;
        } else if (mapData.exit.at === "top") {
            for (let xt = 0; xt < xLimit; xt++) submap.getSquareAt(xt, 0).onEnter = doExit;
        } else if (mapData.exit.at === "left") {
            for (let yl = 0; yl < yLimit; yl++) submap.getSquareAt(0, yl).onEnter = doExit;
        } else if (mapData.exit.at === "right") {
            const xr = xLimit - 1;
            for (let yr = 0; yr < yLimit; yr++) submap.getSquareAt(xr, yr).onEnter = doExit;
        }
    }

    if (mapData.npcs) {
        for (let n = 0; n < mapData.npcs.length; n++) {
            const npcData = mapData.npcs[n];
            const npc = new Character(
                npcData.locX,
                npcData.locY,
                npcData.imgRef,
                mapId,
                npcData.facing,
                npcData.walks,
                npcData.zone
            );
            npc.action = (function (data, mid) {
                return function () {
                    this.facePlayer();
                    if (data.script && typeof ScriptEngine !== "undefined") {
                        Promise.resolve(
                            ScriptEngine.run(data.script, { mapId: mid, npc: this, npcData: data })
                        ).catch(function () {});
                        return;
                    }
                    if (data.callback) g_textDisplay.setCallback(data.callback);
                    if (typeof data.displayText === "function") g_textDisplay.displayText(data.displayText());
                    else if (data.displayText !== undefined) g_textDisplay.displayText(data.displayText);
                };
            })(npcData, mapId);
            map.addSprite(npc);
            npcData.npc = npc;
        }
    }

    if (mapData.actions) {
        for (let a = 0; a < mapData.actions.length; a++) {
            const actionData = mapData.actions[a];
            const sq = submap.getSquareAt(actionData.locX, actionData.locY);
            sq.onAction = (function (data, mid) {
                return function () {
                    if (data.dir && data.dir !== g_player.getDir()) return;
                    if (data.script && typeof ScriptEngine !== "undefined") {
                        Promise.resolve(ScriptEngine.run(data.script, { mapId: mid, action: data })).catch(
                            function () {}
                        );
                        return;
                    }
                    if (data.onAction) data.onAction();
                };
            })(actionData, mapId);
        }
    }

    if (mapData.chests) {
        for (let c = 0; c < mapData.chests.length; c++) {
            const chestData = mapData.chests[c];
            const chest = new Chest(chestData.locX, chestData.locY, chestData.imgRef, mapId, chestData.event);
            chest.action = chestData.action;
            map.addSprite(chest);
        }
    }
}

async function loadMapsAsync() {
    const mapKeys = Object.keys(g_mapData.submaps)
        .map(Number)
        .sort(function (a, b) {
            return a - b;
        });
    try {
        for (let k = 0; k < mapKeys.length; k++) {
            g_progress.addResource(g_mapData.submaps[mapKeys[k]].xmlUrl);
        }
        for (let k = 0; k < mapKeys.length; k++) {
            const mapData = g_mapData.submaps[mapKeys[k]];
            const mapId = mapData.id;
            const tileset = new Tileset(mapData.tileset.width, mapData.tileset.height, mapData.tileset.imgRef);
            const xmlUrl = mapData.xmlUrl;
            const mapXml = await loadXmlAsync(xmlUrl);
            g_progress.setLoaded(xmlUrl);
            applyLoadedMap(mapData, mapId, tileset, mapXml);
        }
        g_progress.finishSetup();
    } catch (err) {
        console.error(err);
        g_bootLoaderFatal = true;
        g_bootLoaderErrorText = String(err && err.message ? err.message : err);
        g_progress.onFail();
    }
}

function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
}

onReady(() => {
    g_progress.onComplete = () => {
        g_bootLoadFinished = true;
    };

    g_progress.onFail = () => {
        g_bootLoaderFatal = true;
        g_bootLoaderErrorText =
            BunnyRPG.t("boot.load_fail_prefix") +
            g_progress.getList().join("\n");
    };

    g_game = new Game("titlescreen");

    loadImages();
    startCompositeLoop();
    requestAnimationFrame(bootLoaderFrame);
    loadMapsAsync();

    if (typeof initVirtualGameControls === "function") initVirtualGameControls();

    if (gameCanvas) gameCanvas.focus();
});

function printText(msg) {
    if (g_battle) g_battle.writeMsg(msg);
    else g_textDisplay.displayText(msg);
}

function setOnNewGame(callback) {
    g_menu.setOnNewGame(callback);
}

const DOWN_ARROW = 40;
const UP_ARROW = 38;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const SPACEBAR = 32;
const ENTER = 13;
const ESC = 27;
let keyBuffer = 0;
let keyDown = false;

const g_dirKeyDown = {};
g_dirKeyDown[UP_ARROW] = false;
g_dirKeyDown[DOWN_ARROW] = false;
g_dirKeyDown[LEFT_ARROW] = false;
g_dirKeyDown[RIGHT_ARROW] = false;
let g_lastDirPressed = 0;
let g_fieldMoveInterval = null;

function anyDirKeyDown() {
    return (
        g_dirKeyDown[UP_ARROW] ||
        g_dirKeyDown[DOWN_ARROW] ||
        g_dirKeyDown[LEFT_ARROW] ||
        g_dirKeyDown[RIGHT_ARROW]
    );
}

function getActiveRepeatDir() {
    if (g_lastDirPressed && g_dirKeyDown[g_lastDirPressed]) {
        return g_lastDirPressed;
    }
    const order = [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW];
    for (let i = 0; i < order.length; i++) {
        if (g_dirKeyDown[order[i]]) {
            return order[i];
        }
    }
    return null;
}

function stopFieldMoveRepeat() {
    if (g_fieldMoveInterval) {
        window.clearInterval(g_fieldMoveInterval);
        g_fieldMoveInterval = null;
    }
}

/** 打开游戏内文本框时调用：停掉方向连发并清按键状态，避免与输入框抢键 */
window.resetGameKeyboardHoldStateForOverlay = function () {
    stopFieldMoveRepeat();
    g_dirKeyDown[UP_ARROW] = false;
    g_dirKeyDown[DOWN_ARROW] = false;
    g_dirKeyDown[LEFT_ARROW] = false;
    g_dirKeyDown[RIGHT_ARROW] = false;
    keyDown = false;
};

function isOsrpgGameTextPromptOpen() {
    return (
        typeof document !== "undefined" &&
        document.body &&
        document.body.classList.contains("osrpg-prompt-open")
    );
}

function fieldMoveRepeatTick() {
    if (!anyDirKeyDown()) {
        stopFieldMoveRepeat();
        return;
    }
    if (!g_progress.isLoadComplete()) return;
    if (
        g_menu.isDisplayed() ||
        g_shop.shopDisplayed() ||
        g_battle ||
        g_titlescreen ||
        g_textDisplay.textDisplayed() ||
        isOsrpgGameTextPromptOpen()
    ) {
        return;
    }
    if (g_worldmap.isAnimating()) return;
    const d = getActiveRepeatDir();
    if (d != null) {
        applyDirectionKey(d, noopEvent());
    }
}

function startFieldMoveRepeat() {
    stopFieldMoveRepeat();
    const pollMs =
        typeof FIELD_MOVE_POLL_MS !== "undefined" ? FIELD_MOVE_POLL_MS : 40;
    g_fieldMoveInterval = window.setInterval(fieldMoveRepeatTick, pollMs);
}

function noopEvent() {
    return { preventDefault: function () {} };
}

function eventToDirectionKey(event) {
    if (event.ctrlKey || event.altKey || event.metaKey) return null;
    const c = event.code;
    if (c === "ArrowUp" || c === "KeyW") return UP_ARROW;
    if (c === "ArrowDown" || c === "KeyS") return DOWN_ARROW;
    if (c === "ArrowLeft" || c === "KeyA") return LEFT_ARROW;
    if (c === "ArrowRight" || c === "KeyD") return RIGHT_ARROW;
    return null;
}

/** NES/GBA-style: J=⭕/A 确认, K=❌/B 仅返回, Esc=取消并可在场上开菜单, H=Start, G=Select */
function eventToAction(event) {
    if (event.ctrlKey || event.altKey || event.metaKey) return null;
    const c = event.code;
    if (c === "KeyJ" || c === "Space" || c === "Enter" || c === "NumpadEnter") return "confirm";
    if (c === "Escape") return "cancel";
    if (c === "KeyK") return "b";
    if (c === "KeyH") return "start";
    if (c === "KeyG") return "select";
    return null;
}

function applyDirectionKey(key, event) {
    const ev = event || noopEvent();
    if (!g_progress.isLoadComplete()) return;
    if (g_worldmap.isAnimating()) {
        keyBuffer = key;
        ev.preventDefault();
        return;
    }
    switch (key) {
        case DOWN_ARROW:
            if (g_menu.isDisplayed()) g_menu.handleKey(key);
            else if (g_shop.shopDisplayed()) g_shop.handleKey(key);
            else if (g_battle) g_battle.handleKey(key);
            else if (!g_titlescreen && !g_textDisplay.textDisplayed() && !g_worldmap.isAnimating())
                g_player.move(0, 1, FACING_DOWN);
            ev.preventDefault();
            break;
        case UP_ARROW:
            if (g_menu.isDisplayed()) g_menu.handleKey(key);
            else if (g_shop.shopDisplayed()) g_shop.handleKey(key);
            else if (g_battle) g_battle.handleKey(key);
            else if (!g_titlescreen && !g_textDisplay.textDisplayed() && !g_worldmap.isAnimating())
                g_player.move(0, -1, FACING_UP);
            ev.preventDefault();
            break;
        case RIGHT_ARROW:
            if (g_menu.isDisplayed()) g_menu.handleKey(key);
            else if (g_shop.shopDisplayed()) g_shop.handleKey(key);
            else if (g_battle) g_battle.handleKey(key);
            else if (!g_titlescreen && !g_textDisplay.textDisplayed() && !g_worldmap.isAnimating())
                g_player.move(1, 0, FACING_RIGHT);
            ev.preventDefault();
            break;
        case LEFT_ARROW:
            if (g_menu.isDisplayed()) g_menu.handleKey(key);
            else if (g_shop.shopDisplayed()) g_shop.handleKey(key);
            else if (g_battle) g_battle.handleKey(key);
            else if (!g_titlescreen && !g_textDisplay.textDisplayed() && !g_worldmap.isAnimating())
                g_player.move(-1, 0, FACING_LEFT);
            ev.preventDefault();
            break;
    }
}

function dispatchConfirm(event) {
    const ev = event || noopEvent();
    if (!g_progress.isLoadComplete()) return;
    if (g_worldmap.isAnimating()) {
        keyBuffer = ENTER;
        ev.preventDefault();
        return;
    }
    if (g_textDisplay.textDisplayed()) g_textDisplay.clearText();
    else if (g_menu.isDisplayed()) g_menu.handleEnter();
    else if (g_shop.shopDisplayed()) g_shop.handleEnter();
    else if (g_battle) g_battle.handleEnter();
    else if (!g_worldmap.isAnimating()) {
        g_worldmap.doAction();
        g_player.getSquareUnderfoot().onAction();
    }
    ev.preventDefault();
}

function dispatchCancel(event) {
    const ev = event || noopEvent();
    if (!g_progress.isLoadComplete()) return;
    if (g_worldmap.isAnimating()) {
        ev.preventDefault();
        return;
    }
    if (g_textDisplay.textDisplayed()) g_textDisplay.clearText();
    else if (g_menu.isDisplayed()) g_menu.handleESC();
    else if (g_shop.shopDisplayed()) g_shop.handleESC();
    else if (g_battle) g_battle.handleESC();
    else g_menu.getCurrentMenu().display();
    ev.preventDefault();
}

function dispatchBButton(event) {
    const ev = event || noopEvent();
    if (!g_progress.isLoadComplete()) return;
    if (g_worldmap.isAnimating()) {
        ev.preventDefault();
        return;
    }
    if (g_textDisplay.textDisplayed()) g_textDisplay.clearText();
    else if (g_menu.isDisplayed()) g_menu.handleESC();
    else if (g_shop.shopDisplayed()) g_shop.handleESC();
    else if (g_battle) g_battle.handleESC();
    ev.preventDefault();
}

function dispatchStart(event) {
    const ev = event || noopEvent();
    if (!g_progress.isLoadComplete()) return;
    if (g_worldmap.isAnimating()) {
        ev.preventDefault();
        return;
    }
    if (g_textDisplay.textDisplayed()) return;
    if (g_battle || g_shop.shopDisplayed()) return;
    if (g_menu.isDisplayed()) g_menu.handleESC();
    else g_menu.getCurrentMenu().display();
    ev.preventDefault();
}

function dispatchSelect(event) {
    const ev = event || noopEvent();
    if (!g_progress.isLoadComplete()) return;
    if (g_worldmap.isAnimating()) return;
    if (g_titlescreen || g_textDisplay.textDisplayed() || g_battle || g_shop.shopDisplayed()) return;
    if (g_menu.isDisplayed()) {
        const cur = g_menu.getCurrentMenu();
        if (cur && cur.getType && cur.getType() === STATUS_MENU) {
            cur.handleESC();
        }
        ev.preventDefault();
        return;
    }
    g_menu.displayStatusMenu(true);
    ev.preventDefault();
}

function handleKeyDown(event) {
    if (isOsrpgGameTextPromptOpen()) return;
    const dir = eventToDirectionKey(event);
    if (dir !== null) {
        keyDown = true;
        g_dirKeyDown[dir] = true;
        g_lastDirPressed = dir;
        const fieldWalkOnly =
            !g_menu.isDisplayed() &&
            !g_shop.shopDisplayed() &&
            !g_battle &&
            !g_titlescreen &&
            !g_textDisplay.textDisplayed();
        if (event.repeat) {
            event.preventDefault();
            if (fieldWalkOnly) return;
            applyDirectionKey(dir, event);
            return;
        }
        applyDirectionKey(dir, event);
        if (fieldWalkOnly) {
            startFieldMoveRepeat();
        }
        return;
    }
    if (event.repeat) return;
    const action = eventToAction(event);
    if (action) {
        keyDown = true;
        switch (action) {
            case "confirm":
                dispatchConfirm(event);
                break;
            case "cancel":
                dispatchCancel(event);
                break;
            case "b":
                dispatchBButton(event);
                break;
            case "start":
                dispatchStart(event);
                break;
            case "select":
                dispatchSelect(event);
                break;
        }
    }
}

function handleKeyUp(event) {
    if (isOsrpgGameTextPromptOpen()) return;
    const dir = eventToDirectionKey(event);
    if (dir !== null) {
        g_dirKeyDown[dir] = false;
        if (!anyDirKeyDown()) {
            stopFieldMoveRepeat();
        } else {
            g_lastDirPressed = getActiveRepeatDir() || 0;
        }
    }
    keyDown = false;
    if (g_battle) g_battle.handleKeyUp();
}

function handleBufferedKey() {
    if (keyBuffer && !g_battle && !g_worldmap.isAnimating()) {
        const key = keyBuffer;
        keyBuffer = 0;
        switch (key) {
            case DOWN_ARROW:
                g_player.move(0, 1, FACING_DOWN);
                break;
            case UP_ARROW:
                g_player.move(0, -1, FACING_UP);
                break;
            case RIGHT_ARROW:
                g_player.move(1, 0, FACING_RIGHT);
                break;
            case LEFT_ARROW:
                g_player.move(-1, 0, FACING_LEFT);
                break;
            case SPACEBAR:
            case ENTER:
                if (g_textDisplay.textDisplayed()) g_textDisplay.clearText();
                else g_worldmap.doAction();
                break;
        }
    }
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

window.addEventListener("dblclick", function (event) {
    g_fullscreen = !g_fullscreen;
    resize();
    event.preventDefault();
});

window.addEventListener("resize", function () {
    if (g_fullscreen) resize();
});

function resize() {
    if (!gameCanvas) return;
    if (g_fullscreen) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const widthRatio = width / mapCanvas.width;
        const heightRatio = height / mapCanvas.height;
        const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
        const top = widthRatio < heightRatio ? (height - mapCanvas.height) / 2 : 0;
        const left = widthRatio < heightRatio ? 0 : (width - mapCanvas.width) / 2;
        gameCanvas.style.position = "fixed";
        gameCanvas.style.left = Math.floor(left) + "px";
        gameCanvas.style.top = Math.floor(top) + "px";
        gameCanvas.style.transform = "scale(" + ratio + ")";
        gameCanvas.style.transformOrigin = "top left";
        gameCanvas.style.zIndex = "1";
    } else {
        gameCanvas.style.position = "";
        gameCanvas.style.left = "";
        gameCanvas.style.top = "";
        gameCanvas.style.transform = "";
        gameCanvas.style.transformOrigin = "";
        gameCanvas.style.zIndex = "";
    }
    invalidateComposite();
}

