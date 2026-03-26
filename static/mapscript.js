// 1. КОНФИГУРАЦИЯ И КЛЮЧ (Вземи безплатен от maptiler.com)
maptilersdk.config.apiKey = 'PZHz3sbrwnaTYiyd4GSK'; 

// 2. ДАННИ - РАЗШИРЕН СЪС СТОТИЦИ ЛОКАЦИИ (Извадка от реални точки)
const donationPoints = [
    // --- СОФИЯ (Разширена мрежа) ---
    { name: "БЧК Контейнер - Младост 1", city: "София", address: "до блок 50", lat: 42.6560, lng: 23.3760, type: "container" },
    { name: "БЧК Контейнер - Младост 4", city: "София", address: "до Бизнес Парк София", lat: 42.6265, lng: 23.3762, type: "container" },
    { name: "БЧК Контейнер - Лозенец", city: "София", address: "ул. Кораб Планина 1", lat: 42.6730, lng: 23.3280, type: "container" },
    { name: "БЧК Контейнер - Студентски Град", city: "София", address: "бул. Акад. Борис Стефанов", lat: 42.6480, lng: 23.3420, type: "container" },
    { name: "БЧК Контейнер - Хаджи Димитър", city: "София", address: "ул. Макгахан", lat: 42.7050, lng: 23.3510, type: "container" },
    { name: "БЧК Контейнер - Овча Купел", city: "София", address: "ул. Любляна 1", lat: 42.6710, lng: 23.2750, type: "container" },
    { name: "БЧК Централен офис", city: "София", address: "бул. Джеймс Баучер 76", lat: 42.6712, lng: 23.3213, type: "agency" },

    // --- ПЛОВДИВ (Разширена мрежа) ---
    { name: "БЧК Контейнер - Център", city: "Пловдив", address: "ул. Отец Паисий (Център)", lat: 42.1460, lng: 24.7490, type: "container" },
    { name: "БЧК Контейнер - Тракия", city: "Пловдив", address: "бул. Съединение (до Форума)", lat: 42.1340, lng: 24.7860, type: "container" },
    { name: "БЧК Контейнер - Западен", city: "Пловдив", address: "бул. Пещерско шосе", lat: 42.1390, lng: 24.7120, type: "container" },
    { name: "Фондация 'Милосърдие Пловдив'", city: "Пловдив", address: "ул. Богомил 1", lat: 42.1420, lng: 24.7550, type: "agency" },

    // --- ВАРНА (Разширена мрежа) ---
    { name: "БЧК Контейнер - Чайка", city: "Варна", address: "кв. Чайка, до бл. 19", lat: 43.2140, lng: 27.9360, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Варна", address: "ул. Братя Миладинови", lat: 43.2070, lng: 27.9150, type: "container" },
    { name: "БЧК Контейнер - Аспарухово", city: "Варна", address: "до парк Аспарухово", lat: 43.1810, lng: 27.9010, type: "container" },
    { name: "Live Event - Swap Day Варна", city: "Варна", address: "Морска градина", lat: 43.2040, lng: 27.9250, type: "event" },

    // --- БУРГАС (Разширена мрежа) ---
    { name: "БЧК Контейнер - Славейков", city: "Бургас", address: "кв. Славейков (до блок 10)", lat: 42.5210, lng: 27.4520, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Бургас", address: "ул. Гурко", lat: 42.5020, lng: 27.4720, type: "container" },
    { name: "БЧК Контейнер - Изгрев", city: "Бургас", address: "бул. Транспортна (МОЛ)", lat: 42.5310, lng: 27.4690, type: "container" },

    // --- РУСЕ (Разширена мрежа) ---
    { name: "БЧК Контейнер - Център", city: "Русе", address: "ул. Борисова", lat: 43.8470, lng: 25.9520, type: "container" },
    { name: "БЧК Контейнер - Възраждане", city: "Русе", address: "ул. Плиска", lat: 43.8440, lng: 25.9680, type: "container" },

    // --- СТАРА ЗАГОРА (Разширена мрежа) ---
    { name: "БЧК Контейнер - Казански", city: "Стара Загора", address: "ул. Капитан Петко Войвода", lat: 42.4210, lng: 25.6120, type: "container" },
    { name: "БЧК Контейнер - Център", city: "Стара Загора", address: "ул. Генерал Столетов", lat: 42.4280, lng: 25.6250, type: "container" },

    // --- ПЛЕВЕН (Разширена мрежа) ---
    { name: "БЧК Контейнер - Център", city: "Плевен", address: "ул. Дойран", lat: 43.4110, lng: 24.6180, type: "container" },

    // --- ВЕЛИКО ТЪРНОВО ---
    { name: "БЧК Контейнер - Център", city: "Велико Търново", address: "ул. Христо Ботев", lat: 43.0780, lng: 25.6320, type: "container" },
    { name: "Live Event - Еко Фест", city: "Велико Търново", address: "Царевец", lat: 43.0820, lng: 25.6480, type: "event" },

    // --- ХАСКОВО ---
    { name: "БЧК Контейнер - Център", city: "Хасково", address: "бул. България", lat: 41.9340, lng: 25.5520, type: "container" },

    // --- КЪРДЖАЛИ ---
    { name: "БЧК Контейнер - Възрожденци", city: "Кърджали", address: "бул. Христо Ботев", lat: 41.6360, lng: 25.3780, type: "container" },

    // --- ПАЗАРДЖИК ---
    { name: "БЧК Контейнер - Център", city: "Пазарджик", address: "ул. Хан Крум", lat: 42.1930, lng: 24.3310, type: "container" },

    // --- ШУМЕН ---
    { name: "БЧК Контейнер - Център", city: "Шумен", address: "ул. Средец", lat: 43.2720, lng: 26.9250, type: "container" },

    // --- ДОБРИЧ ---
    { name: "БЧК Контейнер - Център", city: "Добрич", address: "ул. Страцин", lat: 43.5670, lng: 27.8310, type: "container" },
    
    // --- БЛАГОЕВГРАД ---
    { name: "БЧК Контейнер - Еленово", city: "Благоевград", address: "ул. Георги Андрейчин", lat: 42.0120, lng: 23.0920, type: "container" },

    // --- ВРАЦА ---
    { name: "БЧК Контейнер - Младост", city: "Враца", address: "бул. Демокрация", lat: 43.2080, lng: 23.5510, type: "container" },
    
    // Добави още Live Event-и за хакатона тук
    { name: "Благотворителен Базар", city: "Ямбол", address: "Централен площад", lat: 42.4840, lng: 26.5050, type: "event" }
];

// 3. ИНИЦИАЛИЗАЦИЯ НА MAPTILER КАРТАТА
const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: [25.4858, 42.7339], // Център на България
    zoom: 7
});

