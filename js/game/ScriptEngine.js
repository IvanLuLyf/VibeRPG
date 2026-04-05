/**
 * 极简命令式脚本（每行一条）。用于 maps 里 NPC 的 `script` / 地图格 `onAction.script`。
 *
 * NPC 对话绑定：把脚本写在对应 NPC 的 `script` 字段即可（地图数据在 js/game/maps/maps-starter.js）。
 * 多语言：`t|i18nKey`（文案在 en-ui / 各语言包）；或 `scene|roleId|lineKey|英文回退`。
 * 元数据 / 备忘：任意以 # 开头的行是注释，可写 # npc:foo # line:1 等方便检索（不参与执行）。
 *
 * 命令（管道符分隔参数）：
 *   display|<文本>     — translateMapText 后显示
 *   say|<英文>|<中文>  — 仅 zh 用第二段；新内容请用 t|
 *   t|<i18nKey>        — BunnyRPG.t(key)（可保留旧格式 t|key|… 第二段起忽略）
 *   scene|<角色id>|<台词key>|<默认英文> — translateSceneText(mapId, roleId, lineKey, enFallback)
 *   flag|set|<名> / flag|clear|<名>
 *   prompt_secret|<PASSWORD> — 合言葉；匹配则 GameBusiness.grantPOTMOON()（游戏内输入框）
 *
 * 战斗：未接入本引擎；道具效果见 ItemEffectRun(effectScript)。
 */
const ScriptEngine = {
    async run(scriptText, ctx) {
        if (!scriptText || typeof scriptText !== "string") return;
        const mapId =
            ctx && ctx.mapId != null
                ? ctx.mapId
                : typeof g_worldmap !== "undefined" && g_worldmap
                  ? g_worldmap.getCurrentSubMapId()
                  : null;
        const lines = scriptText.split(/\r?\n/);
        for (let raw of lines) {
            const line = raw.trim();
            if (!line || line.charAt(0) === "#") continue;
            const pipe = line.indexOf("|");
            if (pipe < 0) continue;
            const cmd = line.slice(0, pipe).trim().toLowerCase();
            const rest = line.slice(pipe + 1);
            switch (cmd) {
                case "display":
                    g_textDisplay.displayText(rest);
                    break;
                case "say": {
                    const p = rest.indexOf("|");
                    const en = p >= 0 ? rest.slice(0, p) : rest;
                    const zh = p >= 0 ? rest.slice(p + 1) : undefined;
                    if (window.g_lang === "zh" && zh != null && zh !== "") g_textDisplay.displayText(zh);
                    else g_textDisplay.displayText(en);
                    break;
                }
                case "t": {
                    const p = rest.indexOf("|");
                    const key = (p >= 0 ? rest.slice(0, p) : rest).trim();
                    g_textDisplay.displayText(BunnyRPG.t(key));
                    break;
                }
                case "scene": {
                    const parts = rest.split("|");
                    const roleId = (parts[0] || "").trim();
                    const lineKey = (parts[1] || "").trim();
                    const enFallback = parts.slice(2).join("|") || "";
                    const msg =
                        typeof translateSceneText === "function"
                            ? translateSceneText(mapId, roleId, lineKey, enFallback)
                            : enFallback;
                    g_textDisplay.displayText(msg);
                    break;
                }
                case "flag": {
                    const parts = rest.split("|");
                    const op = (parts[0] || "").trim().toLowerCase();
                    const name = (parts[1] || "").trim();
                    if (!name || !g_game) break;
                    if (op === "set") g_game.setFlag(name);
                    else if (op === "clear") g_game.clearFlag(name);
                    break;
                }
                case "prompt_secret": {
                    const code = (rest || "").trim().toUpperCase();
                    const label = BunnyRPG.t("game.secret_prompt");
                    let user = null;
                    if (typeof showGameTextPrompt === "function") {
                        user = await showGameTextPrompt({ label: label, initial: "", maxLength: 64 });
                    } else {
                        user = window.prompt(label, "");
                    }
                    if (user && user.trim().toUpperCase() === code) {
                        if (typeof GameBusiness !== "undefined" && GameBusiness.grantPOTMOON)
                            GameBusiness.grantPOTMOON();
                    }
                    break;
                }
                default:
                    break;
            }
        }
    }
};
