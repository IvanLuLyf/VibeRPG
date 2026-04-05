/**
 * 日本語パック。?lang=ja またはブラウザ優先言語が日本語のとき。
 */
(function () {
    if (!window.BunnyRPG || !BunnyRPG.registerLocale) return;

    BunnyRPG.registerLocale("ja", {
        keys: {
            "boot.powered_by": "Powered by BunnyRPG",
            "boot.title": "ナカモン",
            "boot.loading": "リソースを読み込み中…",
            "boot.load_fail_prefix": "次のリソースの読み込みに失敗しました：\n",
            "shop.thanks": "ありがとうございました。\nまたのご利用をお待ちしています。",
            "encounter.appear": "{name}があらわれた！",
            "place.world": "ワールドマップ",
            "place.milford": "ミルフォード町",
            "place.castle_town": "キャッスルタウン",
            "place.kingdom": "グラン王国",
            "place.dark_forest": "暗黒の森",
            "place.mountain_pass": "山道",
            "game.name_prompt": "名前を入力してください：",
            "game.secret_prompt": "合言葉を入力：",
            "game.potmoon_reward": "星が揃った。装備は万全だ。",
            "game.npc_potmoon_hint":
                "古い言葉 POTMOON を知る旅人には妙な幸運があるという。\n知っているなら、聞かれたときに言いなさい。",
            "game.npc_password_ask": "合言葉を知っていますか？\n",
            "battle.cmd_fight": "たたかう",
            "battle.cmd_bag": "バッグ",
            "battle.hint_back": "Esc：もどる",
            "battle.attack": "たたかう",
            "battle.move_empty": "—",
            "battle.defend": "ぼうぎょ",
            "battle.item": "どうぐ",
            "battle.party": "パーティ",
            "battle.run": "にげる",
            "battle.no_move_slot": "このわざ欄は空だ。",
            "battle.party_solo": "いまはひとりきりだ。",
            "ui.text_prompt.ok": "OK",
            "ui.text_prompt.cancel": "キャンセル",
            "ui.text_prompt.hint": "Enter：決定  ·  Esc：キャンセル"
        },
        keyTree: {
            item: {
                effect: {
                    heal_random: "{name}は{amt}HPかいふくした。",
                    heal_full: "{name}のHPは全回復した。",
                    mp_random: "{name}はMPを{amt}かいふくした。",
                    mp_full: "{name}のMPは全回復した。",
                    restore_full: "{name}の状態は全回復した。"
                },
                name: {
                    potion: "ポーション",
                    bomb: "ボム",
                    ether: "エーテル",
                    max_potion: "マックスポーション",
                    elixer: "エリクサー",
                    tin_sword: "ブリキの剣",
                    copper_sword: "銅の剣",
                    bronze_sword: "青銅の剣",
                    iron_sword: "鉄の剣",
                    steel_sword: "鋼の剣",
                    broad_sword: "ブロードソード",
                    great_sword: "グレートソード",
                    clothes: "ふつうの服",
                    leather_armor: "皮のよろい",
                    chain_mail: "チェインメイル",
                    half_plate_mail: "ハーフプレート",
                    full_plate_mail: "フルプレート",
                    cap: "ぼうし",
                    leather_helmet: "皮の兜",
                    bronze_helmet: "青銅の兜",
                    iron_helmet: "鉄の兜",
                    steel_helmet: "鋼の兜",
                    tin_shield: "ブリキの盾",
                    copper_shield: "銅の盾",
                    bronze_shield: "青銅の盾",
                    iron_shield: "鉄の盾",
                    steel_shield: "鋼の盾"
                }
            },
            spell: {
                name: {
                    heal: "ヒール",
                    bomb: "ボム",
                    spark: "スパーク",
                    thunder: "サンダー"
                },
                field: {
                    no_mp: "MPが足りず「{name}」を使えない。"
                }
            },
            player: {
                default_name: "あなた"
            },
            game: {
                chest: {
                    gold_found: "{amt}G みつかった。",
                    learn_spell: "まほうの本をみつけた。\n「{spell}」をおぼえた。"
                }
            },
            ui: {
                equip: {
                    weapon: "ぶき：",
                    armor: "よろい：",
                    helmet: "かぶと：",
                    shield: "たて："
                },
                save: {
                    slot: "セーブスロット{n}：",
                    empty: "から",
                    saved: "スロット{slot}にセーブした。",
                    load_no_save: "スロット{slot}にセーブデータがない。",
                    load_old_version: "このセーブは古いバージョンのもので\n現在の版と互換がありません。"
                },
                title: {
                    new_game: "ニューゲーム",
                    load_game: "ロード",
                    language: "言語"
                },
                main: {
                    item: "どうぐ",
                    spell: "まほう",
                    equip: "そうび",
                    status: "ステータス",
                    save: "セーブ",
                    load: "ロード"
                },
                shop: {
                    buy: "かう",
                    sell: "うる",
                    exit: "でる"
                },
                status: {
                    hp: "HP：",
                    mp: "MP：",
                    attack: "こうげき：",
                    defense: "ぼうぎょ：",
                    level: "レベル：",
                    exp: "けいけん：",
                    gold: "ゴールド："
                }
            },
            shop: {
                qty_cost_line: "数量：{qty}  費用：{cost}G",
                buy_one: "「{name}」を 1 つ {cost}G でかった。",
                buy_fail_one: "ゴールドが足りず「{name}」をかえない。\nいま {gold}G しかない。",
                buy_many: "「{name}」を {qty} つ {cost}G でかった。",
                buy_fail_many: "ゴールドが足りず「{name}」を {qty} つかえない。\nいま {gold}G しかない。",
                sell_one: "「{name}」を 1 つ {cost}G でうった。",
                sell_many: "「{name}」を {qty} つ {cost}G でうった。"
            },
            battle: {
                effect: {
                    monster_hit: "{name}は{dmg}のダメージを受けた。"
                },
                hud: {
                    lv: "Lv."
                },
                msg: {
                    no_mp: "MPが足りない",
                    cast_suffix: "「{name}」をとなえられない。",
                    defended: "ぼうぎょした。",
                    monster_killed: "{name}をたおした！",
                    exp_gained: "けいけんち {exp} を得た",
                    gold_gained: "ゴールド {gold} G を得た。",
                    level_up: "レベルがあがった！",
                    you_missed: "はずれた！",
                    crit: "かいしんのいちげき！",
                    you_hit: "{dmg}のダメージをあたえた。",
                    monster_missed: "{name}のこうげきははずれた！",
                    terrible_hit: "つうこん！",
                    monster_attack: "{name}のこうげき",
                    damage_amount: "{dmg}のダメージ！",
                    you_died: "たおされた…",
                    run_start: "にげだした。",
                    run_fail: "にげられなかった。",
                    run_ok: "うまくにげきれた。"
                }
            }
        },
        sceneDialogue: {
            "8": {
                shop_sign: {
                    welcome: "ミルフォードの看板が風にぎしぎしと揺れている。"
                }
            },
            "15": {
                gate_guard: {
                    halt: "止まれ！用件を言え。"
                }
            }
        },
        encounterAppear: {
            "A slime": "スライムがあらわれた！",
            "A rat": "ネズミがあらわれた！",
            "A snake": "ヘビがあらわれた！"
        },
        monsterNames: {
            slime: "スライム",
            rat: "ネズミ",
            snake: "ヘビ",
            wolf: "オオカミ",
            mage: "まどうし"
        }
    });
})();
