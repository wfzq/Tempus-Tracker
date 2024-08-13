/* 

    Filter

*/
function filterMapBy_difficultyRange(map, classInt) {
    const sliderType = classInt == 3 ? "sliderS" : "sliderD";
    const min = mapFilters[sliderType].min;
    const max = mapFilters[sliderType].max;
    const difficulty = map.tier_info[classInt];

    return difficulty >= min && difficulty <= max;
}

function filterMapBy_bonusRange(map) {
    const min = mapFilters.sliderB.min;
    const max = mapFilters.sliderB.max;
    const bonuses = map.zone_counts.bonus != undefined ? map.zone_counts.bonus : 0;

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
    const type = mapFilters.completions.select;

    const hasMin = !Number.isNaN(min);
    const hasMax = !Number.isNaN(max);

    const sval = map.completion_info.soldier;
    const dval = map.completion_info.demoman;

    let result = false;
    switch (type) {
        case "soldier":
            if (hasMin && hasMax) {
                if (sval >= min && sval <= max) {
                    result = true;
                }
            } else if (hasMin) {
                if (sval >= min) {
                    result = true;
                }
            } else /* hasMax */ {
                if (sval <= max) {
                    result = true;
                }
            }
            return result;

        case "demoman":
            if (hasMin && hasMax) {
                if (dval >= min && dval <= max) {
                    result = true;
                }
            } else if (hasMin) {
                if (dval >= min) {
                    result = true;
                }
            } else /* hasMax */ {
                if (dval <= max) {
                    result = true;
                }
            }
            return result;

        case "both":
            if (hasMin && hasMax) {
                if ((sval >= min && sval <= max) && (dval >= min && dval <= max)) {
                    result = true;
                }
            } else if (hasMin) {
                if (sval >= min && dval >= min) {
                    result = true;
                }
            } else /* hasMax */ {
                if (sval <= max && dval <= max) {
                    result = true;
                }
            }
            return result;

        default:
            if (hasMin && hasMax) {
                if ((sval >= min && sval <= max) || (dval >= min && dval <= max)) {
                    result = true;
                }
            } else if (hasMin) {
                if (sval >= min || dval >= min) {
                    result = true;
                }
            } else /* hasMax */ {
                if (sval <= max || dval <= max) {
                    result = true;
                }
            }
            return result;
    }
}

function reduceFilterFunctions(currentFilters) {
    const defaultSettings = getDefaultFilters();
    /** Remove filter from list if:
     *  1) It's turned off
     *  2) It's value is default
     */
    for (const [key, fun] of currentFilters) {
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
                    isNaN(mapFilters.completions.min) &&
                    isNaN(mapFilters.completions.max)
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
 *  - S  - [S]oldier
 *  - D  - [D]emoman
 *  - B  - [B]onus
 *  - LC - [L]inear [C]ourse
 *  - IN - [IN]tended
 *  - AN - [A]uthor [N]ame
 *  - AC - [A]uthor [C]ount
 *  - CO - [CO]mpletions
 */
function filterMaps(mapList, excludeFiltersByKey = []) {
    let filters = new Map([
        // ORDER OF FUNCTIONS MATTERS!!
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
        const isVisible = ((map) => {
            for (let filter of filters.values()) {
                if (!filter(map))
                    return false;
            }
            return true;
        })(map); // Pass current map into IIFE

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