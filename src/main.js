var detailedMapsList = {};
var filteredMapsList = {};
var authorsList = {};
var mostBonuses = 0;
// Elements
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

function sortMaps() {
    const selectedFilter = document.getElementById('sort-select').value;
    const key = 'id';
    return filteredMapsList.sort((a, b) => {
        if (selectedFilter === 'oldest') {
            return a[key] - b[key];
        } else if (selectedFilter === 'newest') {
            return b[key] - a[key];
        }
        else return;
    });
}

function filterMaps() {
    filteredMapsList = detailedMapsList;

    // Filter by difficulty
    const minS = document.getElementById('min-range-s').value;
    const maxS = document.getElementById('max-range-s').value;
    const minD = document.getElementById('min-range-d').value;
    const maxD = document.getElementById('max-range-d').value;
    const sSlider = document.getElementById('toggle-s-slider');
    const dSlider = document.getElementById('toggle-d-slider');

    filteredMapsList = filteredMapsList.filter(map => {
        // Filter by difficulty
        let isSInRange = undefined;
        if (sSlider.classList.contains('button-on')) {
            const sDifficulty = map.tier_info['3'];
            isSInRange = sDifficulty >= minS && sDifficulty <= maxS;
        }
        let isDInRange = undefined;
        if (dSlider.classList.contains('button-on')) {
            const dDifficulty = map.tier_info['4'];
            isDInRange = dDifficulty >= minD && dDifficulty <= maxD;
        }
        if (isSInRange && isDInRange !== undefined) {
            return isSInRange && isDInRange;
        }
        else if (isSInRange !== undefined) {
            return isSInRange;
        }
        else return isDInRange;
    });

    // Filter by Bonus-count
    const minB = document.getElementById('min-range-b').value;
    const maxB = document.getElementById('max-range-b').value;
    const bSlider = document.getElementById('toggle-b-slider');
    filteredMapsList = filteredMapsList.filter(map => {
        const mapBonuses = map.zone_counts.bonus === undefined ? 0 : map.zone_counts.bonus;
        if (bSlider.classList.contains('button-on')) {
            return mapBonuses >= minB && mapBonuses <= maxB;
        }
        else return true;
    });

    // Filter by linearity
    const isL = document.getElementById('toggle-linear').classList.contains('button-on');
    const isC = document.getElementById('toggle-course').classList.contains('button-on');
    filteredMapsList = filteredMapsList.filter(map => {
        if (isC && isL) {
            return true;
        } else if (isC && !isL) {
            return map.zone_counts.hasOwnProperty('course');
        } else if (!isC && isL) {
            return map.zone_counts.hasOwnProperty('linear');
        } else {
            return false;
        }
    });

    // Filter by author
    const selectedAuthor = document.getElementById('author-select').value;
    if (selectedAuthor != '__all__') {
        filteredMapsList = filteredMapsList.filter(map => {
            return map.authors.some(author => author.name === selectedAuthor);
        });
    }
    sortMaps();
    loadMapsList(filteredMapsList);
}

// DOM Loaded
document.addEventListener('DOMContentLoaded', async function () {
    detailedMapsList = await API_detailedMapsList();
    loadAllMaps();
    sortByAuthor_populate(authorsList);
    sortByBonus_populate(mostBonuses);
});

// Seach Box Input
searchInput.addEventListener('input', async function () {
    var query = searchInput.value.toLowerCase();
    if (query.length) {
        var queryResults = await API_searchPlayersAndMaps(query);
        displayUsernameResults(queryResults.players);
    }
});

// Outside of Search Click
document.addEventListener('click', function (event) {
    var clickedInsideSearch = searchInput.contains(event.target);

    if (!clickedInsideSearch) {
        searchResults.style.display = 'none';
    }
    else {
        searchResults.style.display = 'block';
    }
});