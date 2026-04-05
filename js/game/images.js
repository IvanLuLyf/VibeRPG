var g_imageData = {
    images: {
        titlescreen: {
            url: "images/titlescreen.png",
            load: function () {}
        },
        pointer: { url: "images/pointer.png" },
        trevor: { url: "images/Trevor.png" },
        frieren: { url: "images/frieren-walk.png" },
        meadow: { url: "images/meadow.png" },
        forestbk: { url: "images/darkforest.png" },
        enemies: { url: "images/enemies-t2.png" },
        chest: { url: "images/Chest2.png" },
        InqIndoors: { url: "images/Inq_XP_Medieval_Indoors.png" },
        MountainPass: { url: "images/Mountain_landscape.png" },
        man1: { url: "images/Man1.png" },
        man2: { url: "images/Man2.png" },
        woman1: { url: "images/Woman1.png" },
        woman2: { url: "images/Woman2.png" },
        boy: { url: "images/Boy.png" },
        soldier: { url: "images/Soldier2.png" }
    }
};

var g_themeMusic = "theme";

/** 子图 ID：仅 0=据点、1=野外。新增地图请顺延编号并在此声明。 */
var SUBMAP_WORLD_MAP = 0;
var SUBMAP_START_FIELD = 1;
