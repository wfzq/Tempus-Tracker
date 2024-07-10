function addMapElement(mapInfo) {
    // Element
    var mapElement = document.createElement("div");
    mapElement.className = `map-list-item`;
    mapElement.id = mapInfo.name;
    document.getElementById("maps-container").appendChild(mapElement);

    // Header
    var mapHeader = document.createElement("div");
    mapHeader.className = `map-header`;
    mapElement.appendChild(mapHeader);

    var mapTier = document.createElement("p");
    mapTier.className = `map-tier`;
    mapTier.textContent = `${mapInfo.tier_info['3']} / ${mapInfo.tier_info['4']}`;
    mapHeader.appendChild(mapTier);

    var mapLink = document.createElement("a");
    mapLink.className = 'map-name';
    mapLink.textContent = mapInfo.name;
    mapLink.href = `https://tempus2.xyz/maps/${mapInfo.name}`;
    mapLink.target = "_blank";
    mapHeader.appendChild(mapLink);

    // Main
    var mapMain = document.createElement("div");
    mapMain.className = 'map-main';
    mapElement.appendChild(mapMain);

    var mapCompletions = document.createElement('p');
    mapCompletions.className = 'map-completions';
    mapCompletions.textContent = `${mapInfo.completion_info['soldier']} / ${mapInfo.completion_info['demoman']}`;
    mapMain.appendChild(mapCompletions);

    var mapAuthors = document.createElement('div');
    mapAuthors.classList = 'map-authors';
    let authorsCount = mapInfo.authors.length;
    if (authorsCount > 4) {
        mapAuthors.textContent = `${authorsCount} Authors: ${mapInfo.authors.map(author => author.name).join('  •  ')}`;
    }
    else mapAuthors.textContent = `${mapInfo.authors.map(author => author.name).join('  •  ')}`;
    mapMain.appendChild(mapAuthors);

    // Bonuses/Footer
    var mapBonusContainer = document.createElement("div");
    mapBonusContainer.className = `map-bonus-header`;
    if (mapInfo.zone_counts.bonus !== undefined) {
        for (let i = 0; i < mapInfo.zone_counts.bonus; i++) {
            var mapBonus = document.createElement("div");
            mapBonus.className = `bonus ${i + 1}`;  // Start from 1
            mapBonusContainer.appendChild(mapBonus);
        }
    }
    mapElement.appendChild(mapBonusContainer);
}

function setAutoScrollonMaps() {
    const mapMains = document.querySelectorAll('.map-main');

    mapMains.forEach(mapMain => {
        mapMain.addEventListener('mouseenter', function () {
            autoScroll_authors(this);
        });

        mapMain.addEventListener('mouseleave', function () {
            stopAutoScroll_authors(this);
        });
    });
}

function autoScroll_authors(mapMain) {
    const scrollContainer = mapMain.querySelector('.map-authors');
    let contentWidth = scrollContainer.scrollWidth;
    let containerWidth = mapMain.clientWidth;
    let scrollPosition = 0;

    if (contentWidth > containerWidth) {
        mapMain._scrollInterval = setInterval(() => {
            scrollPosition += 1;
            if (scrollPosition > (contentWidth - containerWidth)) {
                scrollPosition = 0;
            }
            scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
        }, 30);
    }
}

function stopAutoScroll_authors(mapMain) {
    clearInterval(mapMain._scrollInterval);
    const scrollContainer = mapMain.querySelector('.map-authors');
    scrollContainer.style.transform = 'translateX(0)';
}

function loadAllMaps() {
    document.getElementById("maps-container").innerHTML = '';

    detailedMapsList.forEach(map => {
        // Add map author count
        if (mapauthorscount[map.authors.length]) {
            mapauthorscount[map.authors.length]++;
        } else mapauthorscount[map.authors.length] = 1;

        // Add authors
        map.authors.forEach(author => {
            if (authorsList[author.name]) {
                authorsList[author.name]++;
            } else authorsList[author.name] = 1;
        });
        // Get most bonuses
        let mapBonuses = map.zone_counts.bonus;
        if (mapBonuses != undefined) {
            mostBonuses = mapBonuses > mostBonuses ? mapBonuses : mostBonuses;
        }
        addMapElement(map);
    });
    setAutoScrollonMaps();
}

function loadMapsFromList(mapsList) {
    document.getElementById("maps-container").innerHTML = '';
    mapsList.forEach(element => {
        addMapElement(element);
    });
    setAutoScrollonMaps();
}