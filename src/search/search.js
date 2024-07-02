function displayUsernameResults(playersList) {
    // Clear previous results
    searchResults.innerHTML = '';

    // Display new results
    playersList.forEach(function (result) {
        var li = document.createElement('li');
        li.textContent = result.name;

        // Add click event to each result
        li.addEventListener('click', function () {
            // Autocomplete name
            searchInput.value = result.name;
            
            // TODO //
        });

        searchResults.appendChild(li);
    });
    // Show or hide the results list based on whether there are results
    searchResults.style.display = playersList.length > 0 ? 'block' : 'none';
}