(function () {
    var url = "/Ai_assistant/chat";  // директно, без data attribute
    var form = document.getElementById("chatForm");
    var input = document.getElementById("chatInput");
    var log = document.getElementById("chatLog");
    var btn = document.getElementById("chatSend");
    var err = document.getElementById("chatError");
    if (!form || !input || !log || !btn || !err) return;

    function addLine(isUser, text) {
        var li = document.createElement("li");
        li.className = isUser ? "chat-msg chat-msg--user" : "chat-msg chat-msg--ai";
        li.textContent = text;
        log.appendChild(li);
        log.scrollTop = log.scrollHeight;
    }

    form.addEventListener("submit", async function (ev) {
        ev.preventDefault();
        var text = input.value.trim();
        if (!text) return;

        err.hidden = true;
        err.textContent = "";
        addLine(true, text);
        input.value = "";
        btn.disabled = true;

        try {
            var res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
                credentials: "same-origin",
            });
            var data = await res.json();
            if (data.reply) {
                addLine(false, data.reply);
            } else {
                err.textContent = data.error || data.message || "Нещо се обърка.";
                err.hidden = false;
            }
        } catch (e) {
            err.textContent = "Няма връзка със сървъра.";
            err.hidden = false;
        }

        btn.disabled = false;
        input.focus();
    });

    input.addEventListener("keydown", function (ev) {
        if (ev.key !== "Enter") return;
        if (ev.shiftKey) return;
        ev.preventDefault();
        if (btn.disabled) return;
        form.requestSubmit();
    });
})();