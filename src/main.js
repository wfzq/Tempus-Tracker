var detailedMapsList = {};
var filteredMapsList = {};
var authorsList = {};
var mapauthorscount = {};
var mostBonuses = 0;

// DOM Loaded
document.addEventListener('DOMContentLoaded', async function () {
    /* detailedMapsList = await API_detailedMapsList(); */
    detailedMapsList = offline_detailedMapsList_merged;
    loadAllMaps();
    display_results(detailedMapsList);
    populate_sortByAuthor(authorsList);
    populate_sortByAuthorCount(mapauthorscount);
    populate_sortByBonus(mostBonuses);
});