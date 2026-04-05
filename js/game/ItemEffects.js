/**
 * Data-driven item effects (pipe-separated lines). Used when `g_itemData.items[id].effectScript` is set;
 * field menu / battle item flow calls ItemEffectRun instead of item.use().
 * Same DSL could be reused from other systems; battle UI does not use ScriptEngine.run() today (different
 * entry points: spells still use misc.js spell.use).
 *
 * Uses BunnyRPG.t("item.effect.*" | "battle.effect.*", vars).
 *
 * Commands:
 *   heal_random|min|max
 *   heal_full
 *   mp_random|min|max
 *   mp_full
 *   restore_full
 *   battle_damage_all|min|max
 */
(function () {
    function t(key, vars) {
        if (typeof BunnyRPG === "undefined" || !BunnyRPG.t) return "[" + key + "]";
        return BunnyRPG.t(key, vars);
    }

    function targetDisplayName(target) {
        if (!target || !target.getName) return "";
        return String(target.getName());
    }

    function runLine(line, target, ctx) {
        var parts = line.split("|");
        var cmd = (parts[0] || "").trim().toLowerCase();

        switch (cmd) {
            case "heal_random": {
                var lo = parseInt(parts[1], 10) || 0;
                var hi = parseInt(parts[2], 10) || lo;
                var amt = lo + Math.floor(Math.random() * (hi - lo + 1));
                target.heal(amt);
                printText(t("item.effect.heal_random", { name: targetDisplayName(target), amt: amt }));
                break;
            }
            case "heal_full":
                target.heal(target.getMaxHP());
                printText(t("item.effect.heal_full", { name: targetDisplayName(target) }));
                break;
            case "mp_random": {
                var lo2 = parseInt(parts[1], 10) || 0;
                var hi2 = parseInt(parts[2], 10) || lo2;
                var am2 = lo2 + Math.floor(Math.random() * (hi2 - lo2 + 1));
                target.gainMP(am2);
                printText(t("item.effect.mp_random", { name: targetDisplayName(target), amt: am2 }));
                break;
            }
            case "mp_full":
                target.gainMP(target.getMaxMP());
                printText(t("item.effect.mp_full", { name: targetDisplayName(target) }));
                break;
            case "restore_full":
                target.heal(target.getMaxHP());
                target.gainMP(target.getMaxMP());
                printText(t("item.effect.restore_full", { name: targetDisplayName(target) }));
                break;
            case "battle_damage_all": {
                if (typeof g_battle === "undefined" || !g_battle) return;
                var dlo = parseInt(parts[1], 10) || 1;
                var dhi = parseInt(parts[2], 10) || dlo;
                g_battle.forEachMonster(function (monster, id) {
                    var dmg = dlo + Math.floor(Math.random() * (dhi - dlo + 1));
                    dmg -= monster.getDefense();
                    if (dmg < 1) dmg = 1;
                    monster.damage(dmg);
                    var rawName = monster.getName();
                    var nm =
                        typeof translateMonsterName === "function"
                            ? translateMonsterName(rawName)
                            : rawName;
                    g_battle.writeMsg(t("battle.effect.monster_hit", { name: nm, dmg: dmg }));
                    if (monster.isDead()) g_battle.earnReward(monster, id);
                });
                break;
            }
            default:
                break;
        }
    }

    function ItemEffectRun(scriptText, ctx) {
        if (!scriptText || typeof scriptText !== "string") return;
        var target =
            ctx && ctx.target ? ctx.target : typeof g_player !== "undefined" ? g_player : null;
        if (!target) return;
        var lines = scriptText.split(/\r?\n/);
        for (var i = 0; i < lines.length; i++) {
            var raw = lines[i].trim();
            if (!raw || raw.charAt(0) === "#") continue;
            runLine(raw, target, ctx || {});
        }
    }

    window.ItemEffectRun = ItemEffectRun;
})();
