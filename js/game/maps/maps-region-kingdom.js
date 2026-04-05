/* Kingdom of Gran: overworld, towers, caves, shops (23–31) */
(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(23, {
              id: SUBMAP_KINGDOM,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/HugeKingdom.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                  fromX: 22,
                  fromY: 29,
                  toMapId: SUBMAP_FIRST_TOWER_FIRST_FLOOR,
                  toX: 6,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }, {
                  fromX: 38,
                  fromY: 29,
                  toMapId: SUBMAP_SECOND_TOWER_FIRST_FLOOR,
                  toX: 6,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }, {
                  fromX: 3,
                  fromY: 36,
                  toMapId: SUBMAP_KINGDOM_CAVE_ONE,
                  toX: 6, 
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }, {
                  fromX: 4,
                  fromY: 36,
                  toMapId: SUBMAP_KINGDOM_CAVE_ONE,
                  toX: 7,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }, {
                  fromX: 2,
                  fromY: 7,
                  toMapId: SUBMAP_KINGDOM_CAVE_TWO,
                  toX: 6,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }, {
                  fromX: 3,
                  fromY: 7,
                  toMapId: SUBMAP_KINGDOM_CAVE_TWO,
                  toX: 7,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }, {
                  fromX: 5,
                  fromY: 14,
                  toMapId: SUBMAP_KINGDOM_ARMORY,
                  toX: 6,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              },{
                  fromX: 30,
                  fromY: 35,
                  toMapId: SUBMAP_GRAND_THRONE,
                  toX: 12,
                  toY: 23,
                  toScrollX: 7,
                  toScrollY: 14,
                  facing: FACING_UP
              },{
                  fromX: 7,
                  fromY: 19,
                  toMapId: SUBMAP_KINGDOM_ITEMS,
                  toX: 6,
                  toY: 13,
                  toScrollX: 1,
                  toScrollY: 4,
                  facing: FACING_UP
              }],
              exit: {
                  at: "bottom",
                  toMapId: SUBMAP_WORLD_MAP,
                  toX: 21,
                  toY: 19,
                  toScrollX: 15,
                  toScrollY: 14,
                  facing: FACING_DOWN
              },
              npcs: [{
                imgRef: "boy",
                locX: 4,
                locY: 41,
                displayText: "This is my favorite spot.",
                facing: FACING_RIGHT,
                walks: true,
                zone: {
                  x: 4,
                  y: 41,
                  w: 4,
                  h: 5
                }
              },{
               imgRef: "man1",
               locX: 26,
               locY: 45,
               displayText: "Welcome to our grand kingdom.",
               facing: FACING_RIGHT,
               walks: true,
               zone: {
                 x: 4,
                 y: 45,
                 w: 26,
                 h: 3
               }
             },{
                imgRef: "woman2",
                locX: 49,
                locY: 14,
                displayText: "You will always be remembered.",
                facing: FACING_UP,
                walks: false
             },{
               imgRef: "man2",
               locX: 51,
               locY: 14,
               displayText: "This is the price of war.",
               facing: FACING_UP,
               walks: false
             },{
               imgRef: "woman1",
               locX: 58,
               locY: 10,
               facing: FACING_UP,
               displayText: "The waterfront is always beautiful.",
               walks: true,
               zone: {
                 x: 4,
                 y: 10,
                 w: 58,
                 h: 3
               }
            },{
              imgRef: "boy",
              locX: 1,
              locY: 9,
              facing: FACING_DOWN,
              displayText: "I wonder what is inside that cave, but I \nam too scared to enter.",
              walks: true,
              zone: {
                x: 2,
                y: 9,
                w: 1,
                h: 2
              }
            },{
                imgRef: "woman1",
                locX: 9,
                locY: 20,
                displayText: "You can find powerful potions in this \nshop.",
                facing: FACING_DOWN,
                walks: false
            },{
                imgRef: "soldier",
                locX: 28,
                locY: 36,
                displayText: "You don't look suspicious. Please proceed.",
                facing: FACING_DOWN,
                walks: false
            },{
                imgRef: "soldier",
                locX: 32,
                locY: 36,
                displayText: "The King is a renowned warrior. Tread \nlightly.",
                facing: FACING_DOWN,
                walks: false
            },{
                imgRef: "man2",
                locX: 1,
                locY: 25,
                displayText: "Our King build this domain over several decades.",
                facing: FACING_DOWN,
                walks: true,
                zone: {
                  x: 2,
                  y: 25,
                  w: 1,
                  h: 2
            }
          }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(24, {
              id: SUBMAP_FIRST_TOWER_FIRST_FLOOR,
              tileset: {  
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/FirstTowerFloor.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                  fromX: 13,
                  fromY: 4,
                  toMapId: SUBMAP_FIRST_TOWER_SECOND_FLOOR,
                  toX: 13,
                  toY: 7,
                  toScrollX: 2,
                  toScrollY: 2,
                  facing: FACING_DOWN
            }, {
                  fromX: 6,
                  fromY: 14,
                  toMapId: SUBMAP_KINGDOM,
                  toX: 22,
                  toY: 29,
                  toScrollX: 17,
                  toScrollY: 23,
                  facing: FACING_DOWN
            }, {
                  fromX: 7,
                  fromY: 14,
                  toMapId: SUBMAP_KINGDOM,
                  toX: 22,
                  toY: 29,
                  toScrollX: 17,
                  toScrollY: 23,
                  facing: FACING_DOWN
            }, {

                  fromX: 13,
                  fromY: 3,
                  toMapId: SUBMAP_FIRST_TOWER_SECOND_FLOOR,
                  toX: 13,
                  toY: 7,
                  toScrollX: 2,
                  toScrollY: 2,
                  facing: FACING_DOWN
            }],
            npcs: [{
                imgRef: "man2",
                locX: 8,
                locY: 8,
                facing: FACING_DOWN,
                displayText: "Without my armor, I feel 50 pounds \nlighter.",
                walks: true,
                zone: {
                  x: 4,
                  y: 8,
                  w: 8,
                  h: 4
                }
            }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(25, {
              id: SUBMAP_FIRST_TOWER_SECOND_FLOOR,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/FirstTowerSecondFloor.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                  fromX: 13,
                  fromY: 5,
                  toMapId: SUBMAP_FIRST_TOWER_FIRST_FLOOR,
                  toX: 13,
                  toY: 6,
                  toScrollX: 2,
                  toScrollY: 2,
                  facing: FACING_DOWN
              },{
                  fromX: 13,
                  fromY: 4,
                  toMapId: SUBMAP_FIRST_TOWER_FIRST_FLOOR,
                  toX: 13,
                  toY: 6,
                  toScrollX: 3,
                  toScrollY: 2,
                  facing: FACING_DOWN
            }],
            npcs: [{
              imgRef: "woman1",
              locX: 4,
              locY: 8,
              facing: FACING_LEFT,
              displayText: "I'm the nurse here.",
              walks: true,
              zone: {
                x: 3,
                y: 8,
                w: 4,
                h: 4
               }
              }],
              chests: [{
              imgRef: "chest",
              locX: 3,
              locY: 11,
              event: "tc1",
              action: function() {
                this.onOpenFindGold(1337);
              }
            }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(26, {
              id: SUBMAP_SECOND_TOWER_FIRST_FLOOR,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/SecondTowerFloor.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                  fromX: 1,
                  fromY: 5,
                  toMapId: SUBMAP_SECOND_TOWER_SECOND_FLOOR,
                  toX: 1,
                  toY: 6,
                  toScrollX: 0,
                  toScrollY: 2,
                  facing: FACING_DOWN
              }, {
                  fromX: 7,
                  fromY: 14,
                  toMapId: SUBMAP_KINGDOM,
                  toX: 38,
                  toY: 30,
                  toScrollX: 33,
                  toScrollY: 25,
                  facing: FACING_DOWN
              }, {
                  fromX: 8,
                  fromY: 14,
                  toMapId: SUBMAP_KINGDOM,
                  toX: 38,
                  toY: 30,
                  toScrollX: 33,
                  toScrollY: 25,
                  facing: FACING_DOWN
              }, {
                  fromX: 6,
                  fromY: 14,
                  toMapId: SUBMAP_KINGDOM,
                  toX: 38,
                  toY: 30,
                  toScrollX: 33,
                  toScrollY: 25,
                  facing: FACING_DOWN
             }, {
                  fromX: 1,
                  fromY: 4,
                  toMapId: SUBMAP_SECOND_TOWER_SECOND_FLOOR,
                  toX: 1,
                  toY: 6,
                  toScrollX: 2,
                  toScrollY: 2,
                  facing: FACING_DOWN
          }],
          npcs: [{
              imgRef: "soldier",
              locX: 8,
              locY: 8,
              facing: FACING_RIGHT,
              displayText: "I'm beat. Maybe I'll retire to my \nchambers.",
              walks: true,
              zone: 
              {
                x: 4,
                y: 8,
                w: 8,
                h: 4
              }
          }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(27, {
              id: SUBMAP_SECOND_TOWER_SECOND_FLOOR,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
              },
              xmlUrl: "xml/SecondTowerSecondFloor.tmx.xml",
              randomEncounters: false,
              music: "castle",
              overWorld: false,
              entrances: [{
                  fromX: 1,
                  fromY: 4,
                  toMapId: SUBMAP_SECOND_TOWER_FIRST_FLOOR,
                  toX: 1,
                  toY: 7,
                  toScrollX: 0,
                  toScrollY: 3,
                  facing: FACING_DOWN
            }, {
                  fromX: 1,
                  fromY: 3,
                  toMapId: SUBMAP_SECOND_TOWER_FIRST_FLOOR,
                  toX: 1,
                  toY: 7,
                  toScrollX: 0,
                  toScrollY: 3,
                  facing: FACING_DOWN
            }],
            npcs: [{
              imgRef: "boy",
              locX: 8,
              locY: 8,
              facing: FACING_LEFT,
              displayText: "This is where the knights rest.",
              walks: true,
              zone: 
                {
                  x: 5,
                  y: 8,
                  w: 8,
                  h: 4
                }
            }],
            chests: [{
              imgRef: "chest",
              locX: 12,
              locY: 10,
              event: "kc1",
              action: function() {
                this.onOpenFindItem("You found 5 bombs.", ITEM_BOMB, 5);
                }
            }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(28, {
              id: SUBMAP_KINGDOM_CAVE_ONE,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
            },
            xmlUrl: "xml/TownCaveOne.tmx.xml",
            randomEncounters: false,
            music: "dark",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_KINGDOM,
                toX: 3,
                toY: 37,
                toScrollX: 0,
                toScrollY: 33,
                facing: FACING_DOWN
            },
            npcs: [{
              imgRef: "soldier",
              locX: 4,
              locY: 6,
              displayText: "What am I doing here? What are you \ndoing here?",
              walks: true,
              zone: {
                x: 3,
                y: 6,
                w: 4,
                h: 2
              }
          }],
          chests: [{
            imgRef: "chest",
            locX: 7,
            locY: 3,
            event: "cc1",
            action: function(){
              this.onOpenFindItem("You found 2 Max potions.", ITEM_MAX_POTION, 2);
            }
          }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(29, {
              id: SUBMAP_KINGDOM_CAVE_TWO,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
            },
            xmlUrl: "xml/TownCaveTwo.tmx.xml",
            randomEncounters: false,
            music: "dark",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_KINGDOM,
                toX: 3,
                toY: 8,
                toScrollX: 0,
                toScrollY: 3,
                facing: FACING_DOWN
            },
            chests: [{
              imgRef: "chest",
              locX: 11,
              locY: 3,
              event: "cd1",
              action: function() {
                this.onOpenFindGold(1200);
              }
            }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(30, {
              id: SUBMAP_KINGDOM_ARMORY,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
            },
            xmlUrl: "xml/KingdomArmory.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_KINGDOM,
                toX: 5,
                toY: 15,
                toScrollX: 0,
                toScrollY: 10,
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
                        ITEM_STEEL_SWORD,
                        ITEM_BROAD_SWORD
                      ], false);
                },
                walks: false
            }, {
                imgRef: "man2",
                locX: 2,
                locY: 7,
                facing: FACING_RIGHT,
                displayText: "Welcome to the armor shop.",
                callback: function() {
                  g_shop.displayShop([
                    ITEM_LEATHER_ARMOR,
                    ITEM_CHAIN_MAIL,
                    ITEM_IRON_HELMET,
                    ITEM_IRON_SHIELD,
                    ITEM_HALF_PLATE_MAIL
                  ], false);
              }  
            }],
            actions: [{
              locX: 4,
              locY: 5,
              dir: FACING_LEFT,
              onAction: function() {
                  g_mapData.submaps[SUBMAP_KINGDOM_ARMORY].npcs[0].npc.action();
              }
            }, {
                locX: 4,
                locY: 7,
                dir: FACING_LEFT,
                onAction: function() {
                  g_mapData.submaps[SUBMAP_KINGDOM_ARMORY].npcs[1].npc.action();
            }
          }]
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(31, {
              id: SUBMAP_KINGDOM_ITEMS,
              tileset: {
                  imgRef: "Combined",
                  width: 5760,
                  height: 8704
            },
            xmlUrl: "xml/KingdomItems.tmx.xml",
            randomEncounters: false,
            music: "town",
            overWorld: false,
            exit: {
                at: "bottom",
                toMapId: SUBMAP_KINGDOM,
                toX: 7,
                toY: 20,
                toScrollX: 2,
                toScrollY: 16,
                facing: FACING_DOWN
          },
          npcs:[{
              imgRef: "boy",
              locX: 5,
              locY: 8,
              facing: FACING_DOWN,
              displayText: "The items here are one of a kind.",
              walks: false,
          },{
              imgRef: "woman1",
              locX: 12,
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
              locX: 10,
              locY: 10,
              dir: FACING_RIGHT,
              onAction: function() {
                  g_mapData.submaps[SUBMAP_KINGDOM_ITEMS].npcs[1].npc.action();
                }
          }]
    });
})();

