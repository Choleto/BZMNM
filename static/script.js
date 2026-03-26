
(function () {
    "use strict";

    // Only run on pages that have the map div (avoids errors on other pages if script is ever shared)
    var el = document.getElementById("map");
    if (!el || typeof L === "undefined") {
        return;
    }

    // Sofia, Bulgaria — center the map here (change to your city)
    var center = [42.6977, 23.3219];
    var zoom = 12;

    //  tiles come from OpenStreetMap (free)
    var map = L.map("map").setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    /**
     * Hardcoded donation points — edit lat/lng and title anytime.
     * lat = latitude, lng = longitude
     */
    var donationPlaces = [
        { title: "Bulgarian Red Cross (example)", lat: 42.695, lng: 23.325 },
        { title: "Donation bin — city center (example)", lat: 42.70, lng: 23.31 },
        { title: "Second-hand / charity shop (example)", lat: 42.688, lng: 23.318 },
    ];

    donationPlaces.forEach(function (place) {
        L.marker([place.lat, place.lng])
            .addTo(map)
            .bindPopup("<strong>" + place.title + "</strong><br>Donation / drop-off (demo)");
    });
})();
