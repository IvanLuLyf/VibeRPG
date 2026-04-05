/**
 * 消耗品：`effectScript` 由 ItemEffects.js（ItemEffectRun）执行；字段菜单与战斗里优先走脚本，不再调用 `use`。
 * 装备等无 `effectScript` 的条目不需要 `use`。
 */
// Ratio of Sell Price to Buy Price of Items
const SELL_PRICE_RATIO = 0.75;

const ITEMTYPE_HEAL_ONE = 1;
const ITEMTYPE_ATTACK_ALL = 4;
const ITEMTYPE_WEAPON = 5;
const ITEMTYPE_ARMOR = 6;
const ITEMTYPE_HELMET = 7;
const ITEMTYPE_SHIELD = 8;

const ITEM_POTION = 0;
const ITEM_BOMB = 1;
const ITEM_ETHER = 2;
const ITEM_MAX_POTION = 3;
const ITEM_ELIXER = 4;
const ITEM_TIN_SWORD = 10;
const ITEM_COPPER_SWORD = 11;
const ITEM_BRONZE_SWORD = 12;
const ITEM_IRON_SWORD = 13;
const ITEM_STEEL_SWORD = 14;
const ITEM_BROAD_SWORD = 15;
const ITEM_GREAT_SWORD = 16;
const ITEM_CLOTHES = 20;
const ITEM_LEATHER_ARMOR = 21;
const ITEM_CHAIN_MAIL = 22;
const ITEM_HALF_PLATE_MAIL = 23;
const ITEM_FULL_PLATE_MAIL = 24;
const ITEM_CAP = 30;
const ITEM_LEATHER_HELMET = 31;
const ITEM_BRONZE_HELMET = 32;
const ITEM_IRON_HELMET = 33;
const ITEM_STEEL_HELMET = 34;
const ITEM_TIN_SHIELD = 40;
const ITEM_COPPER_SHIELD = 41;
const ITEM_BRONZE_SHIELD = 42;
const ITEM_IRON_SHIELD = 43;
const ITEM_STEEL_SHIELD = 44;

