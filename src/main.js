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

    try {
        // Load and synchronize maps
        const result = await synchronize_maps();
        maps_json = result;
        maps_filtered = result;

        // Load maps
        maps_loadAll();
        display_mapCount(maps_json);
        mapFilters = getDefaultFilters();

        // Set Filters, requires map data
        populate_mapTiers();
        populate_sortByAuthor(authorsList);
        populate_sortByAuthorCount(map_authors_count);
        populate_sortByBonus(mostBonuses);
        populate_tech();
    } catch (error) {
        console.error("Failed to load maps:", error);
    }

    filters_combo_sort('newest');
});

async function synchronize_maps() {
    try {
        // Get local maps
        const localResponse = await fetch('src/data/maps_db/maps_merged.json');
        const localMaps = await localResponse.json();

        // Get online maps
        const onlineMaps = await API_detailedMapsList();

        // Create ID maps for quick lookup
        const localMapsById = new Map();
        localMaps.forEach(map => {
            localMapsById.set(map.id, map);
        });

        const onlineMapsById = new Map();
        onlineMaps.forEach(map => {
            onlineMapsById.set(map.id, map);
        });

        // Get new maps
        const newMaps = onlineMaps.filter(map => !localMapsById.has(map.id));

        // Get removed maps
        const removedMaps = localMaps.filter(map => !onlineMapsById.has(map.id));

        // For new maps, fetch their completion data
        if (newMaps.length > 0) {
            const apiPromises = newMaps.map(map =>
                API_zoneRecordPlayerByMapName(map.name, "map", 1, 0, 0)
            );

            // Wait for all API calls to finish
            const apiResponses = await Promise.all(apiPromises);

            // Process the responses
            for (let i = 0; i < newMaps.length; i++) {
                const map = newMaps[i];
                const response = apiResponses[i];

                if (response.error) {
                    console.warn(`Error fetching completion data for ${map.name}: ${response.error}`);
                    map.class_tech = { soldier: [], demoman: [] };
                    map.completion_info = { soldier: null, demoman: null };
                } else {
                    // Append completions
                    map.class_tech = { soldier: [], demoman: [] };
                    map.completion_info = {
                        soldier: response.completion_info.soldier,
                        demoman: response.completion_info.demoman
                    };
                }
            }
        }

        const synchronizedMaps = [];
        synchronizedMaps.push(...newMaps);

        // Check online maps against local maps
        for (const onlineMap of onlineMaps) {
            // Both maps exist, update
            if (localMapsById.has(onlineMap.id)) {
                const localMap = localMapsById.get(onlineMap.id);

                // Log updated map names
                if (localMap.name !== onlineMap.name) {
                    console.log(`Updated Map: "${localMap.name}" is now "${onlineMap.name}"`);
                }

                const mergedMap = {
                    ...localMap,
                    name: onlineMap.name,
                    zone_counts: onlineMap.zone_counts,
                    authors: onlineMap.authors,
                    tier_info: onlineMap.tier_info,
                    rating_info: onlineMap.rating_info
                };
                synchronizedMaps.push(mergedMap);
            }
            else {
                console.log(`New map: "${onlineMap.name}"`);
            }
        }
        return synchronizedMaps;

    } catch (error) {
        console.error("Error synchronizing maps:", error);

        // In case of error, return the local maps as fallback
        try {
            const localResponse = await fetch('src/data/maps_db/maps_merged.json');
            const localMaps = await localResponse.json();
            console.log(`Falling back to ${localMaps.length} local maps due to sync error`);
            return {
                allMaps: localMaps,
                newMaps: [],
                updatedMaps: []
            };
        } catch (fallbackError) {
            console.error("Even fallback to local maps failed:", fallbackError);
            return {
                allMaps: [],
                newMaps: [],
                updatedMaps: []
            };
        }
    }
}

// Set up event listeners
document.querySelectorAll('.r1, .r2').forEach((element) => {
    element.addEventListener('input', function () {
        visual_rangeInput_update(element);
    });
});