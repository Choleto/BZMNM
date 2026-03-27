// Карта с MapTiler: пунктове за дарения и списък отдясно.
// Точките са слой с кръгчета върху картата (WebGL), не отделни HTML маркери — по-плавно при движение.
maptilersdk.config.apiKey = 'PZHz3sbrwnaTYiyd4GSK';

var bulgarianNameForType = {
    container: 'Контейнер',
    agency: 'Агенция',
    event: 'Събитие',
};

var donationPoints = [
    { name: "БЧК Контейнер - Младост 1", city: "София", address: "до блок 50", lat: 42.6560, lng: 23.3760, type: "container" },
    { name: "БЧК Контейнер - Младост 4", city: "София", address: "до Бизнес Парк София", lat: 42.6265, lng: 23.3762, type: "container" },
    { name: "БЧК Контейнер - Лозенец", city: "София", address: "ул. Кораб Планина 1", lat: 42.6730, lng: 23.3280, type: "container" },
    { name: "БЧК Контейнер - Студентски Град", city: "София", address: "бул. Акад. Борис Стефанов", lat: 42.6480, lng: 23.3420, type: "container" },
    { name: "БЧК Контейнер - Хаджи Димитър", city: "София", address: "ул. Макгахан", lat: 42.7050, lng: 23.3510, type: "container" },
    { name: "БЧК Контейнер - Овча Купел", city: "София", address: "ул. Любляна 1", lat: 42.6710, lng: 23.2750, type: "container" },
    { name: "БЧК Контейнер - Белите брези", city: "София", address: "ул. Дойран", lat: 42.6750, lng: 23.2920, type: "container" },
    { name: "БЧК Контейнер - Гео Милев", city: "София", address: "ул. Коста Лулчев", lat: 42.6788, lng: 23.3635, type: "container" },
    { name: "БЧК Контейнер - Надежда 1", city: "София", address: "ул. Кирил Дрангов", lat: 42.7220, lng: 23.3080, type: "container" },
    { name: "БЧК Контейнер - Красна поляна", city: "София", address: "бул. Вардар", lat: 42.6910, lng: 23.2840, type: "container" },
    { name: "БЧК Контейнер - Дружба 2", city: "София", address: "ул. Обиколна", lat: 42.6420, lng: 23.4050, type: "container" },
    { name: "БЧК Контейнер - ж.к. Изток", city: "София", address: "ул. Райко Алексиев", lat: 42.6725, lng: 23.3530, type: "container" },
    { name: "БЧК Контейнер - Павлово", city: "София", address: "ул. Александър Пушкин", lat: 42.6650, lng: 23.2680, type: "container" },
    { name: "БЧК Контейнер - Илинден", city: "София", address: "ул. Найчо Цанов", lat: 42.7040, lng: 23.2980, type: "container" },
    { name: "БЧК Контейнер - Подуяне", city: "София", address: "ул. Тодорини кукли", lat: 42.7010, lng: 23.3580, type: "container" },
    { name: "БЧК Централен офис", city: "София", address: "бул. Джеймс Баучер 76", lat: 42.6712, lng: 23.3213, type: "agency" },
    { name: "Хуманитарна организация 'Каритас'", city: "София", address: "ул. Оборище 9", lat: 42.6950, lng: 23.3380, type: "agency" },
    { name: "Сдружение 'SOS Детски селища'", city: "София", address: "ул. Триадица 5", lat: 42.6985, lng: 23.3225, type: "agency" },
    { name: "Зелен Уикенд - Размяна на дрехи", city: "София", address: "Южен Парк", lat: 42.6680, lng: 23.3085, type: "event" },
    { name: "БЧК Контейнер - Център", city: "Пловдив", address: "ул. Отец Паисий", lat: 42.1460, lng: 24.7490, type: "container" },
    { name: "БЧК Контейнер - Тракия", city: "Пловдив", address: "бул. Съединение", lat: 42.1340, lng: 24.7860, type: "container" },
    { name: "БЧК Контейнер - Западен", city: "Пловдив", address: "бул. Пещерско шосе", lat: 42.1390, lng: 24.7120, type: "container" },
    { name: "БЧК Контейнер - Кършияка", city: "Пловдив", address: "ул. Победа", lat: 42.1620, lng: 24.7410, type: "container" },
    { name: "БЧК Контейнер - Южен", city: "Пловдив", address: "бул. Никола Вапцаров", lat: 42.1220, lng: 24.7350, type: "container" },
    { name: "Фондация 'Милосърдие Пловдив'", city: "Пловдив", address: "ул. Богомил 1", lat: 42.1420, lng: 24.7550, type: "agency" },
    { name: "Детски базар 'Втори шанс'", city: "Пловдив", address: "Цар Симеонова градина", lat: 42.1410, lng: 24.7450, type: "event" },
    { name: "БЧК Контейнер - Чайка", city: "Варна", address: "кв. Чайка, бл. 19", lat: 43.2140, lng: 27.9360, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Варна", address: "ул. Братя Миладинови", lat: 43.2070, lng: 27.9150, type: "container" },
    { name: "БЧК Контейнер - Аспарухово", city: "Варна", address: "до парк Аспарухово", lat: 43.1810, lng: 27.9010, type: "container" },
    { name: "БЧК Контейнер - Левски", city: "Варна", address: "ул. Студентска", lat: 43.2210, lng: 27.9310, type: "container" },
    { name: "БЧК Контейнер - Трошево", city: "Варна", address: "ул. Радост", lat: 43.2180, lng: 27.8850, type: "container" },
    { name: "Live Event - Swap Day Варна", city: "Варна", address: "Морска градина", lat: 43.2040, lng: 27.9250, type: "event" },
    { name: "БЧК Контейнер - Славейков", city: "Бургас", address: "кв. Славейков", lat: 42.5210, lng: 27.4520, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Бургас", address: "ул. Гурко", lat: 42.5020, lng: 27.4720, type: "container" },
    { name: "БЧК Контейнер - Изгрев", city: "Бургас", address: "бул. Транспортна", lat: 42.5310, lng: 27.4690, type: "container" },
    { name: "Swap Party - Дай и вземи", city: "Бургас", address: "Морско казино", lat: 42.4950, lng: 27.4820, type: "event" },
    { name: "БЧК Контейнер - Център", city: "Русе", address: "ул. Борисова", lat: 43.8470, lng: 25.9520, type: "container" },
    { name: "БЧК Контейнер - Възраждане", city: "Русе", address: "ул. Плиска", lat: 43.8440, lng: 25.9680, type: "container" },
    { name: "БЧК Контейнер - Казански", city: "Стара Загора", address: "ул. Капитан Петко Войвода", lat: 42.4210, lng: 25.6120, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Стара Загора", address: "ул. Генерал Столетов", lat: 42.4280, lng: 25.6250, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Казанлък", address: "ул. Скобелев", lat: 42.6180, lng: 25.3950, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Плевен", address: "ул. Дойран", lat: 43.4110, lng: 24.6180, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Велико Търново", address: "ул. Христо Ботев", lat: 43.0780, lng: 25.6320, type: "container" },
    { name: "Live Event - Еко Фест", city: "Велико Търново", address: "Царевец", lat: 43.0820, lng: 25.6480, type: "event" },
    { name: "БЧК Контейнер - Център", city: "Шумен", address: "ул. Средец", lat: 43.2720, lng: 26.9250, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Добрич", address: "ул. Страцин", lat: 43.5670, lng: 27.8310, type: "container" },
    { name: "БЧК Контейнер - Младост", city: "Враца", address: "бул. Демокрация", lat: 43.2080, lng: 23.5510, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Видин", address: "ул. Цар Симеон Велики", lat: 43.9880, lng: 22.8750, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Монтана", address: "ул. Търговска", lat: 43.4120, lng: 23.2250, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Габрово", address: "ул. Радецка", lat: 42.8745, lng: 25.3185, type: "container" },
    { name: "Работилница за рециклиране", city: "Габрово", address: "Дом на хумора", lat: 42.8780, lng: 25.3150, type: "event" },
    { name: "БЧК Контейнер - Център", city: "Ловеч", address: "ул. Търговска", lat: 43.1365, lng: 24.7155, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Силистра", address: "ул. Симеон Велики", lat: 44.1150, lng: 27.2650, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Търговище", address: "ул. Васил Левски", lat: 43.2510, lng: 26.5720, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Разград", address: "бул. България", lat: 43.5250, lng: 26.5250, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Хасково", address: "бул. България", lat: 41.9340, lng: 25.5520, type: "container" },
    { name: "БЧК Контейнер - Възрожденци", city: "Кърджали", address: "бул. Христо Ботев", lat: 41.6360, lng: 25.3780, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Пазарджик", address: "ул. Хан Крум", lat: 42.1930, lng: 24.3310, type: "container" },
    { name: "БЧК Контейнер - Еленово", city: "Благоевград", address: "ул. Георги Андрейчин", lat: 42.0120, lng: 23.0920, type: "container" },
    { name: "Благотворителен Базар", city: "Ямбол", address: "Централен площад", lat: 42.4840, lng: 26.5050, type: "event" },
    { name: "БЧК Контейнер - Център", city: "Смолян", address: "бул. България", lat: 41.5750, lng: 24.7120, type: "container" },
    { name: "БЧК Контейнер - Запад", city: "Кюстендил", address: "ул. Цар Освободител", lat: 42.2855, lng: 22.6885, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Перник", address: "ул. Търговска", lat: 42.6055, lng: 23.0335, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Сливен", address: "бул. Цар Симеон", lat: 42.6825, lng: 26.3155, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Димитровград", address: "бул. България", lat: 42.0550, lng: 25.5950, type: "container" },
    { name: "БЧК Контейнер - Пазара", city: "Асеновград", address: "ул. Васил Левски", lat: 42.0120, lng: 24.8750, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Поморие", address: "ул. Солна", lat: 42.5580, lng: 27.6350, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Созопол", address: "ул. Република", lat: 42.4180, lng: 27.6950, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Несебър", address: "ул. Иван Вазов", lat: 42.6580, lng: 27.7120, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Каварна", address: "ул. Добротица", lat: 43.4350, lng: 28.3380, type: "container" },
];

var map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: [25.4858, 42.7339],
    zoom: 7,
});

var DONATION_SOURCE_ID = 'donation-points';
var DONATION_LAYER_ID = 'donation-points-circle';
var mapPopup = new maptilersdk.Popup({ closeOnClick: true, closeButton: true, maxWidth: '280px', offset: 10 });
var donationLayerBound = false;

function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Радиус на земята в км
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

map.on("load", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var userLat = position.coords.latitude;
                var userLng = position.coords.longitude;
                map.flyTo({ center: [userLng, userLat], zoom: 12 });
                donationPoints.sort(function (a, b) {
                    var distA = getDistance(userLat, userLng, a.lat, a.lng);
                    var distB = getDistance(userLat, userLng, b.lat, b.lng);
                    return distA - distB;
                });
                showLocationsOnMap(donationPoints);
            },
            function () {
                showLocationsOnMap(donationPoints);
            }
        );
        showLocationsOnMap(donationPoints);
    } else {
        showLocationsOnMap(donationPoints);
    }
});

