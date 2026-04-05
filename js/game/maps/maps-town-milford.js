/* Milford: town + houses + library (8–12) */
(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(8, {
            id: SUBMAP_TOWN,
            tileset: {
              imgRef: "BrowserQuest",
              width: 256,
              height: 2560
            },
            xmlUrl: "xml/Town3.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: true,
            entrances: [{
                fromX: 1,
                fromY: 5,
                toMapId: SUBMAP_TOWN_HOUSEA,
                toX: 7,
                toY: 13,
                toScrollX: 2,
                toScrollY: 4,
                facing: FACING_UP
            }, { 
                fromX: 15,
                fromY: 6,
                toMapId: SUBMAP_TOWN_HOUSEB,
                toX: 6,
                toY: 13,
                toScrollX: 0,
                toScrollY: 4,
                facing: FACING_UP
            }, { 
                fromX: 2,
                fromY: 15,
                toMapId: SUBMAP_TOWN_HOUSEC,
                toX: 7,
                toY: 13,
                toScrollX: 2,
                toScrollY: 4,
                facing: FACING_UP
            }, {   
                fromX: 17,
                fromY: 15,
                toMapId: SUBMAP_TOWN_LIBRARY,
                toX: 6,
                toY: 13,
                toScrollX: 1,
                toScrollY: 4,
                facing: FACING_UP
            }, {
                fromX: 9,
                fromY: 0,
                toMapId: SUBMAP_CASTLE_EXTERIOR,
                toX: 12,
                toY: 17,
                toScrollX: 6, 
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 10,
                fromY: 0,
                toMapId: SUBMAP_CASTLE_EXTERIOR,
                toX: 12,
                toY: 17,
                toScrollX: 6, 
                toScrollY: 9,
                facing: FACING_UP
            }],
            exit: {
                at: "bottom",
                toMapId: SUBMAP_WORLD_MAP,
                toX: 23,
                toY: 14,
                toScrollX: 17,
                toScrollY: 9,
                facing: FACING_DOWN
            }, 
            npcs: [{
                imgRef: "woman1",
                locX: 2,
                locY: 8,
                facing: FACING_DOWN,
                displayText: "Our town is small, but we manage to get \nby.",
                walks: false
            }, {
                imgRef: "man1",
                locX: 12,
                locY: 11,
                facing: FACING_LEFT,
                walks: false,
                script:
                    "t|game.npc_potmoon_hint\nt|game.npc_password_ask\nprompt_secret|POTMOON"
            }, {
                imgRef: "boy",
                locX: 7,
                locY: 15,
                facing: FACING_RIGHT, 
                displayText: "My older brother went to the forest to \nlook for my father, but they have not \nreturned yet...sniff.",
                walks: true,
                zone: {
                    x: 4,
                    y: 15,
                    w: 7,
                    h: 3
                }
            }, {
                imgRef: "man1",
                locX: 8,
                locY: 2,
                facing: FACING_RIGHT,
                displayText: "Welcome to the town of (Town name).",
                walks: false
            },{
                imgRef: "soldier",
                locX: 12,
                locY: 18,
                facing: FACING_LEFT,
                displayText: "The king is recruiting all able men to \nvanquish the terror within the forest.",
                walks: false
            }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(9, {
            id: SUBMAP_TOWN_HOUSEA,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/House11.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_TOWN,
                toX: 1,
                toY: 6,
                toScrollX: 0,
                toScrollY: 2,
                facing: FACING_DOWN
            }
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(10, {
            id: SUBMAP_TOWN_HOUSEB,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/House2.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_TOWN,
                toX: 15,
                toY: 7,
                toScrollX: 7,
                toScrollY: 2,
                facing: FACING_DOWN
            }
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(11, {
            id: SUBMAP_TOWN_HOUSEC,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/House3.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_TOWN,
                toX: 2,
                toY: 16,
                toScrollX: 0,
                toScrollY: 9,
                facing: FACING_DOWN
            },
            npcs: [{
                imgRef: "woman1",
                locX: 5,
                locY: 4,
                facing: FACING_RIGHT,
                displayText: "My husband has not returned yet. It has \nbeen three days since he left for the \ndark forest.",
                walks: false
            }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(12, {
            id: SUBMAP_TOWN_LIBRARY,
            tileset: {
                imgRef: "InqIndoors",
                width: 256,
                height: 8704
            },
            xmlUrl: "xml/House4.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_TOWN,
                toX: 17,
                toY: 16,
                toScrollX: 7, 
                toScrollY: 9,
                facing: FACING_DOWN
            },
            npcs: [{
                imgRef: "boy",
                locX: 11,
                locY: 12,
                facing: FACING_RIGHT,
                displayText: "When I am not doing chores, I enjoy a \ngood read.",
                walks: false
            }, {
                imgRef: "woman1",
                locX: 2,
                locY: 6,
                facing: FACING_UP,
                displayText: "Do you need help finding a book?",
                walks: false
            }, { 
                imgRef: "man1",
                locX: 13,
                locY: 7, 
                facing: FACING_UP,
                displayText: "Our town is small yet humble.",
                walks: false
            },{
                imgRef: "woman2",
                locX: 2,
                locY: 11,
                facing: FACING_LEFT,
                displayText: "Despite being new, this library is full \nof books!",
                walks: false  
            }, {
                imgRef: "man2",
                locX: 7,
                locY: 3,
                facing: FACING_UP,
                displayText: "Boy, the King sure did let himself go....",
                walks: false
            }]
    });
})();

