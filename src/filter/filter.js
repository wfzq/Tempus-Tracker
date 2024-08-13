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
    switch (filterValue) {
        case 'oldest':
            maps_filtered = sortBy_oldestId(maps_filtered);
            break;
        case 'newest':
            maps_filtered = sortBy_newestId(maps_filtered);
            break;
        case 'completions_most_s':
            maps_filtered = sortBy_mostCompletions(maps_filtered, map_getSoldierCompletions);
            break;
        case 'completions_least_s':
            maps_filtered = sortBy_leastCompletions(maps_filtered, map_getSoldierCompletions);
            break;
        case 'completions_most_d':
            maps_filtered = sortBy_mostCompletions(maps_filtered, map_getDemomanCompletions);
            break;
        case 'completions_least_d':
            maps_filtered = sortBy_leastCompletions(maps_filtered, map_getDemomanCompletions);
            break;
        case 'completions_most_o':
            maps_filtered = sortBy_mostCompletions(maps_filtered, map_getBothCompletions);
            break;
        case 'completions_least_o':
            maps_filtered = sortBy_leastCompletions(maps_filtered, map_getBothCompletions);
            break;
        default:
            maps_filtered = [...maps_json];
            break;
    }
    reorderMapElements(maps_filtered);
}