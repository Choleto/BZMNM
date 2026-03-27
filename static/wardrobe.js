/* Гардероб: брояч „носена“, цена/носене, филтър по категория, подредба — данни от сървъра (БД), не localStorage */
(function () {
    var SEASON_ORDER = { Spring: 0, Summer: 1, Fall: 2, Winter: 3 };
    var activeFilter = "All";

    function syncPrices() {
        document.querySelectorAll(".item-card").forEach(function (card) {
            var times = +((card.querySelector(".js-times") || {}).textContent || 0) || 0;
            var euro = parseFloat(card.getAttribute("data-price")) || 0;
            var el = card.querySelector(".js-cost-per-wear");
            if (el) el.textContent = euro > 0 && times > 0 ? (euro / times).toFixed(2) + " €" : "—";
        });
    }

    function seasonRank(s) {
        s = (s || "").trim();
        return SEASON_ORDER[s] !== undefined ? SEASON_ORDER[s] : 999;
    }

    function sortGrid() {
        var grid = document.getElementById("wardrobeGrid");
        var select = document.getElementById("wardrobeSort");
        if (!grid || !select) return;
        var mode = select.value;
        var cards = [].slice.call(grid.querySelectorAll(".item-card"));
        cards.sort(function (a, b) {
            var idA = a.getAttribute("data-item-id");
            var idB = b.getAttribute("data-item-id");
            if (mode === "season_order") {
                var ra = seasonRank(a.getAttribute("data-season"));
                var rb = seasonRank(b.getAttribute("data-season"));
                if (ra !== rb) return ra - rb;
                var na = parseInt(idA, 10);
                var nb = parseInt(idB, 10);
                if (!isNaN(na) && !isNaN(nb) && na !== nb) return na - nb;
                return 0;
            }
            var ta = parseInt(a.getAttribute("data-times-worn") || "0", 10) || 0;
            var tb = parseInt(b.getAttribute("data-times-worn") || "0", 10) || 0;
            return mode === "most_worn" ? tb - ta : ta - tb;
        });
        cards.forEach(function (c) {
            grid.appendChild(c);
        });
    }

    function applyCategoryFilter() {
        var cards = document.querySelectorAll("#wardrobeGrid .item-card");
        var anyShown = false;
        for (var i = 0; i < cards.length; i++) {
            var t = cards[i].getAttribute("data-item-type") || "";
            var show =
                activeFilter === "All" ||
                t.toLowerCase().trim() === activeFilter.toLowerCase().trim();
            cards[i].style.display = show ? "" : "none";
            if (show) anyShown = true;
        }
        var msg = document.getElementById("wardrobeFilterEmpty");
        if (msg) msg.hidden = anyShown;
    }

    function resort() {
        sortGrid();
        applyCategoryFilter();
    }

    document.querySelectorAll(".wardrobe-cat-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            activeFilter = btn.getAttribute("data-filter") || "All";
            document.querySelectorAll(".wardrobe-cat-btn").forEach(function (b) {
                b.classList.toggle("is-active", b === btn);
            });
            applyCategoryFilter();
        });
    });

    var sortSelect = document.getElementById("wardrobeSort");
    if (sortSelect) sortSelect.addEventListener("change", resort);

    function getDonateMarkedCount() {
        var el = document.querySelector(".js-donate-marked-count[data-donate-count]");
        if (el) {
            var n = parseInt(el.getAttribute("data-donate-count") || "0", 10);
            return isNaN(n) || n < 0 ? 0 : n;
        }
        return 0;
    }

    function formatDonateMarkedLabel(n) {
        return "Дрехи дарени: " + n;
    }

    function setDonateMarkedCountDisplay() {
        var n = getDonateMarkedCount();
        var text = formatDonateMarkedLabel(n);
        document.querySelectorAll(".js-donate-marked-count").forEach(function (el) {
            el.textContent = text;
        });
    }

    var DONATE_CONFIRM_MSG =
        "Да се маркира ли тази дреха като дарена? Ще я видиш в прегледа „Дрехи дарени“.";

    document.addEventListener("click", function (ev) {
        var btn = ev.target.closest(".btn-wore-it");
        if (!btn) return;
        var card = btn.closest(".item-card");
        if (!card) return;
        var span = card.querySelector(".js-times");
        if (!span) return;
        var itemId = span.getAttribute("data-item-id");
        var cur = parseInt(span.textContent, 10) || 0;
        var next = cur + 1;
        span.textContent = String(next);
        card.setAttribute("data-times-worn", String(next));
        syncPrices();
        var form = document.getElementById("form-mark-worn-" + itemId);
        if (form) form.submit();
    });

    document.querySelectorAll(".item-card-delete-form").forEach(function (form) {
        form.addEventListener("submit", function (ev) {
            ev.preventDefault();
            if (!confirm(DONATE_CONFIRM_MSG)) return;
            form.submit();
        });
    });

    syncPrices();
    setDonateMarkedCountDisplay();
    resort();
})();
