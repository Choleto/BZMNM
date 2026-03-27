/* Профилна снимка: качване/премахване през /profile/avatar (виж app.py) */
(function () {
    var panel = document.getElementById("bcProfilePanel");
    if (!panel) return;

    var uploadUrl = panel.getAttribute("data-avatar-upload") || "/profile/avatar";
    var deleteUrl = panel.getAttribute("data-avatar-delete") || "/profile/avatar/delete";

    var imgs = document.querySelectorAll(".js-profile-photo");
    var backs = document.querySelectorAll(".js-profile-photo-fallback");
    var inp = document.getElementById("bcProfileAvatarInput");
    var rem = document.getElementById("bcProfileAvatarRemove");
    var toggleBtn = document.getElementById("bcProfileToggle");

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
        if (rem) rem.hidden = !ok;
        if (toggleBtn) toggleBtn.classList.toggle("has-photo", ok);
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
            fetch(uploadUrl, { method: "POST", body: fd, credentials: "same-origin" })
                .then(function (r) {
                    if (!r.ok) throw new Error("upload failed");
                    return r.json();
                })
                .then(function (data) {
                    if (data.url) {
                        paint(data.url);
                        panel.setAttribute("data-profile-pic-url", data.url);
                    }
                })
                .catch(function () {});
        });
    }

    if (rem) {
        rem.addEventListener("click", function () {
            fetch(deleteUrl, { method: "POST", credentials: "same-origin" })
                .then(function (r) {
                    if (!r.ok) throw new Error("delete failed");
                    return r.json();
                })
                .then(function () {
                    paint("");
                    panel.setAttribute("data-profile-pic-url", "");
                })
                .catch(function () {});
        });
    }
})();