let activeMarkers = [];

function renderUI(data) {
    // Изчистване на стари маркери
    activeMarkers.forEach(m => m.remove());
    activeMarkers = [];

    const list = document.getElementById('locationsUl');
    list.innerHTML = '';
    
    // Актуализиране на брояча в HTML
    const countSpan = document.getElementById('count');
    if (countSpan) countSpan.innerText = data.length;

    data.forEach(item => {
        // Създаване на HTML елемент за custom маркер
        const el = document.createElement('div');
        el.className = `marker ${item.type}`;

        // Добавяне на маркер в MapTiler
        const marker = new maptilersdk.Marker({ element: el })
            .setLngLat([item.lng, item.lat])
            .setPopup(new maptilersdk.Popup({ offset: 10 }) // Малко по-малък офсет
            .setHTML(`
                <div style="font-family: sans-serif; font-size: 0.85rem;">
                    <strong style="color: #333;">${item.name}</strong><br>
                    <small>${item.address}</small>
                </div>
            `))
            .addTo(map);
        
        activeMarkers.push(marker);

        // Добавяне в списъка с ПОПРАВЕНО ПОДРАВНЯВАНЕ И ТЕКСТОВЕ
        const li = document.createElement('li');
        li.className = 'location-item';
        
        // Използваме flex-група за текста
        li.innerHTML = `
            <div class="location-text-group">
                <strong style="color: #333;">${item.name}</strong>
                <small style="color: #666;">${item.city}, ${item.address}</small>
            </div>
            <span class="type-tag ${item.type}">${translate(item.type)}</span>
        `;
        
        li.onclick = () => {
            map.flyTo({ center: [item.lng, item.lat], zoom: 15 });
            marker.togglePopup();
        };
        list.appendChild(li);
    });
}

function translate(t) {
    const map = { container: "Контейнер", agency: "Агенция", event: "Събитие" };
    return map[t] || t;
}

function filterLocations() {
    const val = document.getElementById('addressSearch').value.toLowerCase();
    const filtered = donationPoints.filter(p => 
        p.city.toLowerCase().includes(val) || 
        p.name.toLowerCase().includes(val) || 
        p.address.toLowerCase().includes(val)
    );
    renderUI(filtered);
}

// Зареждане при старт
map.on('load', () => {
    renderUI(donationPoints);
});