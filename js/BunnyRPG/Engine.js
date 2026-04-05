/**
 * BunnyRPG engine — edit this file directly; index.html loads js/game-constants.js then this script.
 */

// ---------- DisplayHost.js ----------

/**
 * BunnyRPG display host: layered canvases, compositing, shared draw helpers.
 */
const g_audio = {};

function initAudio() {
    const ids = ["theme", "explore", "town", "castle", "dark", "danger"];
    for (const id of ids) {
        const a = new Audio();
        a.loop = true;
        a.preload = "auto";
        const ogg = "audio/" + id + ".ogg";
        const mp3 = "audio/" + id + ".mp3";
        a.src = a.canPlayType && a.canPlayType("audio/ogg") ? ogg : mp3;
        g_audio[id] = a;
    }
}

function createLayerCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
}

initAudio();

const mapCanvas = createLayerCanvas(GAME_VIEW_WIDTH, GAME_VIEW_HEIGHT);
const mapCtx = mapCanvas.getContext("2d");
const spriteCanvas = createLayerCanvas(GAME_VIEW_WIDTH, GAME_VIEW_HEIGHT);
const spriteCtx = spriteCanvas.getContext("2d");
const menuCanvas = createLayerCanvas(GAME_VIEW_WIDTH, GAME_VIEW_HEIGHT);
const menuCtx = menuCanvas.getContext("2d");
const textCanvas = createLayerCanvas(GAME_VIEW_WIDTH, GAME_VIEW_HEIGHT);
const textCtx = textCanvas.getContext("2d");

const gameCanvas = document.getElementById("gameCanvas");
const mainCtx = gameCanvas && gameCanvas.getContext("2d");

function configurePixelArtCtx(ctx) {
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    if (ctx.imageSmoothingQuality !== undefined) {
        ctx.imageSmoothingQuality = "low";
    }
    /* Vendor aliases — avoids blurry upscaled sprites when the browser defaults smoothing on. */
    if (ctx.webkitImageSmoothingEnabled !== undefined) {
        ctx.webkitImageSmoothingEnabled = false;
    }
    if (ctx.mozImageSmoothingEnabled !== undefined) {
        ctx.mozImageSmoothingEnabled = false;
    }
}

configurePixelArtCtx(mapCtx);
configurePixelArtCtx(spriteCtx);
configurePixelArtCtx(menuCtx);
configurePixelArtCtx(textCtx);
configurePixelArtCtx(mainCtx);

/** Merge offscreen layers onto the main canvas (map → sprites → menu → text). */
function compositeLayersImpl() {
    if (!mainCtx || !gameCanvas) return;
    mainCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    mainCtx.drawImage(mapCanvas, 0, 0);
    mainCtx.drawImage(spriteCanvas, 0, 0);
    mainCtx.drawImage(menuCanvas, 0, 0);
    mainCtx.drawImage(textCanvas, 0, 0);
}

function compositeLayers() {
    if (!mainCtx || !gameCanvas) return;
    compositeLayersImpl();
    if (typeof window.drawVirtualGameControls === "function") {
        window.drawVirtualGameControls(mainCtx);
    }
}