let g_itemData = {
    items: {
        0: {
            id: ITEM_POTION,
            name: BunnyRPG.t("item.name.potion"),
            type: ITEMTYPE_HEAL_ONE,
            cost: 15,
            usable: true,
            effectScript: "heal_random|100|199"
        },
        1: {
            id: ITEM_BOMB,
            name: BunnyRPG.t("item.name.bomb"),
            type: ITEMTYPE_ATTACK_ALL,
            cost: 35,
            usable: true,
            effectScript: "battle_damage_all|50|149"
        },
        2: {
            id: ITEM_ETHER,
            name: BunnyRPG.t("item.name.ether"),
            type: ITEMTYPE_HEAL_ONE,
            cost: 100,
            usable: true,
            effectScript: "mp_random|25|49"
        },
        3: {
            id: ITEM_MAX_POTION,
            name: BunnyRPG.t("item.name.max_potion"),
            type: ITEMTYPE_HEAL_ONE,
            cost: 1,
            usable: true,
            effectScript: "heal_full"
        },
        4: {
            id: ITEM_ELIXER,
            name: BunnyRPG.t("item.name.elixer"),
            type: ITEMTYPE_HEAL_ONE,
            cost: 1,
            usable: true,
            effectScript: "restore_full"
        },
        10: {
            id: ITEM_TIN_SWORD,
            name: BunnyRPG.t("item.name.tin_sword"),
            type: ITEMTYPE_WEAPON,
            cost: 10,
            usable: false,
            attack: 5
        },
        11: {
            id: ITEM_COPPER_SWORD,
            name: BunnyRPG.t("item.name.copper_sword"),
            type: ITEMTYPE_WEAPON,
            cost: 30,
            usable: false,
            attack: 10
        },
        12: {
            id: ITEM_BRONZE_SWORD,
            name: BunnyRPG.t("item.name.bronze_sword"),
            type: ITEMTYPE_WEAPON,
            cost: 90,
            usable: false,
            attack: 15
        },
        13: {
            id: ITEM_IRON_SWORD,
            name: BunnyRPG.t("item.name.iron_sword"),
            type: ITEMTYPE_WEAPON,
            cost: 270,
            usable: false,
            attack: 20
        },
        14: {
            id: ITEM_STEEL_SWORD,
            name: BunnyRPG.t("item.name.steel_sword"),
            type: ITEMTYPE_WEAPON,
            cost: 810,
            usable: false,
            attack: 25
        },
        15: {
            id: ITEM_BROAD_SWORD,
            name: BunnyRPG.t("item.name.broad_sword"),
            type: ITEMTYPE_WEAPON,
            cost: 2430,
            usable: false,
            attack: 30
        },
        16: {
            id: ITEM_GREAT_SWORD,
            name: BunnyRPG.t("item.name.great_sword"),
            type: ITEMTYPE_WEAPON,
            cost: 7290,
            usable: false,
            attack: 35
        },
        20: {
            id: ITEM_CLOTHES,
            name: BunnyRPG.t("item.name.clothes"),
            type: ITEMTYPE_ARMOR,
            cost: 10,
            usable: false,
            defense: 1
        },
        21: {
            id: ITEM_LEATHER_ARMOR,
            name: BunnyRPG.t("item.name.leather_armor"),
            type: ITEMTYPE_ARMOR,
            cost: 50,
            usable: false,
            defense: 4
        },
        22: {
            id: ITEM_CHAIN_MAIL,
            name: BunnyRPG.t("item.name.chain_mail"),
            type: ITEMTYPE_ARMOR,
            cost: 250,
            usable: false,
            defense: 7
        },
        23: {
            id: ITEM_HALF_PLATE_MAIL,
            name: BunnyRPG.t("item.name.half_plate_mail"),
            type: ITEMTYPE_ARMOR,
            cost: 1250,
            usable: false,
            defense: 10
        },
        24: {
            id: ITEM_FULL_PLATE_MAIL,
            name: BunnyRPG.t("item.name.full_plate_mail"),
            type: ITEMTYPE_ARMOR,
            cost: 6250,
            usable: false,
            defense: 13
        },
        30: {
            id: ITEM_CAP,
            name: BunnyRPG.t("item.name.cap"),
            type: ITEMTYPE_HELMET,
            cost: 5,
            usable: false,
            defense: 1
        },
        31: {
            id: ITEM_LEATHER_HELMET,
            name: BunnyRPG.t("item.name.leather_helmet"),
            type: ITEMTYPE_HELMET,
            cost: 30,
            usable: false,
            defense: 2
        },
        32: {
            id: ITEM_BRONZE_HELMET,
            name: BunnyRPG.t("item.name.bronze_helmet"),
            type: ITEMTYPE_HELMET,
            cost: 150,
            usable: false,
            defense: 4
        },
        33: {
            id: ITEM_IRON_HELMET,
            name: BunnyRPG.t("item.name.iron_helmet"),
            type: ITEMTYPE_HELMET,
            cost: 600,
            usable: false,
            defense: 6
        },
        34: {
            id: ITEM_STEEL_HELMET,
            name: BunnyRPG.t("item.name.steel_helmet"),
            type: ITEMTYPE_HELMET,
            cost: 1800,
            usable: false,
            defense: 8
        },
        40: {
            id: ITEM_TIN_SHIELD,
            name: BunnyRPG.t("item.name.tin_shield"),
            type: ITEMTYPE_SHIELD,
            cost: 35,
            usable: false,
            defense: 1
        },
        41: {
            id: ITEM_COPPER_SHIELD,
            name: BunnyRPG.t("item.name.copper_shield"),
            type: ITEMTYPE_SHIELD,
            cost: 90,
            usable: false,
            defense: 2
        },
        42: {
            id: ITEM_BRONZE_SHIELD,
            name: BunnyRPG.t("item.name.bronze_shield"),
            type: ITEMTYPE_SHIELD,
            cost: 230,
            usable: false,
            defense: 4
        },
        43: {
            id: ITEM_IRON_SHIELD,
            name: BunnyRPG.t("item.name.iron_shield"),
            type: ITEMTYPE_SHIELD,
            cost: 700,
            usable: false,
            defense: 6
        },
        44: {
            id: ITEM_STEEL_SHIELD,
            name: BunnyRPG.t("item.name.steel_shield"),
            type: ITEMTYPE_SHIELD,
            cost: 2100,
            usable: false,
            defense: 8
        }
    }
};
