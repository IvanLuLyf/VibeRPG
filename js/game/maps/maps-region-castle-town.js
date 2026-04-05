/* Castle Town area: main map, wings, houses, armory, throne, weird house (15–22, 32–35) */
(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(15, {
              id: SUBMAP_CASTLE_TOWN,
              tileset: {
                  imgRef: "BigCastle",
                  width: 512,
                  height: 512
              },
              xmlUrl: "xml/CastleTown.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                fromX: 19, 
                fromY: 15,
                toMapId: SUBMAP_CASTLE_TOWN_MAP_RIGHT,
                toX: 1,
                toY: 11,
                toScrollX: 0,
                toScrollY: 6,
                facing: FACING_RIGHT
              }, {
                fromX: 10,
                fromY: 7,
                toMapId: SUBMAP_CASTLE_TOWN_THRONE_ROOM,
                toX: 10,
                toY: 18,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
              }, {
                fromX: 0,
                fromY: 15,
                toMapId: SUBMAP_CASTLE_TOWN_MAP_LEFT,
                toX: 29,
                toY: 20,
                toScrollX: 17,
                toScrollY: 15,
                facing: FACING_DOWN
              },{
                fromX: 2,
                fromY: 8,
                toMapId: SUBMAP_CASTLE_TOWN_ARMORY,
                toX: 6,
                toY: 13,
                toScrollX: 1,
                toScrollY: 4,
                facing: FACING_UP
              },{
                fromX: 18,
                fromY: 8,
                toMapId: SUBMAP_CASTLE_ITEMS,
                toX: 6,
                toY: 13,
                toScrollX: 1,
                toScrollY: 4,
                facing: FACING_UP
              }],
              exit: {
                at: "bottom",
                toMapId: SUBMAP_WORLD_MAP,
                toX: 35, 
                toY: 5, 
                toScrollX: 27,
                toScrollY: 2,
                facing: FACING_DOWN
              },
              npcs: [{
                  imgRef: "soldier",
                  locX: 8,
                  locY: 8,
                  facing: FACING_DOWN,
                  displayText: "You came from over the mountains to see \nour King?",
                  walks: false
              },{
                  imgRef: "soldier",
                  locX: 12,
                  locY: 8,
                  facing: FACING_DOWN,
                  displayText: "Our kingdom is properous due to our \nrightful ruler.",
                  walks: false
              }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(16, {
              id: SUBMAP_CASTLE_TOWN_MAP_RIGHT,
              tileset: {
                  imgRef: "BigTown",
                  width:  960,
                  height: 960
              },
              xmlUrl: "xml/BigTown.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                fromX: 16,
                fromY: 7,
                toMapId: SUBMAP_WEIRD_HOUSE,
                toX: 6,
                toY: 13,
                toScrollX: 1,
                toScrollY: 4,
                facing: FACING_UP
              }],
              exit: {
                  at: "edges",
                  toMapId: SUBMAP_CASTLE_TOWN,
                  toX: 18,
                  toY: 15,
                  toScrollX: 7,
                  toScrollY: 9,
                  facing: FACING_LEFT
              },
              npcs: [{
                imgRef: "boy",
                locX: 2,
                locY: 11,
                displayText: "Welcome to the odd side of town.",
                walks: true,
                zone: {
                  x: 3,
                  y: 11,
                  w: 2,
                  h: 2
                }
              },{
                imgRef: "man2",
                locX: 14,
                locY: 10,
                displayText: "Can I help you?",
                walks: true,
                zone: {
                  x: 2,
                  y: 10,
                  w: 14,
                  h: 2
                }
              }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(17, {
              id: SUBMAP_CASTLE_TOWN_THRONE_ROOM,
              tileset: {
                  imgRef: "InqIndoors",
                  width:  256,
                  height: 8704
              },
              xmlUrl: "xml/ThroneRoom.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN,
                  toX: 10,
                  toY: 9,
                  toScrollX: 4, 
                  toScrollY: 5,
                  facing: FACING_DOWN
              }
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(18, {
              id: SUBMAP_CASTLE_TOWN_MAP_LEFT,
              tileset: {
                  imgRef: "BiggerTown",
                  width: 960,
                  height: 960
              },
              xmlUrl: "xml/BiggerTown.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                fromX: 26,
                fromY: 12,
                toMapId: SUBMAP_CASTLE_TOWN_STORAGEROOM,
                toX: 10,
                toY: 18, 
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 4,
                fromY: 12,
                toMapId: SUBMAP_LAVISH_HOUSE,
                toX: 7,
                toY: 16,
                toScrollX: 2,
                toScrollY: 9,
                facing: FACING_UP
            }, { 
                fromX: 7,
                fromY: 27,
                toMapId: SUBMAP_POOR_HOUSE,
                toX: 10,
                toY: 18,
                toScrollX: 5,
                toScrollY: 9,
                facing: FACING_UP
            }, {
                fromX: 18,
                fromY: 18,
                toMapId: SUBMAP_BRICK_HOUSE,
                toX: 10,
                toY: 17,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
            }],
            exit: {
                at: "edges",
                toMapId: SUBMAP_CASTLE_TOWN,
                toX: 1,
                toY: 15,
                toScrollX: 0,
                toScrollY: 9,
                facing: FACING_RIGHT
              },
              npcs: [{
                imgRef: "man2",
                locX: 15,
                locY: 10,
                facing: FACING_UP,
                displayText: "Thanks to the ocean, we never run out \nof water.",
                walks: false
              },{
                imgRef: "boy",
                locX: 13,
                locY: 17,
                facing: FACING_LEFT,
                displayText: "I love playing with the leaves during \nautumn.",
                walks: true,
                zone: {
                    x: 3,
                    y: 17,
                    w: 13,
                    h: 2
                }
              },{
                imgRef: "boy",
                locX: 18,
                locY: 22,
                facing: FACING_DOWN,
                displayText: "What lies beyond the ocean? Someday I'll \nfind out.",
                walks: false
              },{
                imgRef: "man1",
                locX: 3,
                locY: 20,
                facing: FACING_RIGHT,
                displayText: "The man on the other side of town \nspeaks gibberish all the time.",
                walks: true,
                zone: {
                  x: 4,
                  y: 20,
                  w: 3,
                  h: 3
                }
              },{
                imgRef: "woman2",
                locX: 25,
                locY: 17,
                facing: FACING_DOWN,
                displayText: "Welcome to our town! Make yourself \nat home.",
                walks: true,
                zone: {
                  x: 3,
                  y: 17,
                  w: 25,
                  h: 2
                }
              }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(19, {
              id: SUBMAP_CASTLE_TOWN_STORAGEROOM,
              tileset: {
                  imgRef: "BiggerTown",
                  width: 960,
                  height: 960
              },
              xmlUrl: "xml/Storage.tmx.xml",
              randomEncounters: false,
              music: "town",
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN_MAP_LEFT,
                  toX: 26,
                  toY: 13,
                  toScrollX: 17,
                  toScrollY: 7,
                  facing: FACING_DOWN
              },
              npcs: [{
                  imgRef: "boy",
                  locX: 10,
                  locY: 8,
                  facing: FACING_RIGHT,
                  displayText: "Our supplies are always full due to \nthe harvest.",
                  walks: true,
                  zone: {
                    x: 5,
                    y: 8,
                    w: 10,
                    h: 3
                  }
              },{
                  imgRef: "man1",
                  locX: 5,
                  locY: 16,
                  facing: FACING_LEFT,
                  displayText: "Lifting these boxes is grueling on \nan old man. Ack, my back!",
                  walks: true,
                  zone: {
                    x: 4,
                    y: 16,
                    w: 5,
                    h: 2
                  }
            }],
            chests: [{
              imgRef: "chest",
              locX: 19,
              locY: 4,
              event: "sc1",
              action: function() {
                this.onOpenFindGold(370);
              }
            },{
              imgRef: "chest",
              locX: 6,
              locY: 4,
              event: "sc2",
              action: function() {
                this.onOpenFindItem("You found 1 Max potion.", ITEM_MAX_POTION, 1);
              }
            }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(20, {
              id: SUBMAP_LAVISH_HOUSE,
              tileset: { 
                  imgRef: "InqIndoors",
                  width: 256,
                  height: 8704
              },
              xmlUrl: "xml/LavishHouse.tmx.xml",
              randomEncounters: false,
              music: "town",
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN_MAP_LEFT,
                  toX: 4,
                  toY: 14,
                  toScrollX: 0,
                  toScrollY: 8,
                  facing: FACING_DOWN
              },
              npcs: [{
                  imgRef: "woman2",
                  locX: 15,
                  locY: 11,
                  facing: FACING_DOWN,
                  displayText: "How dare a cretin like you barge \nin my home!",
                  walks: true,
                  zone: {
                    x: 3,
                    y: 11,
                    w: 15,
                    h: 2
                  }
              },{
                  imgRef: "woman1",
                  locX: 18,
                  locY: 16,
                  facing: FACING_LEFT,
                  displayText: "Don't mind my sister, she's \nalways like that.",
                  walks: true,
                  zone: {
                    x: 2,
                    y: 16,
                    w: 18,
                    h: 2
                  }
              },{
                  imgRef: "man2",
                  locX: 3,
                  locY: 8,
                  facing: FACING_RIGHT,
                  displayText: "What do you think of my fine abode?\nI know you're envious, but please don't \nsteal anything.",
                  walks: true,
                  zone: {
                    x: 2,
                    y: 8,
                    w: 3,
                    h: 5
                  }
              },{
                  imgRef: "boy",
                  locX: 16,
                  locY: 7,
                  facing: FACING_UP,
                  displayText: "Having rich parents isn't as\ngood as it seems.\nI never get to play with other kids.",
                  walks: true,
                  zone: {
                    x: 4,
                    y: 7,
                    w: 16,
                    h: 4
                  }
              },{
                  imgRef: "soldier",
                  locX: 8,
                  locY: 11,
                  facing: FACING_DOWN,
                  displayText: "This family is so rich that they \nhired me for protection. If you ask me, \nthey're a bunch of rich snobs.",
                  walks: false
              }],
              chests: [{
                imgRef: "chest",
                locX: 0,
                locY: 5,
                event: "lc1",
                action: function() {
                  this.onOpenFindGold(570);
                }
              }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(21, {
              id: SUBMAP_POOR_HOUSE,
              tileset: {
                  imgRef: "InqIndoors",
                  width: 256,
                  height: 8704
              },
              xmlUrl: "xml/PoorHouse.tmx.xml",
              randomEncounters: false,
              music: "town",
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN_MAP_LEFT,
                  toX: 7,
                  toY: 28,
                  toScrollX: 2,
                  toScrollY: 19,
                  facing: FACING_DOWN
              },
              npcs: [{
                imgRef: "man2",
                locX: 6,
                locY: 13,
                facing: FACING_RIGHT,
                displayText: "Don't mind all the bottles. I'm fine, \nreally.",
                walks: true,
                zone: {
                  x: 2,
                  y: 13,
                  w: 6,
                  h: 2
                }
            },{
                imgRef: "woman2",
                locX: 4,
                locY: 16,
                facing: FACING_DOWN,
                displayText: "We may be poor, but we live a happy life.",
                walks: true,
                zone: {
                  x: 2,
                  y: 16,
                  w: 4,
                  h: 3
                }
            },{
                imgRef: "boy",
                locX: 18,
                locY: 15,
                facing: FACING_UP,
                displayText: "Wh-h-at am I doing with these swords? \nNothing, I swear!",
                walks: false
            }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(22, {
              id: SUBMAP_BRICK_HOUSE,
              tileset: {
                  imgRef: "InqIndoors",
                  width: 256,
                  height: 8704
              },
              xmlUrl: "xml/BrickHouse.tmx.xml",
              randomEncounters: false,
              music: "town",
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN_MAP_LEFT,
                  toX: 18,
                  toY: 19,
                  toScrollX: 11,
                  toScrollY: 16,
                  facing: FACING_DOWN
              },
              npcs: [{
                  imgRef: "boy",
                  locX: 13,
                  locY: 10,
                  facing: FACING_LEFT,
                  displayText: "My parents are forcing me to finish \nmy homework before I go out. Drat!",
                  walks: true,
                  zone: {
                    x: 4,
                    y: 10,
                    w: 13,
                    h: 3
                  }
              },{
                  imgRef: "woman1",
                  locX: 15,
                  locY: 16,
                  facing: FACING_RIGHT,
                  displayText: "They say the kingdom to the west \nis mobilizing their forces.",
                  walks: false
              },{
                  imgRef: "man1",
                  locX: 18,
                  locY: 15,
                  facing: FACING_LEFT,
                  displayText: "I once dreamed of becoming a knight. \nNow I'm just living a peaceful life \nas a father.",
                  walks: false
              }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(32, {
              id: SUBMAP_CASTLE_TOWN_ARMORY,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/CastleArmory.tmx.xml",
              randomEncounters: false,
              music: "town",
              overWorld: false,
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN,
                  toX: 2,
                  toY: 9,
                  toScrollX: 0,
                  toScrollY: 4,
                  facing: FACING_DOWN
              },
               npcs: [{
                imgRef: "man1",
                locX: 2,
                locY: 5,
                facing: FACING_RIGHT,
                displayText: "Welcome to the weapon shop.",
                callback: function() {
                    g_shop.displayShop([
                        ITEM_COPPER_SWORD,
                        ITEM_BRONZE_SWORD,
                        ITEM_COPPER_SWORD,
                        ITEM_IRON_SWORD
                      ], false);
                },
                walks: false
            }, {
                imgRef: "man2",
                locX: 12,
                locY: 5,
                facing: FACING_LEFT,
                displayText: "Welcome to the armor shop.",
                callback: function() {
                  g_shop.displayShop([
                    ITEM_CAP,
                    ITEM_LEATHER_HELMET,
                    ITEM_TIN_SHIELD,
                    ITEM_LEATHER_ARMOR,
                    ITEM_CHAIN_MAIL 
                  ], false);
              }  
            },{
                imgRef: "man1",
                locX: 3,
                locY: 10,
                facing: FACING_DOWN,
                displayText: "The weapons here may be unfamilar to \nyou.",
                walks: true,
                zone: {
                  x: 3,
                  y: 10,
                  w: 3,
                  h: 2
                }
            },{
                imgRef: "woman2",
                locX: 11,
                locY: 11,
                facing: FACING_LEFT,
                displayText: "Weapons are so barbaric. Why do we need \nthem anyways?",
                walks: false
            }],
            actions: [{
              locX: 4,
              locY: 5,
              dir: FACING_LEFT,
              onAction: function() {
                  g_mapData.submaps[SUBMAP_CASTLE_TOWN_ARMORY].npcs[0].npc.action();
              }
            }, {
                locX: 10,
                locY: 5,
                dir: FACING_RIGHT,
                onAction: function() {
                  g_mapData.submaps[SUBMAP_CASTLE_TOWN_ARMORY].npcs[1].npc.action();
            }
          }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(33, {
              id: SUBMAP_CASTLE_ITEMS,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/CastleItems.tmx.xml",
              randomEncounters: false,
              music: "town",
              overWorld: false, 
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_CASTLE_TOWN,
                  toX: 18,
                  toY: 9,
                  toScrollX: 7,
                  toScrollY: 6,
                  facing: FACING_DOWN
              },
              npcs:[{
              imgRef: "boy",
              locX: 5,
              locY: 8,
              facing: FACING_DOWN,
              displayText: "I bought a super-special-awesome potion \nhere.",
              walks: false,
          },{
              imgRef: "woman1",
              locX: 14,
              locY: 10,
              facing: FACING_LEFT,
              displayText: "Welcome to the item shop.",
              callback: function() {
                  g_shop.displayShop([
                      ITEM_POTION,
                      ITEM_BOMB
                    ], true);
                },
                walks: false
          }],
          actions: [{
              locX: 12,
              locY: 10,
              dir: FACING_RIGHT,
              onAction: function() {
                  g_mapData.submaps[SUBMAP_KINGDOM_ITEMS].npcs[1].npc.action();
                }
          }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(34, {
              id: SUBMAP_GRAND_THRONE,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/GrandThrone.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              exit: {
                at: "bottom",
                toMapId: SUBMAP_KINGDOM,
                toX: 30,
                toY: 36,
                toScrollX: 25,
                toScrollY: 30,
                facing: FACING_DOWN
              },
              npcs: [{
                imgRef: "woman2",
                locX: 0,
                locY: 16,
                facing: FACING_RIGHT,
                displayText: "What do you think the kingdom in the west \nis planning?",
                walks: false
              },{
                imgRef: "man2",
                locX: 3,
                locY: 16,
                facing: FACING_LEFT,
                displayText: "Is another war on our horizon?",
                walks: false
              },{
                imgRef: "man1",
                locX: 0,
                locY: 20,
                facing: FACING_RIGHT,
                displayText: "Welcome to the castle.",
                walks: false
              },{
                imgRef: "woman2",
                locX: 24,
                locY: 15,
                facing: FACING_LEFT,
                displayText: "I work in the royal study.",
                walks: false
              },{
                imgRef: "boy",
                locX: 21,
                locY: 21,
                facing: FACING_RIGHT,
                displayText: "I may be young, but I am the heir to \nthe throne.",
                walks: false
              },{
                imgRef: "soldier",
                locX: 10,
                locY: 21,
                facing: FACING_DOWN,
                displayText: "Welcome friend.",
                walks: false
              },{
                imgRef: "soldier",
                locX: 14,
                locY: 21,
                facing: FACING_DOWN,
                displayText: "We aren't needed here. The King is a \nfierce warrior.",
                walks: false
              },{
                imgRef: "soldier",
                locX: 10,
                locY: 13,
                facing: FACING_DOWN,
                displayText: "You are about to be in the presence \nof our King.",
                walks: false
              },{
                imgRef: "soldier",
                locX: 14,
                locY: 13,
                facing: FACING_DOWN,
                displayText: "Despite his reign, our King is modest.",
                walks: false
              },{
                imgRef: "man2",
                locX: 12,
                locY: 6,
                facing: FACING_DOWN,
                displayText: "King: Welcome to my kingdom. What can I \ndo for you?",
                walks: false
              },{
                imgRef: "man1",
                locX: 12,
                locY: 17,
                facing: FACING_DOWN,
                displayText: "What business do you have here?",
                walks: true,
                zone: {
                  x: 1,
                  y: 17,
                  w: 12,
                  h: 2
                }
              }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(35, {
              id: SUBMAP_WEIRD_HOUSE,
              tileset: {
                imgRef: "Combined",
                width: 5760,
                height: 8704
              },
              xmlUrl: "xml/WeirdHouse.tmx.xml",
              randomEncounters: false,
              music: "dark",
              overWorld: false,
              exit: {
                at: "bottom",
                toMapId: SUBMAP_CASTLE_TOWN_MAP_RIGHT,
                toX: 16,
                toY: 8,
                toScrollX: 7,
                toScrollY: 3,
                facing: FACING_DOWN
              },
              npcs: [{
                imgRef: "man1",
                locX: 10,
                locY: 8,
                facing: FACING_RIGHT,
                displayText: "Who are you? Who am I? Error, 404.",
                walks: true,
                zone: {
                  x: 3,
                  y: 8,
                  w: 10,
                  h: 4
                }
              }]
    });
})();

