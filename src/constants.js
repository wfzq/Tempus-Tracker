const mascots = 5;
const MIN_TIER = 0;
const MAX_TIER = 6;

// Header Elements
const mascot = document.getElementById('mascot');
const logo = document.getElementById('tf-logo');
const logoBackground = document.getElementById('logo-container');

// Main Elements
const server_container = document.getElementById('server-container');
const map_filters_container = document.getElementById('maps-filters-container');
const server_filters_container = document.getElementById('server-filters-container');
const maps_container = document.getElementById('maps-container');

// Filter Elements
const resetButton = document.getElementById('reset-btn');
const sliderS = document.getElementById('toggle-s-slider');
const r1s = document.getElementById('r1-s');
const r2s = document.getElementById('r2-s');
const toggleMix = document.getElementById('toggle-mix');
const sliderD = document.getElementById('toggle-d-slider');
const r1d = document.getElementById('r1-d')
const r2d = document.getElementById('r2-d')
const sliderB = document.getElementById('toggle-b-slider');
var r1b // Loaded in function filters_reset
var r2b // Loaded in function filters_reset
const toggleLinear = document.getElementById('toggle-linear');
const toggleCourse = document.getElementById('toggle-course');
const toggleSoldierIntended = document.getElementById('toggle-soldier');
const toggleDemomanIntended = document.getElementById('toggle-demoman');
const techBox_S = document.getElementById('tech-select-s');
const techBox_D = document.getElementById('tech-select-d');
const selectAuthor = document.getElementById('author-select');
const selectAuthorAmount = document.getElementById('author-amount-select');
const completionsClass = document.getElementById('completions-class-select');
const completionsMin = document.getElementById('min-completions');
const completionsMax = document.getElementById('max-completions');
const sortMapsSelect = document.getElementById('sort-select');
const countryToCode = {
    "United Kingdom": "gb",
    "United States": "us",
    "Germany": "de",
    "Hong Kong": "hk",
    "Bahrain": "bh",
    "France": "fr",
    "New Zealand": "nz",
    "Japan": "jp",
    "South Africa": "za",
    "Singapore": "sg",
    "Australia": "au",
    "Sweden": "se",
    "Russia": "ru",
    "Brazil": "br",
    "United Arab Emirates": "ae",
};
const countryGroups = {
    "central europe": ["de", "fr", "gb", "se"],
    "north america": ["us"],
    "south america": ["br"],
    "asia": ["hk", "bh", "jp", "sg"],
    "oceania": ["nz", "au"],
    "middle east": ["ae", "bh"],
    "africa": ["za"],
    "eurasia": ["ru"]
};

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