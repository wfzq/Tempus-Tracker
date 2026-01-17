function addMapElement(map) {
    // Element
    let mapElement = document.createElement("div");
    mapElement.className = `map-list-item`;
    mapElement.id = map.name;

    // Assign thumbnail, if available
    let thumbnail_url = `${thumbnailsUrl}/${map.name.toLowerCase()}.jpg`;
    let thumbnail = new Image();
    thumbnail.src = thumbnail_url;
    thumbnail.onload = () => {
        // Image Loaded
        mapElement.style.backgroundImage = `url('${thumbnail_url}')`;
        mapElement.loading = "lazy";
    }
    thumbnail.onerror = () => {
        // Image Not Found
        mapElement.style.backgroundColor = `#00000050`;
    }

    // Header wrapper link
    let headerLink = document.createElement("a");
    headerLink.className = 'header-link'
    headerLink.href = `https://tempus2.xyz/maps/${map.name}`;
    headerLink.target = "_blank";
    mapElement.appendChild(headerLink);

    // Header
    let mapHeader = document.createElement("div");
    mapHeader.className = `map-header`;
    headerLink.appendChild(mapHeader);

    let mapTypeContainer = document.createElement("div");
    mapTypeContainer.className = 'map-type-container';
    mapHeader.appendChild(mapTypeContainer)

    if (!map.zone_counts.linear) {
        let mapTypeIcon = document.createElement("i");
        mapTypeIcon.className = 'fa fa-flag-o';
        mapTypeContainer.appendChild(mapTypeIcon)

        let mapTypeCourses = document.createElement("p");
        mapTypeCourses.className = 'map-type-course';
        mapTypeCourses.textContent = map.zone_counts.course;
        mapTypeContainer.appendChild(mapTypeCourses)
    }

    let mapName = document.createElement("p");
    mapName.className = 'map-name';
    mapName.textContent = map.name;
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
    soldierIcon.style.backgroundImage = `url(src/data/ico/soldier.png)`;
    soldierIcon.loading = "lazy";

    soldierContainer.appendChild(soldierIcon);

    let soldierDifficulty = document.createElement("p");
    soldierDifficulty.className = 'map-soldier-difficulty';
    soldierDifficulty.textContent = `T${map.tier_info['3']} / R${map.rating_info['3']}`;
    soldierContainer.appendChild(soldierDifficulty);
    
    let soldierCompletions = document.createElement("p");
    soldierCompletions.className = 'map-soldier-completions';
    soldierCompletions.textContent = `( ${map.completion_info['soldier']} )`;
    soldierContainer.appendChild(soldierCompletions);
    
    // Demoman Map Info
    let demomanContainer = document.createElement("div");
    demomanContainer.className = 'map-demoman-container';
    mapInfoContainer.appendChild(demomanContainer);

    let demomanIcon = document.createElement("div");
    demomanIcon.className = 'map-demoman-icon';
    demomanIcon.style.backgroundImage = `url(src/data/ico/demoman.png)`;
    demomanIcon.loading = "lazy";
    demomanContainer.appendChild(demomanIcon);

    let demomanDifficulty = document.createElement("p");
    demomanDifficulty.className = 'map-demoman-difficulty';
    demomanDifficulty.textContent = `T${map.tier_info['4']} / R${map.rating_info['4']}`;
    demomanContainer.appendChild(demomanDifficulty);

    let demomanCompletions = document.createElement("p");
    demomanCompletions.className = 'map-demoman-completions';
    demomanCompletions.textContent = `( ${map.completion_info['demoman']} )`;;
    demomanContainer.appendChild(demomanCompletions);

    // Bonuses
    let bonusesContainer = document.createElement("div");
    bonusesContainer.className = 'map-bonus-container';
    mapInfoContainer.appendChild(bonusesContainer);

    let bonusesIcon = document.createElement("div");
    bonusesIcon.className = 'map-bonus-icon';
    bonusesIcon.style.backgroundImage = `url(src/data/ico/bonus_icon_colorful.png)`;
    bonusesIcon.loading = "lazy";
    bonusesContainer.appendChild(bonusesIcon);

    let bonusCount = document.createElement("p");
    bonusCount.className = 'map-bonus-count';
    bonusCount.textContent = map.zone_counts.bonus ?? 0;
    bonusesContainer.appendChild(bonusCount);

    let mapTechContainer = document.createElement('div');
    mapTechContainer.classList = 'map-tech-container';
    mapMain.appendChild(mapTechContainer);

    let soldierTech = document.createElement('p');
    soldierTech.classList = 'map-tech-soldier';
    soldierTech.style = "background-color: #ADD8E630"
    soldierTech.textContent = map.class_tech.soldier.join(' • ');
    mapTechContainer.appendChild(soldierTech);

    let demomanTech = document.createElement('p');
    demomanTech.classList = 'map-tech-demoman';
    demomanTech.style = "background-color: #FF7F7F30"
    demomanTech.textContent = map.class_tech.demoman.join('  •  ');
    mapTechContainer.appendChild(demomanTech);

    // Authors
    let mapAuthors = document.createElement('div');
    mapAuthors.classList = 'map-authors-container';
    mapMain.appendChild(mapAuthors);

    let mapAuthorsBackground = document.createElement('div');
    mapAuthorsBackground.classList = 'map-authors-background';
    mapAuthors.appendChild(mapAuthorsBackground);

    let mapAuthorsText = document.createElement('p');
    mapAuthorsText.classList = 'map-authors';
    let authorsCount = map.authors.length;
    mapAuthorsText.textContent = authorsCount > 4 ?
        `By ${authorsCount} Authors: ${map.authors.map(author => author.name).join('  •  ')}` :
        `By ${map.authors.map(author => author.name).join('  •  ')}`;
    mapAuthors.appendChild(mapAuthorsText);

    document.getElementById("maps-container").appendChild(mapElement);
}

function set_auto_scroll_authors_on_maps() {
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

function maps_loadAll() {
    document.getElementById("maps-container").innerHTML = '';

    maps_json.forEach(map => {
        // Add map author count
        if (map_authors_count[map.authors.length]) {
            map_authors_count[map.authors.length]++;
        } else map_authors_count[map.authors.length] = 1;

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
    set_auto_scroll_authors_on_maps();
}

function maps_showFromList(mapsList) {
    const container = document.getElementById("maps-container");
    for (let i = 0; i < container.children.length; i++) {
        const child = container.children[i];

        if (mapsList.find(element => element.name == child.id)) {
            child.classList.remove('hidden');
        }
        else {
            child.classList.add('hidden');
        }
    }
}

function reorderMapElements(mapsList) {
    const mapsContainer = document.querySelector('#maps-container');
    const elements = mapsList.map(map => document.getElementById(map.name));
    elements.forEach(element => mapsContainer.appendChild(element));
}

function map_getSoldierCompletions(map) {
    return map['completion_info']?.soldier ?? 0;
}

function map_getDemomanCompletions(map) {
    return map['completion_info']?.demoman ?? 0;
}

function map_getBothCompletions(map) {
    return (map['completion_info']?.soldier ?? 0) + (map['completion_info']?.demoman ?? 0);
}