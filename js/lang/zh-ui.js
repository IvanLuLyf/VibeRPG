/**
 * 中文 UI / 物品 / 战斗文案。registerLocale("zh", { keys, keyTree })。
 */
(function () {
    var zhUiKeys = {
        "boot.powered_by": "由 BunnyRPG 驱动",
        "boot.title": "《纳卡蒙》",
        "boot.loading": "加载资源中…",
        "boot.load_fail_prefix": "部分资源加载失败：\n",
        "shop.thanks": "谢谢惠顾。\n欢迎再来。",
        "encounter.appear": "{name}出现了！",
        "place.world": "世界地图",
        "place.milford": "米尔福德镇",
        "place.castle_town": "城堡镇",
        "place.kingdom": "格兰王国",
        "place.dark_forest": "黑暗森林",
        "place.mountain_pass": "山间小道",
        "game.name_prompt": "请输入你的名字：",
        "game.secret_prompt": "请输入口令：",
        "game.potmoon_reward": "星象齐一。你已全副武装。",
        "game.npc_potmoon_hint": "据说知道古词 POTMOON 的旅人会走奇运。\n若你知道，等我开口时再说。",
        "game.npc_password_ask": "你知道那句口令吗？\n",
        "battle.cmd_fight": "战斗",
        "battle.cmd_bag": "背包",
        "battle.hint_back": "Esc：返回",
        "battle.attack": "攻击",
        "battle.move_empty": "—",
        "battle.defend": "防御",
        "battle.item": "道具",
        "battle.party": "队伍",
        "battle.run": "逃跑",
        "battle.no_move_slot": "此栏没有技能。",
        "battle.party_solo": "目前只有你一人。",
        "ui.text_prompt.ok": "确定",
        "ui.text_prompt.cancel": "取消",
        "ui.text_prompt.hint": "Enter：确定  ·  Esc：取消"
    };

    var zhKeyTree = {
        item: {
            effect: {
                heal_random: "{name}恢复了{amt}点生命。",
                heal_full: "{name}的生命完全恢复了。",
                mp_random: "{name}恢复了{amt}点魔法值。",
                mp_full: "{name}的魔法完全恢复了。",
                restore_full: "{name}完全恢复了状态。"
            },
            name: {
                potion: "药水",
                bomb: "炸弹",
                ether: "以太药",
                max_potion: "极限药水",
                elixer: "灵药",
                tin_sword: "锡剑",
                copper_sword: "铜剑",
                bronze_sword: "青铜剑",
                iron_sword: "铁剑",
                steel_sword: "钢剑",
                broad_sword: "阔剑",
                great_sword: "巨剑",
                clothes: "布衣",
                leather_armor: "皮甲",
                chain_mail: "锁子甲",
                half_plate_mail: "半身板甲",
                full_plate_mail: "全身板甲",
                cap: "便帽",
                leather_helmet: "皮盔",
                bronze_helmet: "青铜盔",
                iron_helmet: "铁盔",
                steel_helmet: "钢盔",
                tin_shield: "锡盾",
                copper_shield: "铜盾",
                bronze_shield: "青铜盾",
                iron_shield: "铁盾",
                steel_shield: "钢盾"
            }
        },
        spell: {
            name: {
                heal: "治疗",
                bomb: "炸弹",
                spark: "电火花",
                thunder: "雷鸣"
            },
            field: {
                no_mp: "魔法值不足，无法使用「{name}」。"
            }
        },
        player: {
            default_name: "你"
        },
        game: {
            chest: {
                gold_found: "你获得了 {amt} 金币。",
                learn_spell: "你发现了一本法术书。\n你学会了「{spell}」。"
            }
        },
        ui: {
            equip: {
                weapon: "武器：",
                armor: "护甲：",
                helmet: "头盔：",
                shield: "盾牌："
            },
            save: {
                slot: "存档槽 {n}：",
                empty: "空",
                saved: "已保存到存档槽 {slot}。",
                load_no_save: "存档槽 {slot} 中没有存档。",
                load_old_version: "该存档来自旧版本，\n与当前版本不兼容。"
            },
            title: {
                new_game: "新游戏",
                load_game: "读档",
                language: "语言"
            },
            main: {
                item: "道具",
                spell: "法术",
                equip: "装备",
                status: "状态",
                save: "存档",
                load: "读档"
            },
            shop: {
                buy: "购买",
                sell: "出售",
                exit: "离开"
            },
            status: {
                hp: "生命：",
                mp: "魔法：",
                attack: "攻击：",
                defense: "防御：",
                level: "等级：",
                exp: "经验：",
                gold: "金币："
            }
        },
        shop: {
            qty_cost_line: "数量：{qty}  花费：{cost} 金币",
            buy_one: "你购买了 1 个「{name}」，花费 {cost} 金币。",
            buy_fail_one: "金币不足，无法购买「{name}」。\n你只有 {gold} 金币。",
            buy_many: "你购买了 {qty} 个「{name}」，花费 {cost} 金币。",
            buy_fail_many: "金币不足，无法购买 {qty} 个「{name}」。\n你只有 {gold} 金币。",
            sell_one: "你出售了 1 个「{name}」，获得 {cost} 金币。",
            sell_many: "你出售了 {qty} 个「{name}」，获得 {cost} 金币。"
        },
        battle: {
            effect: {
                monster_hit: "{name}受到{dmg}点伤害。"
            },
            hud: {
                lv: "Lv."
            },
            msg: {
                no_mp: "魔法值不足",
                cast_suffix: "无法施放「{name}」。",
                defended: "你采取了防御。",
                monster_killed: "{name}被击败了！",
                exp_gained: "你获得了 {exp} 点经验值",
                gold_gained: "以及 {gold} 金币。",
                level_up: "你升级了！",
                you_missed: "未命中！",
                crit: "会心一击！",
                you_hit: "你造成了 {dmg} 点伤害。",
                monster_missed: "{name}没有打中！",
                terrible_hit: "重创！",
                monster_attack: "{name}攻击造成",
                damage_amount: "{dmg} 点伤害。",
                you_died: "你阵亡了。",
                run_start: "你转身要逃。",
                run_fail: "没能逃走。",
                run_ok: "你成功逃走了。"
            }
        }
    };

    if (window.BunnyRPG && BunnyRPG.registerLocale) {
        BunnyRPG.registerLocale("zh", {
            keys: zhUiKeys,
            keyTree: zhKeyTree
        });
    }
})();
