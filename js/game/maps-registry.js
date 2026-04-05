/**
 * Game map registry: regional bundles under js/game/maps/maps-*.js call registerGameMap.
 * Core engine + main.js only read g_mapData.
 * From monolithic maps.js: node tools/split-maps.mjs path/to/maps.js → map-NN.js
 * Then: node tools/merge-map-regions.mjs (needs map-NN.js present) → maps-*.js ; remove map-NN.js
 */
var g_mapData = { submaps: {} };
function registerGameMap(id, config) {
    g_mapData.submaps[id] = config;
}
