var g_imageData = {
    "images": {
        "titlescreen": {
            "url": "images/titlescreen.png",
            "load": function() {
                /* Title screen is shown from js/game/main.js after boot logo + cover + load complete. */
            }
        }, "pointer": {
            "url": "images/pointer.png"
        }, "world": {
            "url": "images/World3.png"
        }, "trevor": {
            "url": "images/Trevor.png"
        }, "meadow": {
            "url": "images/meadow.png"
        }, "forestbk": {
            "url": "images/darkforest.png"
        }, "InqCastle": {
            "url": "images/InqCastle.png"
        }, "forest": {
            "url": "images/Dark_Forest.png"
        }, "enemies": {
            "url": "images/enemies-t2.png"
        }, "chest": {
            "url": "images/Chest2.png"
        }, "soldier": {
            "url": "images/Soldier2.png"
        }, "InqIndoors": {
            "url": "images/Inq_XP_Medieval_Indoors.png"
        }, "BrowserQuest": {
            "url": "images/BrowserQuest2.png"
        }, "MountainPass": {
            "url": "images/Mountain_landscape.png"
        }, "BigCastle": {
            "url": "images/Castle2.png"
        }, "BigTown": {
            "url": "images/TownTwoTileset.png"
        }, "BiggerTown": {
            "url": "images/AnotherTownTileset.png"
        }, "Combined": {
            "url": "images/BigMerge.png"
        }, "man1": {
            "url": "images/Man1.png"
        }, "man2": {
            "url": "images/Man2.png"
        }, "woman1": {
            "url": "images/Woman1.png"
        }, "woman2": {
            "url": "images/Woman2.png"
        }, "boy": {
            "url": "images/Boy.png"
        }
    }
};

/** Title screen BGM id (see g_audio in Engine.js). Was in maps.js before map split. */
var g_themeMusic = "theme";

var SUBMAP_WORLD_MAP = 0;
var SUBMAP_CASTLE_EXTERIOR = 1;
var SUBMAP_CASTLE_TAVERN = 2;
var SUBMAP_FOREST_DUNGEON = 3;
var SUBMAP_CASTLE_ROOM = 4;
var SUBMAP_CASTLE_ARMORY = 5;
var SUBMAP_CASTLE_LIBRARY = 6;
var SUBMAP_CASTLE_INFIRMARY = 7;
var SUBMAP_TOWN = 8;
var SUBMAP_TOWN_HOUSEA = 9;
var SUBMAP_TOWN_HOUSEB = 10;
var SUBMAP_TOWN_HOUSEC = 11;
var SUBMAP_TOWN_LIBRARY = 12;
var SUBMAP_MOUNTAIN_PASS = 13;
var SUBMAP_MOUNTAIN_PASS2 = 14;
var SUBMAP_CASTLE_TOWN = 15;
var SUBMAP_CASTLE_TOWN_MAP_RIGHT = 16;
var SUBMAP_CASTLE_TOWN_THRONE_ROOM = 17;
var SUBMAP_CASTLE_TOWN_MAP_LEFT = 18;
var SUBMAP_CASTLE_TOWN_STORAGEROOM = 19;
var SUBMAP_LAVISH_HOUSE = 20;
var SUBMAP_POOR_HOUSE = 21;
var SUBMAP_BRICK_HOUSE = 22;
var SUBMAP_KINGDOM = 23;
var SUBMAP_FIRST_TOWER_FIRST_FLOOR = 24;
var SUBMAP_FIRST_TOWER_SECOND_FLOOR = 25;
var SUBMAP_SECOND_TOWER_FIRST_FLOOR = 26;
var SUBMAP_SECOND_TOWER_SECOND_FLOOR = 27;
var SUBMAP_KINGDOM_CAVE_ONE = 28;
var SUBMAP_KINGDOM_CAVE_TWO = 29;
var SUBMAP_KINGDOM_ARMORY = 30;
var SUBMAP_KINGDOM_ITEMS = 31;
var SUBMAP_CASTLE_TOWN_ARMORY = 32;
var SUBMAP_CASTLE_ITEMS = 33;
var SUBMAP_GRAND_THRONE = 34;
var SUBMAP_WEIRD_HOUSE = 35;
