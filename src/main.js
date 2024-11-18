const MIN_TIER = 0;
const MAX_TIER = 6;
var maps_filtered = [...maps_json];
var authorsList = {};
var map_authors_count = {};
var mostBonuses = 0;
var mapFilters = {};

function getDefaultFilters() {
    return {
        "difficultyMix": true,
        "sliderS": {
            "toggle": true,
            "min": MIN_TIER,
            "max": MAX_TIER
        },
        "sliderD": {
            "toggle": true,
            "min": MIN_TIER,
            "max": MAX_TIER
        },
        "sliderB": {
            "toggle": true,
            "min": 0,
            "max": mostBonuses
        },

        "linear": true,
        "course": true,
        "soldier": true,
        "demoman": true,

        "tech": {
            "soldier": "none",
            "demoman": "none"
        },

        "authors": {
            "author-select": "__all__",
            "author-amount-select": "__all__",
        },
        "completions": {
            "select": "either",
            "min": NaN,
            "max": NaN,
        }
    };
}

function getTechniques() {
    return {
        "O": ["Mixed", "Pogo", "Gimmick", "Phase", "Strafe", "Jank", "Jurf", "Edgebug", "Wallbug", "Texturebug", "Hole", "Lim Ammo", "Technical", "Bounce", "Buttons"],
        "S": ["Wallpogo", "Wallshot", "Sync", "Prefire", "Rand Bounce", "Airstrike", "Speedshot", "Ctap"],
        "D": ["3pre", "Hardpogo", "Airpogo", "Downair", "Vert"]
    }
}

async function setSplashScreen() {
    const splashText = document.getElementById('splash')

    // Determine font
    if (Math.random() > 0.5) {
        splashText.classList.add('minecraft');
    } else {
        splashText.classList.add('terraria');
    }

    // Determine Message
    const getMessage = async () => {
        try {
            const response = await fetch('../src/data/splash.txt');
            const data = await response.text();

            // Split into lines and filter out empty lines
            const lines = data.split('\n').filter(line => line.trim() !== '');
            // Pick a random line
            return lines[Math.floor(Math.random() * lines.length)];
        } catch (error) {
            console.error('Error getting splash text:', error);
            return '';
        }
    };
    const message = await getMessage();
    splashText.innerHTML = message;
}

// DOM Loaded
document.addEventListener('DOMContentLoaded', async function () {
    setSplashScreen();
    maps_loadAll();
    display_mapCount(maps_json);
    mapFilters = getDefaultFilters();

    populate_sortByAuthor(authorsList);
    populate_sortByAuthorCount(map_authors_count);
    populate_sortByBonus(mostBonuses);
    populate_tech();

    document.querySelectorAll('.r1, .r2').forEach((element) => {
        element.addEventListener('input', function () {
            visual_rangeInput_update(element);
        });
    });
});

// Header (nav) menu listeners
const headerOptions = document.querySelectorAll('.header-option');
document.querySelectorAll('.header-option').forEach(option => {
    // Exclude discord button
    if (option.id == 'discord-container') { return; }

    option.addEventListener('click', () => {
        // Remove the 'header-selected' class from all options
        headerOptions.forEach(opt => opt.classList.remove('header-selected'));

        // Add the 'header-selected' class to the clicked option
        option.classList.add('header-selected');
    });
});