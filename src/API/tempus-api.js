const url = "https://tempus2.xyz/api/v0";
const DEFAULT_RESULT_LIMIT = 5000;

// Activity
async function API_activity() {
    return fetch(`${url}/activity`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

// Demos
async function API_demoOverview(demoId) {
    return fetch(`${url}/demos/id/${demoId}/overview`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

// Maps
async function API_mapsList() {
    return fetch(`${url}/maps/list`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

async function API_detailedMapsList() {
    return fetch(`${url}/maps/detailedList`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

async function API_fullMapOverviewId(mapId) {
    return fetch(`${url}/maps/id/${mapId}/fullOverview`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
}

async function API_fullMapOverviewName(mapName) {
    return fetch(`${url}/maps/name/${mapName}/fullOverview`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
}

async function API_fullMapOverview2Id(mapId) {
    return fetch(`${url}/maps/id/${mapId}/fullOverview2`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

async function API_fullMapOverview2Name(mapName) {
    return fetch(`${url}/maps/name/${mapName}/fullOverview2`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

async function API_zoneRecordsListId(mapId, zoneType, zoneIndex, limit = DEFAULT_RESULT_LIMIT) {
    return fetch(`${url}/maps/id/${mapId}/zones/typeindex/${zoneType}/${zoneIndex}/records/list?limit=${limit}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

async function API_zoneRecordsListName(mapName, zoneType, zoneIndex, limit = DEFAULT_RESULT_LIMIT) {
    return fetch(`${url}/maps/name/${mapName}/zones/typeindex/${zoneType}/${zoneIndex}/records/list?limit=${limit}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

async function API_zoneRecordPlayerByMapId(mapId, zoneType, zoneIndex, playerId, playerClass) {
    return fetch(`${url}/maps/id/${mapId}/zones/typeindex/${zoneType}/${zoneIndex}/records/player/${playerId}/${playerClass}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

async function API_zoneRecordPlayerByMapName(mapName, zoneType, zoneIndex, playerId, playerClass) {
    return fetch(`${url}/maps/name/${mapName}/zones/typeindex/${zoneType}/${zoneIndex}/records/player/${playerId}/${playerClass}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    // Handle 404 error specifically
                    return { error: 'Not Found', status: 404 };
                }
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

async function API_mapNameWRs(mapName) {
    return fetch(`${url}/maps/name/${mapName}/wrs`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

// Players
async function API_playerIdRank(playerId) {
    return fetch(`${url}/players/id/${playerId}/rank`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

async function API_playerIdInfo(playerId) {
    return fetch(`${url}/players/id/${playerId}/info`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

async function API_playerIdStats(playerId) {
    return fetch(`${url}/players/id/${playerId}/stats`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

// Ranks
async function API_top50Class(playerClass) {
    return fetch(`${url}/ranks/class/${playerClass}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

async function API_top50Overall() {
    return fetch(`${url}/ranks/overall`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

// Records
async function API_getRecordById(recordId) {
    return fetch(`${url}/records/id/${recordId}/overview`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

// Search 
async function API_searchPlayersAndMaps(search) {
    return fetch(`${url}/search/playersAndMaps/${search}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

// Servers 
async function API_mostRecentDemosOnServerId(serverId) {
    return fetch(`${url}/servers/${serverId}/demos`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

async function API_ServerStatusList() {
    return fetch(`${url}/servers/statusList`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

// Zones
async function API_mostRecentDemosOnServerId(limit = DEFAULT_RESULT_LIMIT) {
    return fetch(`${url}/servers/statusList?limit=${limit}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            return response.json();
        });
}

// Debug
async function API_debugNotFound() {
    throw new Error({ "code": 404, "message": "Not Found", "details": [] });
}