function sortByAuthor_populate(authors) {
	const select = document.getElementById('author-select');
	for (const author in authors) {
		const option = document.createElement('option');
		option.value = author;
		option.textContent = `${author} (${authors[author]})`;
		select.appendChild(option);
	}
}

function sortByBonus_populate(mostBonuses) {
	const sliderContainer = document.getElementById('bonus-range');

	const minRange = document.createElement('input');
	minRange.type = 'range';
	minRange.id = 'min-range-b'
	minRange.classList.add('min-range');
	minRange.min = 0;
	minRange.max = mostBonuses;
	minRange.value = 0;
	minRange.step = 1;
	minRange.onchange = function () {
		range_input(this);
	}
	sliderContainer.appendChild(minRange);

	const maxRange = document.createElement('input');
	maxRange.type = 'range';
	maxRange.id = 'max-range-b'
	maxRange.classList.add('max-range');
	maxRange.min = 0;
	maxRange.max = mostBonuses;
	maxRange.value = mostBonuses;
	maxRange.step = 1;
	maxRange.onchange = function () {
		range_input(this);
	};
	sliderContainer.appendChild(maxRange);
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

function button_toggleAndFilter(button) {
	button_toggle(button);
	filterMaps();
}

function button_clikedIsActive(b_clicked, b2) {
	if (b_clicked.classList.contains('button-on')) {
		button_toggle(b2);
	}
	else button_toggle(b_clicked);
}

function toggleMapFilter(button) {
	const linearButton = document.getElementById('toggle-linear');
	const courseButton = document.getElementById('toggle-course');
	const otherButton = button == linearButton ? courseButton : linearButton;
	button_clikedIsActive(button, otherButton);
	filterMaps();
}

function toggle_difficultySlider(button) {
	const sSlider = document.getElementById('toggle-s-slider');
	const dSlider = document.getElementById('toggle-d-slider');
	const otherButton = button == sSlider ? dSlider : sSlider;
	button_clikedIsActive(button, otherButton);
	filterMaps();
}

function range_input(slider) {
	const rangeSlider = slider.closest('.range-input');
	const minRange = rangeSlider.querySelector('.min-range');
	const maxRange = rangeSlider.querySelector('.max-range');
	const minValue = parseInt(minRange.value);
	const maxValue = parseInt(maxRange.value);

	if (minValue > maxValue) {
		if (slider.classList.contains('min-range')) {
			minRange.value = maxValue;
		} else {
			maxRange.value = minValue;
		}
	}
	filterMaps();
}