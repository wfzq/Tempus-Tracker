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

function loadAllMaps() {
    document.getElementById("maps-container").innerHTML = '';
    
    detailedMapsList.forEach(map => {
        // Add authors
        map.authors.forEach(author => {
            if (authorsList[author.name]) {
                authorsList[author.name]++;
            }
            else authorsList[author.name] = 1;
        });
        // Get most bonuses
        let mapBonuses = map.zone_counts.bonus;
        if (mapBonuses != undefined) {
            mostBonuses = mapBonuses > mostBonuses ? mapBonuses : mostBonuses;
        }
        addMapElement(map);
    });
}

function loadMapsFromList(mapsList) {
    document.getElementById("maps-container").innerHTML = '';
    mapsList.forEach(element => {
        addMapElement(element);
    });
}