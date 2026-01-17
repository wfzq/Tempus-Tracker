var serverCall;
var filtered_servers;
var updateServers = false;
var updateServersInterval = 5000; // 5sec

function show_maps() {
    updateServers = false;
    server_container.classList.add('hidden');

    server_filters_container.classList.add('hidden');
    map_filters_container.classList.remove('hidden');
    maps_container.classList.remove('hidden');
}

function show_servers() {
    server_container.classList.remove('hidden');

    server_filters_container.classList.remove('hidden');
    map_filters_container.classList.add('hidden');
    maps_container.classList.add('hidden');

    /* Skip re-setting up*/
    if (server_container.innerHTML != '') {
        return;
    }

    setupMaps();
    updateServersFunction();
}

async function updateServersFunction() {
    // Enable update and wait initially
    updateServers = true;
    await new Promise(resolve => setTimeout(resolve, updateServersInterval));

    // Get updates
    while (updateServers) {
        updateMaps();
        await new Promise(resolve => setTimeout(resolve, updateServersInterval));
    }
};

async function updateMaps() {
    serverCall = await API_ServerStatusList();
    serverCall = serverCall.filter(server => {
        return !(server.server_info.hidden === true || server.game_info === null);
    });

    serverCall.forEach(server => {
        const serverId = server.game_info.hostname;
        const existingElement = document.getElementById(serverId);

        if (existingElement) {
            // Update existing server element
            const mapInfo = existingElement.querySelector('.map-info-container');
            const serverMapName = mapInfo.querySelector('p:first-of-type');
            const serverPlayerCount = mapInfo.querySelector('p:last-of-type');
            
            // Update map name
            serverMapName.textContent = `Map: ${server.game_info.currentMap}`;

            // Update player count
            if (server.game_info.playerCount) {
                serverPlayerCount.innerHTML = `
                Players: ${server.game_info.playerCount} 
                <span style="color: #7289da;">[</span> 
                
                ${server.game_info.users.map((player, index, array) => `
                    <a href="https://tempus2.xyz/players/${player.id}" target="_blank" style="text-decoration: none; color: inherit;">
                        ${player.name}
                    </a>${index < array.length - 1 ? '<span style="color: #7289da;">  |  </span>' : ''}`).join('')}
                    
                <span style="color: #7289da;">]</span>`;
            } else {
                serverPlayerCount.textContent = `Players: ${server.game_info.playerCount}`;
            }

            // Update thumbnail if necessary
            const thumbnailElement = existingElement.querySelector('.server-map-thumbnail');
            const newThumbnailUrl = `${githubBaseUrl}/map-backgrounds/${server.game_info.currentMap.toLowerCase()}.jpg`;

            if (!thumbnailElement.style.backgroundImage.includes(newThumbnailUrl)) {
                // Update the thumbnail if it has changed
                const thumbnail = new Image();
                thumbnail.src = newThumbnailUrl;
                thumbnail.onload = () => {
                    thumbnailElement.style.backgroundImage = `url('${newThumbnailUrl}')`;
                    thumbnailElement.loading = "lazy";
                };
                thumbnail.onerror = () => {
                    thumbnailElement.style.backgroundColor = `#00000050`;
                };
            }
        }
    });
}

async function setupMaps() {
    serverCall = await API_ServerStatusList();
    serverCall = serverCall.filter(server => {
        return !(server.server_info.hidden === true || server.game_info === null);
    });
    serverCall.forEach(server => {
        addServerElement(server);
    });
    filtered_servers = serverCall;
}

