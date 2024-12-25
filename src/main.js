var maps_json;
var maps_filtered;
var authorsList = {};
var map_authors_count = {};
var mapFilters = {};
var mostBonuses = 0;

document.addEventListener('DOMContentLoaded', async function () {
    // Set base URL
    const base = document.createElement('base');
    base.href = window.location.hostname === '127.0.0.1' ? '/' : '/Tempus-Tracker/';
    document.head.appendChild(base);

    setSplashScreen();

    // Get local map list
    const maps_response = await fetch('src/data/maps_db/maps_merged.json');
    maps_json = await maps_response.json();

    // Check for new maps
    const updatedMapsList = await API_detailedMapsList();

    // Load new maps, if any
    const newMaps = [];
    for (const map of updatedMapsList) {
        if (maps_json[0].name == map.name) { break; }
        newMaps.push(map);
    }

    if (newMaps.length != 0) {
        // Get completions for new maps
        const apiPromises = newMaps.map(map => API_zoneRecordPlayerByMapName(map.name, "map", 1, 0, 0));

        // Wait for calls to finish
        const apiResponses = await Promise.all(apiPromises);

        // Process the responses
        for (let i = 0; i < newMaps.length; i++) {
            const map = newMaps[i];
            const response = apiResponses[i];

            if (response.error) {
                console.warn(`Tempus gave an error for ${map.name}: ${response.error}`);
                continue;
            }

            // Attach necessary json to maps
            map.class_tech = { soldier: [], demoman: [] };

            map.completion_info = {};
            map.completion_info.soldier = response.completion_info.soldier;
            map.completion_info.demoman = response.completion_info.demoman;

            // Add the map to the front of the maps_json array
            maps_json.unshift(map);
        }
    }

    // Set filtered maps to all maps
    maps_filtered = maps_json;

    // Load maps
    maps_loadAll();
    display_mapCount(maps_json);
    mapFilters = getDefaultFilters();

    // Set Filters, requires map data
    populate_sortByAuthor(authorsList);
    populate_sortByAuthorCount(map_authors_count);
    populate_sortByBonus(mostBonuses);
    populate_tech();

    // Set up event listeners
    document.querySelectorAll('.r1, .r2').forEach((element) => {
        element.addEventListener('input', function () {
            visual_rangeInput_update(element);
        });
    });
});