/** Full composite every frame avoids stale pixels when partial clears miss a region. */
function startCompositeLoop() {
    function tick() {
        compositeLayers();
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

window.invalidateComposite = function () {};

/** Engine UI string: BunnyRPG.t(key). */
function Ei(key) {
    if (typeof window.BunnyRPG !== "undefined" && BunnyRPG.t && key) {
        try {
            return BunnyRPG.t(key);
        } catch (e1) {}
    }
    return key ? String(key) : "";
}

function shopQtyCostLine(qty, cost) {
    return BunnyRPG.t("shop.qty_cost_line", { qty: qty, cost: cost });
}

function battleMonsterDisplayName(raw) {
    return typeof translateMonsterName === "function" ? translateMonsterName(String(raw)) : String(raw);
}

/** Clears a rectangle with a small bleed for stroke/anti-alias (no canvas shadow — shadow caused menu “ghosts”). */
function clearLayerRegion(ctx, x, y, w, h, pad) {
    const bleed = pad == null ? 2 : pad;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    const nx = Math.max(0, x - bleed);
    const ny = Math.max(0, y - bleed);
    const nw = Math.min(cw - nx, w + 2 * bleed);
    const nh = Math.min(ch - ny, h + 2 * bleed);
    ctx.clearRect(nx, ny, nw, nh);
}

/** Right-pointing triangle; textTopY matches fillText(..., y) with textBaseline "top". */
function drawMenuPointerArrow(ctx, x, textTopY) {
    var cy = textTopY + 8;
    ctx.save();
    ctx.fillStyle = "rgba(241, 245, 249, 0.98)";
    ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, cy - 5);
    ctx.lineTo(x + 10, cy);
    ctx.lineTo(x, cy + 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function clearMenuPointerArrow(ctx, x, textTopY) {
    clearLayerRegion(ctx, x - 1, textTopY + 1, MENU_ARROW_CLEAR_W, MENU_ARROW_CLEAR_H, 2);
}

function drawBox(ctx, x, y, width, height, radius, lineWidth) {
    const inset = Math.max(1, Math.min(lineWidth, 5));
    const left = x + inset;
    const top = y + inset;
    const right = x + width - inset;
    const bottom = y + height - inset;
    const rad = Math.min(radius, (right - left) / 2, (bottom - top) / 2);

    ctx.beginPath();
    ctx.moveTo(left + rad, top);
    ctx.lineTo(right - rad, top);
    ctx.quadraticCurveTo(right, top, right, top + rad);
    ctx.lineTo(right, bottom - rad);
    ctx.quadraticCurveTo(right, bottom, right - rad, bottom);
    ctx.lineTo(left + rad, bottom);
    ctx.quadraticCurveTo(left, bottom, left, bottom - rad);
    ctx.lineTo(left, top + rad);
    ctx.quadraticCurveTo(left, top, left + rad, top);
    ctx.closePath();

    ctx.fillStyle = "rgba(32, 36, 54, 0.94)";
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const glossH = Math.min(56, (bottom - top) * 0.28);
    const gloss = ctx.createLinearGradient(left, top, left, top + glossH);
    gloss.addColorStop(0, "rgba(255, 255, 255, 0.09)");
    gloss.addColorStop(0.55, "rgba(255, 255, 255, 0.02)");
    gloss.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(left + rad, top);
    ctx.lineTo(right - rad, top);
    ctx.quadraticCurveTo(right, top, right, top + rad);
    ctx.lineTo(right, bottom - rad);
    ctx.quadraticCurveTo(right, bottom, right - rad, bottom);
    ctx.lineTo(left + rad, bottom);
    ctx.quadraticCurveTo(left, bottom, left, bottom - rad);
    ctx.lineTo(left, top + rad);
    ctx.quadraticCurveTo(left, top, left + rad, top);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = gloss;
    ctx.fillRect(left, top, right - left, glossH);
    ctx.restore();
}

window.BunnyRPG = window.BunnyRPG || {};
window.BunnyRPG.version = "0.2.0";
window.BunnyRPG.display = {
    GAME_VIEW_WIDTH,
    GAME_VIEW_HEIGHT,
    mapCanvas,
    spriteCanvas,
    menuCanvas,
    textCanvas,
    gameCanvas,
    compositeLayers,
    startCompositeLoop
};

// ---------- Animation.js ----------

class Animation {
    constructor() {
        this._lastFrameTime = Date.now();
        this._dirtyRects = [];
    }

    getDelay() {
        var currentTime = Date.now();
        var elapsedTime = currentTime - this._lastFrameTime;
        var delay = 1000 / FPS - elapsedTime;
        if (delay < 1) delay = 1;
        return delay;
    }

    update() {
        this._lastFrameTime = Date.now();
    }

    addDirtyRect(x, y, w, h) {
        this._dirtyRects.push({ x: x, y: y, w: w, h: h });
    }

    clearDirtyRects() {
        for (var i = 0; i < this._dirtyRects.length; ++i) {
            var rect = this._dirtyRects[i];
            spriteCtx.clearRect(rect.x, rect.y, rect.w, rect.h);
        }
        this._dirtyRects = [];
    }
}

// ---------- Progress.js ----------

const LOAD_TIMEOUT = 10000;

class Resource {
    constructor(url, res) {
        this._url = url;
        this._res = res;
        this._loaded = false;
    }

    isLoaded() {
        return this._loaded;
    }

    setLoaded() {
        this._loaded = true;
    }
}

class Progress {
    constructor() {
        this._resources = {};
        this._count = 0;
        this._loaded = 0;
        this._setupFinished = false;
        const progress = this;
        this._failTimeout = window.setTimeout(function () {
            progress.onFail();
        }, LOAD_TIMEOUT);
    }

    addResource(url, res) {
        this._resources[url] = new Resource(url, res);
        this._count++;
    }

    finishSetup() {
        this._setupFinished = true;
        if (this.isLoadComplete()) {
            window.clearTimeout(this._failTimeout);
            this.onComplete();
        }
    }

    setLoaded(url) {
        this._resources[url].setLoaded();
        this._loaded++;
        if (this.isLoadComplete()) {
            window.clearTimeout(this._failTimeout);
            this.onComplete();
        }
    }

    isLoadComplete() {
        return this._setupFinished && this._count === this._loaded;
    }

    getPercentLoaded() {
        if (!this._count) return 0;
        return this._loaded / this._count;
    }

    getList() {
        const list = [];
        for (const res of Object.keys(this._resources)) {
            if (!this._resources[res].isLoaded()) list.push(res);
        }
        return list;
    }

    onComplete() {}

    onFail() {}
}

// ---------- MapSquare.js ----------

class MapSquare {
    constructor(subMap, x, y, passable, zone) {
        this._subMap = subMap;
        this._x = x;
        this._y = y;
        this._passable = passable;
        this._zone = zone;
    }

    getX() {
        return this._x;
    }

    getY() {
        return this._y;
    }

    passable() {
        return this._passable;
    }

    getZone() {
        return this._zone;
    }

    onEnter(player) {}

    onAction(player) {}
}

// ---------- SubMap.js ----------

function subMapTileGid(tiles, idx) {
    if (!tiles || idx < 0 || idx >= tiles.length) return 0;
    var g = tiles[idx].getAttribute("gid");
    return g ? parseInt(g, 10) : 0;
}

class SubMap {
    constructor(mapXml, tileset, overworld, music) {
        var mapRoot = mapXml.documentElement;
        var layers = mapRoot.getElementsByTagName("layer");
        this._layer = layers[0];
        this._xLimit = parseInt(this._layer.getAttribute("width"), 10);
        this._yLimit = parseInt(this._layer.getAttribute("height"), 10);
        this._mapXml = mapXml;
        this._tileset = tileset;
        this._overworld = overworld;
        this._spriteList = [];
        this._mapSquares = [];
        this._animation = new Animation();
        this._music = music;

        var waterLayer = mapRoot.querySelector('layer[name="Water"]');
        var waterTiles = waterLayer ? waterLayer.getElementsByTagName("tile") : null;
        var impassLayer = mapRoot.querySelector('layer[name="Impassable"]');
        var impassableTiles = impassLayer ? impassLayer.getElementsByTagName("tile") : [];
        var zoneLayerEl = mapRoot.querySelector('layer[name="Zones"]');
        var zoneTiles = zoneLayerEl ? zoneLayerEl.getElementsByTagName("tile") : [];
        for (var y = 0; y < this._yLimit; y++) {
            var mapSquareRow = [];
            for (var x = 0; x < this._xLimit; x++) {
                var idx = y * this._xLimit + x;

                var passable = true;
                if (waterTiles != null) passable = passable && subMapTileGid(waterTiles, idx) === 0;
                passable = passable && subMapTileGid(impassableTiles, idx) === 0;

                var zone = 0;
                if (zoneTiles.length > 0) {
                    zone = subMapTileGid(zoneTiles, idx);
                    if (zone > 0) zone -= 288;
                }

                var square = new MapSquare(this, x, y, passable, zone);
                mapSquareRow.push(square);
            }
            this._mapSquares.push(mapSquareRow);
        }

        this._renderLayerGids = [];
        var layerElsPrep = mapRoot.getElementsByTagName("layer");
        var nTileCells = this._xLimit * this._yLimit;
        for (var lip = 0; lip < layerElsPrep.length; lip++) {
            var layerElPrep = layerElsPrep[lip];
            if (layerElPrep.getAttribute("visible") === "0") {
                this._renderLayerGids.push(null);
                continue;
            }
            var domTiles = layerElPrep.getElementsByTagName("tile");
            var domTileCount = domTiles.length;
            var arr = new Uint32Array(nTileCells);
            for (var t = 0; t < nTileCells; t++) {
                if (t < domTileCount) {
                    var g = domTiles[t].getAttribute("gid");
                    arr[t] = g ? parseInt(g, 10) : 0;
                }
            }
            this._renderLayerGids.push(arr);
        }
    }

    getXLimit() {
        return this._xLimit;
    }

    getYLimit() {
        return this._yLimit;
    }

    getTileset() {
        return this._tileset;
    }

    isOverWorld() {
        return this._overworld;
    }

    /* True if the point x, y (in world coordinates) is within the bounds
     * of the submap. */
    pointInBounds(x, y) {
        if (x < 0 || x >= this._xLimit) {
            return false;
        }
        if (y < 0 || y >= this._yLimit) {
            return false;
        }

        return true;
    }

    /* True if the square at position x, y (in world coordinates) is within
     * the bounds of the submap. */
    isPassable(x, y) {
        return this._mapSquares[y][x].passable();
    }

    /* True if the square at position x, y (in world coordinates) is occupied
     * by another character */
    isOccupied(x, y) {
        var occupied = false;
        for (var i = 0; i < this._spriteList.length; ++i) {
            var sprite = this._spriteList[i];
            if (sprite.isAt(x, y))
                occupied = true;
            if (sprite instanceof Character && sprite.prevAt(x, y))
                occupied = true;
        }
        return occupied;
    }

    /* Returns the MapSquare instance at position x, y (in world
     * coordinates). */
    getSquareAt(x, y) {
        if (!this.pointInBounds(x, y)) {
            return null;
        }
        return this._mapSquares[y][x];
    }

    /* Add a sprite to the submap. */
    addSprite(sprite) {
        this._spriteList.push(sprite);
        return this._spriteList.length - 1;
    }

    /* Remove a sprite from the submap */
    removeSprite(sprite) {
        var index;
        for (var i = 0; i < this._spriteList.length; ++i) {
            if (this._spriteList[i] == sprite)
                index = i;
        }
        this._spriteList.splice(index, 1);
    }

    /* True if the submap contains the sprite */
    hasSprite(sprite) {
        for (var i = 0; i < this._spriteList.length; ++i) {
            if (this._spriteList[i] == sprite)
                return true;
        }
        return false;
    }

    /* Determines if any sprites are located at (x,y) on this submap */
    getSpriteAt(x, y) {
        for (var i = 0; i < this._spriteList.length; ++i) {
            var sprite = this._spriteList[i];
            if (sprite.isAt(x, y))
                return sprite;
        }
        return null;
    }

    onEnter() {
        // What happens when map is entered?
    }

    onExit() {
        // What happens when map is exited?
    }

    /* Draws all the sprites on the map */
    drawSprites() {
        for (var i = 0; i < this._spriteList.length; ++i) {
            var sprite = this._spriteList[i];
            sprite.plot();
            if (sprite instanceof Character && sprite.doesWalk())
                sprite.startWalking();
        }
    }

    /* Clear all the sprites on the map */
    clearSprites() {
        for (var i = 0; i < this._spriteList.length; ++i) {
            var sprite = this._spriteList[i];
            sprite.clear();
            if (sprite instanceof Character && sprite.doesWalk())
                sprite.stopWalking();
        }
    }

    /* Run when action key is hit. Looks at square where player sprite is
     * facing and performs an action based on the square */
    doAction() {
        var coords = g_player.getFacingCoords();
        var x = coords[0];
        var y = coords[1];
        var sprite = this.getSpriteAt(x, y);
        if (sprite != null) {
            sprite.action();
        }
    }

    playMusic() {
        if (this._music && g_audio[this._music]) {
            g_audio[this._music].play().catch(function () {});
        }
    }

    pauseMusic() {
        if (this._music && g_audio[this._music]) {
            g_audio[this._music].pause();
        }
    }

    /* This function renders the current view of the map into this
     * canvas. */
    redraw(scrollX, scrollY, offsetX, offsetY) {
        
        var xLimit = this._xLimit;
        var tileset = this._tileset;
        
        // Which tiles do we need on the screen, based on the offset?
        var startX = (offsetX > 0) ? -1 : 0;
        var startY = (offsetY > 0) ? -1 : 0;
        var endX = (offsetX < 0) ? TILES_ON_SCREEN_X + 1 : TILES_ON_SCREEN_X;
        var endY = (offsetY < 0) ? TILES_ON_SCREEN_Y + 1 : TILES_ON_SCREEN_Y;
        
        var layersG = this._renderLayerGids;
        if (layersG && layersG.length > 0) {
            for (var li = 0; li < layersG.length; li++) {
                var gids = layersG[li];
                if (!gids) continue;
                for (var y = startY; y < endY; ++y) {
                    for (var x = startX; x < endX; ++x) {
                        var idx = (y + scrollY) * xLimit + x + scrollX;
                        var gid = idx >= 0 && idx < gids.length ? gids[idx] : 0;
                        if (gid > 0) tileset.drawClip(gid, x, y, offsetX, offsetY);
                    }
                }
            }
        } else {
            var mapRoot = this._mapXml.documentElement;
            var layerEls = mapRoot.getElementsByTagName("layer");
            for (var li2 = 0; li2 < layerEls.length; li2++) {
                var layerEl = layerEls[li2];
                if (layerEl.getAttribute("visible") === "0") continue;
                var tiles = layerEl.getElementsByTagName("tile");
                for (var y2 = startY; y2 < endY; ++y2) {
                    for (var x2 = startX; x2 < endX; ++x2) {
                        var idx2 = (y2 + scrollY) * xLimit + x2 + scrollX;
                        var gid2 = subMapTileGid(tiles, idx2);
                        if (gid2 > 0) tileset.drawClip(gid2, x2, y2, offsetX, offsetY);
                    }
                }
            }
        }
    }

    /* This function does the scrolling animation */
    animate(fromX, fromY, toX, toY) {
        var deltaX = toX - fromX;
        var deltaY = toY - fromY;
        g_worldmap.startAnimating();
        g_worldmap.startScrolling();
        this._prevOffsetX = deltaX * TILE_WIDTH;
        this._prevOffsetY = deltaY * TILE_HEIGHT;
        var numSteps = ((deltaY != 0) ? TILE_HEIGHT: TILE_WIDTH ) / SCROLL_FACTOR;
        var submap = this;
        submap.animateSub(fromX, fromY, 0, 0, deltaX, deltaY, numSteps);
    }

    // Recursive part of Submap.animate, the scrolling animation.
    animateSub(fromX, fromY, offsetX, offsetY, deltaX, deltaY, numSteps) {
        this._animation.update();
        
        // Don't redraw sprites the last time, or the plot will not be cleared.
        if (numSteps > 0) {
        
            for (var i = 0; i < this._spriteList.length; ++i) {
                var sprite = this._spriteList[i];
                if (sprite instanceof Character && (sprite.isWalking() || sprite.wasWalking())) {
                    sprite.clear(offsetX + deltaX * TILE_WIDTH + sprite._lastOffsetX,
                                 offsetY + deltaY * TILE_HEIGHT + sprite._lastOffsetY);
                    sprite.clear(offsetX + deltaX * TILE_WIDTH + sprite._destOffsetX,
                                 offsetY + deltaY * TILE_HEIGHT + sprite._destOffsetY);
                    sprite.clear(offsetX + deltaX * TILE_WIDTH, offsetY + deltaY * TILE_HEIGHT);
                    if (!sprite.isWalking())
                        sprite._wasWalking = false;
                } else {
                    // this._x and this._y already changed, so offset by a tile size
                    sprite.clear(offsetX + deltaX * TILE_WIDTH,
                                 offsetY + deltaY * TILE_HEIGHT);
                }
            }
        
            this._prevOffsetX = offsetX + deltaX * TILE_WIDTH;
            this._prevOffsetY = offsetY + deltaY * TILE_HEIGHT;
            // offset map in opposite direction of scroll
            offsetX -= deltaX * SCROLL_FACTOR;
            offsetY -= deltaY * SCROLL_FACTOR;
            
            for (var i = 0; i < this._spriteList.length; ++i) {
                var sprite = this._spriteList[i];
                if (sprite instanceof Character && sprite.isWalking()) {
                    sprite.plot(sprite._sourceOffsetX, 0,
                        offsetX + deltaX * TILE_WIDTH + sprite._destOffsetX,
                        offsetY + deltaY * TILE_HEIGHT + sprite._destOffsetY);
                    sprite._wasWalking = true;
                } else {
                    sprite.plot(0, 0, offsetX + deltaX * TILE_WIDTH,
                                      offsetY + deltaY * TILE_HEIGHT);
                }
            }
            
            // Save last offsets for later
            this._lastOffsetX = offsetX + deltaX * TILE_WIDTH;
            this._lastOffsetY = offsetY + deltaY * TILE_HEIGHT;
        } else {
            for (var j = 0; j < this._spriteList.length; ++j) {
                var spr = this._spriteList[j];
                if (spr instanceof Character && (spr.isWalking() || spr.wasWalking())) {
                    spr.clear(spr._lastOffsetX, spr._lastOffsetY);
                    spr.clear(spr._destOffsetX, spr._destOffsetY);
                    spr.plot(0, 0, spr._destOffsetX, spr._destOffsetY);
                }
            }
        }
        
        // Redraw submap *after* redrawing sprites to avoid shift illusion
        this.redraw(fromX, fromY, offsetX, offsetY);
        
        if (numSteps > 0) {
            var submap = this;
            window.setTimeout(function() {
                submap.animateSub(fromX, fromY, offsetX, offsetY, deltaX, deltaY, --numSteps);
            }, this._animation.getDelay());
        }
        else {
            g_worldmap.finishAnimating();
            g_worldmap.finishScrolling();
            this._lastOffsetX = undefined;
            this._lastOffsetY = undefined;
            handleBufferedKey();
        }
    }
}

// ---------- WorldMap.js ----------

/* Main map manager class.  This class is a container for any number
 * of sub-maps; it's assumed that the default map is an 'overworld' or
 * main world map; it's initialized by the mapXml and tileset that
 * you pass in.  You can also call addSubMap to add additional sub-maps.*/
class WorldMap {
    /** @param {boolean} [overworld] If true, sprites draw squashed to tile (legacy “world map” look). Map 0 must match registerGameMap(..., overWorld). */
    constructor(mapXml, tileset, music, overworld) {
        this._subMapList = [];
        this._currentSubMap = 0;
        this._scrollX = 0;
        this._scrollY = 0;

        var isOverWorld = overworld === true;
        var mainMap = new SubMap(mapXml, tileset, isOverWorld, music);
        this._subMapList[0] = mainMap;

        // Are we busy with animations?
        this._animating = false;
        
        // Are we scrolling?
        this._scrolling = false;
        
        // Function to run after animation
        this._runAfterAnimation = null;
    }

    getSubMap(id) {
        return this._subMapList[id];
    }

    getScrollX() {
        return this._scrollX;
    }

    getScrollY() {
        return this._scrollY;
    }

    getCurrentSubMapId() {
        return this._currentSubMap;
    }

    getXLimit() {
        return this._subMapList[this._currentSubMap].getXLimit();
    }

    getYLimit() {
        return this._subMapList[this._currentSubMap].getYLimit();
    }

    isOverWorld() {
        return this._subMapList[this._currentSubMap].isOverWorld();
    }

    // Returns true if the given point (world coordinates) is
    // in-bounds for the active sub-map.
    pointInBounds(x, y) {
        return this._subMapList[this._currentSubMap].pointInBounds(x, y);
    }

    // Returns true if the given point (world coordinates) is passable
    // to the player character.
    isPassable(x, y) {
        return this._subMapList[this._currentSubMap].isPassable(x, y);
    }

    // Returns true if the given point (world coordinates) is occupied
    // by another character.
    isOccupied(x, y) {
        return this._subMapList[this._currentSubMap].isOccupied(x, y);
    }

    getSquareAt(x, y) {
        var square = this._subMapList[this._currentSubMap].getSquareAt(x, y);
        return square;
    }

    // transforms world coords (in squares) to screen coords (in pixels):
    transform( worldX, worldY ) {
        var screenX = TILE_WIDTH * (worldX - this._scrollX);
        var screenY = TILE_HEIGHT * (worldY - this._scrollY);
        return [screenX, screenY];
    }

    // Returns true if the given point is currently on-screen
    isOnScreen( worldX, worldY ) {
        var screenX = worldX - this._scrollX;
        var screenY = worldY - this._scrollY;
        
        // includes one less / one more for benefit of scrolling animation
        return (screenX >= -1 && screenX <= TILES_ON_SCREEN_X + 1
                && screenY >= -1 && screenY <= TILES_ON_SCREEN_Y + 1);
    }

    // Returns true if the given point is near the screen
    isNearScreen( worldX, worldY ) {
        var screenX = worldX - this._scrollX;
        var screenY = worldY - this._scrollY;
        
        // includes two less / two more for benefit of scrolling animation
        return (screenX >= -2 && screenX <= TILES_ON_SCREEN_X + 2
                && screenY >= -2 && screenY <= TILES_ON_SCREEN_Y + 2);
    }

    // Scrolls screen if this is too close to the edge and it's
    // possible to scroll.
    autoScrollToPlayer( x, y ) {
        var scrolled = false;
        var screenX = x - this._scrollX;
        var screenY = y - this._scrollY;
        var scrollVal = 0;
        if (screenX < MIN_SCREEN_SQUARE_X) {
            scrolled = this.scroll( (screenX - MIN_SCREEN_SQUARE_X), 0 ) || scrolled;
        } else if (screenX > MAX_SCREEN_SQUARE_X) {
            scrolled = this.scroll( (screenX - MAX_SCREEN_SQUARE_X), 0 ) || scrolled;
        }
        if (screenY < MIN_SCREEN_SQUARE_Y) {
            scrolled = this.scroll( 0, (screenY - MIN_SCREEN_SQUARE_Y) ) || scrolled;
        } else if (screenY > MAX_SCREEN_SQUARE_Y) {
            scrolled = this.scroll( 0, (screenY - MAX_SCREEN_SQUARE_Y) ) || scrolled;
        }
        return scrolled;
    }

    /* Scrolls the current view of the map horizontally by deltaX squares
     * and vertically by deltaY squares.  Positive number means the view
     * is moving to the right relative to the underlying world map. */
    scroll( deltaX, deltaY ) {
        
        var scrollX = this._scrollX + deltaX;
        var scrollY = this._scrollY + deltaY;
        
        var xLimit = this.getXLimit();
        var yLimit = this.getYLimit();
        
        // Make sure we aren't moving off edge of map
        if (scrollX < 0)
            scrollX = 0;
        if (scrollX + TILES_ON_SCREEN_X > xLimit)
            scrollX = xLimit - TILES_ON_SCREEN_X;
        if (scrollY < 0)
            scrollY = 0;
        if (scrollY + TILES_ON_SCREEN_Y > yLimit)
            scrollY = yLimit - TILES_ON_SCREEN_Y;

        if (scrollX != this._scrollX || scrollY != this._scrollY) {
            var oldScrollX = this._scrollX;
            var oldScrollY = this._scrollY;
            this._scrollX = scrollX;
            this._scrollY = scrollY;
            this.animate(oldScrollX, oldScrollY, scrollX, scrollY);
            return true;
        }
        return false;
    }

    /* This function renders the current view of the map into this
     * canvas. */
    redraw() {
        this._subMapList[this._currentSubMap].redraw(this._scrollX, this._scrollY, 0, 0);
    }

    /* This function does the scrolling animation */
    animate(fromX, fromY, toX, toY) {
        this._subMapList[this._currentSubMap].animate(fromX, fromY, toX, toY);
    }

    /* Adds a new sub-map from the given to the world map list.
     * Uses submap id provided as index. */
    addSubMap(subMapId, subMap) {
        this._subMapList[subMapId] = subMap;
    }

    /* Moves sprite to the submap identified by mapId at point x,y
     * and changes view to match. */
    goToMap(sprite, mapId, x, y, scrollX, scrollY, dir) {
        sprite.clear();
        var oldMap = this._subMapList[this._currentSubMap];
        oldMap.pauseMusic();
        oldMap.onExit();
        oldMap.clearSprites();
        spriteCtx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
        this._currentSubMap = mapId;
        sprite.enterNewSubMap(mapId, x, y, dir);
        this.goTo(scrollX, scrollY);
        var newMap = this._subMapList[mapId];
        newMap.drawSprites();
        newMap.onEnter();
        sprite.plot();
        newMap.playMusic();
        if (typeof GameBusiness !== "undefined" && GameBusiness.onMapEntered) {
            GameBusiness.onMapEntered(mapId);
        }
    }

    // Moves map on screen to provided coordinates
    goTo(scrollX, scrollY) {
        this._scrollX = scrollX;
        this._scrollY = scrollY;
        this.redraw();
    }

    // Run when action key is hit
    doAction() {
        this._subMapList[this._currentSubMap].doAction();
    }

    // Draw all the sprites
    drawSprites() {
        this._subMapList[this._currentSubMap].drawSprites();
    }

    // Clear all the sprites
    clearSprites() {
        this._subMapList[this._currentSubMap].clearSprites();
    }

    isAnimating() {
        return this._animating;
    }

    startAnimating() {
        this._animating = true;
    }

    finishAnimating() {
        this._animating = false;
        if (this._runAfterAnimation) {
            this._runAfterAnimation();
            this._runAfterAnimation = null;
        }
    }

    isScrolling() {
        return this._scrolling;
    }

    startScrolling() {
        this._scrolling = true;
    }

    finishScrolling() {
        this._scrolling = false;
    }

    // Will run callback after animation is complete.
    runAfterAnimation(callback) {
        if (!this._runAfterAnimation)
            this._runAfterAnimation = callback;
    }

    // Create object containing any worldmap data to be saved
    createSaveData() {
        return {
            scrollX: this._scrollX,
            scrollY: this._scrollY
        };
    }

    // Load any data saved using createSaveData
    loadSaveData(worldMapData) {
        this._scrollX = worldMapData.scrollX;
        this._scrollY = worldMapData.scrollY;
    }
}

// ---------- Sprite.js ----------

/* Class representing an object that can move around the map, such
 * as a player character, or have multiple views and events, such as a
 * treasure chest. Sprite objects are drawn superimposed on
 * the map using a separate canvas with z-index=1 and absolute
 * positioning (these CSS styles are defined in rpgdemo.css) */
class Sprite {
    constructor(x, y, width, height, imgRef, subMapId, sx, sy) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._subMap = subMapId;
        this._img = g_imageData.images[imgRef].img;
        this._sx = sx != undefined ? sx : 0;
        this._sy = sy != undefined ? sy : 0;
    }

    getX() {
        return this._x;
    }

    getY() {
        return this._y;
    }

    getSubMap() {
        return this._subMap;
    }

    isAt(x, y) {
        return this._x == x && this._y == y;
    }
    
    /* Draws the sprite onto the map (unless its position is offscreen,
     * or on a different map): */
    plot(sourceOffsetX, sourceOffsetY, destOffsetX, destOffsetY) {
        if (typeof g_battle !== "undefined" && g_battle) {
            return;
        }
        if (g_worldmap.getCurrentSubMapId() != this._subMap) {
            return;
        }
        if (!g_worldmap.isOnScreen(this._x, this._y)) {
            return;
        }

        var sw = this._width;
        var sh = this._height;
        var dsw = this._width;
        var dsh = this._height;

        // If overworld map, clamp sprite height to tile height
        var map = g_worldmap.getSubMap(this._subMap);
        if (map.isOverWorld()) {
            dsw = Math.ceil(TILE_WIDTH * TILE_HEIGHT / SPRITE_HEIGHT);
            dsh = TILE_HEIGHT;
        }

        // get coordinates on screen to draw at
        var screenCoords = g_worldmap.transform(this._x, this._y);
        var dx = screenCoords[0];
        var dy = screenCoords[1];

        // Adjust for difference between tile and sprite sizes
        dx += Math.floor((TILE_WIDTH - dsw) / 2); // center for x
        dy += TILE_HEIGHT - dsh;                  // upward for y

        // apply sourceOffsetX and sourceOffsetY if available
        var sx = this._sx;
        if (sourceOffsetX != undefined)
            sx += sourceOffsetX;
        var sy = this._sy;
        if (sourceOffsetY != undefined)
            sy += sourceOffsetY;

        // apply destOffsetX and destOffsetY if available
        if (destOffsetX != undefined)
            dx += destOffsetX;
        if (destOffsetY != undefined)
            dy += destOffsetY;

        // draw the sprite!
        spriteCtx.drawImage(this._img, sx, sy, sw, sh, dx, dy, dsw, dsh);

        if (!map.isOverWorld()) {
            if (this == g_player) {
            
                // if another sprite below the player, replot it
                var sprite = map.getSpriteAt(this._x, this._y + 1);
                if (sprite != null) {
                    if (g_worldmap.isScrolling()) {
                        if (map._lastOffsetX != undefined) {
                            if (sprite instanceof Character && sprite.isWalking())
                                sprite.plot(0, 0, map._lastOffsetX + sprite._destOffsetX, map._lastOffsetY + sprite._destOffsetY);
                            else
                                sprite.plot(0, 0, map._lastOffsetX, map._lastOffsetY);
                        }
                    } //else if (sprite instanceof Character && sprite.isWalking())
                        //sprite.plot(0, 0, sprite._destOffsetX, sprite._destOffsetY);
                    else
                        sprite.plot();
                }
                
                // if another sprite below the player's previous location, replot it
                var sprite = map.getSpriteAt(this._prevX, this._prevY + 1);
                if (sprite != null) {
                    if (sprite instanceof Character && sprite.isWalking()) {
                        if (g_worldmap.isScrolling()) {
                            if (map._lastOffsetX != undefined)
                                sprite.plot(0, 0, map._lastOffsetX + sprite._destOffsetX, map._lastOffsetY + sprite._destOffsetY);
                            else
                                sprite.plot(0, 0, (this._x - this._prevX) * TILE_WIDTH + sprite._destOffsetX,
                                                  (this._y - this._prevY) * TILE_HEIGHT + sprite._destOffsetY);
                        } //else
                            //sprite.plot(0, 0, sprite._destOffsetX, sprite._destOffsetY);
                    } else {
                        if (g_worldmap.isScrolling()) {
                            if (map._lastOffsetX != undefined)
                                sprite.plot(0, 0, map._lastOffsetX, map._lastOffsetY);
                            else
                                sprite.plot(0, 0, (this._x - this._prevX) * TILE_WIDTH,
                                                  (this._y - this._prevY) * TILE_HEIGHT);
                        } else
                            sprite.plot();
                    }
                }
                    
            } else {

                // if player sprite below current location, replot it.
                if (g_player.isAt(this._x, this._y + 1))
                    g_player.plot();
                
                if (this instanceof Character && this.isWalking())
                    if (g_player.isAt(this._prevX, this._prevY + 1))
                        g_player.plot();
            }
        }
    }

    // clears sprite canvas of this sprite
    clear(destOffsetX, destOffsetY) {
        /* Battle draws HUD + sprites on spriteCtx in screen space; field clear/plot use map coords and would punch holes through battle UI (transparent → grass shows through). */
        if (typeof g_battle !== "undefined" && g_battle) {
            return;
        }
        if (g_worldmap.getCurrentSubMapId() != this._subMap) {
            return;
        }
        if (!g_worldmap.isNearScreen(this._x, this._y)) {
            return;
        }
        
        var screenCoords = g_worldmap.transform(this._x, this._y);
        var dx = screenCoords[0];
        var dy = screenCoords[1];
        var dsw = this._width;
        var dsh = this._height;
        
        // If overworld map, clamp sprite height to tile height
        var map = g_worldmap.getSubMap(this._subMap);
        if (map.isOverWorld()) {
            dsw = Math.ceil(TILE_WIDTH * TILE_HEIGHT / SPRITE_HEIGHT);
            dsh = TILE_HEIGHT;
        }
        
        // Adjust for difference between tile and sprite sizes
        dx += Math.floor((TILE_WIDTH - dsw) / 2); // center for x
        dy += TILE_HEIGHT - dsh;                  // upward for y
            
        // apply destOffsetX and destOffsetY if available
        if (destOffsetX != undefined)
            dx += destOffsetX;
        if (destOffsetY != undefined)
            dy += destOffsetY;
                
        spriteCtx.clearRect(dx, dy, dsw, dsh);
        
        if (!map.isOverWorld()) {
            if (this == g_player) {
                
                // if sprite above current location, replot it.
                var spriteAbove = map.getSpriteAt(this._x, this._y - 1);
                if (spriteAbove != null)
                    if (g_worldmap.isScrolling()) {
                        if (map._lastOffsetX !== undefined) {
                            if (spriteAbove instanceof Character && spriteAbove.isWalking())
                                spriteAbove.plot(0, 0, map._lastOffsetX + spriteAbove._destOffsetX, map._lastOffsetY + spriteAbove._destOffsetY);
                            else
                                spriteAbove.plot(0, 0, map._lastOffsetX, map._lastOffsetY);
                        }
                    } else if (spriteAbove instanceof Character && spriteAbove.isWalking())
                        spriteAbove.plot(0, 0, spriteAbove._destOffsetX, spriteAbove._destOffsetY);
                    else
                        spriteAbove.plot();

                // if sprite above or below previous location, replot it.
                var spriteAbove = map.getSpriteAt(this._prevX, this._prevY - 1);
                if (spriteAbove != null)
                    if (g_worldmap.isScrolling() && map._lastOffsetX !== undefined) {
                        if (spriteAbove instanceof Character && spriteAbove.isWalking())
                            spriteAbove.plot(0, 0, map._lastOffsetX + spriteAbove._destOffsetX, map._lastOffsetY + spriteAbove._destOffsetY);
                        else
                            spriteAbove.plot(0, 0, map._lastOffsetX, map._lastOffsetY);
                    } else if (spriteAbove instanceof Character && spriteAbove.isWalking())
                        spriteAbove.plot(0, 0, spriteAbove._destOffsetX, spriteAbove._destOffsetY);
                    else
                        spriteAbove.plot();
                var spriteBelow = map.getSpriteAt(this._prevX, this._prevY + 1);
                if (spriteBelow != null)
                    if (g_worldmap.isScrolling() && map._lastOffsetX != undefined) {
                        if (spriteBelow instanceof Character && spriteBelow.isWalking())
                            spriteBelow.plot(0, 0, map._lastOffsetX + spriteBelow._destOffsetX, map._lastOffsetY + spriteBelow._destOffsetY);
                        else
                            spriteBelow.plot(0, 0, map._lastOffsetX, map._lastOffsetY);
                    } else if (spriteBelow instanceof Character && spriteBelow.isWalking()) {
                        spriteBelow.plot(0, 0, spriteBelow._destOffsetX, spriteBelow._destOffsetY);
                    } else
                        spriteBelow.plot();
                    
            } else if (this instanceof Character && this.isWalking() && !g_worldmap.isScrolling()) {

                // if player sprite above or below current location, replot it.
                if (g_player.isAt(this._x, this._y - 1))
                    g_player.plot();
                if (g_player.isAt(this._x, this._y + 1))
                    g_player.plot();
                if (g_player.isAt(this._prevX, this._prevY - 1))
                    g_player.plot();
                if (g_player.isAt(this._prevX, this._prevY + 1))
                    g_player.plot();
            
            } else if (!g_worldmap.isScrolling()) {

                // if player sprite above or below current location, replot it.
                if (g_player.isAt(this._x, this._y - 1))
                    g_player.plot();
                if (g_player.isAt(this._x, this._y + 1))
                    g_player.plot();
            }
        }
    }

    action() {
        // What happens when this sprite is acted on?
    }
}

// ---------- Chest.js ----------

/* Class representing a treasure chest */
class Chest extends Sprite {
    constructor(x, y, imgRef, subMapId, flagName) {
        super(x, y, TILE_WIDTH, TILE_HEIGHT, imgRef, subMapId);
        this._flagName = flagName;
        this._open = false;
        
        var chest = this;
        
        // Determine if chest is open when game is loaded
        g_game.addLoadFunction(function() {
            if (g_game.isFlagSet(chest._flagName))
                chest._open = true;
            else
                chest._open = false;
        });
    }

    /* is the treasure chest open? */
    isOpen() {
        return this._open;
    }

    /* Open the treasure chest */
    open() {
        this.clear();
        this._open = true;
        g_game.setFlag(this._flagName);
        this.plot();
    }

    /* Draw the treasure chest */
    plot(sourceOffsetX, sourceOffsetY, destOffsetX, destOffsetY) {
        var newSourceOffsetX = 0;
        if (this._open) newSourceOffsetX = TILE_WIDTH;
        super.plot(newSourceOffsetX, 0, destOffsetX, destOffsetY);
    }
    
    /* called from action method of chests section of g_mapData,
       used to indicate how much gold user will receive upon
       opening the chest */
    onOpenFindGold(amt) {
        if (!this.isOpen()) {
            this.open();
            g_player.earnGold(amt);
            g_textDisplay.displayText(
                BunnyRPG.t("game.chest.gold_found", { amt: amt })
            );
        }
    }

    /* called from action method of chests section of g_mapData,
       used to indicate what item(s) user will receive upon
       opening the chest */
    onOpenFindItem(msg, itemId, amt) {
        if (!this.isOpen()) {
            this.open();
            g_player.addToInventory(itemId, amt);
            g_textDisplay.displayText(msg);
        }
    }

    /* called from action method of chests section of g_mapData,
       used to indicate what spell(s) character will learn upon
       opening the chest */
    onOpenLearnSpell(spellId) {
        if (!this.isOpen()) {
            this.open();
            g_player.learnSpell(spellId);
            var spellName = g_spellData.spells[spellId].name;
            g_textDisplay.displayText(
                BunnyRPG.t("game.chest.learn_spell", { spell: spellName })
            );
        }
    }
}

// ---------- Character.js ----------

// Directions of a character
var FACING_UP = 0;
var FACING_RIGHT = 1;
var FACING_DOWN = 2;
var FACING_LEFT = 3;

/* Class representing either a player character or NPC
 * Characters can either stay still or move about the map. */
class Character extends Sprite {
    constructor(x, y, imgRef, subMapId, dir, walks, zone) {
        super(x, y, SPRITE_WIDTH, SPRITE_HEIGHT, imgRef, subMapId);
        
        this._dir = dir;
        this._walks = walks ? true : false;
        this._zone = zone;

        // Are we currently walking?
        this._walking = false;
        
        // Were we walking? // used to clear last image
        this._wasWalking = false

        // Have we just entered a new area? (Prevent enter chaining.)
        this._entered = false;
    }

    getDir() {
        return this._dir;
    }

    doesWalk() {
        return this._walks;
    }

    isWalking() {
        return this._walking;
    }

    wasWalking() {
        return this._wasWalking;
    }

    // Was char previously at x, y?
    prevAt(x, y) {
        return this._walking && this._prevX == x && this._prevY == y;
    }

    /* Get coordinates the sprite is facing */
    getFacingCoords() {
        var x = this._x;
        var y = this._y
        switch(this._dir) {
            case FACING_UP:
                y--;
                break;
            case FACING_DOWN:
                y++;
                break;
            case FACING_LEFT:
                x--;
                break;
            case FACING_RIGHT:
                x++;
                break;
        }
        return [x, y];
    }

    /* Faces the direction *opposite* the one player is facing */
    facePlayer() {
        switch(g_player.getDir()) {
            case FACING_UP:
                this._dir = FACING_DOWN;
                break;
            case FACING_DOWN:
                this._dir = FACING_UP;
                break;
            case FACING_LEFT:
                this._dir = FACING_RIGHT;
                break;
            case FACING_RIGHT:
                this._dir = FACING_LEFT;
                break;
        }
        this.clear();
        this.plot();
    }

    /* Draws the sprite onto the map (unless its position is offscreen,
     * or on a different map):*/
    plot(sourceOffsetX, sourceOffsetY, destOffsetX, destOffsetY) {

        // Quick fix for race condition
        if (this._walking && destOffsetX === undefined && destOffsetY === undefined)
            return;
        
        // select sprite from sprite image based on direction
        var newSourceOffsetY = SPRITE_HEIGHT * this._dir;
        
        // apply sourceOffsetX if available
        var newSourceOffsetX = SPRITE_WIDTH;
        if (sourceOffsetX != undefined)
            newSourceOffsetX += sourceOffsetX; 
        
        // calls inherited version of plot
        super.plot(newSourceOffsetX, newSourceOffsetY, destOffsetX, destOffsetY);
    }

    /* Sprite will attempt to move by deltaX in the east-west dimension
     * and deltaY in the north-south dimension.  Returns true if success
     * and false if blocked somehow. */
    move(deltaX, deltaY, dir) {
        
        this._dir = dir;
        
        var newX = this._x + deltaX;
        var newY = this._y + deltaY;
        
        // Make sure you're not walking off edge of the world and
        // the square we're trying to enter is passable and not occupied:
        if (!g_worldmap.pointInBounds(newX, newY) ||
                !g_worldmap.isPassable(newX, newY) ||
                g_worldmap.isOccupied(newX, newY) ||
                g_player.isAt(newX, newY) || 
                !this.inZone(newX, newY)) {
            if (!g_worldmap.isAnimating()) {
                this.clear();
                this.plot();
            }
            return false;
        }
            
        this.clear();
        this._prevX = this._x;
        this._prevY = this._y;
        this._x += deltaX;
        this._y += deltaY;

        if (this == g_player) {
            var scrolling = g_worldmap.autoScrollToPlayer(this._x, this._y);
            if (scrolling)
                this.scrollAnimation();
            else
                this.walkAnimation(deltaX, deltaY);
               
            // Any effects of stepping on the new square:
            this._entered = false;
            var sprite = this;
            g_worldmap.runAfterAnimation(function() {
                if (!sprite._entered)
                    sprite.getSquareUnderfoot().onEnter();
                sprite._entered = true;
            });
        } else if (this._walks) {
            this.walkAnimation(deltaX, deltaY);
        }        
        
        return true;
    }

    // Changes the info when the sprite enters a new submap
    enterNewSubMap(subMapId, x, y, dir) {
        this._x = x;
        this._y = y;
        this._dir = dir;
        this._subMap = subMapId;
    }

    // Returns the map square the sprite is standing on.
    getSquareUnderfoot() {
        return g_worldmap.getSquareAt(this._x, this._y);
    }

    startWalking() {
        this.walk();
    }

    stopWalking() {
        window.clearTimeout(this._walkTimeout);
    }

    walk() {
        if (!this.isWalking()) {
            var i, j;
            var dir = Math.floor(Math.random() * 4);
            switch(dir) {
                case FACING_UP:
                    i = 0; j = -1; break;
                case FACING_DOWN:
                    i = 0; j = 1; break;
                case FACING_LEFT:
                    i = -1; j = 0; break;
                case FACING_RIGHT:
                    i = 1; j = 0; break;
            }
            this.move(i, j, dir);
        }
        var sprite = this;
        this._walkTimeout = window.setTimeout(function() {
            sprite.walk();
        }, 1600);
    }

    inZone(newX, newY) {
        if (this._zone !== undefined) {
            return newX >= this._zone.x &&
                newX <= this._zone.x + this._zone.w &&
                newY >= this._zone.y &&
                newY <= this._zone.y + this._zone.h;
        }
        return true;
    }

    /* Show sprite as walking as background scrolls */
    scrollAnimation() {
        if (g_worldmap.isScrolling()) {
            this.scrollAnimationSub(0);
        }
    }

    /* Recursive part of sprite.scrollAnimation */
    scrollAnimationSub(animStage) {
        if (g_worldmap.isScrolling() && !g_battle) {
            
            // Determine source offset in sprite image based on animation stage.
            this.clear();
            var sourceOffsetX = 0;
            if (animStage == 2 || animStage == 3)
                sourceOffsetX = -SPRITE_WIDTH;
            else if (animStage == 6 || animStage == 7)
                sourceOffsetX = SPRITE_WIDTH;
            this.plot(sourceOffsetX);
            
            var sprite = this;
            window.setTimeout(function() {
                sprite.scrollAnimationSub((animStage + 1) % 8);
            }, 1000 / FPS);
        } else if (!g_battle) {
            this.clear();
            this.plot();
        }
    }

    /* Shows the sprite walking from one square to another */
    walkAnimation(deltaX, deltaY) {
        if (this == g_player && g_worldmap.isAnimating()) {
            var sprite = this;
            g_worldmap.runAfterAnimation(function() {
                sprite.walkAnimation(deltaX, deltaY);
            });
        } else if (!g_battle) {
            if (this == g_player)
                g_worldmap.startAnimating();
            this._lastOffsetX = -deltaX * TILE_WIDTH;
            this._lastOffsetY = -deltaY * TILE_HEIGHT;
            this._walking = true;
            var numSteps =  ((deltaY != 0) ? TILE_HEIGHT : TILE_WIDTH) / SCROLL_FACTOR;
            var destOffsetX = -deltaX * TILE_WIDTH;
            var destOffsetY = -deltaY * TILE_HEIGHT;
            this._destOffsetX = destOffsetX;
            this._destOffsetY = destOffsetY;
            var numStages = 32;
            if (this == g_player)
                numStages = 8;
            this.walkAnimationSub(0, deltaX, deltaY, destOffsetX, destOffsetY, numSteps, numStages);
        }
    }

    /* Recursive part of sprite.walkAnimation */
    walkAnimationSub(animStage, deltaX, deltaY, destOffsetX, destOffsetY, numSteps, numStages) {
        if (numSteps > 1 && !g_battle) {
            if (this == g_player || !g_worldmap.isScrolling())
                this.clear(destOffsetX, destOffsetY);
            else {
                var map = g_worldmap.getSubMap(this._subMap);
                this.clear(this._lastOffsetX + map._lastOffsetX, this._lastOffsetY + map._lastOffsetY);
                this.clear(destOffsetX + map._lastOffsetX, destOffsetY + map._lastOffsetY);
            }
            
            // Determine source offset in sprite image based on animation stage.
            var sourceOffsetX = 0;
            if (Math.floor(animStage * 4 / numStages) == 1)
                sourceOffsetX = -SPRITE_WIDTH;
            else if (Math.floor(animStage * 4 / numStages) == 3)
                sourceOffsetX = SPRITE_WIDTH;

            this._sourceOffsetX = sourceOffsetX;
            this._lastOffsetX = destOffsetX;
            this._lastOffsetY = destOffsetY;
            if ((animStage + 1) % (numStages / 8) == 0) {
                destOffsetX += deltaX * SCROLL_FACTOR;
                destOffsetY += deltaY * SCROLL_FACTOR;
                --numSteps;
            }
            this._destOffsetX = destOffsetX;
            this._destOffsetY = destOffsetY;
            if (this == g_player || !g_worldmap.isScrolling())
                this.plot(sourceOffsetX, 0, destOffsetX, destOffsetY);
            else {
                var map = g_worldmap.getSubMap(this._subMap);
                this.plot(sourceOffsetX, 0, destOffsetX + map._lastOffsetX, destOffsetY + map._lastOffsetY);
            }
            var sprite = this;
            window.setTimeout(function() {
                sprite.walkAnimationSub((animStage + 1) % numStages, deltaX, deltaY, destOffsetX, destOffsetY, numSteps, numStages);
            }, 1000 / FPS);
        } else {
            this._walking = false;
            if (!g_battle) {
                if (this == g_player || !g_worldmap.isScrolling()) {
                    this.clear(destOffsetX, destOffsetY); // clear last image drawn
                    this.plot();
                }
            }
            if (this == g_player)
                g_worldmap.finishAnimating();
            if (!g_battle)
                handleBufferedKey();
        }
    }
}

// ---------- Player.js ----------

/* Class representing a main character that can fight in battles. */
class Player extends Character {
    constructor(x, y, imgRef, subMapId, dir, playerId) {
        super(x, y, imgRef, subMapId, dir);
        this._player = g_playerData.players[playerId];
        this.reset();
    }

    reset() {
        this._name = this._player.name;
        this._exp = this._player.exp;
        this._gold = this._player.gold;
        this._level = this._player.level;
        this._maxHP = this._player.maxHP;
        this._maxMP = this._player.maxMP;
        this._hp = this._player.maxHP;
        this._mp = this._player.maxMP;
        this._attack = this._player.attack;
        this._defense = this._player.defense;
        this._levels = this._player.levels;
        this._weapon = this._player.weapon;
        this._armor = this._player.armor;
        this._helmet = this._player.helmet;
        this._shield = this._player.shield;
        this._inventory = {};
        var inv = this._player.inventory || {};
        for (var ik in inv) {
            if (Object.prototype.hasOwnProperty.call(inv, ik)) this._inventory[ik] = inv[ik];
        }
        this._spells = (this._player.spells || []).slice();
    }

    getName() {
        return this._name;
    }

    setName(name) {
        this._name = name;
        if (this._player) this._player.name = name;
    }

    getSpellIdAt(slot) {
        if (slot < 0 || slot >= 4) return null;
        if (slot >= this._spells.length) return null;
        var v = this._spells[slot];
        return v === undefined || v === null ? null : v;
    }

    getExp() {
        return this._exp;
    }

    getNextExp() {
        return this._levels[this._level];
    }

    getGold() {
        return this._gold;
    }

    getMaxHP() {
        return this._maxHP;
    }

    getMaxMP() {
        return this._maxMP;
    }

    getHP() {
        return this._hp;
    }

    getMP() {
        return this._mp;
    }

    getAttack() {
        return this._attack + g_itemData.items[this._weapon].attack;
    }

    getDefense() {
        return (
            this._defense +
            g_itemData.items[this._armor].defense +
            g_itemData.items[this._helmet].defense +
            g_itemData.items[this._shield].defense
        );
    }

    getLevel() {
        return this._level;
    }

    getWeapon() {
        return this._weapon;
    }

    getArmor() {
        return this._armor;
    }

    getHelmet() {
        return this._helmet;
    }

    getShield() {
        return this._shield;
    }

    isDead() {
        return this._hp <= 0;
    }

    damage(dmg) {
        this._hp -= dmg;
    }

    heal(amt) {
        this._hp += amt;
        if (this._hp > this._maxHP) this._hp = this._maxHP;
    }

    useMP(amt) {
        this._mp -= amt;
    }

    gainMP(amt) {
        this._mp += amt;
        if (this._mp > this._maxMP) this._mp = this._maxMP;
    }

    restore() {
        this._hp = this._maxHP;
        this._mp = this._maxMP;
    }

    earnExp(amt) {
        this._exp += amt;
        if (this._level < this._player.max_levels && this._exp >= this.getNextExp()) {
            this._level++;
            this._attack += this._player.attack_increase;
            this._defense += this._player.defense_increase;
            this._maxHP += this._player.maxHP_increase;
            this._maxMP += this._player.maxMP_increase;
            return true;
        }
        return false;
    }

    earnGold(amt) {
        this._gold += amt;
    }

    spendGold(amt) {
        this._gold -= amt;
    }

    equipWeapon(itemId) {
        this._weapon = itemId;
    }

    equipArmor(itemId) {
        this._armor = itemId;
    }

    equipHelmet(itemId) {
        this._helmet = itemId;
    }

    equipShield(itemId) {
        this._shield = itemId;
    }

    addToInventory(item, amt) {
        if (amt == undefined) amt = 1;
        if (this._inventory[item]) this._inventory[item] += amt;
        else this._inventory[item] = amt;
    }

    numInInventory(item) {
        return parseInt(this._inventory[item]);
    }

    removeFromInventory(item, amt) {
        if (amt == undefined) amt = 1;
        this._inventory[item] -= amt;
    }

    forEachItemInInventory(callback) {
        for (var i in this._inventory) callback(i, this._inventory[i]);
    }

    learnSpell(spellId) {
        spellId = parseInt(spellId, 10);
        if (isNaN(spellId)) return;
        for (var i = 0; i < this._spells.length; i++) {
            if (this._spells[i] === spellId) return;
        }
        if (this._spells.length >= 4) return;
        this._spells.push(spellId);
    }

    forEachSpell(callback) {
        for (var j = 0; j < this._spells.length; j++) callback(this._spells[j], j);
    }

    createSaveData() {
        return {
            name: this._name,
            exp: this._exp,
            gold: this._gold,
            level: this._level,
            maxHP: this._maxHP,
            maxMP: this._maxMP,
            hp: this._hp,
            mp: this._mp,
            attack: this._attack,
            defense: this._defense,
            weapon: this._weapon,
            armor: this._armor,
            helmet: this._helmet,
            shield: this._shield,
            inventory: this._inventory,
            spells: this._spells,
            x: this._x,
            y: this._y,
            subMap: this._subMap,
            dir: this._dir
        };
    }

    loadSaveData(playerData) {
        if (playerData.name != null && playerData.name !== "") {
            this._name = playerData.name;
            if (this._player) this._player.name = playerData.name;
        }
        this._exp = playerData.exp;
        this._gold = playerData.gold;
        this._level = playerData.level;
        this._maxHP = playerData.maxHP;
        this._maxMP = playerData.maxMP;
        this._hp = playerData.hp;
        this._mp = playerData.mp;
        this._attack = playerData.attack;
        this._defense = playerData.defense;
        this._weapon = playerData.weapon;
        this._armor = playerData.armor;
        this._helmet = playerData.helmet;
        this._shield = playerData.shield;
        this._inventory = playerData.inventory;
        this._spells = playerData.spells;
        this._x = playerData.x;
        this._y = playerData.y;
        this._subMap = playerData.subMap;
        this._dir = playerData.dir;
    }
}

// ---------- Monster.js ----------

class Monster {
    constructor(monster) {
        this._monster = monster;
        this._maxHP = monster.hp;
        this._hp = monster.hp;
        this._loc = 0;
    }

    getHP() {
        return this._hp;
    }

    getMaxHP() {
        return this._maxHP;
    }

    damage(amt) {
        this._hp -= amt;
    }

    heal(amt) {
        this._hp += amt;
        if (this._hp > this._maxHP) this._hp = this._maxHP;
    }

    isDead() {
        return this._hp <= 0;
    }

    getLoc() {
        return this._loc;
    }

    setLoc(loc) {
        this._loc = loc;
    }

    getName() {
        return translateMonsterName(this._monster.name);
    }

    getAttack() {
        return this._monster.attack;
    }

    getDefense() {
        return this._monster.defense;
    }

    getExp() {
        return this._monster.exp;
    }

    getGold() {
        return this._monster.gold;
    }

    getImageRef() {
        return this._monster.imgRef;
    }

    getLeft() {
        return this._monster.left;
    }

    getTop() {
        return this._monster.top;
    }

    getWidth() {
        return this._monster.width;
    }

    getHeight() {
        return this._monster.height;
    }

    hasSpecialAttack() {
        return !!this._monster.special;
    }

    useSpecialAttack() {
        this._monster.special(this);
    }
}

// ---------- Tileset.js ----------

class Tileset {
    constructor(width, height, imgRef) {
        this._width = width;
        this._height = height;
        this._url = g_imageData.images[imgRef].url;
        this._img = g_imageData.images[imgRef].img;
    }

    drawClip(gid, scrollX, scrollY, offsetX, offsetY) {
        gid = parseInt(gid);
        gid--;

        var tw = TILE_WIDTH;
        var th = TILE_HEIGHT;
        var perRow = this._width / tw;
        var sx = (gid % perRow) * tw;
        var sy = Math.floor(gid / perRow) * th;
        var dx = scrollX * tw + offsetX;
        var dy = scrollY * th + offsetY;

        mapCtx.drawImage(this._img, sx, sy, tw, th, dx, dy, tw, th);
    }
}

// ---------- TextDisplay.js ----------

class TextDisplay {
    constructor() {
        this._textDisplayed = false;
        this._callback = null;
    }

    setCallback(callback) {
        this._callback = callback;
    }

    textDisplayed() {
        return this._textDisplayed;
    }

    displayText(txt) {
        if (typeof txt === "string") txt = translateMapText(txt);

        textCtx.fillStyle = "rgba(24, 28, 42, 0.92)";
        textCtx.fillRect(0, 236, textCanvas.width, 100);
        textCtx.fillStyle = "rgba(241, 245, 249, 0.98)";
        textCtx.font = MENU_FONT_MAIN;
        textCtx.textBaseline = "top";
        var txtArray = txt.split("\n");
        var i = 0;
        do textCtx.fillText(txtArray[i], 10, 246 + 22 * i);
        while (txtArray.length > ++i);
        this._textDisplayed = true;
    }

    clearText() {
        textCtx.clearRect(0, 236, textCanvas.width, 100);
        this._textDisplayed = false;

        if (this._callback) {
            this._callback();
            this._callback = null;
        }
    }
}

// ---------- menu/AbstractMenu.js ----------

class AbstractMenu {
    constructor(args) {
        this._type = args.type;
        this._displayed = false;
        this._num = args.numberSelections;
        this._drawBox = args.drawBox;
        this._left = args.left;
        this._top = args.top;
        this._width = args.width;
        this._height = args.height;
        this._radius = args.radius;
        this._thickness = args.thickness;
        this._textLeft = args.textLeft;
        this._heights = args.heights;
        this._texts = args.texts;
        this._font = args.font;
        this._canESC = true;
        this._beforeCallback = args.beforeCallback ?? (() => {});
        this._afterCallback = args.afterCallback ?? (() => {});
        this._beforeClear = args.beforeClear ?? (() => {});
        this._afterClear = args.afterClear ?? (() => {});
    }

    display() {
        if (this._drawBox)
            drawBox(menuCtx, this._left, this._top, this._width, this._height, this._radius, this._thickness);

        textCtx.font = this._font;
        textCtx.textBaseline = "top";
        this.drawText();

        if (this._num > 0) this.drawPointer();

        this._displayed = true;
    }

    isDisplayed() {
        return this._displayed;
    }

    clear() {
        if (typeof clearLayerRegion === "function") {
            if (this._drawBox) {
                clearLayerRegion(menuCtx, this._left, this._top, this._width, this._height);
            }
            clearLayerRegion(textCtx, this._left, this._top, this._width, this._height);
        } else {
            if (this._drawBox) {
                menuCtx.clearRect(this._left, this._top, this._width, this._height);
            }
            textCtx.clearRect(this._left, this._top, this._width, this._height);
        }

        this._displayed = false;
    }

    getType() {
        return this._type;
    }

    drawPointer() {}

    clearPointer() {}

    drawText() {
        textCtx.fillStyle = "rgba(241, 245, 249, 0.98)";
        for (let i = 0; i < this._num; ++i) {
            textCtx.fillText(this._texts[i], this._textLeft, this._heights[i]);
        }
    }

    handleKey(key) {}

    handleEnter() {
        this._beforeCallback();
        this.handleESC();
        this._afterCallback();
    }

    handleESC() {
        if (this._displayed)
            if (this._canESC) {
                this._beforeClear();
                this.clear();
                this._afterClear();
            }
    }
}

// ---------- menu/Menu.js ----------

class Menu extends AbstractMenu {
    constructor(args) {
        super(args);
        this._current = 0;
        this._pointer = false;
        this._pointerLeft = args.pointerLeft;
        this._flags = args.flags;
        this._callbacks = args.callbacks;
        this._canESC = args.canESC;
        this._onFlag = args.onFlag ? args.onFlag : function () {};
    }

    drawPointer() {
        var drawHeight = this._heights[this._current % this._num];
        drawMenuPointerArrow(textCtx, this._pointerLeft, drawHeight);
        this._pointer = true;
    }

    clearPointer() {
        var drawHeight = this._heights[this._current % this._num];
        clearMenuPointerArrow(textCtx, this._pointerLeft, drawHeight);
        this._pointer = false;
    }

    drawText() {
        for (let i = 0; i < this._num; ++i) {
            textCtx.fillStyle = this._flags
                ? this._flags[i]
                    ? "rgba(148, 163, 184, 0.95)"
                    : "rgba(241, 245, 249, 0.98)"
                : "rgba(241, 245, 249, 0.98)";
            textCtx.fillText(this._texts[i], this._textLeft, this._heights[i]);
        }
    }

    handleKey(key) {
        if (this._displayed) {
            this.clearPointer();
            switch (key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    this._current++;
                    this._current %= this._num;
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    this._current--;
                    if (this._current < 0) this._current += this._num;
                    break;
            }
            this.drawPointer();
        }
    }

    handleEnter() {
        if (this._displayed) {
            if (this._flags && this._flags[this._current]) {
                this._onFlag();
            } else if (this._num > 0) {
                this._beforeCallback();
                this._callbacks[this._current]();
                this._afterCallback();
            } else {
                this.handleESC();
            }
        }
    }

    createCallbacks(num) {
        var callbacks = [];
        var menu = this;
        for (let i = 0; i < num; ++i)
            callbacks[i] = (function (i) {
                return function () {
                    menu.callback(i);
                };
            })(i);
        return callbacks;
    }
}

// ---------- menu/HorizMenu.js ----------

class HorizMenu extends Menu {
    constructor(args) {
        super(args);
        this._lineTop = args.lineTop;
        this._textLefts = args.textLefts;
        this._pointerLefts = args.pointerLefts;
    }

    drawPointer() {
        var drawLeft = this._pointerLefts[this._current % this._num];
        drawMenuPointerArrow(textCtx, drawLeft, this._lineTop);
        this._pointer = true;
    }

    clearPointer() {
        var drawLeft = this._pointerLefts[this._current % this._num];
        clearMenuPointerArrow(textCtx, drawLeft, this._lineTop);
        this._pointer = false;
    }

    drawText() {
        for (let i = 0; i < this._num; ++i) {
            textCtx.fillStyle = this._flags
                ? this._flags[i]
                    ? "rgba(148, 163, 184, 0.95)"
                    : "rgba(241, 245, 249, 0.98)"
                : "rgba(241, 245, 249, 0.98)";
            textCtx.fillText(this._texts[i], this._textLefts[i], this._lineTop);
        }
    }
}

// ---------- menu/MenuComposer.js ----------

/**
 * Declarative menu layout + callback wiring: compose Menu constructor args from presets and row data.
 */
const MenuComposer = {
    selfCallbacks(count, getInstance, methodName) {
        methodName = methodName || "callback";
        const cbs = [];
        for (let i = 0; i < count; i++) {
            const j = i;
            cbs[i] = function () {
                getInstance()[methodName](j);
            };
        }
        return cbs;
    },

    /** Shop buy / sell list (boxed, 300×250). */
    shopListPanel() {
        return {
            drawBox: true,
            left: 100,
            top: 0,
            width: 300,
            height: 250,
            radius: 40,
            thickness: 5,
            pointerLeft: 124,
            textLeft: 144,
            heights: [35, 55, 75, 95, 115, 135, 155, 175, 195, 215]
        };
    },

    /** Field item menu (main menu). */
    fieldItemPanel() {
        return {
            drawBox: true,
            left: 150,
            top: 0,
            width: 250,
            height: 200,
            radius: 25,
            thickness: 4,
            pointerLeft: 170,
            textLeft: 186,
            heights: [20, 48, 76, 104, 132, 160]
        };
    },

    /** Battle bottom item list (full width of command area). */
    battleItemPanel() {
        var screenWidth = mapCanvas.width;
        var screenHeight = mapCanvas.height;
        var panelTop = screenHeight - BATTLE_BOTTOM_PANEL_H;
        var logLeft = BATTLE_LOG_X - 8;
        return {
            drawBox: false,
            left: logLeft,
            top: panelTop,
            width: screenWidth - logLeft,
            height: BATTLE_BOTTOM_PANEL_H,
            radius: 15,
            thickness: 3,
            pointerLeft: BATTLE_LOG_X + 4,
            textLeft: BATTLE_LOG_X + 28,
            heights: [panelTop + 12, panelTop + 34, panelTop + 56, panelTop + 78, panelTop + 100]
        };
    }
};

// ---------- menu/ItemMenu.js ----------

function itemMenuBuildRows() {
    const items = [];
    g_player.forEachItemInInventory(function (itemId, amt) {
        if (amt > 0) {
            var type = g_itemData.items[itemId].type;
            items.push({
                name: g_itemData.items[itemId].name,
                type: type,
                amt: amt,
                id: itemId,
                canUse: type == ITEMTYPE_HEAL_ONE
            });
        }
    });
    return items;
}

class ItemMenu extends Menu {
    constructor(mainMenu) {
        const items = itemMenuBuildRows();
        const texts = items.map(function (item) {
            var amt2 = item.amt < 10 ? " " + item.amt : item.amt;
            return item.name + ":" + amt2;
        });
        const flags = items.map(function (item) {
            return !item.canUse;
        });
        const selfRef = {};
        super(
            Object.assign({}, MenuComposer.fieldItemPanel(), {
                type: ITEM_MENU,
                numberSelections: items.length,
                texts: texts,
                flags: flags,
                font: MENU_FONT_TITLE,
                callbacks: MenuComposer.selfCallbacks(items.length, () => selfRef.me),
                canESC: true,
                afterCallback: function () {
                    mainMenu.setCurrentMenu(mainMenu);
                },
                afterClear: function () {
                    mainMenu.returnTo();
                }
            })
        );
        selfRef.me = this;
        this._mainMenu = mainMenu;
        this._items = items;
    }

    callback(i) {
        var item = this._items[i];
        this.clear();
        this._mainMenu.clear();
        var theItem = g_itemData.items[item.id];
        if (theItem.effectScript && typeof ItemEffectRun !== "undefined") {
            ItemEffectRun(theItem.effectScript, { target: g_player, itemId: item.id, inBattle: false });
        } else if (typeof theItem.use === "function") {
            theItem.use(g_player);
        }
        g_player.removeFromInventory(item.id);
    }
}

// ---------- menu/SpellMenu.js ----------

function fieldSpellMenuBuildRows() {
    const spells = [];
    g_player.forEachSpell(function (spellId) {
        var type = g_spellData.spells[spellId].type;
        spells.push({
            name: g_spellData.spells[spellId].name,
            type: type,
            id: spellId,
            canUse: type == SPELLTYPE_HEAL_ONE
        });
    });
    return spells;
}

class SpellMenu extends Menu {
    constructor(mainMenu) {
        const spells = fieldSpellMenuBuildRows();
        const texts = spells.map(function (s) {
            return s.name;
        });
        const flags = spells.map(function (spell) {
            return !spell.canUse;
        });
        const selfRef = {};
        const callbacks = [];
        for (let i = 0; i < spells.length; i++) {
            const j = i;
            callbacks[i] = function () {
                selfRef.me.callback(j);
            };
        }
        super({
            type: SPELL_MENU,
            numberSelections: spells.length,
            drawBox: true,
            left: 150,
            top: 0,
            width: 250,
            height: 200,
            radius: 25,
            thickness: 4,
            pointerLeft: 170,
            textLeft: 186,
            heights: [20, 48, 76, 104, 132, 160],
            texts: texts,
            flags: flags,
            font: MENU_FONT_TITLE,
            callbacks: callbacks,
            canESC: true,
            afterCallback: function () {
                mainMenu.setCurrentMenu(mainMenu);
            },
            afterClear: function () {
                mainMenu.returnTo();
            }
        });
        selfRef.me = this;
        this._mainMenu = mainMenu;
        this._spells = spells;
    }

    callback(i) {
        var spell = this._spells[i];
        this.clear();
        this._mainMenu.clear();
        var theSpell = g_spellData.spells[spell.id];
        if (g_player.getMP() >= theSpell.mpCost) {
            theSpell.use(g_player);
            g_player.useMP(parseInt(theSpell.mpCost));
        } else {
            g_textDisplay.displayText(
                BunnyRPG.t("spell.field.no_mp", { name: spell.name })
            );
        }
    }
}

// ---------- menu/EquipMenu.js ----------

var NUM_EQUIP_TYPES = 4;

var EQUIP_WEAPON = 0;
var EQUIP_ARMOR = 1;
var EQUIP_HELMET = 2;
var EQUIP_SHIELD = 3;

class EquipMenu extends Menu {
    constructor(mainMenu) {
        const selfRef = {};
        const callbacks = [];
        for (let i = 0; i < NUM_EQUIP_TYPES; i++) {
            const j = i;
            callbacks[i] = function () {
                selfRef.me.callback(j);
            };
        }
        super({
            type: EQUIP_MENU,
            numberSelections: NUM_EQUIP_TYPES,
            drawBox: true,
            left: 150,
            top: 0,
            width: 250,
            height: 200,
            radius: 25,
            thickness: 4,
            pointerLeft: 170,
            textLeft: 195,
            heights: [20, 60, 100, 140],
            font: MENU_FONT_MAIN,
            callbacks: callbacks,
            canESC: true,
            afterClear: function () {
                mainMenu.returnTo();
            }
        });
        selfRef.me = this;
        this._mainMenu = mainMenu;
    }

    drawText() {
        textCtx.fillStyle = "rgba(241, 245, 249, 0.98)";
        textCtx.fillText(BunnyRPG.t("ui.equip.weapon"), this._textLeft, this._heights[0]);
        textCtx.fillText(g_itemData.items[g_player.getWeapon()].name, 210, 40);
        textCtx.fillText(BunnyRPG.t("ui.equip.armor"), this._textLeft, this._heights[1]);
        textCtx.fillText(g_itemData.items[g_player.getArmor()].name, 210, 80);
        textCtx.fillText(BunnyRPG.t("ui.equip.helmet"), this._textLeft, this._heights[2]);
        textCtx.fillText(g_itemData.items[g_player.getHelmet()].name, 210, 120);
        textCtx.fillText(BunnyRPG.t("ui.equip.shield"), this._textLeft, this._heights[3]);
        textCtx.fillText(g_itemData.items[g_player.getShield()].name, 210, 160);
    }

    callback(equipType) {
        var equipSubMenu = new EquipSubMenu(this._mainMenu, this, equipType);
        equipSubMenu.display();
        this._mainMenu.setCurrentMenu(equipSubMenu);
    }

    returnTo() {
        this.clear();
        this.display();
        this._mainMenu.setCurrentMenu(this);
    }
}

function equipSubMenuEquivType(equipType) {
    switch (equipType) {
        case EQUIP_WEAPON:
            return ITEMTYPE_WEAPON;
        case EQUIP_ARMOR:
            return ITEMTYPE_ARMOR;
        case EQUIP_HELMET:
            return ITEMTYPE_HELMET;
        case EQUIP_SHIELD:
            return ITEMTYPE_SHIELD;
    }
}

function equipSubMenuBuildItems(equipType) {
    const equivType = equipSubMenuEquivType(equipType);
    const items = [];
    g_player.forEachItemInInventory(function (itemId, amt) {
        if (amt > 0) {
            var itemType = g_itemData.items[itemId].type;
            if (itemType == equivType) {
                items.push({
                    name: g_itemData.items[itemId].name,
                    type: itemType,
                    amt: amt,
                    id: itemId
                });
            }
        }
    });
    return items;
}

class EquipSubMenu extends Menu {
    constructor(mainMenu, parent, equipType) {
        const items = equipSubMenuBuildItems(equipType);
        const texts = items.map(function (it) {
            return it.name;
        });
        const selfRef = {};
        const callbacks = [];
        for (let i = 0; i < items.length; i++) {
            const j = i;
            callbacks[i] = function () {
                selfRef.me.callback(j);
            };
        }
        super({
            type: EQUIP_SUBMENU,
            numberSelections: items.length,
            drawBox: true,
            left: 150,
            top: 200,
            width: 250,
            height: 150,
            radius: 25,
            thickness: 4,
            pointerLeft: 170,
            textLeft: 195,
            heights: [220, 240, 260, 280, 300],
            texts: texts,
            font: MENU_FONT_MAIN,
            callbacks: callbacks,
            canESC: true,
            afterCallback: function () {},
            afterClear: function () {
                parent.returnTo();
            }
        });
        selfRef.me = this;
        this._mainMenu = mainMenu;
        this._parent = parent;
        this._equipType = equipType;
        this._items = items;
    }

    callback(i) {
        this.changeEquip(i);
        this.clear();
        this._parent.returnTo();
    }

    changeEquip(i) {
        var currentlyEquippedItemId;
        var toEquipItemId = this._items[i].id;
        switch (this._equipType) {
            case EQUIP_WEAPON:
                currentlyEquippedItemId = g_player.getWeapon();
                g_player.equipWeapon(toEquipItemId);
                break;
            case EQUIP_ARMOR:
                currentlyEquippedItemId = g_player.getArmor();
                g_player.equipArmor(toEquipItemId);
                break;
            case EQUIP_HELMET:
                currentlyEquippedItemId = g_player.getHelmet();
                g_player.equipHelmet(toEquipItemId);
                break;
            case EQUIP_SHIELD:
                currentlyEquippedItemId = g_player.getShield();
                g_player.equipShield(toEquipItemId);
                break;
        }
        g_player.removeFromInventory(toEquipItemId);
        g_player.addToInventory(currentlyEquippedItemId);
    }
}

// ---------- menu/SlotMenu.js ----------

var NUM_SAVE_SLOTS = 4;

class SlotMenu extends Menu {
    constructor(mainMenu) {
        const selfRef = {};
        const callbacks = [];
        for (let i = 0; i < NUM_SAVE_SLOTS; i++) {
            const j = i;
            callbacks[i] = function () {
                selfRef.me.callback(j);
            };
        }
        super({
            numberSelections: NUM_SAVE_SLOTS,
            drawBox: true,
            left: 150,
            top: 0,
            width: 250,
            height: 200,
            radius: 25,
            thickness: 4,
            pointerLeft: 170,
            textLeft: 195,
            heights: [20, 60, 100, 140],
            font: MENU_FONT_MAIN,
            callbacks: callbacks,
            canESC: true,
            afterCallback: function () {
                mainMenu.setCurrentMenu(mainMenu);
            },
            afterClear: function () {
                mainMenu.returnTo();
            }
        });
        selfRef.me = this;
        this._mainMenu = mainMenu;
    }
}

// ---------- menu/SaveMenu.js ----------

class SaveMenu extends SlotMenu {
    constructor(mainMenu) {
        super(mainMenu);
        this._type = SAVE_MENU;
    }

    drawText() {
        for (var i = 1; i <= NUM_SAVE_SLOTS; ++i) {
            textCtx.font = MENU_FONT_MAIN;
            textCtx.fillStyle = "rgba(241, 245, 249, 0.98)";
            textCtx.fillText(BunnyRPG.t("ui.save.slot", { n: i }), this._textLeft, this._heights[i - 1]);
            if (g_game.hasSaveInfo(i)) {
                textCtx.font = MENU_FONT_SMALL;
                textCtx.fillStyle = "rgba(203, 213, 225, 0.95)";
                textCtx.fillText(g_game.getSaveInfo(i), this._textLeft + 15, this._heights[i - 1] + 20);
            } else {
                textCtx.font = 'italic 14px system-ui, "Segoe UI", "Microsoft YaHei", sans-serif';
                textCtx.fillStyle = "rgba(148, 163, 184, 0.95)";
                textCtx.fillText(BunnyRPG.t("ui.save.empty"), this._textLeft + 15, this._heights[i - 1] + 20);
            }
        }
    }

    callback(i) {
        this.clear();
        this._mainMenu.clear();
        var slot = i + 1;
        g_game.save(slot);
        g_textDisplay.displayText(BunnyRPG.t("ui.save.saved", { slot: slot }));
    }
}

// ---------- menu/LoadMenu.js ----------

class LoadMenu extends SlotMenu {
    constructor(mainMenu) {
        super(mainMenu);
        this._type = LOAD_MENU;
        this._afterCallback = function () {
            if (g_titlescreen) {
                g_titlescreen = false;
                g_game.exitTitleScreen();
                g_menu.setCurrentMenu(g_menu);
            } else {
                g_menu.setCurrentMenu(mainMenu);
            }
        };
    }

    drawText() {
        for (var i = 1; i <= NUM_SAVE_SLOTS; ++i) {
            if (g_game.hasSaveInfo(i)) {
                textCtx.font = MENU_FONT_MAIN;
                textCtx.fillStyle = "rgba(241, 245, 249, 0.98)";
                textCtx.fillText(BunnyRPG.t("ui.save.slot", { n: i }), 195, 40 * i - 20);
                textCtx.font = MENU_FONT_SMALL;
                textCtx.fillText(g_game.getSaveInfo(i), 210, 40 * i);
            } else {
                textCtx.font = MENU_FONT_MAIN;
                textCtx.fillStyle = "rgba(148, 163, 184, 0.95)";
                textCtx.fillText(BunnyRPG.t("ui.save.slot", { n: i }), 195, 40 * i - 20);
                textCtx.font = 'italic 14px system-ui, "Segoe UI", "Microsoft YaHei", sans-serif';
                textCtx.fillText(BunnyRPG.t("ui.save.empty"), 210, 40 * i);
            }
        }
    }

    callback(i) {
        this.clear();
        this._mainMenu.clear();
        this.loadGame(i + 1);
    }

    loadGame(slot) {
        try {
            g_game.load(slot);
            spriteCtx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
            g_worldmap.goToMap(
                g_player,
                g_player.getSubMap(),
                g_player.getX(),
                g_player.getY(),
                g_worldmap.getScrollX(),
                g_worldmap.getScrollY(),
                g_player.getDir()
            );
        } catch (e) {
            if (e instanceof NoSaveException)
                g_textDisplay.displayText(
                    BunnyRPG.t("ui.save.load_no_save", { slot: slot })
                );
            else if (e instanceof OldVersionException)
                g_textDisplay.displayText(
                    BunnyRPG.t("ui.save.load_old_version")
                );
            else throw e;
        }
    }
}

// ---------- menu/TitleScreenMenu.js ----------

var TITLE_LANGUAGE_MENU = 96;

class TitleLanguageMenu extends Menu {
    constructor(titleScreen) {
        const selfRef = { me: null };
        const codes = BunnyRPG.getLocaleCodes().slice().sort(function (a, b) {
            if (a === b) return 0;
            return a < b ? -1 : 1;
        });
        const labels = codes.map(function (c) {
            var L = BunnyRPG.localeLabels;
            return L && L[c] ? L[c] : String(c).toUpperCase();
        });
        const n = codes.length;
        const heights = [];
        for (var hi = 0; hi < n; hi++) heights.push(20 + hi * 28);
        const menuH = Math.max(90, 24 + n * 28);
        const callbacks = codes.map(function (code) {
            return function () {
                BunnyRPG.setLocale(code);
                selfRef.me.clear();
                titleScreen.returnTo();
            };
        });
        super({
            type: TITLE_LANGUAGE_MENU,
            numberSelections: n,
            drawBox: true,
            left: 155,
            top: 0,
            width: 230,
            height: menuH,
            radius: 25,
            thickness: 4,
            pointerLeft: 175,
            textLeft: 198,
            heights: heights,
            texts: labels,
            font: MENU_FONT_TITLE,
            callbacks: callbacks,
            canESC: true,
            afterClear: function () {
                titleScreen.returnTo();
            }
        });
        selfRef.me = this;
    }
}

var NUM_TITLESCREEN_MENU_ACTIONS = 3;

var TITLESCREEN_MENU_NEW_GAME = 0;
var TITLESCREEN_MENU_LOAD_GAME = 1;
var TITLESCREEN_MENU_LANGUAGE = 2;

class TitleScreenMenu extends Menu {
    constructor(mainMenu) {
        const selfRef = { me: null };
        super({
            type: TITLESCREEN_MENU,
            numberSelections: NUM_TITLESCREEN_MENU_ACTIONS,
            drawBox: true,
            left: 0,
            top: 0,
            width: 175,
            height: 118,
            radius: 25,
            thickness: 4,
            pointerLeft: 24,
            textLeft: 44,
            heights: [20, 48, 76],
            texts: [
                BunnyRPG.t("ui.title.new_game"),
                BunnyRPG.t("ui.title.load_game"),
                BunnyRPG.t("ui.title.language")
            ],
            font: MENU_FONT_TITLE,
            callbacks: [
                function () {
                    g_game.reset();
                    var nameLabel =
                        typeof BunnyRPG !== "undefined" && BunnyRPG.t
                            ? BunnyRPG.t("game.name_prompt")
                            : "What is your name?";
                    var defNm = g_player.getName();
                    var afterName = function (rawName) {
                        if (rawName != null && String(rawName).trim() !== "")
                            g_player.setName(String(rawName).trim());
                        if (typeof GameBusiness !== "undefined" && GameBusiness.applyStarterPack)
                            GameBusiness.applyStarterPack();
                        mainMenu.onNewGame();
                        g_game.exitTitleScreen();
                    };
                    if (typeof showGameTextPrompt === "function") {
                        showGameTextPrompt({ label: nameLabel, initial: defNm, maxLength: 24 }).then(afterName);
                    } else {
                        var rawName = window.prompt(nameLabel, defNm);
                        afterName(rawName);
                    }
                },
                function () {
                    selfRef.me.displayLoadMenu();
                },
                function () {
                    selfRef.me.displayLanguageMenu();
                }
            ],
            canESC: true,
            afterClear: function () {
                g_menu.clearTitleScreenMenu();
            }
        });
        selfRef.me = this;
        this._mainMenu = mainMenu;
        this._currentMenu = this;
    }

    display() {
        this._mainMenu.setDisplayed(true);
        super.display();
    }

    clear() {
        this._mainMenu.setDisplayed(false);
        super.clear();
    }

    displayLoadMenu() {
        var menu = new LoadMenu(this);
        menu.display();
        this._currentMenu = menu;
    }

    displayLanguageMenu() {
        var menu = new TitleLanguageMenu(this);
        menu.display();
        this._currentMenu = menu;
    }

    handleKey(key) {
        if (this._currentMenu == this) super.handleKey(key);
        else this._currentMenu.handleKey(key);
    }

    handleEnter() {
        if (this._currentMenu == this) super.handleEnter();
        else this._currentMenu.handleEnter();
    }

    handleESC() {
        if (this._currentMenu == this) super.handleESC();
        else this._currentMenu.handleESC();
    }

    getCurrentMenu() {
        return this._mainMenu.getCurrentMenu();
    }

    setCurrentMenu(menu) {
        this._mainMenu.setCurrentMenu(menu);
    }

    returnTo() {
        this._mainMenu.setCurrentMenu(this);
        this._currentMenu = this;
        this._texts[0] = BunnyRPG.t("ui.title.new_game");
        this._texts[1] = BunnyRPG.t("ui.title.load_game");
        this._texts[2] = BunnyRPG.t("ui.title.language");
        this.display();
        this.drawPointer();
    }

    setDisplayed(displayed) {
        this._displayed = displayed;
    }
}

// ---------- menu/MainMenu.js ----------

const MAIN_MENU = 0;
const ITEM_MENU = 1;
const SPELL_MENU = 2;
const EQUIP_MENU = 3;
const STATUS_MENU = 4;
const SAVE_MENU = 5;
const LOAD_MENU = 6;
const NOT_IMPLEMENTED_MENU = 7;
const EQUIP_SUBMENU = 8;
const TITLESCREEN_MENU = 9;

const MAIN_MENU_ITEM = 0;
const MAIN_MENU_SPELL = 1;
const MAIN_MENU_EQUIP = 2;
const MAIN_MENU_STATUS = 3;
const MAIN_MENU_SAVE = 4;
const MAIN_MENU_LOAD = 5;

const NUM_MAIN_MENU_ACTIONS = 6;

/* Class for main menu */
class MainMenu extends Menu {
    constructor() {
        const selfRef = {};
        super({
            type: MAIN_MENU,
            numberSelections: NUM_MAIN_MENU_ACTIONS,
            drawBox: true,
            left: 0,
            top: 0,
            width: 150,
            height: 200,
            radius: 25,
            thickness: 4,
            pointerLeft: 24,
            textLeft: 42,
            heights: [20, 48, 76, 104, 132, 160],
            texts: [
                BunnyRPG.t("ui.main.item"),
                BunnyRPG.t("ui.main.spell"),
                BunnyRPG.t("ui.main.equip"),
                BunnyRPG.t("ui.main.status"),
                BunnyRPG.t("ui.main.save"),
                BunnyRPG.t("ui.main.load")
            ],
            font: MENU_FONT_TITLE,
            callbacks: [
                function () {
                    selfRef.me.displayItemMenu();
                },
                function () {
                    selfRef.me.displaySpellMenu();
                },
                function () {
                    selfRef.me.displayEquipMenu();
                },
                function () {
                    selfRef.me.displayStatusMenu();
                },
                function () {
                    selfRef.me.displaySaveMenu();
                },
                function () {
                    selfRef.me.displayLoadMenu();
                }
            ],
            canESC: true
        });
        selfRef.me = this;
        this._onNewGame = null;
        this._statusFromFieldQuick = false;

        if (g_titlescreen) {
            this._currentMenu = new TitleScreenMenu(this);
        } else {
            this._currentMenu = this;
        }
    }

    /* Get the current menu */
    getCurrentMenu() {
        return this._currentMenu;
    }

    /* Set the current menu */
    setCurrentMenu(menu) {
        this._currentMenu = menu;
    }

    // Called after one of the submenus is cleared
    returnTo() {
        this._currentMenu = this;
        this.clear();
        this.display();
        this.drawPointer();
    }

    // set function to call when new game is started.
    setOnNewGame(callback) {
        this._onNewGame = callback;
    }

    // runs when a new game is started.
    onNewGame() {
        this._currentMenu.clear();
        this._onNewGame();
        g_titlescreen = false;
        g_game.exitTitleScreen();
        this.setCurrentMenu(this);
    }

    setDisplayed(displayed) {
        this._displayed = displayed;
    }

    isDisplayed() {
        return (
            this._displayed ||
            (this._currentMenu !== this &&
                this._currentMenu &&
                this._currentMenu.isDisplayed &&
                this._currentMenu.isDisplayed())
        );
    }

    displayTitleScreenMenu() {
        var menu = new TitleScreenMenu(this);
        menu.display();
        this._currentMenu = menu;
        this._displayed = true;
    }

    clearTitleScreenMenu() {
        this._displayed = false;
    }

    displayNotImplementedMenu() {
        var menu = new NotImplementedMenu(this);
        menu.display();
        this._currentMenu = menu;
    }

    displayItemMenu() {
        var menu = new ItemMenu(this);
        menu.display();
        this._currentMenu = menu;
    }

    displaySpellMenu() {
        var menu = new SpellMenu(this);
        menu.display();
        this._currentMenu = menu;
    }

    displayEquipMenu() {
        var menu = new EquipMenu(this);
        menu.display();
        this._currentMenu = menu;
    }

    displayStatusMenu(fromFieldQuick) {
        var menu = new StatusMenu(this);
        this._statusFromFieldQuick = !!fromFieldQuick;
        menu.display();
        this._currentMenu = menu;
    }

    displaySaveMenu() {
        var menu = new SaveMenu(this);
        menu.display();
        this._currentMenu = menu;
    }

    displayLoadMenu() {
        var menu = new LoadMenu(this);
        menu.display();
        this._currentMenu = menu;
    }

    /* Handles arrow key input for main menu */
    handleKey(key) {
        if (this._currentMenu == this) super.handleKey(key);
        else this._currentMenu.handleKey(key);
    }

    /* Called when enter key is pressed and main menu has focus */
    handleEnter() {
        if (this._currentMenu == this) super.handleEnter();
        else this._currentMenu.handleEnter();
    }

    /* Called when ESC key is pressed and main menu has focus */
    handleESC() {
        if (this._currentMenu == this) super.handleESC();
        else this._currentMenu.handleESC();
    }
}


/* Class for Not Implemented Menu */
class NotImplementedMenu extends AbstractMenu {
    constructor(mainMenu) {
        super({
            type: NOT_IMPLEMENTED_MENU,
            numberSelections: 0,
            drawBox: true,
            left: 150,
            top: 0,
            width: 250,
            height: 200,
            radius: 25,
            thickness: 4,
            textLeft: 170,
            heights: [],
            texts: [],
            font: MENU_FONT_TITLE,
            afterClear: function () {
                mainMenu.returnTo();
            }
        });
        this._mainMenu = mainMenu;
    }
}

/* Class for Status Menu */
class StatusMenu extends AbstractMenu {
    constructor(mainMenu) {
        var texts = StatusMenu.buildStatusTexts();
        super({
            type: STATUS_MENU,
            numberSelections: 7,
            drawBox: true,
            left: 150,
            top: 0,
            width: 250,
            height: 200,
            radius: 25,
            thickness: 4,
            textLeft: 180,
            heights: [18, 36, 54, 72, 90, 108, 126],
            texts: texts,
            font: MENU_FONT_SMALL,
            afterCallback: function () {
                mainMenu.setCurrentMenu(mainMenu);
            },
            afterClear: function () {
                var m = mainMenu;
                if (m._statusFromFieldQuick) {
                    m._statusFromFieldQuick = false;
                    m._currentMenu = m;
                    m.clear();
                    if (typeof window.invalidateComposite === "function") {
                        window.invalidateComposite();
                    }
                    return;
                }
                m.returnTo();
            }
        });
        this._mainMenu = mainMenu;
    }

    static buildStatusTexts() {
        var texts = [];
        texts[0] = BunnyRPG.t("ui.status.hp") + g_player.getHP() + "/" + g_player.getMaxHP();
        texts[1] = BunnyRPG.t("ui.status.mp") + g_player.getMP() + "/" + g_player.getMaxMP();
        texts[2] = BunnyRPG.t("ui.status.attack") + g_player.getAttack();
        texts[3] = BunnyRPG.t("ui.status.defense") + g_player.getDefense();
        texts[4] = BunnyRPG.t("ui.status.level") + g_player.getLevel();
        texts[5] = BunnyRPG.t("ui.status.exp") + g_player.getExp() + "/" + g_player.getNextExp();
        texts[6] = BunnyRPG.t("ui.status.gold") + g_player.getGold();
        return texts;
    }
}

// ---------- menu/BuyMenu.js ----------

function buyMenuBuildRows(itemList) {
    const items = [];
    for (var i = 0; i < itemList.length; ++i) {
        var itemId = itemList[i];
        items.push({
            name: g_itemData.items[itemId].name,
            type: g_itemData.items[itemId].type,
            cost: g_itemData.items[itemId].cost,
            id: itemId
        });
    }
    return items;
}

class BuyMenu extends Menu {
    constructor(parent, shop, itemList) {
        const items = buyMenuBuildRows(itemList);
        const texts = items.map(function (item) {
            var itemText = item.name;
            while (itemText.length < 16) itemText += " ";
            var itemCost = item.cost + "";
            while (itemCost.length < 5) itemCost = " " + itemCost;
            return itemText + itemCost;
        });
        const selfRef = {};
        super(
            Object.assign({}, MenuComposer.shopListPanel(), {
                type: BUY_MENU,
                numberSelections: items.length,
                texts: texts,
                font: MENU_FONT_MAIN,
                callbacks: MenuComposer.selfCallbacks(items.length, () => selfRef.me),
                canESC: true,
                afterClear: function () {
                    parent.returnTo();
                }
            })
        );
        selfRef.me = this;
        this._parent = parent;
        this._shop = shop;
        this._itemList = itemList;
        this._items = items;
    }

    callback(i) {
        this._shop.handlePurchase(this._items[i]);
    }
}

// ---------- menu/SellMenu.js ----------

function sellMenuBuildRows() {
    const items = [];
    g_player.forEachItemInInventory(function (itemId, amt) {
        if (amt > 0) {
            var cost = g_itemData.items[itemId].cost;
            items.push({
                id: itemId,
                name: g_itemData.items[itemId].name,
                amt: amt,
                cost: cost,
                sellPrice: Math.floor(cost * SELL_PRICE_RATIO)
            });
        }
    });
    return items;
}

class SellMenu extends Menu {
    constructor(parent, shop) {
        const items = sellMenuBuildRows();
        const texts = items.map(function (item) {
            var amt = item.amt;
            var displayAmt = amt >= 10 ? amt : " " + amt;
            var displayPrice = item.sellPrice.toString();
            while (displayPrice.length < 5) displayPrice = " " + displayPrice;
            var displayName = item.name;
            while (displayName.length < 15) displayName += " ";
            return displayName + " " + displayAmt + " " + displayPrice + "G";
        });
        const selfRef = {};
        super(
            Object.assign({}, MenuComposer.shopListPanel(), {
                type: SELL_MENU,
                numberSelections: items.length,
                texts: texts,
                font: MENU_FONT_SMALL,
                callbacks: MenuComposer.selfCallbacks(items.length, () => selfRef.me),
                canESC: true,
                afterClear: function () {
                    parent.returnTo();
                }
            })
        );
        selfRef.me = this;
        this._parent = parent;
        this._shop = shop;
        this._items = items;
    }

    callback(i) {
        this._shop.handleSale(this._items[i]);
        if (!this._shop.isQuantityDialogDisplayed()) this._parent.setCurrentMenu(this._parent);
    }
}

// ---------- menu/ShopMenu.js ----------

const SHOP_MENU = 0;
const BUY_MENU = 1;
const SELL_MENU = 2;

const NUM_SHOP_ACTIONS = 3;

const SHOP_BUY = 0;
const SHOP_SELL = 1;
const SHOP_EXIT = 2;

class ShopMenu extends Menu {
    constructor(shop) {
        const selfRef = {};
        super({
            type: SHOP_MENU,
            numberSelections: NUM_SHOP_ACTIONS,
            drawBox: true,
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            radius: 15,
            thickness: 3,
            pointerLeft: 13,
            textLeft: 32,
            heights: [12, 40, 68],
            texts: [
                BunnyRPG.t("ui.shop.buy"),
                BunnyRPG.t("ui.shop.sell"),
                BunnyRPG.t("ui.shop.exit")
            ],
            font: MENU_FONT_TITLE,
            callbacks: [
                function () {
                    selfRef.me.displayBuyMenu();
                },
                function () {
                    selfRef.me.displaySellMenu();
                },
                function () {
                    selfRef.me.handleESC();
                }
            ],
            afterClear: function () {
                selfRef.me.afterClear();
            },
            canESC: true
        });
        selfRef.me = this;
        this._shop = shop;
        this._currentMenu = this;
    }

    getShop() {
        return this._shop;
    }

    returnTo() {
        this._currentMenu = this;
        this.clear();
        this.display();
        this.drawPointer();
    }

    afterClear() {
        g_textDisplay.displayText(
            BunnyRPG.t("shop.thanks")
        );
    }

    display() {
        super.display();
        this.displayGold();
    }

    clear() {
        super.clear();
        this.clearGold();
    }

    displayGold() {
        drawBox(menuCtx, 0, 120, 100, 40, 10, 2);
        textCtx.font = MENU_FONT_TITLE;
        textCtx.fillStyle = "rgba(241, 245, 249, 0.98)";
        textCtx.textBaseline = "top";
        textCtx.fillText(g_player.getGold() + "G", 16, 130);
    }

    clearGold() {
        if (typeof clearLayerRegion === "function") {
            clearLayerRegion(menuCtx, 0, 120, 100, 50);
            clearLayerRegion(textCtx, 0, 120, 100, 50);
        } else {
            menuCtx.clearRect(0, 118, 100, 54);
            textCtx.clearRect(0, 118, 100, 54);
        }
    }

    displayBuyMenu() {
        var menu = new BuyMenu(this, this.getShop(), this.getShop().getItemList());
        menu.display();
        this._currentMenu = menu;
    }

    displaySellMenu() {
        var menu = new SellMenu(this, this.getShop());
        menu.display();
        this._currentMenu = menu;
    }

    getCurrentMenu() {
        return this._currentMenu;
    }

    setCurrentMenu(menu) {
        this._currentMenu = menu;
    }

    handleKey(key) {
        if (this._currentMenu == this) super.handleKey(key);
        else this._currentMenu.handleKey(key);
    }

    handleEnter() {
        if (this._currentMenu == this) super.handleEnter();
        else this._currentMenu.handleEnter();
    }

    handleESC() {
        if (this._currentMenu == this) super.handleESC();
        else this._currentMenu.handleESC();
    }
}

// ---------- menu/MonsterMenu.js ----------

class MonsterMenu extends HorizMenu {
    handleEnter() {
        if (!this._displayed) return false;
        if (this._flags && this._flags[this._current]) {
            this._onFlag();
            return false;
        }
        if (this._num > 0) {
            this._beforeCallback();
            this._callbacks[this._current]();
            this._afterCallback();
            return "done";
        }
        this.handleESC();
        return false;
    }

    constructor(parent, battle, monsterList) {
        const selfRef = {};
        const callbacks = [];
        for (let i = 0; i < monsterList.length; i++) {
            const j = i;
            callbacks[i] = function () {
                selfRef.me.callback(j);
            };
        }
        var monsterLefts = monsterList.map(function (monster) {
            return monster.getLoc();
        });
        var lineTop = BATTLE_ENEMY_SPRITE_Y + BATTLE_PLAYER_SPRITE_SRC_H + 4;
        super({
            type: BATTLE_MONSTER_MENU,
            numberSelections: monsterList.length,
            drawBox: false,
            left: monsterLefts[0] - 10,
            top: lineTop,
            width: monsterLefts[monsterList.length - 1] + 6,
            height: 13,
            lineTop: lineTop,
            pointerLefts: monsterLefts.map(function (left) {
                return left - 10;
            }),
            textLefts: monsterLefts,
            texts: ["", "", ""],
            callbacks: callbacks,
            canESC: true,
            afterCallback: function () {
                selfRef.me.clear();
            },
            afterClear: function () {
                parent.returnTo(false);
            }
        });
        selfRef.me = this;
        this._parent = parent;
        this._battle = battle;
        this._monsterList = monsterList;
    }

    drawText() {}

    callback(i) {
        this._battle.doActionToMonster(i);
    }

    handleKey(key) {
        if (this._displayed) {
            this.clearPointer();
            switch (key) {
                case DOWN_ARROW:
                case RIGHT_ARROW:
                    do {
                        this._current++;
                        this._current %= this._num;
                    } while (this._monsterList[this._current].isDead());
                    break;
                case UP_ARROW:
                case LEFT_ARROW:
                    do {
                        this._current--;
                        if (this._current < 0) this._current += this._num;
                    } while (this._monsterList[this._current].isDead());
                    break;
            }
            this.drawPointer();
        }
    }

    selectFirstLiveMonster() {
        for (var i = 0; i < this._monsterList.length; ++i)
            if (!this._monsterList[i].isDead()) {
                this._current = i;
                break;
            }
    }
}

// ---------- menu/BattleItemMenu.js ----------

function battleItemMenuBuildRows() {
    const items = [];
    g_player.forEachItemInInventory(function (itemId, amt) {
        if (amt > 0) {
            items.push({
                name: g_itemData.items[itemId].name,
                type: g_itemData.items[itemId].type,
                amt: amt,
                id: itemId,
                canUse: g_itemData.items[itemId].usable
            });
        }
    });
    return items;
}

class BattleItemMenu extends Menu {
    constructor(parent, battle) {
        const items = battleItemMenuBuildRows();
        const texts = items.map(function (item) {
            var amt2 = item.amt < 10 ? " " + item.amt : item.amt;
            return item.name + ":" + amt2;
        });
        const flags = items.map(function (item) {
            return !item.canUse;
        });
        const selfRef = {};
        super(
            Object.assign({}, MenuComposer.battleItemPanel(), {
                type: BATTLE_ITEM_MENU,
                numberSelections: items.length,
                texts: texts,
                flags: flags,
                font: MENU_FONT_MAIN,
                callbacks: MenuComposer.selfCallbacks(items.length, () => selfRef.me),
                canESC: true,
                onFlag: function () {
                    battle.setMonsterWillAttack(false);
                },
                afterCallback: function () {
                    parent.returnTo(true);
                },
                afterClear: function () {
                    parent.returnTo(true);
                }
            })
        );
        selfRef.me = this;
        this._parent = parent;
        this._battle = battle;
        this._items = items;
    }

    callback(i) {
        var item = this._items[i];
        this.clear();
        var theItem = g_itemData.items[item.id];
        if (theItem.effectScript && typeof ItemEffectRun !== "undefined") {
            ItemEffectRun(theItem.effectScript, { target: g_player, itemId: item.id, inBattle: true });
        } else if (typeof theItem.use === "function") {
            theItem.use(g_player);
        }
        g_player.removeFromInventory(item.id);
        g_battle.setMonsterWillAttack(true);
    }
}

// ---------- menu/BattleSpellMenu.js ----------

function battleSpellMenuCollectSpells() {
    const spells = [];
    g_player.forEachSpell(function (spellId) {
        spells.push({
            name: g_spellData.spells[spellId].name,
            type: g_spellData.spells[spellId].type,
            id: spellId,
            canUse: true
        });
    });
    return spells;
}

class BattleSpellMenu extends Menu {
    constructor(parent, battle) {
        const spells = battleSpellMenuCollectSpells();
        const texts = spells.map(function (s) {
            return s.name;
        });
        const selfRef = {};
        const callbacks = [];
        for (let i = 0; i < spells.length; i++) {
            const j = i;
            callbacks[i] = function () {
                selfRef.me.callback(j);
            };
        }
        var screenWidth = mapCanvas.width;
        var screenHeight = mapCanvas.height;
        var panelTop = screenHeight - BATTLE_BOTTOM_PANEL_H;
        var logLeft = BATTLE_LOG_X - 8;
        super({
            type: BATTLE_SPELL_MENU,
            numberSelections: spells.length,
            drawBox: false,
            left: logLeft,
            top: panelTop,
            width: screenWidth - logLeft,
            height: BATTLE_BOTTOM_PANEL_H,
            radius: 15,
            thickness: 3,
            pointerLeft: BATTLE_LOG_X + 4,
            textLeft: BATTLE_LOG_X + 28,
            heights: [panelTop + 12, panelTop + 34, panelTop + 56, panelTop + 78, panelTop + 100],
            texts: texts,
            font: MENU_FONT_MAIN,
            callbacks: callbacks,
            canESC: true,
            afterCallback: function () {
                parent.returnTo(true);
            },
            afterClear: function () {
                parent.returnTo(true);
            }
        });
        selfRef.me = this;
        this._parent = parent;
        this._battle = battle;
        this._spells = spells;
    }

    callback(i) {
        var spell = this._spells[i];
        this.clear();
        var theSpell = g_spellData.spells[spell.id];
        if (g_player.getMP() >= theSpell.mpCost) {
            switch (spell.type) {
                case SPELLTYPE_HEAL_ONE:
                    theSpell.use(g_player);
                    break;
                case SPELLTYPE_ATTACK_ALL:
                    theSpell.use();
                    break;
            }
            g_player.useMP(parseInt(theSpell.mpCost));
            g_battle.setMonsterWillAttack(true);
        } else {
            this._battle.writeMsg(BunnyRPG.t("battle.msg.no_mp"));
            this._battle.writeMsg(
                BunnyRPG.t("battle.msg.cast_suffix", { name: spell.name })
            );
            g_battle.setMonsterWillAttack(false);
        }
    }
}

// ---------- menu/BattleMenu.js ----------

var BATTLE_MAIN_MENU = 0;
var BATTLE_ITEM_MENU = 1;
var BATTLE_SPELL_MENU = 2;
var BATTLE_MONSTER_MENU = 3;

var BATTLE_MENU_ATTACK = 0;
var BATTLE_MENU_DEFEND = 1;
var BATTLE_MENU_SPELL = 2;
var BATTLE_MENU_ITEM = 3;
var BATTLE_MENU_RUN = 4;

var BATTLE_GRID_FONT_MAIN =
    '600 13px system-ui, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif';
var BATTLE_GRID_FONT_SUB =
    '500 10px system-ui, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif';

/** @returns {{x:number,y:number,w:number,h:number}} */
function battleGridCellRect(panelLeft, panelTop, panelW, panelH, cols, rows, index, gap, pad, hintReserve) {
    gap = gap == null ? 4 : gap;
    pad = pad == null ? 6 : pad;
    hintReserve = hintReserve || 0;
    var innerW = panelW - pad * 2 - gap * (cols - 1);
    var innerH = panelH - pad * 2 - gap * (rows - 1) - hintReserve;
    var cw = Math.floor(innerW / cols);
    var ch = Math.floor(innerH / rows);
    var col = index % cols;
    var row = Math.floor(index / cols);
    var x = panelLeft + pad + col * (cw + gap);
    var y = panelTop + pad + row * (ch + gap);
    return { x: x, y: y, w: cw, h: ch };
}

function battleGridDrawCellChrome(menuCtx, x, y, w, h, selected) {
    var rr = Math.min(8, w / 4, h / 4);
    battleRoundRect(menuCtx, x, y, w, h, rr);
    menuCtx.fillStyle = selected ? "rgba(52, 62, 98, 0.95)" : "rgba(36, 40, 58, 0.9)";
    menuCtx.fill();
    menuCtx.strokeStyle = selected ? "rgba(250, 204, 21, 0.92)" : "rgba(255, 255, 255, 0.1)";
    menuCtx.lineWidth = selected ? 2.5 : 1;
    menuCtx.stroke();
}

function battleGridNav(sel, key, cols, rows) {
    var row = Math.floor(sel / cols);
    var col = sel % cols;
    switch (key) {
        case UP_ARROW:
            if (row > 0) return sel - cols;
            return sel;
        case DOWN_ARROW:
            if (row < rows - 1) return sel + cols;
            return sel;
        case LEFT_ARROW:
            if (col > 0) return sel - 1;
            return sel;
        case RIGHT_ARROW:
            if (col < cols - 1) return sel + 1;
            return sel;
        default:
            return sel;
    }
}

function battleClipText(ctx, str, maxW) {
    if (str == null) return "";
    str = String(str);
    if (ctx.measureText(str).width <= maxW) return str;
    var s = str;
    while (s.length > 1 && ctx.measureText(s + "…").width > maxW) s = s.slice(0, -1);
    return s + "…";
}

/**
 * Pokémon-style battle UI: root 2×2 (Fight / Bag / Party / Run), then Fight 2×3
 * (Attack / Defend / four move slots).
 */
class BattleMenu {
    constructor(battle) {
        this._type = BATTLE_MAIN_MENU;
        this._battle = battle;
        this._currentMenu = this;
        this._displayed = false;
        this._panelTop = 0;
        this._gridMode = "root";
        this._sel = 0;
        this._pointerShown = true;
        this._fightEsc = false;
    }

    getType() {
        return BATTLE_MAIN_MENU;
    }

    isDisplayed() {
        return this._displayed;
    }

    _colsRows() {
        return this._gridMode === "root" ? { c: 2, r: 2 } : { c: 2, r: 3 };
    }

    _hintReserve() {
        return this._gridMode === "fight" ? 14 : 0;
    }

    _cellRect(i) {
        var g = this._colsRows();
        return battleGridCellRect(
            0,
            this._panelTop,
            BATTLE_CMD_AREA_W,
            BATTLE_BOTTOM_PANEL_H,
            g.c,
            g.r,
            i,
            4,
            6,
            this._hintReserve()
        );
    }

    _numCells() {
        var g = this._colsRows();
        return g.c * g.r;
    }

    _cellLabelPair(i) {
        if (this._gridMode === "root") {
            if (i === 0) return { main: Ei("battle.cmd_fight"), sub: null };
            if (i === 1) return { main: Ei("battle.cmd_bag"), sub: null };
            if (i === 2) return { main: Ei("battle.party"), sub: null };
            return { main: Ei("battle.run"), sub: null };
        }
        if (i === 0) return { main: Ei("battle.attack"), sub: null };
        if (i === 1) return { main: Ei("battle.defend"), sub: null };
        var slot = i - 2;
        var sid = g_player.getSpellIdAt(slot);
        if (sid == null) return { main: Ei("battle.move_empty"), sub: null };
        var sp = g_spellData.spells[sid];
        return { main: sp.name, sub: String(sp.mpCost) + " MP" };
    }

    redrawGridContent(highlightIndex) {
        var n = this._numCells();
        var hi = this._pointerShown ? highlightIndex : -1;
        var i;
        for (i = 0; i < n; i++) {
            var r = this._cellRect(i);
            battleGridDrawCellChrome(menuCtx, r.x, r.y, r.w, r.h, i === hi);
        }
        textCtx.save();
        textCtx.textAlign = "center";
        textCtx.textBaseline = "middle";
        var j;
        for (j = 0; j < n; j++) {
            var rr = this._cellRect(j);
            var cx = rr.x + rr.w / 2;
            var cy = rr.y + rr.h / 2;
            var pair = this._cellLabelPair(j);
            textCtx.font = BATTLE_GRID_FONT_MAIN;
            textCtx.fillStyle = "rgba(241, 245, 249, 0.96)";
            var maxW = rr.w - 8;
            if (pair.sub) {
                textCtx.fillText(battleClipText(textCtx, pair.main, maxW), cx, cy - 6);
                textCtx.font = BATTLE_GRID_FONT_SUB;
                textCtx.fillStyle = "rgba(186, 198, 214, 0.92)";
                textCtx.fillText(battleClipText(textCtx, pair.sub, maxW), cx, cy + 7);
            } else {
                textCtx.fillText(battleClipText(textCtx, pair.main, maxW), cx, cy);
            }
        }
        textCtx.restore();

        if (this._gridMode === "fight") {
            textCtx.save();
            textCtx.font = BATTLE_GRID_FONT_SUB;
            textCtx.fillStyle = "rgba(148, 163, 184, 0.88)";
            textCtx.textAlign = "center";
            textCtx.textBaseline = "bottom";
            textCtx.fillText(
                Ei("battle.hint_back"),
                BATTLE_CMD_AREA_W / 2,
                this._panelTop + BATTLE_BOTTOM_PANEL_H - 3
            );
            textCtx.restore();
        }
    }

    display() {
        this._panelTop = mapCanvas.height - BATTLE_BOTTOM_PANEL_H;
        clearLayerRegion(menuCtx, 0, this._panelTop, BATTLE_CMD_AREA_W, BATTLE_BOTTOM_PANEL_H);
        clearLayerRegion(textCtx, 0, this._panelTop, BATTLE_CMD_AREA_W, BATTLE_BOTTOM_PANEL_H);
        drawBox(menuCtx, 0, this._panelTop, BATTLE_CMD_AREA_W, BATTLE_BOTTOM_PANEL_H, 15, 3);
        this._displayed = true;
        this.redrawGridContent(this._sel);
    }

    clear() {
        clearLayerRegion(menuCtx, 0, this._panelTop, BATTLE_CMD_AREA_W, BATTLE_BOTTOM_PANEL_H);
        clearLayerRegion(textCtx, 0, this._panelTop, BATTLE_CMD_AREA_W, BATTLE_BOTTOM_PANEL_H);
        this._displayed = false;
    }

    drawPointer() {
        this._pointerShown = true;
        if (this._displayed && this._currentMenu === this) this.redrawGridContent(this._sel);
    }

    clearPointer() {
        this._pointerShown = false;
        if (this._displayed && this._currentMenu === this) this.redrawGridContent(-1);
    }

    getCurrentMenu() {
        return this._currentMenu;
    }

    setCurrentMenu(menu) {
        this._currentMenu = menu;
    }

    returnTo(clear) {
        this._currentMenu = this;
        this._gridMode = "root";
        this._sel = 0;
        this._fightEsc = false;
        this.drawPointer();
        if (clear) {
            this._battle.clearText();
            this._battle.drawText();
        }
        if (this._displayed) this.display();
    }

    setDisplayed(displayed) {
        this._displayed = displayed;
    }

    displayItemMenu() {
        this._battle.clearText();
        var menu = new BattleItemMenu(this, this._battle);
        menu.display();
        this._currentMenu = menu;
        this._battle.setMonsterWillAttack(false);
    }

    handleKey(key) {
        if (this._currentMenu !== this) {
            this._currentMenu.handleKey(key);
            return;
        }
        if (!this._displayed) return;
        var g = this._colsRows();
        var next = battleGridNav(this._sel, key, g.c, g.r);
        if (next !== this._sel) {
            this._sel = next;
            this.redrawGridContent(this._sel);
        }
    }

    /**
     * @returns {boolean|"done"|"yield"|void} false = 仅切换界面不结束回合; "done" = 子菜单已内部 finishTurn; "yield" = 需 finishTurn 但不强制怪物行动
     */
    handleEnter() {
        if (this._currentMenu !== this) {
            return this._currentMenu.handleEnter();
        }
        if (!this._displayed) return false;
        if (this._gridMode === "root") {
            if (this._sel === 0) {
                this._gridMode = "fight";
                this._sel = 0;
                this._fightEsc = true;
                this.display();
                return false;
            }
            if (this._sel === 1) {
                this.displayItemMenu();
                return false;
            }
            if (this._sel === 2) {
                this._battle.switchPartyInBattle();
                return "yield";
            }
            if (this._sel === 3) {
                this._battle.run();
                return "done";
            }
            return false;
        }
        if (this._sel === 0) {
            this._battle.beginAttack();
            return this._battle._monsterList.length === 1 ? "done" : false;
        }
        if (this._sel === 1) {
            this._battle.defend();
            return "done";
        }
        this._battle.castSpellFromSlot(this._sel - 2);
        return this._battle._monsterWillAttack ? true : false;
    }

    handleESC() {
        if (this._currentMenu !== this) {
            this._currentMenu.handleESC();
            return;
        }
        if (this._gridMode === "fight" && this._fightEsc) {
            this._gridMode = "root";
            this._sel = 0;
            this._fightEsc = false;
            this.display();
        }
    }
}

// ---------- Shop.js ----------

/* Class for shops (SHOP_*, BUY_MENU, SELL_MENU from ShopMenu.js) */
class Shop {
    constructor() {
        this._shopDisplayed = false;
        this._quantity = 1;
        this._maxquantity = 99;
        this._price = 0;
        this._quantityDisplayed = false;
        this._toDisplayQuantity = false;
    }

    shopDisplayed() {
        return this._menu && this._menu.isDisplayed();
    }

    getItemList() {
        return this._itemList;
    }

    displayShop(itemList, toDisplayQty) {
        this._itemList = itemList;
        this._toDisplayQuantity = toDisplayQty;
        this._menu = new ShopMenu(this);
        this._menu.display();
    }

    displayQuantityDialog(item) {
        this._quantity = 1;
        
        var price;
        if (this._menu.getCurrentMenu().getType() == BUY_MENU) {
            price = item.cost;
            this._maxQuantity = 99;
        } else if (this._menu.getCurrentMenu().getType() == SELL_MENU) {
            price = item.sellPrice;
            this._maxQuantity = item.amt;
        }
        this._price = price;
        
        drawBox(menuCtx, 100, 250, 300, 50, 10, 3);
        
        // Text properties
        textCtx.font = MENU_FONT_MAIN;
        textCtx.fillStyle = "rgba(241, 245, 249, 0.98)";
        textCtx.textBaseline = "top";
        
        textCtx.fillText(shopQtyCostLine(this._quantity, this._quantity * price), 120, 266);
        
        this._item = item;
        this._quantityDisplayed = true;
    }

    clearQuantityDialog() {
        if (typeof clearLayerRegion === "function") {
            clearLayerRegion(menuCtx, 100, 250, 300, 50);
            clearLayerRegion(textCtx, 100, 250, 300, 50);
        } else {
            menuCtx.clearRect(98, 248, 304, 54);
            textCtx.clearRect(98, 248, 304, 54);
        }
        
        this._quantityDisplayed = false;
    }

    isQuantityDialogDisplayed() {
        return this._quantityDisplayed;
    }

    /* Increase the quantity that the user will buy */
    increaseQuantity() {
        if (this._quantity < this._maxQuantity)
            this._quantity++;
        
        if (typeof clearLayerRegion === "function") {
            clearLayerRegion(textCtx, 100, 250, 300, 50);
        } else {
            textCtx.clearRect(98, 248, 304, 54);
        }
        textCtx.fillText(shopQtyCostLine(this._quantity, this._quantity * this._price), 120, 266);
    }

    /* Decrease the quantity that the user will buy */
    decreaseQuantity() {
        if (this._quantity > 1)
            this._quantity--;
        
        if (typeof clearLayerRegion === "function") {
            clearLayerRegion(textCtx, 100, 250, 300, 50);
        } else {
            textCtx.clearRect(98, 248, 304, 54);
        }
        textCtx.fillText(shopQtyCostLine(this._quantity, this._quantity * this._price), 120, 266);
    }

    /* Handles arrow key input while any shop is being displayed */
    handleKey(key) {
        if (this._quantityDisplayed) {
            switch(key) {
                case UP_ARROW:
                case RIGHT_ARROW:
                    this.increaseQuantity();
                    break;
                case LEFT_ARROW:
                case DOWN_ARROW:
                    this.decreaseQuantity();
                    break;
            }
        } else if (this._menu.isDisplayed()) {
            this._menu.handleKey(key);
        }
    }

    /* Handle if enter is pressed while shop is being displayed */
    handleEnter() {
        if (this._quantityDisplayed) {
            var menuType = this._menu.getCurrentMenu().getType();
            this._menu.handleESC();
            if (menuType == BUY_MENU)
                this.buyItems();
            else if (menuType == SELL_MENU)
                this.sellItems();
        } else if (this._menu.isDisplayed()) {
            this._menu.handleEnter();
        }
    }

    /* Handle ESC key pressed while shop is being displayed */
    handleESC() {
        if (this._quantityDisplayed)
            this.clearQuantityDialog();
        else if (this._menu.isDisplayed()) {
            this._menu.handleESC();
        }
    }

    /* if toDisplayQty, show Quantity Dialog, otherwise purchase one */
    handlePurchase(item) {
        if (this._toDisplayQuantity)
            this.displayQuantityDialog(item);
        else
            this.buyItem(item);
    }

    /* if toDisplayQty, show Quantity Dialog, otherwise sell one */
    handleSale(item) {
        if (item.amt > 1)
            this.displayQuantityDialog(item);
        else {
            this._menu.getCurrentMenu().clear();
            this.sellItem(item);
        }
    }

    /* Called when user tries to complete purchase of single item. */
    buyItem(item) {
    
        var gold = g_player.getGold();
        if (gold >= item.cost) {
            g_player.spendGold(item.cost);
            g_player.addToInventory(item.id, 1);
            g_textDisplay.displayText(
                BunnyRPG.t("shop.buy_one", { name: item.name, cost: item.cost })
            );
            this._menu.clearGold();
            this._menu.displayGold();
        } else {
            g_textDisplay.displayText(
                BunnyRPG.t("shop.buy_fail_one", { name: item.name, gold: gold })
            );
        }
    }

    /* Called when user tries to complete purchase of multiple items. */
    buyItems() {
        this.clearQuantityDialog();
        
        var item = this._item;
        var gold = g_player.getGold();
        var totalCost = item.cost * this._quantity;
        if (gold >= totalCost) {
            g_player.spendGold(totalCost);
            g_player.addToInventory(item.id, this._quantity);
            g_textDisplay.displayText(
                BunnyRPG.t("shop.buy_many", { qty: this._quantity, name: item.name, cost: totalCost })
            );
            this._menu.clearGold();
            this._menu.displayGold();
        } else {
            g_textDisplay.displayText(
                BunnyRPG.t("shop.buy_fail_many", { qty: this._quantity, name: item.name, gold: gold })
            );
        }
    }

    /* Called when user tries to complete sale of single item. */
    sellItem(item) {
    
        g_player.removeFromInventory(item.id);
        g_player.earnGold(item.sellPrice);
        this._menu.clearGold();
        this._menu.displayGold();
        g_textDisplay.displayText(
            BunnyRPG.t("shop.sell_one", { name: item.name, cost: item.sellPrice })
        );
    }

    /* Called when user tries to complete sale of multiple items. */
    sellItems() {
        this.clearQuantityDialog();
        var item = this._item;
        
        var totalCost = item.sellPrice * this._quantity;
        g_player.removeFromInventory(item.id, this._quantity);
        g_player.earnGold(totalCost);
        this._menu.clearGold();
        this._menu.displayGold();
        g_textDisplay.displayText(
            BunnyRPG.t("shop.sell_many", { qty: this._quantity, name: item.name, cost: totalCost })
        );
    }
}

// ---------- Game.js ----------

class NoSaveException extends Error {
    constructor(message) {
        super(message || "NoSaveException");
        this.name = "NoSaveException";
    }
}

class OldVersionException extends Error {
    constructor(message) {
        super(message || "OldVersionException");
        this.name = "OldVersionException";
    }
}

class Game {
    constructor(titlescreenImgRef) {
        this._titlescreenImgRef = titlescreenImgRef;
        this._flags = {};
        this._loadFunctions = [];
    }

    isFlagSet(flag) {
        return !!this._flags[flag];
    }

    setFlag(flag) {
        this._flags[flag] = true;
    }

    clearFlag(flag) {
        delete this._flags[flag];
    }

    addLoadFunction(callback) {
        this._loadFunctions.push(callback);
    }

    save(slot) {
        try {
            localStorage.setItem(
                OSRPG_STORAGE_PREFIX + slot,
                JSON.stringify({
                    version: CURRENT_VERSION,
                    timestamp: new Date().toString(),
                    player: g_player.createSaveData(),
                    worldmap: g_worldmap.createSaveData(),
                    game: this.createSaveData()
                })
            );
        } catch (e) {
            console.error(e);
        }
    }

    load(slot) {
        var raw = localStorage.getItem(OSRPG_STORAGE_PREFIX + slot);
        var data = null;
        if (raw) {
            try {
                data = JSON.parse(raw);
            } catch (e) {
                data = null;
            }
        }
        if (!data) throw new NoSaveException();
        if (data.version != CURRENT_VERSION) throw new OldVersionException();
        g_player.loadSaveData(data.player);
        g_worldmap.loadSaveData(data.worldmap);
        this.loadSaveData(data.game);
        for (var i = 0; i < this._loadFunctions.length; ++i) this._loadFunctions[i]();
    }

    reset() {
        this._flags = {};
        for (var i = 0; i < this._loadFunctions.length; ++i) this._loadFunctions[i]();
        g_player.reset();
    }

    showTitleScreen() {
        if (g_audio[g_themeMusic]) g_audio[g_themeMusic].play().catch(function () {});
        mapCtx.drawImage(g_imageData.images[this._titlescreenImgRef].img, 0, 0);
        g_menu.setCurrentMenu(new TitleScreenMenu(g_menu));
    }

    exitTitleScreen() {
        if (g_audio[g_themeMusic]) g_audio[g_themeMusic].pause();
    }

    hasSaveInfo(slot) {
        return !!localStorage.getItem(OSRPG_STORAGE_PREFIX + slot);
    }

    getSaveInfo(slot) {
        var raw = localStorage.getItem(OSRPG_STORAGE_PREFIX + slot);
        if (!raw) return "";
        var data;
        try {
            data = JSON.parse(raw);
        } catch (e) {
            return "";
        }
        var timestamp = new Date(data.timestamp);
        if (g_lang !== "en")
            return timestamp.toLocaleString(
                typeof BunnyRPG !== "undefined" && BunnyRPG.localeTag ? BunnyRPG.localeTag() : g_lang,
                { dateStyle: "medium", timeStyle: "short" }
            );
        return dateFormat(timestamp, "ddd, mmm d h:MM TT");
    }

    createSaveData() {
        return this._flags;
    }

    loadSaveData(gameData) {
        this._flags = gameData;
    }
}

// ---------- Battle.js ----------

function battleHpBarColor(pct) {
    if (pct <= 0.2) return "#e84848";
    if (pct <= 0.45) return "#e8c030";
    return "#40c878";
}

function battleRoundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
}

/* Class representing a battle */
class Battle {
    constructor() {
        
        // Initialize properties
        this._background = null;
        this._encounter = null;
        this._monsterList = null;
        this._currentAction = BATTLE_MENU_ATTACK;
        this._mainMenu = new BattleMenu(this);
        this._currentMenu = this._mainMenu;
        this._over = false;
        this._win = false;
        this._line = 0;
        this._txt = "";        
        this._totalExp = 0;
        this._totalGold = 0;
        this._monsterWillAttack = true;
        this._defending = false;
        this._ignoringKeys = false;
        this._writing = false;
        this._delay = 0;
        this._enemyHudRect = { x: 0, y: 0, w: 0, h: 0 };
        this._playerHudRect = { x: 0, y: 0, w: 0, h: 0 };
        
        var screenHeight = mapCanvas.height;
        var logTop = screenHeight - BATTLE_BOTTOM_PANEL_H + 12;
        this._textHeight = [logTop, logTop + 22, logTop + 44, logTop + 66];
    }

    /* Setup random encounter */
    setupRandomEncounter(zone, backgroundRef, battleMusic) {
        
        this._background = g_imageData.images[backgroundRef].img;
        this._music = battleMusic;
        if (!!battleMusic) {
            g_worldmap.getSubMap(g_worldmap.getCurrentSubMapId()).pauseMusic();
            if (g_audio[battleMusic]) g_audio[battleMusic].play().catch(function () {});
        }
        
        // Get encounter data associated with zone
        var zoneXml = null;
        for (var i = 0; i < g_encounterData.zones.length; ++i)
            if (g_encounterData.zones[i].zone == zone)
                zoneXml = g_encounterData.zones[i];
        if (zoneXml != null) {
            
            // Choose an encounter randomly
            var len = zoneXml.encounters.length;
            var r = Math.floor(Math.random() * len);
            this._encounter = zoneXml.encounters[r];

            // Create monster list
            this._monsterList = [];
            for (var j = 0; j < this._encounter.monsters.length; ++j) {
                var monsterId = this._encounter.monsters[j];
                for (var k = 0; k < g_monsterData.monsters.length; ++k)
                    if (g_monsterData.monsters[k].id == monsterId) {
                        var monster = new Monster(g_monsterData.monsters[k]);
                        this._monsterList.push(monster);
                    }
            }
        }
        
        if (keyDown)
            this._ignoringKeys = true;
    }

    /* Setup scripted encounter (for boss monsters, etc.) */
    setupEncounter(name, aryMonsters, backgroundRef) {
        
        this._background = g_imageData.images[backgroundRef].img;
        
        // Create encounter object
        this._encounter = {
            "name": name,
            "monsters": aryMonsters
        };
        
        // Create monster list
        this._monsterList = [];
        for (var i = 0; i < aryMonsters.length; ++i) {
            var monsterId = aryMonsters[i];
            for (var j = 0; j < g_monsterData.monsters.length; ++j)
                if (g_monsterData.monsters[j].id == monsterId) {
                    var monster = new Monster(g_monsterData.monsters[j]);
                    this._monsterList.push(monster);
                }
        }
        
        if (keyDown)
            this._ignoringKeys = true;
    }

    /* Draws battle screen */
    draw() {
        var screenWidth = mapCanvas.width;
        var screenHeight = mapCanvas.height;

        // Draw battle background
        mapCtx.drawImage(this._background, 0, 0, screenWidth, screenHeight);

        spriteCtx.clearRect(0, 0, screenWidth, screenHeight);
        this.drawMonsters();
        this.drawPlayer();
        this.drawEnemyHudPanel();
        this.drawPlayerHudPanel();
        
        this._mainMenu.display();

        textCtx.font = MENU_FONT_MAIN;
        textCtx.fillStyle = "rgba(241, 245, 249, 0.98)";
        var txt = translateEncounterAppear(this._encounter.name);
        textCtx.fillText(txt, BATTLE_LOG_X, this._textHeight[0]);
        this._line = 1;
        this._txt = txt;
    }

    _getFirstLivingMonster() {
        for (var i = 0; i < this._monsterList.length; i++) {
            if (!this._monsterList[i].isDead()) return this._monsterList[i];
        }
        return null;
    }

    /* Opponent HUD — top-right, Pokémon-style */
    drawEnemyHudPanel() {
        var m = this._getFirstLivingMonster();
        var sw = spriteCanvas.width;
        var pw = 168;
        var ph = 54;
        var x = sw - pw - 14;
        var y = 10;
        this._enemyHudRect = { x: x - 4, y: y - 4, w: pw + 8, h: ph + 8 };
        if (!m) return;

        spriteCtx.save();
        battleRoundRect(spriteCtx, x, y, pw, ph, 8);
        spriteCtx.fillStyle = "rgba(250, 252, 255, 0.96)";
        spriteCtx.fill();
        spriteCtx.strokeStyle = "#2a2a38";
        spriteCtx.lineWidth = 2;
        spriteCtx.stroke();

        var pct = m.getHP() / m.getMaxHP();
        if (pct < 0) pct = 0;
        if (pct > 1) pct = 1;

        spriteCtx.fillStyle = "#1a1a24";
        spriteCtx.font = MENU_FONT_SMALL;
        spriteCtx.textBaseline = "top";
        spriteCtx.fillText(m.getName(), x + 10, y + 8);

        var bx = x + 10;
        var by = y + 30;
        var bw = pw - 20;
        var bh = 10;
        spriteCtx.fillStyle = "#404050";
        battleRoundRect(spriteCtx, bx, by, bw, bh, 3);
        spriteCtx.fill();
        var fillW = Math.max(0, Math.floor(bw * pct));
        if (fillW > 0) {
            spriteCtx.fillStyle = battleHpBarColor(pct);
            battleRoundRect(spriteCtx, bx, by, fillW, bh, 3);
            spriteCtx.fill();
        }
        spriteCtx.strokeStyle = "#1a1a24";
        spriteCtx.lineWidth = 1;
        battleRoundRect(spriteCtx, bx, by, bw, bh, 3);
        spriteCtx.stroke();

        spriteCtx.fillStyle = "#2a2a38";
        spriteCtx.font = '500 11px system-ui, "Segoe UI", "Microsoft YaHei", sans-serif';
        spriteCtx.textAlign = "right";
        spriteCtx.fillText(m.getHP() + " / " + m.getMaxHP(), x + pw - 8, y + 8);
        spriteCtx.textAlign = "left";
        spriteCtx.restore();
    }

    clearEnemyHudPanel() {
        var r = this._enemyHudRect;
        spriteCtx.clearRect(r.x, r.y, r.w, r.h);
    }

    /* Player HUD — above command bar, left (@param overrideHp optional during anim) */
    drawPlayerHudPanel(overrideHp) {
        var sh = spriteCanvas.height;
        var pw = 196;
        var ph = 50;
        var x = 10;
        var y = sh - BATTLE_BOTTOM_PANEL_H - ph - 6;
        this._playerHudRect = { x: x - 4, y: y - 4, w: pw + 8, h: ph + 8 };

        var curHp = overrideHp != null ? overrideHp : g_player.getHP();
        var hpPct = curHp / g_player.getMaxHP();
        if (hpPct < 0) hpPct = 0;
        if (hpPct > 1) hpPct = 1;
        var mpPct = g_player.getMaxMP() > 0 ? g_player.getMP() / g_player.getMaxMP() : 0;
        if (mpPct < 0) mpPct = 0;
        if (mpPct > 1) mpPct = 1;

        spriteCtx.save();
        battleRoundRect(spriteCtx, x, y, pw, ph, 8);
        spriteCtx.fillStyle = "rgba(250, 252, 255, 0.96)";
        spriteCtx.fill();
        spriteCtx.strokeStyle = "#2a2a38";
        spriteCtx.lineWidth = 2;
        spriteCtx.stroke();

        spriteCtx.fillStyle = "#1a1a24";
        spriteCtx.font = MENU_FONT_SMALL;
        spriteCtx.textBaseline = "top";
        var lvLabel = BunnyRPG.t("battle.hud.lv");
        spriteCtx.fillText(g_player.getName() + "  " + lvLabel + g_player.getLevel(), x + 10, y + 6);

        var bx = x + 10;
        var hpY = y + 26;
        var bw = pw - 20;
        var hpH = 8;
        spriteCtx.fillStyle = "#404050";
        battleRoundRect(spriteCtx, bx, hpY, bw, hpH, 2);
        spriteCtx.fill();
        var hpFill = Math.max(0, Math.floor(bw * hpPct));
        if (hpFill > 0) {
            spriteCtx.fillStyle = battleHpBarColor(hpPct);
            battleRoundRect(spriteCtx, bx, hpY, hpFill, hpH, 2);
            spriteCtx.fill();
        }
        battleRoundRect(spriteCtx, bx, hpY, bw, hpH, 2);
        spriteCtx.strokeStyle = "#1a1a24";
        spriteCtx.lineWidth = 1;
        spriteCtx.stroke();

        var mpY = hpY + hpH + 3;
        var mpH = 5;
        spriteCtx.fillStyle = "#404050";
        battleRoundRect(spriteCtx, bx, mpY, bw, mpH, 2);
        spriteCtx.fill();
        var mpFill = Math.max(0, Math.floor(bw * mpPct));
        if (mpFill > 0) {
            spriteCtx.fillStyle = "#6898e8";
            battleRoundRect(spriteCtx, bx, mpY, mpFill, mpH, 2);
            spriteCtx.fill();
        }
        battleRoundRect(spriteCtx, bx, mpY, bw, mpH, 2);
        spriteCtx.strokeStyle = "#1a1a24";
        spriteCtx.stroke();

        spriteCtx.fillStyle = "#3a3a48";
        spriteCtx.font = '500 10px system-ui, "Segoe UI", "Microsoft YaHei", sans-serif';
        spriteCtx.textAlign = "right";
        spriteCtx.fillText(curHp + "/" + g_player.getMaxHP(), x + pw - 8, y + 6);
        spriteCtx.textAlign = "left";
        spriteCtx.restore();
    }

    clearPlayerHudPanel() {
        var r = this._playerHudRect;
        spriteCtx.clearRect(r.x, r.y, r.w, r.h);
    }

    refreshEnemyHud() {
        this.clearEnemyHudPanel();
        this.drawEnemyHudPanel();
    }

    refreshPlayerHud() {
        this.clearPlayerHudPanel();
        this.drawPlayerHudPanel();
    }

    /* Draws player on battle screen — front-left, facing opponent */
    drawPlayer() {
        var sh = spriteCanvas.height;
        var dx = BATTLE_PLAYER_SPRITE_X;
        var dy = sh - BATTLE_BOTTOM_PANEL_H - BATTLE_PLAYER_SPRITE_SRC_H + 12;
        this._playerSpriteRect = {
            x: dx - 2,
            y: dy - 2,
            w: SPRITE_WIDTH + 4,
            h: BATTLE_PLAYER_SPRITE_SRC_H + 4
        };

        var battleSy = FACING_UP * SPRITE_HEIGHT + (SPRITE_HEIGHT - BATTLE_PLAYER_SPRITE_SRC_H);
        spriteCtx.drawImage(g_player._img,
            SPRITE_WIDTH,
            battleSy,
            SPRITE_WIDTH,
            BATTLE_PLAYER_SPRITE_SRC_H,
            dx,
            dy,
            SPRITE_WIDTH,
            BATTLE_PLAYER_SPRITE_SRC_H);
    }

    /* Erases player on battle screen */
    clearPlayer() {
        var r = this._playerSpriteRect;
        if (r) spriteCtx.clearRect(r.x, r.y, r.w, r.h);
    }

    /* Draws enemies — upper-right cluster */
    drawMonsters() {
        var sw = spriteCanvas.width;
        var ey = BATTLE_ENEMY_SPRITE_Y;
        var gap = 12;
        var destRight = sw - 24;
        for (var i = 0; i < this._monsterList.length; ++i) {
            var monster = this._monsterList[i];
            var img = g_imageData.images[monster.getImageRef()].img;
            var mw = monster.getWidth();
            var mh = monster.getHeight();
            destRight -= mw;
            var destLeft = destRight;
            spriteCtx.drawImage(img,
                monster.getLeft(),
                monster.getTop(),
                mw,
                mh,
                destLeft,
                ey,
                mw,
                mh);
            
            monster.setLoc(destLeft);
            monster._battleDrawY = ey;
            destRight -= gap;
        }
    }

    /* Erases enemy on battle screen */
    clearMonster(id) {
        var monster = this._monsterList[id];
        var y = monster._battleDrawY != null ? monster._battleDrawY : BATTLE_ENEMY_SPRITE_Y;
        spriteCtx.clearRect(
            monster.getLoc(),
            y,
            monster.getWidth(),
            monster.getHeight());
    }

    drawHealthBar() {
        this.drawPlayerHudPanel();
    }

    drawManaBar() {}

    clearHealthBar() {
        this.clearPlayerHudPanel();
    }

    clearManaBar() {}

    updateHealthBar(health) {
        this.clearPlayerHudPanel();
        this.drawPlayerHudPanel(health);
    }

    /* Writes a message line on bottom right box of battle screen */
    writeMsg(msg) {
        this._writing = true;
        this._mainMenu.clearPointer();
        window.setTimeout(function() {
            g_battle.drawText();
            var line = g_battle._line <= 4 ? g_battle._line : 4;
            textCtx.fillText(msg, BATTLE_LOG_X, g_battle._textHeight[line]);
            g_battle._txt += "\n" + msg;
            g_battle._line++;
            g_battle._delay -= MESSAGE_DELAY;
            if (g_battle._delay == 0) {
                g_battle._writing = false;
                if (!g_battle._over)
                    g_battle._mainMenu.drawPointer();
            }
        }, this._delay);
        this._delay += MESSAGE_DELAY;
    }

    /* Draws the previously written text */
    drawText() {
        
        textCtx.font = MENU_FONT_MAIN;
        textCtx.fillStyle = "rgba(241, 245, 249, 0.98)";
        textCtx.textBaseline = "top";

        this.clearText();
        var prevText = this._txt.split("\n");
        if (this._line <= 4) {
            for (var i = 0; i < this._line; ++i)
                textCtx.fillText(prevText[i], BATTLE_LOG_X, this._textHeight[i]);
        } else {
            for (var i = 0; i < 4; ++i) {
                var lineText = prevText[prevText.length - 4 + i];
                textCtx.fillText(lineText, BATTLE_LOG_X, this._textHeight[i]);
            }
        }
    }

    /* Clears battle log text (right side of bottom panel) */
    clearText() {
        var panelTop = mapCanvas.height - BATTLE_BOTTOM_PANEL_H;
        var top = Math.min.apply(null, this._textHeight) - 6;
        if (top < panelTop + 4) top = panelTop + 4;
        textCtx.clearRect(
            BATTLE_LOG_X - 10,
            top,
            textCanvas.width - (BATTLE_LOG_X - 10) + 12,
            textCanvas.height - top
        );
    }

    /* End of the battle */
    end() {
        menuCtx.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
        spriteCtx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        if (this._music && g_audio[this._music]) g_audio[this._music].pause();
        var battle = this;
        g_battle = null;
        if (!g_player.isDead()) {
            g_worldmap.redraw();
            g_worldmap.drawSprites();
            g_player.plot();

            g_worldmap.getSubMap(g_worldmap.getCurrentSubMapId()).playMusic();

            if (battle._win) battle.onWin();
            battle.onExit();
        } else {
            g_titlescreen = true;
            g_game.showTitleScreen();
        }
    }

    /* Handles input while battling for up, down, left, and right arrow keys */
    handleKey(key) {
        if (!this._writing && !this._ignoringKeys && !this._over && !g_player.isDead()) {
            this._currentMenu.handleKey(key);
        }
    }

    /* Handles input of enter key or spacebar while battling */
    handleEnter() {
        if (!this._writing && !g_player.isDead()) {
            if (this._over)
                this.end();
            else {
                this._defending = false;
                var st = this._currentMenu.handleEnter();
                if (st === false) {
                    this._monsterWillAttack = false;
                    return;
                }
                if (st === "done") return;
                if (st === "yield") {
                    this.finishTurn();
                    return;
                }
                this._monsterWillAttack = true;
                this.finishTurn();
            }
        }
    }

    /* handles input of ESC key while battling. */
    handleESC() {
        if (this._over) {
            this.end();
        } else {
            this._currentMenu.handleESC();
        }
    }

    /* handles key up event */
    handleKeyUp() {
        this._ignoringKeys = false;
    }

    setMonsterWillAttack(willAttack) {
        this._monsterWillAttack = willAttack;
    }

    castSpellFromSlot(slotIndex) {
        var sid = g_player.getSpellIdAt(slotIndex);
        if (sid == null) {
            this.writeMsg(Ei("battle.no_move_slot"));
            this.setMonsterWillAttack(false);
            return;
        }
        var spell = g_spellData.spells[sid];
        if (g_player.getMP() < spell.mpCost) {
            this.writeMsg(BunnyRPG.t("battle.msg.no_mp"));
            this.writeMsg(
                BunnyRPG.t("battle.msg.cast_suffix", { name: spell.name })
            );
            this.setMonsterWillAttack(false);
            return;
        }
        switch (spell.type) {
            case SPELLTYPE_HEAL_ONE:
                spell.use(g_player);
                break;
            case SPELLTYPE_ATTACK_ALL:
                spell.use();
                break;
        }
        g_player.useMP(parseInt(spell.mpCost, 10));
        this.setMonsterWillAttack(true);
    }

    switchPartyInBattle() {
        this.writeMsg(Ei("battle.party_solo"));
        this.setMonsterWillAttack(false);
    }

    /* called from battle menu to begin the attack of the monster */
    beginAttack() {
        this._currentAction = BATTLE_MENU_ATTACK;
        if (this._monsterList.length == 1) {
            this.setMonsterWillAttack(true);
            this.attack(0);
            this.finishTurn();
        } else {

            // There is more than one monster, enter selecting mode.
            this._currentMenu = new MonsterMenu(this._currentMenu, this, this._monsterList); 
            this._currentMenu.selectFirstLiveMonster();
            this._currentMenu.display();
            this._monsterWillAttack = false;
        }
    }

    /* called from battle menu to begin defending */
    defend() {
        this._defending = true;
        this.writeMsg(BunnyRPG.t("battle.msg.defended"));
        this.setMonsterWillAttack(true);
        this.finishTurn();
    }

    /* Finish turn after selecting monster and performing action */
    finishTurn() {
        
        // Monster's turn
        if (!this._over && this._monsterWillAttack)
            this.monsterTurn(false);
        
        // Update Health Bar
        if (this._monsterWillAttack) {
            this.runAfterWriting(function() {
                g_battle.clearHealthBar();
                g_battle.clearManaBar();
                g_battle.drawHealthBar();
                g_battle.drawManaBar();
                g_battle.refreshEnemyHud();
                if (!g_battle._over) {
                    g_battle._currentMenu = g_battle._mainMenu;
                    g_battle._mainMenu.returnTo(false);
                }
            });
        }
        
        this._defending = false;
        this._monsterWillAttack = false;
    }

    /* Utility function to run callback function when writing is finished */
    runAfterWriting(callback) {
        if (this._writing) {
            window.setTimeout(function() {
                g_battle.runAfterWriting(callback);
            });
        }         else
            callback();
    }

    /* Utility function to call a function for each monster currently alive
     * callback function takes a monster and id. */
    forEachMonster(callback) {
        for (var i = 0; i < this._monsterList.length; ++i)
            if (!this._monsterList[i].isDead())
                callback(this._monsterList[i], i);
    }

    // Earn gold & exp associated with killing a monster
    earnReward(monster, id) {
        var battle = this;
        window.setTimeout(function() {
            battle.clearMonster(id);
        }, this._delay);
        this.writeMsg(
            BunnyRPG.t("battle.msg.monster_killed", { name: battleMonsterDisplayName(monster.getName()) })
        );
        this._totalExp += monster.getExp();
        this._totalGold += monster.getGold();

        // If all monsters are dead...
        for (var i = 0; i < this._monsterList.length; ++i)
            if (!this._monsterList[i].isDead())
                return;

        // End battle and award exp & gold to player.
        g_player.earnGold(this._totalGold);
        var gainedLevel = g_player.earnExp(this._totalExp);
        this.writeMsg(
            BunnyRPG.t("battle.msg.exp_gained", { exp: this._totalExp })
        );
        this.writeMsg(
            BunnyRPG.t("battle.msg.gold_gained", { gold: this._totalGold })
        );
        if (gainedLevel) this.writeMsg(BunnyRPG.t("battle.msg.level_up"));
        this._over = true;
        this._win = true;
        this._mainMenu.clearPointer();
    }

    doActionToMonster(id) {
        switch (this._currentAction) {
            case BATTLE_MENU_ATTACK:
                this.setMonsterWillAttack(true);
                this.attack(id);
                this.finishTurn();
                break;
            case BATTLE_MENU_DEFEND:
                this._defending = true;
                break;
            case BATTLE_MENU_ITEM:
                // not implemented
                break;
            case BATTLE_MENU_SPELL:
                // not implemented
                break;
            case BATTLE_MENU_RUN:
                // not possible
                break;
        }
    }

    /* Player attacks monster with id provided */
    attack(id) {
        
        // Basic battle system; determine damage from attack and defense
        var monster = this._monsterList[id];
        var rand = Math.random();
        if (rand > 0.95) {
            this.writeMsg(BunnyRPG.t("battle.msg.you_missed"));
        } else {
            var damage = g_player.getAttack() - monster.getDefense();
            if (rand > 0.9) {
                this.writeMsg(BunnyRPG.t("battle.msg.crit"));
                damage *= 2;
            }
            if (damage < 1)
                damage = 1;
            damage -= Math.floor(Math.random() * damage / 2);
            this.writeMsg(BunnyRPG.t("battle.msg.you_hit", { dmg: damage }));
            monster.damage(damage);

            // If monster is dead, earn exp & gold associated.
            if (monster.isDead()) {
                this.earnReward(monster, id);
            } else {
                this.refreshEnemyHud();
            }
        }
    }

    /* Monsters attack the player */
    monsterTurn() {
        for (var i = 0; i < this._monsterList.length; ++i) {
            var monster = this._monsterList[i];
            if (!monster.isDead()) {
                if (monster.hasSpecialAttack() && Math.random() < 0.5)
                    monster.useSpecialAttack();
                else {
                    // Basic battle system; determine damage from attack and defense
                    var rand = Math.random();
                    if (rand > 0.9) {
                        this.writeMsg(
                            BunnyRPG.t("battle.msg.monster_missed", { name: battleMonsterDisplayName(monster.getName()) })
                        );
                    } else {
                        var damage = monster.getAttack() - g_player.getDefense();
                        if (rand > 0.86) {
                            this.writeMsg(BunnyRPG.t("battle.msg.terrible_hit"));
                            damage = 2 * monster.getAttack() - g_player.getDefense();
                        }
                        if (this._defending)
                            damage = Math.floor(damage / 2.5);
                        if (damage < 1)
                            damage = 1;
                        damage -= Math.floor(Math.random() * damage / 2);
                        g_player.damage(damage);
                        this.writeMsg(
                            BunnyRPG.t("battle.msg.monster_attack", { name: battleMonsterDisplayName(monster.getName()) })
                        );
                        this.writeMsg(
                            BunnyRPG.t("battle.msg.damage_amount", { dmg: damage })
                        );

                        // Update health bar as you go.
                        var battle = this;
                        var health = g_player.getHP();
                        window.setTimeout(function(health) {
                            return function() {
                                battle.updateHealthBar(health);
                            };
                        }(health), this._delay);
                    }   
                }
                
                // If player is dead, end game!
                if (g_player.isDead()) {
                    this.writeMsg(BunnyRPG.t("battle.msg.you_died"));
                    this._over = true;
                    this._mainMenu.clearPointer();
                    var battle = this;
                    this.runAfterWriting(function() {
                        battle.clearPlayer();
                    });
                    return;
                }
            }
        }
    }

    /* Player will attempt to run */
    run() {
        if (Math.random() >= 0.33) {
            this.writeMsg(BunnyRPG.t("battle.msg.run_start"));
            this.monsterTurn(false);
            if (g_player.isDead() || this._over)
                return false;
            if (Math.random() < 0.33) {
                this.writeMsg(BunnyRPG.t("battle.msg.run_fail"));
                return false;
            }
        }
        
        this.writeMsg(BunnyRPG.t("battle.msg.run_ok"));
        this._over = true;
        this._mainMenu.clearPointer();
        var battle = this;
        this.runAfterWriting(function() {
            battle.clearPlayer();
        });
        return true;
    }

    /* Use the selected item. Returns true if an item was used. */
    useItem() {
        if (this._itemSelection < this._numItems) {
            var itemId = this._itemId[this._itemSelection];
            var item = g_itemData.items[itemId];
            if (item.effectScript && typeof ItemEffectRun !== "undefined") {
                ItemEffectRun(item.effectScript, { target: g_player, itemId: itemId, inBattle: true });
            } else if (typeof item.use === "function") {
                switch (item.type) {
                    case ITEMTYPE_HEAL_ONE:
                        item.use(g_player);
                        break;
                    case ITEMTYPE_ATTACK_ALL:
                        item.use();
                        break;
                }
            }
            g_player.removeFromInventory(itemId);
            return true;
        }
        return false;
    }

    /* Use the selected spell. Returns true if a spell was used. */
    useSpell() {
        if (this._spellSelection < this._numSpells) {
            var spellId = this._spellId[this._spellSelection];
            var spell = g_spellData.spells[spellId];
            if (g_player.getMP() >= spell.mpCost) {
                switch(spell.type) {
                    case SPELLTYPE_HEAL_ONE:
                        spell.use(g_player);
                        break;
                    case SPELLTYPE_ATTACK_ALL:
                        spell.use();
                        break;
                }
                g_player.useMP(spell.mpCost);
                return true;
            } else {
                this.writeMsg(BunnyRPG.t("battle.msg.no_mp"));
                this.writeMsg(
                    BunnyRPG.t("battle.msg.cast_suffix", { name: spell.name })
                );
            }
        }
        return false;
    }

    onExit() {
        // What happens after the battle is over and you exit?
    }

    onWin() {
        // What happens after the battle is over and you have won?
    }
}
