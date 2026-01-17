let searchResults = document.getElementById('search-results');
let searchInput = document.getElementById('search-input');
let clearBtn = document.getElementById('clear-btn');

let addedElements = [];

searchInput.addEventListener('input', function () {
    let searchQuery = this.value.toLowerCase();
    let searchableElements = document.querySelectorAll('.map-name');

    searchResults.innerHTML = '';
    addedElements = [];

    searchableElements.forEach(element => {
        element.style.backgroundColor = '';

        if (searchQuery &&
            element.innerText.toLowerCase().includes(searchQuery) &&
            !element.parentElement.parentElement.parentElement.classList.contains('hidden')
        ) {
            // Push to highlighted elements
            addedElements.push(element);

            // Highlight matching element
            element.style.backgroundColor = '#7289da';

            // Add to list
            var li = document.createElement('li');
            li.textContent = element.innerText;
            // Add click event to each result
            li.addEventListener('click', function () {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            });
            searchResults.appendChild(li);
        }
    });
    clearBtn.style.display = searchQuery ? 'block' : 'none';
    searchResults.style.display = searchableElements.length > 0 ? 'block' : 'none';
});

clearBtn.addEventListener('click', function () {
    addedElements.forEach(element => {
        element.style.backgroundColor = '';
    });
    addedElements = [];
    
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
    clearBtn.style.display = 'none';
});

document.addEventListener('click', function (event) {
    // Check if the click was inside the search input or the search results
    let clickedInsideSearch = searchInput.contains(event.target) || searchResults.contains(event.target);

    if (!clickedInsideSearch) {
        searchResults.style.display = 'none';
        addedElements.forEach(element => {
            element.style.backgroundColor = '';
        });
    } else {
        searchResults.style.display = 'block';
        addedElements.forEach(element => {
            element.style.backgroundColor = '#7289da';
        });
    }
});