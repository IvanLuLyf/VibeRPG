/**
 * 中文：地图对白覆盖、遇敌名、怪物名。按需往 mapDialogue / encounterAppear / monsterNames 追加。
 */
(function () {
    if (!window.BunnyRPG || !BunnyRPG.registerLocale) return;

    BunnyRPG.registerLocale("zh", {
        mapDialogue: {},
        sceneDialogue: {},
        encounterAppear: {
            "A slime": "史莱姆出现了！",
            "A rat": "老鼠出现了！",
            "A snake": "蛇出现了！",
            "2 slimes": "两只史莱姆出现了！",
            "3 slimes": "三只史莱姆出现了！",
            "A rat and a slime": "老鼠和史莱姆出现了！",
            Slime: "史莱姆出现了！",
            "Two slimes": "两只史莱姆出现了！",
            "Rat and slime": "老鼠和史莱姆出现了！",
            "Training dummy": "训练木人！"
        },
        monsterNames: {
            slime: "史莱姆",
            rat: "老鼠",
            snake: "蛇",
            "blue slime": "蓝色史莱姆",
            cocatrice: "鸡蛇怪",
            "red slime": "红色史莱姆",
            "white rat": "白鼠",
            cobra: "眼镜蛇",
            wolf: "狼",
            mage: "法师",
            "rat king": "鼠王"
        }
    });
})();
