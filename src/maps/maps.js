function addMapElement(mapInfo) {
    // Element
    let mapElement = document.createElement("div");
    mapElement.className = `map-list-item`;
    mapElement.id = mapInfo.name;

    // Header wrapper link
    let headerLink = document.createElement("a");
    headerLink.className = 'header-link'
    headerLink.href = `https://tempus2.xyz/maps/${mapInfo.name}`;
    headerLink.target = "_blank";
    mapElement.appendChild(headerLink);

    // Header
    let mapHeader = document.createElement("div");
    mapHeader.className = `map-header`;
    headerLink.appendChild(mapHeader);

    let mapName = document.createElement("p");
    mapName.className = 'map-name';
    mapName.textContent = mapInfo.name;
    mapHeader.appendChild(mapName)

    // Main
    let mapMain = document.createElement("div");
    mapMain.className = 'map-main';
    mapElement.appendChild(mapMain);

    // Map Info 
    let mapInfoContainer = document.createElement("div");
    mapInfoContainer.className = 'map-info';
    mapMain.appendChild(mapInfoContainer);

    // Soldier Map Info
    let soldierContainer = document.createElement("div");
    soldierContainer.className = 'map-soldier-container';
    mapInfoContainer.appendChild(soldierContainer);

    let soldierIcon = document.createElement("div");
    soldierIcon.className = 'map-soldier-icon';
    soldierContainer.appendChild(soldierIcon);

    let soldierDifficulty = document.createElement("p");
    soldierDifficulty.className = 'map-soldier-difficulty';
    soldierDifficulty.textContent = mapInfo.tier_info['3'];
    soldierContainer.appendChild(soldierDifficulty);

    let soldierCompletions = document.createElement("p");
    soldierCompletions.className = 'map-soldier-completions';
    soldierCompletions.textContent = `( ${mapInfo.completion_info['soldier']} )`;
    soldierContainer.appendChild(soldierCompletions);

    // Demoman Map Info
    let demomanContainer = document.createElement("div");
    demomanContainer.className = 'map-demoman-container';
    mapInfoContainer.appendChild(demomanContainer);

    let demomanIcon = document.createElement("div");
    demomanIcon.className = 'map-demoman-icon';
    demomanContainer.appendChild(demomanIcon);

    let demomanDifficulty = document.createElement("p");
    demomanDifficulty.className = 'map-demoman-difficulty';
    demomanDifficulty.textContent = mapInfo.tier_info['4'];;
    demomanContainer.appendChild(demomanDifficulty);

    let demomanCompletions = document.createElement("p");
    demomanCompletions.className = 'map-demoman-completions';
    demomanCompletions.textContent = `( ${mapInfo.completion_info['demoman']} )`;;
    demomanContainer.appendChild(demomanCompletions);

    // Bonuses
    let bonusesContainer = document.createElement("div");
    bonusesContainer.className = 'map-bonus-container';
    mapInfoContainer.appendChild(bonusesContainer);

    let bonusesIcon = document.createElement("div");
    bonusesIcon.className = 'map-bonus-icon';
    bonusesContainer.appendChild(bonusesIcon);

    let bonusCount = document.createElement("p");
    bonusCount.className = 'map-bonus-count';
    bonusCount.textContent = mapInfo.zone_counts.bonus ?? 0;
    bonusesContainer.appendChild(bonusCount);

    // Authors
    let mapAuthors = document.createElement('div');
    mapAuthors.classList = 'map-authors';
    let authorsCount = mapInfo.authors.length;
    mapAuthors.textContent = authorsCount > 4 ?
        `By ${authorsCount} Authors: ${mapInfo.authors.map(author => author.name).join('  •  ')}` :
        `By ${mapInfo.authors.map(author => author.name).join('  •  ')}`;
    mapMain.appendChild(mapAuthors);

    document.getElementById("maps-container").appendChild(mapElement);
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

    maps_json.forEach(map => {
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