const { getDefaultSettings } = require("http2");

/* 

    Filter

*/
function filterMapBy_difficultyRange(map, classChar) {
    const min = mapFilters[classChar].min;
    const max = mapFilters[classChar].max;
    const difficulty = map.tier_info[classChar];

    return difficulty >= min && difficulty <= max;
}

function filterMapBy_bonusRange(map) {
    const min = mapFilters.sliderB.min;
    const max = mapFilters.sliderB.max;
    const bonuses = map.zone_counts.bonus ? 0 : map.zone_counts.bonus;

    return bonuses >= min && bonuses <= max;
}

function filterMapBy_linearCourse(map) {
    const allowLinear = mapFilters.linear;
    const allowCourse = mapFilters.course;
    const isLinear = map.zone_counts.hasOwnProperty('linear');
    //   !isLinear == isCourse

    return (
        (isLinear && allowLinear) ||
        (!isLinear && allowCourse)
    );
}

function filterMapBy_intended(map) {
    const intendedS = mapFilters.soldier;
    const intendedD = mapFilters.demoman;
    const mapIntended = map.intended_class;

    return !(
        (!intendedS && mapIntended == '3') ||
        (!intendedD && mapIntended == '4')
    )
}

function filterMapBy_authorName(map) {
    const selectedAuthor = mapFilters.authors["author-select"];
    return map.authors.some(author =>
        author.name === selectedAuthor
    );
}

function filterMapBy_authorCount(map) {
    const authorAmount = mapFilters.authors["author-amount-select"];
    return map.authors.length == authorAmount;
}

function filterMapBy_completions(map) {
    const min = mapFilters.completions.min;
    const max = mapFilters.completions.max;
    const hasMin = !Number.isNaN(min);
    const hasMax = !Number.isNaN(max);
    const type = mapFilters.completions.select;

    if (hasMin || hasMax) {
        const sval = map.completion_info.soldier;
        const dval = map.completion_info.demoman;

        switch (type) {
            case "soldier":
                return (
                    (hasMin && hasMax && (sval >= min || sval <= max)) ||
                    (hasMin && sval >= min) ||
                    (hasMax && sval <= max)
                );
            case "demoman":
                return (
                    (hasMin && hasMax && (dval >= min && dval <= max)) ||
                    (hasMin && dval >= min) ||
                    (hasMax && dval <= max)
                );
            case "both":
                return (
                    (hasMin && hasMax && (sval >= min || sval <= max) && (dval >= min && dval <= max)) ||
                    (hasMin && sval >= min && dval >= min) ||
                    (hasMax && sval <= max && dval <= max)
                );
            default:
                return (
                    (hasMin && hasMax && ((sval >= min || sval <= max) || (dval >= min && dval <= max))) ||
                    (hasMin && (sval >= min || dval >= min)) ||
                    (hasMax && (sval <= max || dval <= max))
                );
        }
    }
    return true;
}

