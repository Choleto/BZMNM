/* Гардероб: брояч „носена“, цена/носене, филтър по категория, подредба */
(function () {
    var TIMES_KEY = "wardrobeTimesWorn_v1";
    var DATE_KEY = "wardrobeDateAdded_v1";
    var PRICES_KEY = "wardrobePrice_v1";
    var DONATE_MARKED_COUNT_KEY = "wardrobeDonateMarkedCount_v1";
    var SEASON_ORDER = { Spring: 0, Summer: 1, Fall: 2, Winter: 3 };
    var activeFilter = "All";

    function load(key) {
        try {
            var text = localStorage.getItem(key);
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return {};
        }
    }

    function save(key, obj) {
        localStorage.setItem(key, JSON.stringify(obj));
    }

    function syncPrices() {
        var prices = load(PRICES_KEY);
        var pending = sessionStorage.getItem("pendingClothesPrice");
        if (pending !== null) {
            sessionStorage.removeItem("pendingClothesPrice");
            var euro = parseFloat(pending, 10);
            if (!isNaN(euro) && euro >= 0) {
                var newest = 0;
                document.querySelectorAll(".item-card").forEach(function (c) {
                    var id = parseInt(c.getAttribute("data-item-id"), 10) || 0;
                    if (id > newest) newest = id;
                });
                if (newest) {
                    prices[String(newest)] = euro;
                    save(PRICES_KEY, prices);
                }
            }
        }
        document.querySelectorAll(".item-card").forEach(function (card) {
            var id = card.getAttribute("data-item-id");
            var times = +((card.querySelector(".js-times") || {}).textContent || 0) || 0;
            var euro = +(prices[id] || 0);
            var el = card.querySelector(".js-cost-per-wear");
            if (el) el.textContent = euro > 0 && times > 0 ? (euro / times).toFixed(2) + " €" : "—";
        });
    }

    function loadTimes() {
        var t = load(TIMES_KEY);
        document.querySelectorAll(".js-times").forEach(function (el) {
            var id = el.getAttribute("data-item-id");
            el.textContent = typeof t[id] === "number" ? t[id] : 0;
        });
        syncPrices();
    }

    function saveTime(itemId, n) {
        var t = load(TIMES_KEY);
        t[String(itemId)] = n;
        save(TIMES_KEY, t);
    }

    function loadDates() {
        var d = load(DATE_KEY);
        document.querySelectorAll(".js-date-added").forEach(function (el) {
            var id = el.getAttribute("data-item-id");
            if (!d[id]) {
                d[id] = new Date().toLocaleDateString("en-CA");
                save(DATE_KEY, d);
            }
            el.textContent = d[id];
        });
    }

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
        saveTime(itemId, next);
        syncPrices();
        var form = document.getElementById("form-mark-worn-" + itemId);
        if (form) form.submit();
    });

    function seasonRank(s) {
        s = (s || "").trim();
        return SEASON_ORDER[s] !== undefined ? SEASON_ORDER[s] : 999;
    }

    function sortGrid() {
        var grid = document.getElementById("wardrobeGrid");
        var select = document.getElementById("wardrobeSort");
        if (!grid || !select) return;
        var times = load(TIMES_KEY);
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
            var ta = typeof times[idA] === "number" ? times[idA] : 0;
            var tb = typeof times[idB] === "number" ? times[idB] : 0;
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
        try {
            var n = parseInt(localStorage.getItem(DONATE_MARKED_COUNT_KEY) || "0", 10);
            return isNaN(n) || n < 0 ? 0 : n;
        } catch (e) {
            return 0;
        }
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
        "Тази дреха ще бъде дарена и премахната от гардероба?";

    document.querySelectorAll(".item-card-delete-form").forEach(function (form) {
        form.addEventListener("submit", function (ev) {
            ev.preventDefault();
            if (!confirm(DONATE_CONFIRM_MSG)) return;
            var n = getDonateMarkedCount() + 1;
            try {
                localStorage.setItem(DONATE_MARKED_COUNT_KEY, String(n));
            } catch (e) {}
            setDonateMarkedCountDisplay();
            form.submit();
        });
    });

    loadTimes();
    loadDates();
    setDonateMarkedCountDisplay();
    resort();
})();
