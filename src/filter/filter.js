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
    minRange.classList.add('min-range-b');
    minRange.min = 0;
    minRange.max = mostBonuses;
    minRange.value = 0;
    minRange.step = 1;
    minRange.onchange = filterMaps;
	sliderContainer.appendChild(minRange);

	const maxRange = document.createElement('input');
    maxRange.type = 'range';
    maxRange.classList.add('max-range-b');
    maxRange.min = 0;
    maxRange.max = mostBonuses;
    maxRange.value = mostBonuses;
    maxRange.step = 1;
    maxRange.onchange = filterMaps;
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