function placesToGeoJSON(places) {
    return {
        type: 'FeatureCollection',
        features: places.map(function (place) {
            return {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [place.lng, place.lat],
                },
                properties: {
                    name: place.name,
                    address: place.address,
                    city: place.city,
                    type: place.type,
                },
            };
        }),
    };
}

function bindDonationLayerOnce() {
    if (donationLayerBound) {
        return;
    }
    donationLayerBound = true;

    map.on('click', DONATION_LAYER_ID, function (e) {
        if (!e.features || !e.features.length) {
            return;
        }
        var p = e.features[0].properties;
        var html =
            '<div style="font-family: sans-serif; font-size: 0.85rem;">' +
            '<strong style="color: #333;">' +
            p.name +
            '</strong><br>' +
            '<small>' +
            p.address +
            '</small></div>';
        mapPopup.setLngLat(e.lngLat).setHTML(html).addTo(map);
    });

    map.on('mouseenter', DONATION_LAYER_ID, function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', DONATION_LAYER_ID, function () {
        map.getCanvas().style.cursor = '';
    });
}

function ensureDonationLayer(geojson) {
    if (map.getSource(DONATION_SOURCE_ID)) {
        map.getSource(DONATION_SOURCE_ID).setData(geojson);
        return;
    }

    map.addSource(DONATION_SOURCE_ID, {
        type: 'geojson',
        data: geojson,
    });

    map.addLayer({
        id: DONATION_LAYER_ID,
        type: 'circle',
        source: DONATION_SOURCE_ID,
        paint: {
            'circle-radius': 9,
            'circle-color': [
                'match',
                ['get', 'type'],
                'container',
                '#ef4444',
                'agency',
                '#22c55e',
                'event',
                '#3b82f6',
                '#888888',
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
        },
    });

    bindDonationLayerOnce();
}

function popupHtmlForPlace(place) {
    return (
        '<div style="font-family: sans-serif; font-size: 0.85rem;">' +
        '<strong style="color: #333;">' +
        place.name +
        '</strong><br>' +
        '<small>' +
        place.address +
        '</small></div>'
    );
}

function showLocationsOnMap(places) {
    var geojson = placesToGeoJSON(places);
    ensureDonationLayer(geojson);

    var listElement = document.getElementById('locationsUl');
    listElement.innerHTML = '';

    var countElement = document.getElementById('count');
    if (countElement) {
        countElement.innerText = places.length;
    }

    places.forEach(function (place) {
        var tagText = bulgarianNameForType[place.type];
        if (!tagText) {
            tagText = place.type;
        }

        var listRow = document.createElement('li');
        listRow.className = 'location-item';
        listRow.innerHTML =
            '<div class="location-text-group">' +
            '<strong style="color: #333;">' +
            place.name +
            '</strong>' +
            '<small style="color: #666;">' +
            place.city +
            ', ' +
            place.address +
            '</small></div>' +
            '<span class="type-tag ' +
            place.type +
            '">' +
            tagText +
            '</span>';

        listRow.onclick = function () {
            map.flyTo({ center: [place.lng, place.lat], zoom: 15 });
            mapPopup.setLngLat([place.lng, place.lat]).setHTML(popupHtmlForPlace(place)).addTo(map);
        };

        listElement.appendChild(listRow);
    });
}

function filterLocations() {
    var searchBox = document.getElementById('addressSearch');
    var searchText = searchBox.value.toLowerCase();
    var filteredPlaces = donationPoints.filter(function (place) {
        var cityOk = place.city.toLowerCase().indexOf(searchText) !== -1;
        var nameOk = place.name.toLowerCase().indexOf(searchText) !== -1;
        var addressOk = place.address.toLowerCase().indexOf(searchText) !== -1;
        return cityOk || nameOk || addressOk;
    });
    showLocationsOnMap(filteredPlaces);
}

