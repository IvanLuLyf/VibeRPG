/**
 * `registerGameMap(id, config)` 由 js/game/maps/maps-starter.js（或你自建的地图脚本）调用。
 */
var g_mapData = { submaps: {} };
function registerGameMap(id, config) {
    g_mapData.submaps[id] = config;
}
