function filters_slider_toggle(button) {
    filter_button_toggle(button);
    
}

function filters_slider_range(classInt) {

}

function filters_button_type_linear(button) {

}

function filters_button_type_course(button) {

}

function filters_button_intended_soldier(button) {

}

function filters_button_intended_demoman(button) {

}

function filters_combo_author(author) {

}

function filters_combo_author_count(count) {

}

function filters_combo_completions_classes(type) {

}

function filters_input_completions_min(min) {

}

function filters_input_completions_max(max) {

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