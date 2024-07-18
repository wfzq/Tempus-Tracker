var filteredMapsList = {};
var authorsList = {};
var mapauthorscount = {};
var mostBonuses = 0;

// DOM Loaded
document.addEventListener('DOMContentLoaded', async function () {
    loadAllMaps();
    display_results(maps_json);
    populate_sortByAuthor(authorsList);
    populate_sortByAuthorCount(mapauthorscount);
    populate_sortByBonus(mostBonuses);

    document.querySelectorAll('.r1, .r2').forEach((element) => {
        element.addEventListener('input', function () {
            range_input_update(element);
        });
        element.addEventListener('change', function () {
            filterMaps();
        });
    });
    document.querySelectorAll('.button-on, .button-off').forEach((element) => {
        element.addEventListener('click', function () {
            button_toggleAndFilter(element);
        });
    });
});