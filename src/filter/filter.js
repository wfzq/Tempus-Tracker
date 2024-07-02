function sortByAuthor_populate(authors) {
  const select = document.getElementById('author-select');
  for (const author in authors) {
    const option = document.createElement('option');
    option.value = author;
    option.textContent = `${author} (${authors[author]})`;
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