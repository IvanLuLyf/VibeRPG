/**
 * 最小可玩骨架：0=据点（商店/宝箱/NPC 战），1=野外遇敌。在此文件扩展剧情与地图。
 */
(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(SUBMAP_WORLD_MAP, {
        id: SUBMAP_WORLD_MAP,
        tileset: {
            imgRef: "InqIndoors",
            width: 256,
            height: 8704
        },
        xmlUrl: "xml/House2.tmx.xml",
        randomEncounters: false,
        music: "town",
        overWorld: false,
        load: function () {
            g_player = new Player(7, 12, "frieren", SUBMAP_WORLD_MAP, FACING_DOWN, PLAYER_TREVOR);
            g_menu.setOnNewGame(function () {
                g_worldmap.goToMap(g_player, SUBMAP_WORLD_MAP, 7, 12, 0, 2, FACING_DOWN);
            });
        },
        exit: {
            at: "bottom",
            toMapId: SUBMAP_START_FIELD,
            toX: 10,
            toY: 16,
            toScrollX: 3,
            toScrollY: 8,
            facing: FACING_UP
        },
        npcs: [
            {
                imgRef: "woman2",
                locX: 7,
                locY: 3,
                facing: FACING_DOWN,
                walks: false,
                displayText: "道具店（示例）。在 maps-starter.js 里改商品与台词。",
                callback: function () {
                    g_shop.displayShop([ITEM_POTION, ITEM_ETHER, ITEM_BOMB], true);
                }
            },
            {
                imgRef: "soldier",
                locX: 13,
                locY: 10,
                facing: FACING_LEFT,
                walks: false,
                displayText: "训练用木人（关闭对话框后进入战斗）。",
                callback: function () {
                    g_textDisplay.setCallback(function () {
                        keyBuffer = 0;
                        g_battle = new Battle();
                        g_battle.setupEncounter("Training dummy", [1], "meadow");
                        g_battle.draw();
                    });
                    g_textDisplay.displayText("开始吗？");
                }
            }
        ],
        actions: [
            {
                locX: 7,
                locY: 4,
                dir: FACING_UP,
                onAction: function () {
                    g_mapData.submaps[SUBMAP_WORLD_MAP].npcs[0].npc.action();
                }
            }
        ],
        chests: [
            {
                imgRef: "chest",
                locX: 2,
                locY: 10,
                event: "starter_chest",
                action: function () {
                    this.onOpenFindItem("示例宝箱。", ITEM_POTION, 1);
                }
            }
        ]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(SUBMAP_START_FIELD, {
        id: SUBMAP_START_FIELD,
        tileset: {
            imgRef: "MountainPass",
            width: 512,
            height: 512
        },
        xmlUrl: "xml/Mountain.tmx.xml",
        randomEncounters: true,
        zone: "starter_field",
        background: "meadow",
        battleMusic: "danger",
        music: "explore",
        overWorld: false,
        exit: {
            at: "bottom",
            toMapId: SUBMAP_WORLD_MAP,
            toX: 7,
            toY: 14,
            toScrollX: 0,
            toScrollY: 4,
            facing: FACING_DOWN
        },
        npcs: [
            {
                imgRef: "boy",
                locX: 3,
                locY: 5,
                facing: FACING_RIGHT,
                walks: false,
                displayText: "往南走出地图回到据点。草地上会随机遇敌。"
            }
        ]
    });
})();
