const MIN_TIER = 0;
const MAX_TIER = 6;
var maps_filtered = [...maps_json];
var authorsList = {};
var mapauthorscount = {};
var mostBonuses = 0;
var mapFilters = {};

function getDefaultFilters() {
    return {
        "sliderS": {
            "toggle": 1,
            "min": MIN_TIER,
            "max": MAX_TIER
        },
        "sliderD": {
            "toggle": 1,
            "min": MIN_TIER,
            "max": MAX_TIER
        },
        "sliderB": {
            "toggle": 1,
            "min": 0,
            "max": mostBonuses
        },

        "linear": 1,
        "course": 1,
        "soldier": 1,
        "demoman": 1,

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
    populate_sortByAuthorCount(mapauthorscount);
    populate_sortByBonus(mostBonuses);

    document.querySelectorAll('.r1, .r2').forEach((element) => {
        element.addEventListener('input', function () {
            visual_rangeInput_update(element);
        });
    });
});