/**
 * English canonical strings (locale pack "en"). Other locales override the same keys.
 * Load after i18n.js, before zh-ui / ja-ui.
 */
(function () {
    if (!window.BunnyRPG || !BunnyRPG.registerLocale) return;

    var enUiKeys = {
        "boot.powered_by": "Powered by BunnyRPG",
        "boot.title": "OS-RPG",
        "boot.loading": "Loading resources…",
        "boot.load_fail_prefix": "Some resources failed to load:\n",
        "shop.thanks": "Thank you for your business.\nPlease come again.",
        "encounter.appear": "{name} appeared!",
        "place.hub": "Hub",
        "place.field": "Field (random encounters)",
        "player.default_name": "Frieren",
        "game.name_prompt": "What is your name?",
        "game.secret_prompt": "Enter password:",
        "game.potmoon_reward": "The stars align. You are fully equipped.",
        "game.npc_potmoon_hint":
            "They say travelers who know the old word POTMOON find strange luck.\nIf you know it, say it when I ask.",
        "game.npc_password_ask": "Do you know the password?\n",
        "battle.cmd_fight": "Fight",
        "battle.cmd_bag": "Bag",
        "battle.hint_back": "Esc: Back",
        "battle.attack": "Attack",
        "battle.move_empty": "—",
        "battle.defend": "Defend",
        "battle.item": "Item",
        "battle.party": "Pokémon",
        "battle.run": "Run",
        "battle.no_move_slot": "No move in this slot.",
        "battle.party_solo": "You're on your own for now.",
        "ui.text_prompt.ok": "OK",
        "ui.text_prompt.cancel": "Cancel",
        "ui.text_prompt.hint": "Enter: confirm  ·  Esc: cancel"
    };

    var enKeyTree = {
        item: {
            effect: {
                heal_random: "{name} healed for {amt} HP.",
                heal_full: "{name} is fully healed.",
                mp_random: "{name} recovered {amt} MP.",
                mp_full: "{name}'s MP is fully restored.",
                restore_full: "{name} is fully restored."
            },
            name: {
                potion: "Potion",
                bomb: "Bomb",
                ether: "Ether",
                max_potion: "Max Potion",
                elixer: "Elixer",
                tin_sword: "Tin Sword",
                copper_sword: "Copper Sword",
                bronze_sword: "Bronze Sword",
                iron_sword: "Iron Sword",
                steel_sword: "Steel Sword",
                broad_sword: "Broad Sword",
                great_sword: "Great Sword",
                clothes: "Clothes",
                leather_armor: "Leather Armor",
                chain_mail: "Chain Mail",
                half_plate_mail: "Half Plate Mail",
                full_plate_mail: "Full Plate Mail",
                cap: "Cap",
                leather_helmet: "Leather Helmet",
                bronze_helmet: "Bronze Helmet",
                iron_helmet: "Iron Helmet",
                steel_helmet: "Steel Helmet",
                tin_shield: "Tin Shield",
                copper_shield: "Copper Shield",
                bronze_shield: "Bronze Shield",
                iron_shield: "Iron Shield",
                steel_shield: "Steel Shield"
            }
        },
        spell: {
            name: {
                heal: "Heal",
                bomb: "Bomb",
                spark: "Spark",
                thunder: "Thunder"
            },
            field: {
                no_mp: "You do not have enough mp to use {name}."
            }
        },
        player: {
            default_name: "You"
        },
        game: {
            chest: {
                gold_found: "You found {amt} gold.",
                learn_spell: "You found a spell book.\nYou learned {spell}."
            }
        },
        ui: {
            equip: {
                weapon: "Weapon:",
                armor: "Armor:",
                helmet: "Helmet:",
                shield: "Shield:"
            },
            save: {
                slot: "Save Slot {n}:",
                empty: "Empty",
                saved: "Game saved to slot {slot}.",
                load_no_save: "There is no saved game in slot {slot}.",
                load_old_version: "The game saved is from an old,\nincompatible version."
            },
            title: {
                new_game: "New Game",
                load_game: "Load Game",
                language: "Language"
            },
            main: {
                item: "Item",
                spell: "Spell",
                equip: "Equip",
                status: "Status",
                save: "Save",
                load: "Load"
            },
            shop: {
                buy: "Buy",
                sell: "Sell",
                exit: "Exit"
            },
            status: {
                hp: "HP:      ",
                mp: "MP:      ",
                attack: "Attack:  ",
                defense: "Defense: ",
                level: "Level:   ",
                exp: "Exp:     ",
                gold: "Gold:    "
            }
        },
        shop: {
            qty_cost_line: "Quantity: {qty}  Cost: {cost}G",
            buy_one: "You purchased 1 {name} for {cost}G.",
            buy_fail_one: "You do not have enough gold\nto buy a {name}.\nYou only have {gold}G.",
            buy_many: "You purchased {qty} {name}s for {cost}G.",
            buy_fail_many: "You do not have enough gold\nto buy {qty} {name}s.\nYou only have {gold}G.",
            sell_one: "You sold 1 {name} for {cost}G.",
            sell_many: "You sold {qty} {name}s for {cost}G."
        },
        battle: {
            effect: {
                monster_hit: "{name} took {dmg} damage."
            },
            hud: {
                lv: "Lv."
            },
            msg: {
                no_mp: "You do not have enough MP",
                cast_suffix: "to cast {name}.",
                defended: "You defended.",
                monster_killed: "The {name} was killed.",
                exp_gained: "You have earned {exp} exp",
                gold_gained: "and {gold} GP.",
                level_up: "You gained a level!",
                you_missed: "You missed!",
                crit: "Critical Hit!",
                you_hit: "You attacked for {dmg} damage.",
                monster_missed: "The {name} missed!",
                terrible_hit: "Terrible Hit!",
                monster_attack: "The {name} attacked for",
                damage_amount: "{dmg} damage.",
                you_died: "You died.",
                run_start: "You start to run.",
                run_fail: "You couldn't run away.",
                run_ok: "You ran away."
            }
        }
    };

    BunnyRPG.registerLocale("en", {
        keys: enUiKeys,
        keyTree: enKeyTree
    });
})();
