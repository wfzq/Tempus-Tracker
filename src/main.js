var maps_json;
var maps_filtered;
var authorsList = {};
var map_authors_count = {};
var mapFilters = {};
var mostBonuses = 0;

document.addEventListener('DOMContentLoaded', async function () {
    setSplashScreen();

    // Get maps
    const response = await fetch('../src/data/maps_db/maps_merged.json');
    maps_json = await response.json();
    maps_filtered = maps_json;

    // Set maps
    maps_loadAll();
    display_mapCount(maps_json);
    mapFilters = getDefaultFilters();

    // Set Filters
    populate_sortByAuthor(authorsList);
    populate_sortByAuthorCount(map_authors_count);
    populate_sortByBonus(mostBonuses);
    populate_tech();

    document.querySelectorAll('.r1, .r2').forEach((element) => {
        element.addEventListener('input', function () {
            visual_rangeInput_update(element);
        });
    });
});