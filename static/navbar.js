/* Мобилно меню + профил панел; брояч „Дрехи дарени“ от data-donate-count (БД) */
(function () {
    var menuButton = document.getElementById("bcNavToggle");
    var menuPanel = document.getElementById("bcNavMenu");
    if (menuButton && menuPanel) {
        menuButton.addEventListener("click", function () {
            var menuIsOpen = menuPanel.classList.toggle("is-open");
            menuButton.setAttribute("aria-expanded", menuIsOpen ? "true" : "false");
        });
        var links = menuPanel.querySelectorAll("a");
        var i;
        for (i = 0; i < links.length; i++) {
            links[i].addEventListener("click", function () {
                if (window.matchMedia("(max-width: 900px)").matches) {
                    menuPanel.classList.remove("is-open");
                    menuButton.setAttribute("aria-expanded", "false");
                }
            });
        }
    }

    var profileToggle = document.getElementById("bcProfileToggle");
    var profilePanel = document.getElementById("bcProfilePanel");
    var profileWrap = document.querySelector(".bc-navbar__profile-wrap");
    if (profileToggle && profilePanel && profileWrap) {
        profileToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            var willOpen = profilePanel.hidden;
            profilePanel.hidden = !willOpen;
            profileToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
        });
        document.addEventListener("click", function (e) {
            if (profileWrap.contains(e.target)) return;
            if (!profilePanel.hidden) {
                profilePanel.hidden = true;
                profileToggle.setAttribute("aria-expanded", "false");
            }
        });
        document.addEventListener("keydown", function (e) {
            if (e.key !== "Escape") return;
            if (!profilePanel.hidden) {
                profilePanel.hidden = true;
                profileToggle.setAttribute("aria-expanded", "false");
                profileToggle.focus();
            }
        });
    }

    var donateEls = document.querySelectorAll(".js-donate-marked-count");
    if (donateEls.length) {
        var dn = 0;
        var src = document.querySelector(".js-donate-marked-count[data-donate-count]");
        if (src) {
            dn = parseInt(src.getAttribute("data-donate-count") || "0", 10);
            if (isNaN(dn) || dn < 0) dn = 0;
        }
        var donateLabel = "Дрехи дарени: " + dn;
        for (var j = 0; j < donateEls.length; j++) donateEls[j].textContent = donateLabel;
    }
})();
