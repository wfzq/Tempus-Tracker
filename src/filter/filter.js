function filters_slider_toggle(button) {
    button_toggle(button);

    // Determine slider
    const buttonVal = button.innerText;
    const slider = (() => {
        switch (buttonVal) {
            case 'S':
                return "sliderS";
            case 'D':
                return "sliderD";
            case 'B':
                return "sliderB";
            case 'Sr':
                return "ratingS";
            case 'Dr':
                return "ratingD";
            default:
                console.error("Invalid button value");
                return null;
        }
    })();

    mapFilters[slider].toggle = !mapFilters[slider].toggle;

    maps_filtered = filterMaps(maps_json);
    display_mapCount();
}

function filters_difficulty_mix(button) {
    mapFilters.difficultyMix = !mapFilters.difficultyMix;
    button.innerText = mapFilters.difficultyMix ? "and" : "or";

    maps_filtered = filterMaps(maps_json);
    display_mapCount();
}

function filters_slider_range(classInt) {
    // Determine slider
    let slider;
    let min
    let max
    switch (classInt) {
        case 3:
            slider = "sliderS";
            min = parseInt(document.getElementById(`r1-s`).value);
            max = parseInt(document.getElementById(`r2-s`).value);
            break;
        case 4:
            slider = "sliderD";
            min = parseInt(document.getElementById(`r1-d`).value);
            max = parseInt(document.getElementById(`r2-d`).value);
            break;
        case 5:
            slider = "sliderB";
            min = parseInt(document.getElementById(`r1-b`).value);
            max = parseInt(document.getElementById(`r2-b`).value);
            break;
        case 33:
            slider = "ratingS"
            min = parseInt(document.getElementById(`r1-s-r`).value);
            max = parseInt(document.getElementById(`r2-s-r`).value);
            break;
        case 44:
            slider = "ratingD"
            min = parseInt(document.getElementById(`r1-d-r`).value);
            max = parseInt(document.getElementById(`r2-d-r`).value);
            break;
        default:
            console.error("Slider range error, check HTML");
            return;
    }

    // Access slider contents
    const cacheMin = mapFilters[slider].min;
    const cacheMax = mapFilters[slider].max;
    if (min > max) {
        let t = min;
        min = max;
        max = t;
    }

    // Filter
    mapFilters[slider].min = min;
    mapFilters[slider].max = max;
    maps_filtered = filterMaps(maps_json);
    display_mapCount(maps_filtered);
}

function filters_button_type_linear(button) {
    if (!button_canToggle_linearCourse(button)) return;

    button_toggle(button);
    mapFilters.linear = !mapFilters.linear;

    maps_filtered = filterMaps(maps_json);
    display_mapCount(maps_filtered);
}

function filters_button_type_course(button) {
    if (!button_canToggle_linearCourse(button)) return;

    button_toggle(button);
    mapFilters.course = !mapFilters.course;

    maps_filtered = filterMaps(maps_json);
    display_mapCount(maps_filtered);
}

function filters_button_intended_soldier(button) {
    button_toggle(button);
    mapFilters.soldier = !mapFilters.soldier;

    maps_filtered = filterMaps(maps_json);
    display_mapCount(maps_filtered);
}

function filters_button_intended_demoman(button) {
    button_toggle(button);
    mapFilters.demoman = !mapFilters.demoman;

    maps_filtered = filterMaps(maps_json);
    display_mapCount(maps_filtered);
}

function filters_combo_soldierTech(type) {
    mapFilters.tech.soldier = type;

    maps_filtered = filterMaps(maps_json);
    display_mapCount(maps_filtered);
}

function filters_combo_demomanTech(type) {
    mapFilters.tech.demoman = type;

    maps_filtered = filterMaps(maps_json);
    display_mapCount(maps_filtered);
}

function filters_combo_author(author) {
    mapFilters.authors["author-select"] = author;

    maps_filtered = filterMaps(maps_json);
    display_mapCount(maps_filtered);
}

function filters_combo_author_count(count) {
    mapFilters.authors["author-amount-select"] = count;

    maps_filtered = filterMaps(maps_json);
    display_mapCount(maps_filtered);
}

function filters_combo_completions_classes(type) {
    mapFilters.completions.select = type;

    maps_filtered = filterMaps(maps_json);
    display_mapCount(maps_filtered);
}

function filters_input_completions_min(min) {
    mapFilters.completions.min = parseInt(min);

    maps_filtered = filterMaps(maps_json);
    display_mapCount(maps_filtered);
}

function filters_input_completions_max(max) {
    mapFilters.completions.max = parseInt(max);

    maps_filtered = filterMaps(maps_json);
    display_mapCount(maps_filtered);
}

function filters_combo_sort(filterValue) {
    /* 
        Filter all maps once,
        this fixes issues with re-ordering them each time
        more maps have been added to the pool
    */
    let ordered_maps
    switch (filterValue) {
        case 'oldest':
            ordered_maps = sortBy_oldestId([...maps_json]);
            break;
        case 'name':
            ordered_maps = [...maps_json];
            break;
        case 'completions_most_s':
            ordered_maps = sortBy_mostCompletions([...maps_json], map_getSoldierCompletions);
            break;
        case 'completions_least_s':
            ordered_maps = sortBy_leastCompletions([...maps_json], map_getSoldierCompletions);
            break;
        case 'completions_most_d':
            ordered_maps = sortBy_mostCompletions([...maps_json], map_getDemomanCompletions);
            break;
        case 'completions_least_d':
            ordered_maps = sortBy_leastCompletions([...maps_json], map_getDemomanCompletions);
            break;
        case 'completions_most_o':
            ordered_maps = sortBy_mostCompletions([...maps_json], map_getBothCompletions);
            break;
        case 'completions_least_o':
            ordered_maps = sortBy_leastCompletions([...maps_json], map_getBothCompletions);
            break;
        default:
            ordered_maps = sortBy_newestId([...maps_json]);

            // Don't show reset button if no filters are applied
            if (JSON.stringify(mapFilters) === JSON.stringify(getDefaultFilters())) {
                resetButton.classList.add('hidden');
            }

            // Avoid tripping restart code
            reorderMapElements(ordered_maps);
            return;
    }
    reorderMapElements(ordered_maps);
    resetButton.classList.remove('hidden')
}