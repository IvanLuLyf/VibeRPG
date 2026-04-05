/* World overworld (SUBMAP_WORLD_MAP) */
(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(0, {
            id: SUBMAP_WORLD_MAP,
            tileset: {
                imgRef: "world",
                width: 256,
                height: 1152
            },
            xmlUrl: "xml/WorldMap1.tmx.xml",
            randomEncounters: true,
            background: "meadow",
            music: "explore",
            battleMusic: "danger",
            overWorld: true,
            load: function() {
                g_player = new Player(23, 13, "trevor", 0, FACING_DOWN, PLAYER_TREVOR);
                g_menu.setOnNewGame(function() {
                    g_worldmap.goToMap(g_player, 0, 23, 13, 17, 8, FACING_DOWN);
                });
            },
            entrances: [{
                fromX: 23,
                fromY: 14,
                toMapId: SUBMAP_TOWN,
                toX: 9,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP,
                onEnter: function() {
                    g_player.restore();
                }
            }, {
              //Mountain entrance (left)
                fromX: 13,
                fromY: 2,
                toMapId: SUBMAP_MOUNTAIN_PASS,
                toX: 1,
                toY: 9,
                toScrollX: 0,
                toScrollY: 5,
                facing: FACING_RIGHT
            }, {
              //Mountain entrance (right)
                fromX: 15,
                fromY: 3,
                toMapId: SUBMAP_MOUNTAIN_PASS,
                toX: 18,
                toY: 9,
                toScrollX: 7,
                toScrollY: 5,
                facing: FACING_LEFT
            }, {
                fromX: 35,
                fromY: 4,
                toMapId: SUBMAP_CASTLE_TOWN,
                toX: 10,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 21,
                fromY: 18,
                toMapId: SUBMAP_KINGDOM,
                toX: 30,
                toY: 57,
                toScrollX: 24,
                toScrollY: 49,
                facing: FACING_UP
            }, {
                fromX: 13,
                fromY: 9,
                toMapId: SUBMAP_FOREST_DUNGEON,
                toX: 9,
                toY: 28,
                toScrollX: 3,
                toScrollY: 19,
                facing: FACING_UP
            }]
    });
})();

