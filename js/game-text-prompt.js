/**
 * In-game text input overlay (replaces window.prompt). Styled to match the canvas RPG UI.
 * Depends: i18n.js + en-ui (or any locale with ui.text_prompt.* keys).
 */
(function () {
    var root;
    var inputEl;
    var labelEl;
    var hintEl;
    var resolvePromise = null;

    function hintText() {
        if (typeof BunnyRPG !== "undefined" && BunnyRPG.t) return BunnyRPG.t("ui.text_prompt.hint");
        return "Enter: OK — Esc: Cancel";
    }

    function buttonLabel(key, fallback) {
        if (typeof BunnyRPG !== "undefined" && BunnyRPG.t) return BunnyRPG.t(key);
        return fallback;
    }

    function focusCanvas() {
        var c = document.getElementById("gameCanvas");
        if (c) {
            try {
                c.focus();
            } catch (e) {}
        }
    }

    function closeWith(value) {
        if (!root) return;
        root.hidden = true;
        root.setAttribute("aria-hidden", "true");
        document.body.classList.remove("osrpg-prompt-open");
        var r = resolvePromise;
        resolvePromise = null;
        if (r) r(value);
        focusCanvas();
    }

    function ensureDom() {
        if (root) return;
        root = document.createElement("div");
        root.id = "osrpg-text-prompt-root";
        root.className = "osrpg-text-prompt-root";
        root.setAttribute("role", "dialog");
        root.setAttribute("aria-modal", "true");
        root.setAttribute("aria-hidden", "true");
        root.hidden = true;
        root.innerHTML =
            '<div class="osrpg-text-prompt-panel">' +
            '<div class="osrpg-text-prompt-label" aria-live="polite"></div>' +
            '<input type="text" class="osrpg-text-prompt-input" autocomplete="off" spellcheck="false" />' +
            '<div class="osrpg-text-prompt-hint"></div>' +
            '<div class="osrpg-text-prompt-actions">' +
            '<button type="button" class="osrpg-text-prompt-btn osrpg-text-prompt-ok"></button>' +
            '<button type="button" class="osrpg-text-prompt-btn osrpg-text-prompt-cancel"></button>' +
            "</div>" +
            "</div>";
        document.body.appendChild(root);
        labelEl = root.querySelector(".osrpg-text-prompt-label");
        inputEl = root.querySelector(".osrpg-text-prompt-input");
        hintEl = root.querySelector(".osrpg-text-prompt-hint");
        var btnOk = root.querySelector(".osrpg-text-prompt-ok");
        var btnCancel = root.querySelector(".osrpg-text-prompt-cancel");
        btnOk.textContent = buttonLabel("ui.text_prompt.ok", "OK");
        btnCancel.textContent = buttonLabel("ui.text_prompt.cancel", "Cancel");

        btnOk.addEventListener("click", function () {
            closeWith(inputEl ? inputEl.value : "");
        });
        btnCancel.addEventListener("click", function () {
            closeWith(null);
        });
        root.addEventListener("click", function (e) {
            if (e.target === root) closeWith(null);
        });
        /** 不把键盘事件冒泡到 window，否则 main.js 的 Enter/方向键会当游戏确认、移动 */
        function stopKeysReachingGame(e) {
            e.stopPropagation();
        }
        root.addEventListener("keydown", stopKeysReachingGame, false);
        root.addEventListener("keyup", stopKeysReachingGame, false);
        inputEl.addEventListener("keydown", function (e) {
            e.stopPropagation();
            if (e.key === "Enter") {
                e.preventDefault();
                closeWith(inputEl.value);
            } else if (e.key === "Escape") {
                e.preventDefault();
                closeWith(null);
            }
        });
    }

    /**
     * @param {{ label?: string, initial?: string, maxLength?: number }} [options]
     * @returns {Promise<string|null>} submitted value, or null if cancelled
     */
    window.showGameTextPrompt = function (options) {
        options = options || {};
        if (resolvePromise) {
            var prev = resolvePromise;
            resolvePromise = null;
            prev(null);
        }
        ensureDom();
        if (typeof window.resetGameKeyboardHoldStateForOverlay === "function")
            window.resetGameKeyboardHoldStateForOverlay();
        root.querySelector(".osrpg-text-prompt-ok").textContent = buttonLabel("ui.text_prompt.ok", "OK");
        root.querySelector(".osrpg-text-prompt-cancel").textContent = buttonLabel(
            "ui.text_prompt.cancel",
            "Cancel"
        );
        labelEl.textContent = options.label != null ? String(options.label) : "";
        inputEl.value = options.initial != null ? String(options.initial) : "";
        inputEl.maxLength = options.maxLength != null ? Math.max(1, options.maxLength) : 64;
        hintEl.textContent = hintText();

        return new Promise(function (resolve) {
            resolvePromise = resolve;
            root.hidden = false;
            root.setAttribute("aria-hidden", "false");
            document.body.classList.add("osrpg-prompt-open");
            requestAnimationFrame(function () {
                inputEl.focus();
                try {
                    inputEl.select();
                } catch (e2) {}
            });
        });
    };
})();
