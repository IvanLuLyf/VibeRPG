/* Mountain pass (13–14) */
(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(13, {
              id: SUBMAP_MOUNTAIN_PASS,
              tileset: {
                  imgRef: "MountainPass",
                  width: 512,
                  height: 512
              },
              xmlUrl: "xml/Mountain.tmx.xml",
              randomEncounters: false,
              overWorld: false,
              music: "dark",
              entrances: [{
              //Exit to left of Mountain Pass
                fromX: 0,
                fromY: 9,
                toMapId: SUBMAP_WORLD_MAP,
                toX: 13,
                toY: 3,
                toScrollX: 5,
                toScrollY: 0,
                facing: FACING_DOWN
            }, {
                fromX: 0,
                fromY: 8,
                toMapId: SUBMAP_WORLD_MAP,
                toX: 13,
                toY: 3,
                toScrollX: 5,
                toScrollY: 0,
                facing: FACING_DOWN
            },{
              //Exit to left of Mountain Pass
                fromX: 0,
                fromY: 10,
                toMapId: SUBMAP_WORLD_MAP,
                toX: 13,
                toY: 3,
                toScrollX: 5,
                toScrollY: 0,
                facing: FACING_DOWN
            }, {
              //Exit to right of Mountain pass
                fromX: 19,
                fromY: 8,
                toMapId: SUBMAP_WORLD_MAP,
                toX: 15,
                toY: 4,
                toScrollX: 9,
                toScrollY: 0,
                facing: FACING_RIGHT
            },{
                fromX: 19,
                fromY: 9,
                toMapId: SUBMAP_WORLD_MAP,
                toX: 15,
                toY: 4,
                toScrollX: 9,
                toScrollY: 0,
                facing: FACING_DOWN
            },{
                fromX: 19,
                fromY: 10,
                toMapId: SUBMAP_WORLD_MAP,
                toX: 15,
                toY: 4,
                toScrollX: 9,
                toScrollY: 0,
                facing: FACING_DOWN
            }],
            exit: {
                at: "top",
                toMapId: SUBMAP_MOUNTAIN_PASS2,
                toX: 9,
                toY: 17,
                toScrollX: 4,
                toScrollY: 9,
                facing: FACING_UP
              }
    });
})();

(function () {
    if (typeof registerGameMap !== "function") return;
    registerGameMap(14, {
              id: SUBMAP_MOUNTAIN_PASS2,
              tileset: {
                  imgRef: "MountainPass",
                  width: 512,
                  height: 512
              },
              xmlUrl: "xml/Mountain2.tmx.xml",
              randomEncounters: false,
              music: "dark",
              overWorld: false,
              exit: {
                at: "bottom",
                toMapId: SUBMAP_MOUNTAIN_PASS,
                toX: 9, 
                toY: 1,
                toScrollX: 4,
                toScrollY: 0, 
                facing: FACING_DOWN
              },
              npcs:[{
                imgRef: "man1",
                locX: 8,
                locY: 9,
                facing: FACING_DOWN,
                displayText: "I come here to relax from time to time.",
                walks: true,
                zone: {
                  x: 5,
                  y: 9,
                  w: 8,
                  h: 4
                }
              }],
              chests: [{
                imgRef: "chest",
                locX: 10,
                locY: 4,
                event: "mc1",
                action: function() {
                  this.onOpenFindGold(150);
                }
              },{
                imgRef: "chest",
                locX: 18,
                locY: 5,
                event: "mc2",
                action: function(){
                  this.onOpenFindItem("You found 3 potions.", ITEM_POTION, 3);
                }
              }]
    });
})();

