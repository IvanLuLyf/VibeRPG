/**
 * 多语言唯一入口：window.OSRPG_LOCALES + BunnyRPG.registerLocale(code, partial)。
 * 文案不要挂旧全局（如 MAP_DIALOGUE_ZH）；在 js/lang/<code>-*.js 里 registerLocale 合并即可。
 * BunnyRPG.t(key, vars?) — 文案在语言包；缺 key 时回退 en 包，再无则显示 [key]。
 */
(function () {
    /** @type {Record<string, { keys: Record<string,string>, literals: Record<string,string>, mapDialogue: Record<string,string>, sceneDialogue: Record<string, Record<string, Record<string,string>>>, encounterAppear: Record<string,string>, monsterNames: Record<string,string> }>} */
    window.OSRPG_LOCALES = {};

    function mergeScene(target, src) {
        if (!src) return;
        for (var mid in src) {
            if (!Object.prototype.hasOwnProperty.call(src, mid)) continue;
            target[mid] = target[mid] || {};
            var block = src[mid];
            for (var rid in block) {
                if (!Object.prototype.hasOwnProperty.call(block, rid)) continue;
                target[mid][rid] = Object.assign({}, target[mid][rid] || {}, block[rid]);
            }
        }
    }

    /** Nested plain object of strings → flat "a.b.c" keys for BunnyRPG.t */
    function flattenKeyTree(node, prefix) {
        var out = {};
        if (node == null || typeof node !== "object" || Array.isArray(node)) return out;
        for (var k in node) {
            if (!Object.prototype.hasOwnProperty.call(node, k)) continue;
            var v = node[k];
            var path = prefix ? prefix + "." + k : k;
            if (typeof v === "string") {
                out[path] = v;
            } else if (v && typeof v === "object" && !Array.isArray(v)) {
                Object.assign(out, flattenKeyTree(v, path));
            }
        }
        return out;
    }

    /**
     * Register or merge a locale pack. Call from js/lang/*.js after defining data.
     * @param {string} code - BCP 47 base or full (e.g. zh, ja, pt-br → stored as zh, ja, pt)
     * @param {Partial<{ keys, keyTree, literals, mapDialogue, sceneDialogue, encounterAppear, monsterNames }>} partial
     *        keyTree: nested { item: { effect: { heal_random: "{name}…" } } } → merged as dotted keys
     */
    function registerLocale(code, partial) {
        if (!code || !partial) return;
        var c = String(code).toLowerCase().replace(/_/g, "-").split("-")[0];
        if (!c) return;
        var base =
            window.OSRPG_LOCALES[c] ||
            (window.OSRPG_LOCALES[c] = {
                keys: {},
                literals: {},
                mapDialogue: {},
                sceneDialogue: {},
                encounterAppear: {},
                monsterNames: {}
            });
        if (partial.keys) Object.assign(base.keys, partial.keys);
        if (partial.keyTree) Object.assign(base.keys, flattenKeyTree(partial.keyTree, ""));
        if (partial.literals) Object.assign(base.literals, partial.literals);
        if (partial.mapDialogue) Object.assign(base.mapDialogue, partial.mapDialogue);
        if (partial.encounterAppear) Object.assign(base.encounterAppear, partial.encounterAppear);
        if (partial.monsterNames) Object.assign(base.monsterNames, partial.monsterNames);
        if (partial.sceneDialogue) mergeScene(base.sceneDialogue, partial.sceneDialogue);
        refreshLocale();
    }

    var OSRPG_LOCALE_STORAGE_KEY = "osrpg_locale";

    var _urlLangParam = null;
    try {
        var params = new URLSearchParams(window.location.search);
        var forced = params.get("lang");
        if (forced) _urlLangParam = String(forced).toLowerCase().replace(/_/g, "-");
    } catch (e0) {}

    function readSavedLocale() {
        try {
            return localStorage.getItem(OSRPG_LOCALE_STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function codesRegistered() {
        return Object.keys(window.OSRPG_LOCALES || {});
    }

    function resolveCode(want) {
        var reg = codesRegistered();
        if (!want) return null;
        var w = String(want).toLowerCase().replace(/_/g, "-");
        if (reg.indexOf(w) >= 0) return w;
        var base = w.split("-")[0];
        if (reg.indexOf(base) >= 0) return base;
        return null;
    }

    function refreshLocale() {
        var chosen = "en";
        if (_urlLangParam) {
            var rUrl = resolveCode(_urlLangParam);
            chosen = rUrl || "en";
        } else {
            var saved = readSavedLocale();
            var rSaved = saved ? resolveCode(saved) : null;
            if (rSaved) chosen = rSaved;
            else {
                var navs =
                    navigator.languages && navigator.languages.length
                        ? navigator.languages
                        : [navigator.language || "en"];
                var found = null;
                for (var i = 0; i < navs.length; i++) {
                    found = resolveCode(navs[i]);
                    if (found) break;
                }
                chosen = found || "en";
            }
        }
        window.g_lang = chosen;
        try {
            document.documentElement.lang = chosen;
        } catch (e1) {}
    }

    /**
     * Switch UI language; persists to localStorage (unless ?lang= is set — URL wins until removed).
     * @param {string} code
     * @returns {boolean}
     */
    function setLocale(code) {
        if (_urlLangParam) {
            try {
                var u = new URL(window.location.href);
                u.searchParams.delete("lang");
                var qs = u.searchParams.toString();
                window.history.replaceState({}, "", u.pathname + (qs ? "?" + qs : "") + u.hash);
            } catch (e3) {}
            _urlLangParam = null;
        }
        var r = resolveCode(code);
        if (!r) return false;
        try {
            localStorage.setItem(OSRPG_LOCALE_STORAGE_KEY, r);
        } catch (e2) {}
        refreshLocale();
        if (typeof window.BunnyRPG._notifyLocaleChange === "function") window.BunnyRPG._notifyLocaleChange();
        return true;
    }

    window.g_lang = "en";

    function getLocale() {
        var g = window.g_lang;
        return g && window.OSRPG_LOCALES[g] ? window.OSRPG_LOCALES[g] : null;
    }

    function interpolateTemplate(str, vars) {
        if (str == null) return str;
        if (!vars || typeof vars !== "object") return String(str);
        return String(str).replace(/\{(\w+)\}/g, function (_, k) {
            return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : "{" + k + "}";
        });
    }

    /**
     * Short-key i18n with {placeholder} support.
     * @param {string} key - e.g. "ui.save"
     * @param {Record<string, string|number>|null} [vars]
     */
    function bunnyT(key, vars) {
        var loc = getLocale();
        var pack = loc && loc.keys;
        if (pack && Object.prototype.hasOwnProperty.call(pack, key))
            return interpolateTemplate(pack[key], vars);
        var enLoc = window.OSRPG_LOCALES && window.OSRPG_LOCALES.en;
        var enPack = enLoc && enLoc.keys;
        if (enPack && Object.prototype.hasOwnProperty.call(enPack, key))
            return interpolateTemplate(enPack[key], vars);
        return interpolateTemplate("[" + key + "]", vars);
    }

    window.translateMapText = function (s) {
        if (!s) return s;
        var loc = getLocale();
        var m = loc && loc.mapDialogue;
        if (m && m[s]) return m[s];
        return s;
    };

    window.translateSceneText = function (mapId, roleId, lineKey, enFallback) {
        var fb = enFallback != null ? String(enFallback) : "";
        if (mapId == null || !roleId || !lineKey) return fb;
        var loc = getLocale();
        if (!loc) return fb;
        var mid = String(mapId);
        var block = loc.sceneDialogue && loc.sceneDialogue[mid] && loc.sceneDialogue[mid][roleId];
        var s = block && Object.prototype.hasOwnProperty.call(block, lineKey) ? block[lineKey] : null;
        return s != null ? String(s) : fb;
    };

    window.translateEncounterAppear = function (encounterName) {
        if (!encounterName) return "";
        var loc = getLocale();
        var m = loc && loc.encounterAppear;
        if (m && m[encounterName]) return m[encounterName];
        return window.BunnyRPG.t("encounter.appear", { name: encounterName });
    };

    window.translateMonsterName = function (name) {
        var loc = getLocale();
        var m = loc && loc.monsterNames;
        if (m && m[name]) return m[name];
        return name;
    };

    var localeTagMap = {
        zh: "zh-CN",
        ja: "ja-JP",
        ko: "ko-KR",
        pt: "pt-BR",
        fr: "fr-FR",
        de: "de-DE",
        es: "es-ES",
        ru: "ru-RU",
        en: "en-US"
    };

    window.BunnyRPG = window.BunnyRPG || {};
    window.BunnyRPG.t = bunnyT;
    window.BunnyRPG.interpolate = interpolateTemplate;
    window.BunnyRPG.registerLocale = registerLocale;
    window.BunnyRPG.refreshLocale = refreshLocale;
    window.BunnyRPG.setLocale = setLocale;
    /** Display names for title language menu (fallback: uppercased code). */
    window.BunnyRPG.localeLabels = {
        en: "English",
        zh: "中文",
        ja: "日本語"
    };
    window.BunnyRPG.getLocaleCodes = function () {
        return codesRegistered().slice();
    };
    /** BCP 47 tag for Intl / toLocaleString */
    window.BunnyRPG.localeTag = function () {
        return localeTagMap[window.g_lang] || window.g_lang || "en-US";
    };

    window.OSRPG_STORAGE_PREFIX = "osrpg_save_";
})();
