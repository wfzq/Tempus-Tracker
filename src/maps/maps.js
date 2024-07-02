function addMapElement(mapInfo) {
    var mapElement = document.createElement("div");
    mapElement.className = `map-list-item`;
    mapElement.id = mapInfo.name;
    document.getElementById("maps-container").appendChild(mapElement);

    var mapHeader = document.createElement("div");
    mapHeader.className = `map-header`;
    mapElement.appendChild(mapHeader);

    var mapTier = document.createElement("p");
    mapTier.className = `map-tier`;
    mapTier.textContent = `${mapInfo.tier_info['3']} / ${mapInfo.tier_info['4']}`;
    mapHeader.appendChild(mapTier);

    var mapName = document.createElement("p");
    mapName.className = `map-name`;
    mapName.textContent = mapInfo.name;
    mapHeader.appendChild(mapName);

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
        addMapElement(map);
    });
}

function loadMapsList(mapsList) {
    document.getElementById("maps-container").innerHTML = '';
    mapsList.forEach(element => {
        addMapElement(element);
    });
}