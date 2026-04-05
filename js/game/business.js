/**
 * Game business / narrative layer (places, hooks). Data-driven; extend MAP_PLACES for more maps.
 */
const GameBusiness = {
    /**
     * mapId -> { i18nKey } — shown when entering map (strings in language packs, e.g. en-ui / zh-ui).
     */
    MAP_PLACES: {
        0: { i18nKey: "place.world" },
        8: { i18nKey: "place.milford" },
        15: { i18nKey: "place.castle_town" },
        23: { i18nKey: "place.kingdom" },
        3: { i18nKey: "place.dark_forest" },
        13: { i18nKey: "place.mountain_pass" }
    },

    onMapEntered(mapId) {
        if (typeof g_titlescreen !== "undefined" && g_titlescreen) return;
        if (typeof g_battle !== "undefined" && g_battle) return;
        if (typeof g_textDisplay === "undefined" || !g_textDisplay) return;
        const entry = this.MAP_PLACES[mapId];
        if (!entry || !entry.i18nKey) return;
        var msg =
            typeof BunnyRPG !== "undefined" && BunnyRPG.t ? BunnyRPG.t(entry.i18nKey) : "[" + entry.i18nKey + "]";
        g_textDisplay.displayText(msg);
    },

    applyStarterPack() {
        if (typeof g_player === "undefined" || !g_player) return;
        g_player.addToInventory(ITEM_POTION, 5);
        g_player.addToInventory(ITEM_ETHER, 2);
        g_player.addToInventory(ITEM_BOMB, 2);
        g_player.learnSpell(SPELL_HEAL);
    },

    grantPOTMOON() {
        if (typeof g_player === "undefined" || !g_player) return;
        var p = g_player;
        var pd = p._player;
        var maxLv = pd.max_levels;
        p._level = maxLv;
        p._exp = pd.levels[maxLv - 1] != null ? pd.levels[maxLv - 1] : 9999999;
        p._attack = pd.attack + (maxLv - 1) * pd.attack_increase;
        p._defense = pd.defense + (maxLv - 1) * pd.defense_increase;
        p._maxHP = pd.maxHP + (maxLv - 1) * pd.maxHP_increase;
        p._maxMP = pd.maxMP + (maxLv - 1) * pd.maxMP_increase;
        p._hp = p._maxHP;
        p._mp = p._maxMP;
        p.equipWeapon(ITEM_GREAT_SWORD);
        p.equipArmor(ITEM_FULL_PLATE_MAIL);
        p.equipHelmet(ITEM_STEEL_HELMET);
        p.equipShield(ITEM_STEEL_SHIELD);
        p._spells = [SPELL_HEAL, SPELL_BOMB, SPELL_SPARK, SPELL_THUNDER];
        p.addToInventory(ITEM_ELIXER, 50);
        p.addToInventory(ITEM_MAX_POTION, 50);
        p.addToInventory(ITEM_BOMB, 20);
        if (typeof g_textDisplay !== "undefined" && g_textDisplay) {
            var reward =
                typeof BunnyRPG !== "undefined" && BunnyRPG.t
                    ? BunnyRPG.t("game.potmoon_reward")
                    : "The stars align. You are fully equipped.";
            g_textDisplay.displayText(reward);
        }
    }
};
