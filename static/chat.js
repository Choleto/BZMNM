/* Чат с AI: изпраща съобщение към сървъра и показва отговора */
(function () {
    var url =
        (document.body && document.body.getAttribute("data-chat-send-url")) ||
        "/chat/message";
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
})();
