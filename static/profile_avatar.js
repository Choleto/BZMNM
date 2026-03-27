(function () {
    var panel = document.getElementById("bcProfilePanel");
    var uid = panel && panel.getAttribute("data-user-id");
    if (!uid) return;

    var nav = document.getElementById("bcNavbarProfileAvatar");
    var imgs = document.querySelectorAll(".js-profile-photo");
    var backs = document.querySelectorAll(".js-profile-photo-fallback");
    var inp = document.getElementById("bcProfileAvatarInput");
    var rem = document.getElementById("bcProfileAvatarRemove");

    function paint(url) {
        var ok = !!url;
        imgs.forEach(function (img) {
            if (ok) img.src = url;
            else img.removeAttribute("src");
            img.hidden = !ok;
        });
        backs.forEach(function (el) {
            el.hidden = ok;
        });
        if (nav) nav.classList.toggle("has-photo", ok);
        if (rem) rem.hidden = !ok;
    }

    var initialUrl = (panel.getAttribute("data-profile-pic-url") || "").trim();
    paint(initialUrl);

    if (inp) {
        inp.addEventListener("change", function () {
            var f = inp.files && inp.files[0];
            inp.value = "";
            if (!f || f.type.indexOf("image/") !== 0) return;
            var fd = new FormData();
            fd.append("avatar", f);
            fetch("/profile/avatar", { method: "POST", body: fd, credentials: "same-origin" })
                .then(function (r) {
                    if (!r.ok) throw new Error("upload failed");
                    return r.json();
                })
                .then(function (data) {
                    if (data.url) paint(data.url);
                })
                .catch(function () {});
        });
    }
    if (rem) {
        rem.addEventListener("click", function () {
            fetch("/profile/avatar/delete", { method: "POST", credentials: "same-origin" })
                .then(function (r) {
                    if (!r.ok) throw new Error("delete failed");
                    return r.json();
                })
                .then(function () {
                    paint("");
                })
                .catch(function () {});
        });
    }
})();
