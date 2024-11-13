// Filters HTML elements
var resetButton = document.getElementById('reset-btn');
var sliderS = document.getElementById('toggle-s-slider');
var r1s = document.getElementById('r1-s');
var r2s = document.getElementById('r2-s');
var toggleMix = document.getElementById('toggle-mix');
var sliderD = document.getElementById('toggle-d-slider');
var r1d = document.getElementById('r1-d')
var r2d = document.getElementById('r2-d')
var sliderB = document.getElementById('toggle-b-slider');
var r1b // Loaded in function filters_reset
var r2b // Loaded in function filters_reset
var toggleLinear = document.getElementById('toggle-linear');
var toggleCourse = document.getElementById('toggle-course');
var toggleSoldierIntended = document.getElementById('toggle-soldier');
var toggleDemomanIntended = document.getElementById('toggle-demoman');
var selectAuthor = document.getElementById('author-select');
var selectAuthorAmount = document.getElementById('author-amount-select');
var completionsClass = document.getElementById('completions-class-select');
var completionsMin = document.getElementById('min-completions');
var completionsMax = document.getElementById('max-completions');
var sortMapsSelect = document.getElementById('sort-select');

function populate_sortByAuthor(authors) {
    const select = document.getElementById('author-select');

    // Sort By Authors with most maps
    const mapArray = Object.entries(authors);
    const sortedArray = mapArray.sort((a, b) => b[1] - a[1]);
    for (const [author, count] of sortedArray) {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = `${author} (${count})`;
        select.appendChild(option);
    }

    // Sort by Author Names
    /* for (const author in sortedArray) {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = `${author} (${authors[author]})`;
        select.appendChild(option);
    } */
}

function populate_sortByBonus(mostBonuses) {
    const sliderContainer = document.getElementById('slider-container-b');

    const minRange = document.createElement('input');
    minRange.type = 'range';
    minRange.id = 'r1-b'
    minRange.classList.add('r1');
    minRange.min = 0;
    minRange.max = mostBonuses;
    minRange.value = 0;
    minRange.step = 1;
    minRange.oninput = function () {
        visual_rangeInput_update(this);
    }
    minRange.onchange = function () {
        filters_slider_range(5);
    };
    sliderContainer.appendChild(minRange);

    const maxRange = document.createElement('input');
    maxRange.type = 'range';
    maxRange.id = 'r2-b'
    maxRange.classList.add('r2');
    maxRange.min = 0;
    maxRange.max = mostBonuses;
    maxRange.value = mostBonuses;
    maxRange.step = 1;
    maxRange.oninput = function () {
        visual_rangeInput_update(this);
    };
    maxRange.onchange = function () {
        filters_slider_range(5);
    };
    sliderContainer.appendChild(maxRange);
}

function populate_sortByAuthorCount(authors) {
    const select = document.getElementById('author-amount-select');
    for (const amount in authors) {
        const option = document.createElement('option');
        option.value = amount;
        option.textContent = `${amount} (${authors[amount]})`;
        select.appendChild(option);
    }
}

function button_toggle(button) {
    if (button.classList.contains('button-on')) {
        button.classList.remove('button-on');
        button.classList.add('button-off');
    } else {
        button.classList.remove('button-off');
        button.classList.add('button-on');
    }
}

function button_canToggle_linearCourse(button) {
    let current;
    let other;
    if (button.id == "toggle-linear") {
        current = mapFilters.linear;
        other = mapFilters.course;
    } else {
        current = mapFilters.course;
        other = mapFilters.linear;
    }

    if (current == 1 && other == 0) {
        button.classList.add('flash-red');
        setTimeout(() => {
            button.classList.remove('flash-red');
        }, 125);
        return false;
    }
    else return true;
}

function visual_rangeInput_update(slider) {
    const rangeSlider = slider.closest('.slider-container');
    let r1 = parseInt(rangeSlider.querySelector('.r1').value);
    let r2 = parseInt(rangeSlider.querySelector('.r2').value);
    let r1tip = rangeSlider.querySelector("#r1-tip");
    let r2tip = rangeSlider.querySelector("#r2-tip");
    const rangeMax = slider.getAttribute('max');
    const range = rangeSlider.querySelector(".slider-progress");

    if (r1 > r2) {
        let t = r1;
        r1 = r2;
        r2 = t;
    }

    r1tip.textContent = r1;
    r2tip.textContent = r2;

    range.style.left = (r1 / rangeMax) * 100 + "%";
    range.style.right = 100 - (r2 / rangeMax) * 100 + "%";

    r1tip.style.left = (r1 / rangeMax) * 93 + "%";
    r2tip.style.right = 93 - (r2 / rangeMax) * 93 + "%";
}

function display_mapCount() {
    const mapCount = document.getElementById('map-count');
    mapCount.textContent = `${Object.keys(maps_filtered).length}`;
}

function reset_filters_prompt() {
    const user_confirm = confirm("Are you sure you want to revert filter settings?")
    if (user_confirm) {
        filters_reset()
    }
}

function filters_reset() {
    resetButton.classList.add('hidden')

    // Runtime load
    r1b = document.getElementById('r1-b')
    r2b = document.getElementById('r2-b')

    // Reset maps
    mapFilters = getDefaultFilters();
    maps_filtered = maps_json;
    filters_combo_sort();
    display_mapCount();

    // Reset Controls
    /* Soldier Difficulty */
    sliderS.classList.remove('button-off');
    sliderS.classList.add('button-on');
    r1s.value = MIN_TIER;
    visual_rangeInput_update(r1s);
    r2s.value = MAX_TIER;
    visual_rangeInput_update(r2s);

    /* and|or */
    toggleMix.innerHTML = "and";

    /* Demoman Difficulty */
    sliderD.classList.remove('button-off');
    sliderD.classList.add('button-on');
    r1d.value = MIN_TIER;
    visual_rangeInput_update(r1d);
    r2d.value = MAX_TIER;
    visual_rangeInput_update(r2d);

    /* Bonuses */
    sliderB.classList.remove('button-off');
    sliderB.classList.add('button-on');
    r1b.value = 0;
    visual_rangeInput_update(r1b);
    r2b.value = mostBonuses;
    visual_rangeInput_update(r2b);

    /* Map Type */
    toggleLinear.classList.remove('button-off');
    toggleLinear.classList.add('button-on');
    toggleCourse.classList.remove('button-off');
    toggleCourse.classList.add('button-on');

    toggleSoldierIntended.classList.remove('button-off');
    toggleSoldierIntended.classList.add('button-on');
    toggleDemomanIntended.classList.remove('button-off');
    toggleDemomanIntended.classList.add('button-on');

    /* Author */
    selectAuthor.value = "__all__";
    selectAuthorAmount.value = "__all__";

    /* Completions */
    completionsClass.value = "either";
    completionsMin.value = null;
    completionsMax.value = null;

    /* Sort by */
    sortMapsSelect.value = "name";
}