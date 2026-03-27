/* Bio Clothes — home page (templates/home.html): image preview, color hex, pending price */

(function () {
    var input = document.getElementById("image");
    var preview = document.getElementById("image-preview");
    var box = document.querySelector(".add-box");
    if (!input || !preview || !box) return;

    var lastUrl = null;
    input.addEventListener("change", function () {
        if (lastUrl !== null) {
            URL.revokeObjectURL(lastUrl);
            lastUrl = null;
        }
        var pickedFile = input.files && input.files[0];
        var isImage = pickedFile && pickedFile.type.indexOf("image/") === 0;
        if (!isImage) {
            preview.removeAttribute("src");
            box.classList.remove("has-preview");
            return;
        }
        lastUrl = URL.createObjectURL(pickedFile);
        preview.src = lastUrl;
        box.classList.add("has-preview");
    });

    function partToHex(channel) {
        var value0to255 = Math.round(channel * 255);
        var hex = value0to255.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    function hslToHex(hue, saturationPercent, lightnessPercent) {
        var s = saturationPercent / 100;
        var l = lightnessPercent / 100;
        var chroma = (1 - Math.abs(2 * l - 1)) * s;
        var x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
        var m = l - chroma / 2;
        var r = 0;
        var g = 0;
        var b = 0;
        if (hue < 60) {
            r = chroma;
            g = x;
            b = 0;
        } else if (hue < 120) {
            r = x;
            g = chroma;
            b = 0;
        } else if (hue < 180) {
            r = 0;
            g = chroma;
            b = x;
        } else if (hue < 240) {
            r = 0;
            g = x;
            b = chroma;
        } else if (hue < 300) {
            r = x;
            g = 0;
            b = chroma;
        } else {
            r = chroma;
            g = 0;
            b = x;
        }
        return "#" + partToHex(r + m) + partToHex(g + m) + partToHex(b + m);
    }

    var hueInput = document.getElementById("color-hue");
    var hiddenColor = document.getElementById("color-value");
    var swatch = document.getElementById("color-swatch");
    if (!hueInput || !hiddenColor || !swatch) return;

    function syncColorFromHue() {
        var h = Number(hueInput.value);
        var hex = hslToHex(h, 65, 46);
        hiddenColor.value = hex;
        swatch.style.background = hex;
    }

    function setSolidHex(hex) {
        hiddenColor.value = hex;
        swatch.style.background = hex;
    }

    hueInput.addEventListener("input", syncColorFromHue);
    hueInput.addEventListener("change", syncColorFromHue);
    syncColorFromHue();

    var presetBlack = document.getElementById("color-preset-black");
    var presetWhite = document.getElementById("color-preset-white");
    if (presetBlack) presetBlack.addEventListener("click", function () { setSolidHex("#000000"); });
    if (presetWhite) presetWhite.addEventListener("click", function () { setSolidHex("#ffffff"); });
})();

// Price is now saved directly to database via form submission.
// No sessionStorage handling needed.
