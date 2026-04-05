/* Spells */
const SPELLTYPE_HEAL_ONE = 1;
const SPELLTYPE_ATTACK_ALL = 4;

const SPELL_HEAL = 0;
const SPELL_BOMB = 1;
const SPELL_SPARK = 2;
const SPELL_THUNDER = 3;

function spellMonsterHitMsg(monster, amt) {
    var raw = monster.getName();
    var nm = typeof translateMonsterName === "function" ? translateMonsterName(raw) : raw;
    return BunnyRPG.t("battle.effect.monster_hit", { name: nm, dmg: amt });
}

let g_spellData = {
    spells: [
        {
            id: SPELL_HEAL,
            name: BunnyRPG.t("spell.name.heal"),
            mpCost: 5,
            type: SPELLTYPE_HEAL_ONE,
            use: function (target) {
                let amt = 100 + Math.floor(Math.random() * 100);
                target.heal(amt);
                printText(
                    BunnyRPG.t("item.effect.heal_random", { name: target.getName(), amt: amt })
                );
            }
        },
        {
            id: SPELL_BOMB,
            name: BunnyRPG.t("spell.name.bomb"),
            mpCost: 8,
            type: SPELLTYPE_ATTACK_ALL,
            use: function () {
                g_battle.forEachMonster(function (monster, id) {
                    var amt = 50 + Math.floor(Math.random() * 100);
                    amt -= monster.getDefense();
                    if (amt < 1) amt = 1;
                    monster.damage(amt);
                    g_battle.writeMsg(spellMonsterHitMsg(monster, amt));
                    if (monster.isDead()) g_battle.earnReward(monster, id);
                });
            }
        },
        {
            id: SPELL_SPARK,
            name: BunnyRPG.t("spell.name.spark"),
            mpCost: 3,
            type: SPELLTYPE_ATTACK_ALL,
            use: function () {
                g_battle.forEachMonster(function (monster, id) {
                    var amt = 20 + Math.floor(Math.random() * 40);
                    amt -= monster.getDefense();
                    if (amt < 1) amt = 1;
                    monster.damage(amt);
                    g_battle.writeMsg(spellMonsterHitMsg(monster, amt));
                    if (monster.isDead()) g_battle.earnReward(monster, id);
                });
            }
        },
        {
            id: SPELL_THUNDER,
            name: BunnyRPG.t("spell.name.thunder"),
            mpCost: 12,
            type: SPELLTYPE_ATTACK_ALL,
            use: function () {
                g_battle.forEachMonster(function (monster, id) {
                    var amt = 80 + Math.floor(Math.random() * 120);
                    amt -= monster.getDefense();
                    if (amt < 1) amt = 1;
                    monster.damage(amt);
                    g_battle.writeMsg(spellMonsterHitMsg(monster, amt));
                    if (monster.isDead()) g_battle.earnReward(monster, id);
                });
            }
        }
    ]
};

/* Characters */

const PLAYER_TREVOR = 0;

let g_playerData = {
    players: [
        {
            id: 0,
            name: BunnyRPG.t("player.default_name"),
            level: 1,
            maxHP: 100,
            maxMP: 5,
            attack: 12,
            defense: 0,
            exp: 0,
            gold: 0,
            weapon: ITEM_TIN_SWORD,
            armor: ITEM_CLOTHES,
            helmet: ITEM_CAP,
            shield: ITEM_TIN_SHIELD,
            inventory: [],
            spells: [],
            levels: [
                0, 50, 110, 200, 350, 600, 1000, 1500, 2250, 3375, 5000, 7500, 11250, 16875, 25000, 37500, 56250,
                84375, 126500, 189750, 284625, 426900, 640350, 960525, 1440750, 2161125, 3241650, 4862475, 7293700,
                10940550, 16410825
            ],
            max_levels: 30,
            maxHP_increase: 20,
            maxMP_increase: 5,
            attack_increase: 2,
            defense_increase: 1
        }
    ]
};
