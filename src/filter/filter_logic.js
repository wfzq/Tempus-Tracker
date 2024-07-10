function sortBy_id(mapsList, selectedFilter) {
    const key = 'id';
    return mapsList.sort((a, b) => {
        if (selectedFilter === 'oldest') {
            return a[key] - b[key];
        } else if (selectedFilter === 'newest') {
            return b[key] - a[key];
        }
        else return;
    });
}

function sortBy_completionInfo(mapsList, selectedFilter) {
    function getCompletions(map, filter) {
        const key = 'completion_info';
        switch (filter) {
            case 'completions_most_s':
            case 'completions_least_s':
                return map[key]?.soldier ?? 0;
            case 'completions_most_d':
            case 'completions_least_d':
                return map[key]?.demoman ?? 0;
            case 'completions_most_o':
            case 'completions_least_o':
                return (map[key]?.soldier ?? 0) + (map[key]?.demoman ?? 0);
            default:
                return 0;
        }
    }
    
    return mapsList.sort((a, b) => {
        const aCompletions = getCompletions(a, selectedFilter);
        const bCompletions = getCompletions(b, selectedFilter);

        if (aCompletions < bCompletions) {
            return selectedFilter.includes('least') ? -1 : 1;
        } else if (aCompletions > bCompletions) {
            return selectedFilter.includes('least') ? 1 : -1;
        } else {
            return 0;
        }
    });
}

function filterBy_difficulty(mapsList) {
    const minS = document.getElementById('min-range-s').value;
    const maxS = document.getElementById('max-range-s').value;
    const minD = document.getElementById('min-range-d').value;
    const maxD = document.getElementById('max-range-d').value;
    const sSlider = document.getElementById('toggle-s-slider');
    const dSlider = document.getElementById('toggle-d-slider');

    return mapsList.filter(map => {
        let isSInRange = true;
        if (sSlider.classList.contains('button-on')) {
            const sDifficulty = map.tier_info['3'];
            isSInRange = sDifficulty >= minS && sDifficulty <= maxS;
        }
        let isDInRange = true;
        if (dSlider.classList.contains('button-on')) {
            const dDifficulty = map.tier_info['4'];
            isDInRange = dDifficulty >= minD && dDifficulty <= maxD;
        }

        return isSInRange && isDInRange;
    });
}

function filterBy_bonuses(mapsList) {
    const minB = document.getElementById('min-range-b').value;
    const maxB = document.getElementById('max-range-b').value;
    const bSlider = document.getElementById('toggle-b-slider');

    return mapsList.filter(map => {
        const mapBonuses = map.zone_counts.bonus === undefined ? 0 : map.zone_counts.bonus;
        if (bSlider.classList.contains('button-on')) {
            return mapBonuses >= minB && mapBonuses <= maxB;
        }
        else return true;
    });
}

function filterBy_linearCourse(mapsList) {
    const isL = document.getElementById('toggle-linear').classList.contains('button-on');
    const isC = document.getElementById('toggle-course').classList.contains('button-on');
    return mapsList.filter(map => {
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
}

function filterBy_intended(mapsList) {
    const s = document.getElementById('toggle-soldier').classList.contains('button-on');
    const d = document.getElementById('toggle-demoman').classList.contains('button-on');
    return mapsList.filter(map => {
        if (s && d) {
            return true;
        } else if (s && !d) {
            return map.intended_class == '3';
        } else if (!s && d) {
            return map.intended_class == '4';
        } else {
            return map.intended_class == '5';
        }
    });
}

function filterBy_author(mapsList) {
    const selectedAuthor = document.getElementById('author-select').value;
    if (selectedAuthor != '__all__') {
        return mapsList.filter(map => {
            return map.authors.some(author => author.name === selectedAuthor);
        });
    }
    return mapsList;
}

function filterMaps() {
    filteredMapsList = detailedMapsList;
    filteredMapsList = filterBy_difficulty(filteredMapsList);
    filteredMapsList = filterBy_bonuses(filteredMapsList);
    filteredMapsList = filterBy_linearCourse(filteredMapsList);
    filteredMapsList = filterBy_intended(filteredMapsList);
    filteredMapsList = filterBy_author(filteredMapsList);

    const selectedFilter = document.getElementById('sort-select').value;
    switch (selectedFilter) {
        case 'oldest':
        case 'newest':
            sortBy_id(filteredMapsList, selectedFilter);
            break;
        case 'completions_most_s':
        case 'completions_least_s':
        case 'completions_most_d':
        case 'completions_least_d':
        case 'completions_most_o':
        case 'completions_least_o':
            sortBy_completionInfo(filteredMapsList, selectedFilter);
            break;
        default:
            break;
    }
    filteredMapsList = sortBy_id(filteredMapsList);


    display_results(filteredMapsList);
    loadMapsFromList(filteredMapsList);
}