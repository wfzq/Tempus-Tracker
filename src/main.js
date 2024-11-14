const MIN_TIER = 0;
const MAX_TIER = 6;
var maps_filtered = [...maps_json];
var authorsList = {};
var map_authors_count = {};
var mostBonuses = 0;
var mapFilters = {};

function getDefaultFilters() {
    return {
        "difficultyMix": true,
        "sliderS": {
            "toggle": true,
            "min": MIN_TIER,
            "max": MAX_TIER
        },
        "sliderD": {
            "toggle": true,
            "min": MIN_TIER,
            "max": MAX_TIER
        },
        "sliderB": {
            "toggle": true,
            "min": 0,
            "max": mostBonuses
        },

        "linear": true,
        "course": true,
        "soldier": true,
        "demoman": true,

        "authors": {
            "author-select": "__all__",
            "author-amount-select": "__all__",
        },
        "completions": {
            "select": "either",
            "min": NaN,
            "max": NaN,
        }
    };
}

// DOM Loaded
document.addEventListener('DOMContentLoaded', async function () {
    maps_loadAll();
    display_mapCount(maps_json);
    mapFilters = getDefaultFilters();

    populate_sortByAuthor(authorsList);
    populate_sortByAuthorCount(map_authors_count);
    populate_sortByBonus(mostBonuses);

    document.querySelectorAll('.r1, .r2').forEach((element) => {
        element.addEventListener('input', function () {
            visual_rangeInput_update(element);
        });
    });
});