(function () {
    var panel = document.getElementById("bcProfilePanel");
    var uid = panel && panel.getAttribute("data-user-id");
    if (!uid) return;

    var key = "bc_profile_avatar_" + uid;
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

    try {
        paint(localStorage.getItem(key) || "");
    } catch (e) {
        paint("");
    }

    if (inp) {
        inp.addEventListener("change", function () {
            var f = inp.files && inp.files[0];
            inp.value = "";
            if (!f || f.type.indexOf("image/") !== 0) return;
            var r = new FileReader();
            r.onload = function () {
                try {
                    localStorage.setItem(key, r.result);
                } catch (e) {
                    return;
                }
                paint(r.result);
            };
            r.readAsDataURL(f);
        });
    }
    if (rem) {
        rem.addEventListener("click", function () {
            try {
                localStorage.removeItem(key);
            } catch (e) {}
            paint("");
        });
    }
})();
