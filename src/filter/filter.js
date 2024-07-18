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
	minRange.oncinput = function () {
		range_input_update(this);
	}
	sliderContainer.appendChild(minRange);

	const maxRange = document.createElement('input');
	maxRange.type = 'range';
	maxRange.id = 'r2-b'
	maxRange.classList.add('r2');
	maxRange.min = 0;
	maxRange.max = mostBonuses;
	maxRange.value = mostBonuses;
	maxRange.step = 1;
	maxRange.oncinput = function () {
		range_input_update(this);
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

function button_toggleAndFilter(button) {
	button_toggle(button);
	filterMaps();
}

function range_input_update(slider) {
	const rangeSlider = slider.closest('.slider-container');
	let r1 = parseInt(rangeSlider.querySelector('.r1').value);
	let r2 = parseInt(rangeSlider.querySelector('.r2').value);
	const rangeMax = slider.getAttribute('max');
	const range = rangeSlider.querySelector(".slider-progress");

	if (r1 > r2) {
		let t = r1;
		r1 = r2;
		r2 = t;
	}

	range.style.left = (r1 / rangeMax) * 100 + "%";
	range.style.right = 100 - (r2 / rangeMax) * 100 + "%";
}

function display_results(mapsCount) {
	const mapCount = document.getElementById('map-count');
	mapCount.textContent = `${Object.keys(mapsCount).length}`;
}

/* function button_clikedIsActive(b_clicked, b2) {
	if (b_clicked.classList.contains('button-on')) {
		button_toggle(b2);
	}
	else button_toggle(b_clicked);
}

function toggle_MapFilter(button) {
	const linearButton = document.getElementById('toggle-linear');
	const courseButton = document.getElementById('toggle-course');
	const otherButton = button == linearButton ? courseButton : linearButton;
	button_clikedIsActive(button, otherButton);
	filterMaps();
} */