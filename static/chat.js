(function () {
    var url    = "/Ai_assistant/chat";
    var form   = document.getElementById("chatForm");
    var input  = document.getElementById("chatInput");
    var log    = document.getElementById("chatLog");
    var btn    = document.getElementById("chatSend");
    var err    = document.getElementById("chatError");
    var quota  = document.getElementById("chatQuota");
    var typing = document.getElementById("chatTyping");
    if (!form || !input || !log || !btn || !err || !typing) return;

    /* ── Auto-resize textarea to content ── */
    function resizeInput() {
        input.style.height = "auto";
        input.style.height = Math.min(input.scrollHeight, 120) + "px";
    }
    input.addEventListener("input", resizeInput);

    /* ── Add a message bubble with icon ── */
    function addLine(isUser, text) {
        var li = document.createElement("li");
        li.className = isUser ? "chat-msg chat-msg--user" : "chat-msg chat-msg--ai";

        var icon = document.createElement("div");
        icon.className = "chat-icon";
        icon.setAttribute("aria-hidden", "true");

        var bubble = document.createElement("div");
        bubble.className = "chat-bubble";
        bubble.textContent = text;   /* textContent — safe, no XSS risk */

        if (isUser) {
            li.appendChild(bubble);
            li.appendChild(icon);
        } else {
            li.appendChild(icon);
            li.appendChild(bubble);
        }

        /* Insert before typing indicator so it stays at the bottom */
        log.insertBefore(li, typing);
        scrollToBottom();
    }

    function scrollToBottom() {
        log.scrollTop = log.scrollHeight;
    }

    function showTyping() {
        typing.hidden = false;
        scrollToBottom();
    }

    function hideTyping() {
        typing.hidden = true;
    }

    /* ── Submit handler ── */
    form.addEventListener("submit", async function (ev) {
        ev.preventDefault();
        var text = input.value.trim();
        if (!text) return;

        err.hidden = true;
        err.textContent = "";

        addLine(true, text);
        input.value = "";
        resizeInput();
        btn.disabled = true;
        showTyping();

        try {
            var res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
                credentials: "same-origin",
            });
            var data = await res.json();
            hideTyping();
            if (res.ok && data.reply) {
                addLine(false, data.reply);
                if (quota && typeof data.remaining === "number") {
                    quota.textContent =
                        "Остават " + data.remaining + " съобщения днес към AI.";
                    quota.hidden = false;
                }
            } else {
                err.textContent = data.error || data.message || "Нещо се обърка.";
                err.hidden = false;
            }
        } catch (e) {
            hideTyping();
            err.textContent = "Няма връзка със сървъра.";
            err.hidden = false;
        }

        btn.disabled = false;
        input.focus();
    });

    /* ── Enter to send, Shift+Enter for new line ── */
    input.addEventListener("keydown", function (ev) {
        if (ev.key !== "Enter") return;
        if (ev.shiftKey) return;
        ev.preventDefault();
        if (btn.disabled) return;
        form.requestSubmit();
    });

    /* Scroll to bottom on load if there is prior history */
    scrollToBottom();
})();