function reduceFilterFunctions(currentFilters) {
    const defaultSettings = getDefaultSettings();
    /** Remove filter from list if:
     *  1) It's turned off
     *  2) It's value is default
     */
    for (const key of currentFilters) {
        switch (key) {
            case 'S': /* Difficulty Soldier */
                if (
                    mapFilters.sliderS.toggle === false ||
                    (
                        mapFilters.sliderS.min === defaultSettings.sliderS.min &&
                        mapFilters.sliderS.max === defaultSettings.sliderS.max
                    )
                ) {
                    currentFilters.delete(key);
                }
                break;

            case 'D': /* Difficulty Demoman */
                if (
                    mapFilters.sliderD.toggle === false ||
                    (
                        mapFilters.sliderD.min === defaultSettings.sliderD.min &&
                        mapFilters.sliderD.max === defaultSettings.sliderD.max
                    )
                ) {
                    currentFilters.delete(key);
                }
                break;

            case 'B': /* Bonus Range */
                if (
                    mapFilters.sliderB.toggle === false ||
                    (
                        mapFilters.sliderB.min === defaultSettings.sliderB.min &&
                        mapFilters.sliderB.max === defaultSettings.sliderB.max
                    )
                ) {
                    currentFilters.delete(key);
                }
                break;

            case 'LC': /* Linear Course */
                if (
                    mapFilters.linear === defaultSettings.linear &&
                    mapFilters.course === defaultSettings.course
                ) {
                    currentFilters.delete(key);
                }
                break;

            case 'IN': /* Intended */
                if (
                    mapFilters.soldier === defaultSettings.soldier &&
                    mapFilters.demoman === defaultSettings.demoman
                ) {
                    currentFilters.delete(key);
                }
                break;

            case 'AN': /* Author Name */
                if (mapFilters.authors["author-select"] === defaultSettings.authors["author-select"]) {
                    currentFilters.delete(key);
                }
                break;

            case 'AC': /* Author Count */
                if (mapFilters.authors["author-amount-select"] === defaultSettings.authors["author-amount-select"]) {
                    currentFilters.delete(key);
                }
                break;

            case 'CO': /* Completions */
                if (
                    mapFilters.completions.min === defaultSettings.completions.min &&
                    mapFilters.completions.max === defaultSettings.completions.max
                ) {
                    currentFilters.delete(key);
                }
                break;

            default:
                console.error("reduceFilterFunctions(): Unknown key");
                break;
        }
    }
    return currentFilters;
}

/** Functions Index:
 *  - SS - Slider Soldier
 *  - SD - Slider Demoman
 *  - SB - Slider Bonus
 *  - LC - Linear Course
 *  - IN - INtended
 *  - AN - Author Name
 *  - AC - Author Count
 *  - CO - COmpletions
 */
function filterMaps(mapList, excludeFiltersByKey = []) {
    let filters = new Map([
        // ORDER OF FUNCTIONS HERE MATTERS!!
        ['S', (map) => filterMapBy_difficultyRange(map, '3')],
        ['D', (map) => filterMapBy_difficultyRange(map, '4')],
        ['B', (map) => filterMapBy_bonusRange(map)],
        ['LC', (map) => filterMapBy_linearCourse(map)],
        ['IN', (map) => filterMapBy_intended(map)],
        ['AN', (map) => filterMapBy_authorName(map)],
        ['AC', (map) => filterMapBy_authorCount(map)],
        ['CO', (map) => filterMapBy_completions(map)]
    ]);

    // Remove unused filters
    excludeFiltersByKey.forEach(key => {
        filters.delete(key);
    });
    reduceFilterFunctions(filters);

    return mapList.filter(map => {
        const mapElement = document.getElementById(map.name);
        const isVisible = activeFilters.every(filter => filter(map));

        isVisible ?
            mapElement?.classList.remove('hidden') :
            mapElement?.classList.add('hidden');
        return isVisible;
    });
}
/* 

    Sort

*/
function sortBy_oldestId(mapsList) {
    return mapsList.sort((a, b) => {
        return a["id"] - b["id"];
    });
}

function sortBy_newestId(mapsList) {
    return mapsList.sort((a, b) => {
        return b["id"] - a["id"];
    });
}

function sortBy_mostCompletions(mapsList, classFunction) {
    return mapsList.sort((a, b) => {
        return classFunction(a) < classFunction(b) ? 1 : -1;
    });
}

function sortBy_leastCompletions(mapsList, classFunction) {
    return mapsList.sort((a, b) => {
        return classFunction(a) > classFunction(b) ? 1 : -1;
    });
}

/* 

    JSON list logic

*/
function excludeMatchingFrom(main, b) {
    const namesToExclude = new Set(b.map(entry => entry.name));
    return main.filter(entry => !namesToExclude.has(entry.name));
}

function mergeUniquesOnly(main, b) {
    const combinedArray = main.concat(b);
    return Array.from(new Set(
        combinedArray.map(item => JSON.stringify(item))))
        .map(item => JSON.parse(item));
}