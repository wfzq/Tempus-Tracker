function filters_slider_toggle(button) {
    button_toggle(button);

    // Determine slider
    const buttonVal = button.innerText;
    const slider = (() => {
        if (buttonVal == 'S')
            return "sliderS";

        else if (buttonVal == 'D')
            return "sliderD";

        else   /*buttonVal == 'B'*/
            return "sliderB";
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
    let letter;
    if (classInt == 3) {
        slider = "sliderS";
        letter = 's';
    }
    else if (classInt == 4) {
        slider = "sliderD";
        letter = 'd';
    }
    else  /*classInt == 5*/ {
        slider = "sliderB";
        letter = 'b';
    }

    // Access slider contents
    const cacheMin = mapFilters[slider].min;
    const cacheMax = mapFilters[slider].max;
    let min = parseInt(document.getElementById(`r1-${letter}`).value);
    let max = parseInt(document.getElementById(`r2-${letter}`).value);
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
        case 'newest':
            ordered_maps = sortBy_newestId([...maps_json]);
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
            ordered_maps = [...maps_json];
            
            // Avoid tripping restart code
            reorderMapElements(ordered_maps);
            return;
    }
    reorderMapElements(ordered_maps);
    resetButton.classList.remove('hidden')
}