function addServerElement(server) {
    /* Assume server is not hidden */

    // Element
    let serverElement = document.createElement("div");
    serverElement.className = `server-list-item`;
    serverElement.id = server.game_info.hostname;

    // Thumbnail
    let thumbnailContainer = document.createElement("div");
    thumbnailContainer.classList = `server-map-thumbnail-container`
    serverElement.appendChild(thumbnailContainer);

    let thumbnailElement = document.createElement("div");
    thumbnailElement.classList = `server-map-thumbnail`;
    let thumbnail_url = `${githubBaseUrl}/map-backgrounds/${server.game_info.currentMap.toLowerCase()}.jpg`;
    let thumbnail = new Image();
    thumbnail.src = thumbnail_url;
    thumbnail.onload = () => {
        // Image Loaded
        thumbnailElement.style.backgroundImage = `url('${thumbnail_url}')`;
        thumbnailElement.loading = "lazy";
    }
    thumbnail.onerror = () => {
        // Image Not Found
        thumbnailElement.style.backgroundColor = `#00000050`;
    }
    thumbnailContainer.appendChild(thumbnailElement);

    // Info container
    let infoContainer = document.createElement("div");
    infoContainer.className = `map-info-container`;
    serverElement.appendChild(infoContainer);

    let nameContainer = document.createElement("div");
    nameContainer.className = `map-name-container`;
    infoContainer.appendChild(nameContainer);

    // Flag
    let flag = document.createElement("i")
    flag.classList = `flag-icon flag-icon-${countryToCode[server.server_info.country]}`
    nameContainer.appendChild(flag);

    // Name
    let serverName = document.createElement("h3");
    serverName.classList = `server-name`;
    serverName.textContent = server.server_info.name;
    nameContainer.appendChild(serverName);

    // Map Name
    let serverMapName = document.createElement("p");
    serverMapName.textContent = `Map: ${server.game_info.currentMap}`;
    infoContainer.appendChild(serverMapName);

    // Player Count
    let serverPlayerCount = document.createElement("p");
    if (server.game_info.playerCount) {
        serverPlayerCount.innerHTML = `
        Players: ${server.game_info.playerCount} 
        <span style="color: #7289da;">[</span> 
        
        ${server.game_info.users.map((player, index, array) => `
            <a href="https://tempus2.xyz/players/${player.id}" target="_blank" style="text-decoration: none; color: inherit;">
                ${player.name}
            </a>${index < array.length - 1 ? '<span style="color: #7289da;">  |  </span>' : ''}
        `).join('')}
        
        <span style="color: #7289da;">]</span>`;
    } else {
        serverPlayerCount.textContent = `Players: ${server.game_info.playerCount}`;
    }
    infoContainer.appendChild(serverPlayerCount);

    document.getElementById("server-container").appendChild(serverElement);
}

function filterServerBy_playerCount(server) {
    if (PlayerClickedButton == null)
        return true;

    var maxPlayers = PlayerClickedButton.innerHTML;
    return server.game_info.playerCount <= maxPlayers;
}

function filterServerBy_region(server) {
    if (regionClickedButton == null)
        return true;
    var region = regionClickedButton.id;
    const countryCode = countryToCode[server.server_info.country];

    // If the country code doesn't exist, return false
    if (!countryCode) return false;

    const regionCountries = countryGroups[region];
    return regionCountries.includes(countryCode);
}

function filterServers() {
    filtered_servers = serverCall.filter(server => {
        const serverElement = document.getElementById(server.game_info.hostname);
        const isVisible = filterServerBy_playerCount(server) && filterServerBy_region(server);

        isVisible ?
            serverElement?.classList.remove('hidden') :
            serverElement?.classList.add('hidden');
        return isVisible;
    });
}

var regionClickedButton = null;
var PlayerClickedButton = null;
document.getElementById('region-container').addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
        document.querySelectorAll('#region-container button').forEach(button => {
            if (button == event.target) {
                button.classList.remove('button-off');
                button.classList.add('button-on');
            } else {
                button.classList.add('button-off');
                button.classList.remove('button-on');

            }
        });

        if (event.target == regionClickedButton) {
            document.querySelectorAll('#region-container button').forEach(button => {
                button.classList.add('button-on');
                button.classList.remove('button-off');
            });
            regionClickedButton = null;
        } else {
            regionClickedButton = event.target;
        }

        filterServers();
    }
});

document.getElementById('server-player-container').addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
        document.querySelectorAll('#server-player-container button').forEach(button => {
            if (button == event.target) {
                button.classList.remove('button-off');
                button.classList.add('button-on');
            } else {
                button.classList.add('button-off');
                button.classList.remove('button-on');
            }
        });

        if (event.target == PlayerClickedButton) {
            document.querySelectorAll('#server-player-container button').forEach(button => {
                button.classList.add('button-on');
                button.classList.remove('button-off');
            });
            PlayerClickedButton = null;
        } else {
            PlayerClickedButton = event.target;
        }
        filterServers();
    }
});