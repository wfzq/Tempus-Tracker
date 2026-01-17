const mascots = 5;
const MIN_TIER = 0;
const MAX_TIER = 10;
const MIN_RATING = 1;
const MAX_RATING = 4;

// Github Repository
const githubBaseUrl = `https://raw.githubusercontent.com/wfzq/Open-Tempus-Network-Database/main`;
const thumbnailsUrl = `${githubBaseUrl}/map-backgrounds`;

// Header Elements
const mascot = document.getElementById('mascot');
const logo = document.getElementById('tf-logo');
const logoBackground = document.getElementById('logo-container');

// Container Elements
const server_container = document.getElementById('server-container');
const map_filters_container = document.getElementById('maps-filters-container');
const server_filters_container = document.getElementById('server-filters-container');
const maps_container = document.getElementById('maps-container');

// Filter Elements
const resetButton = document.getElementById('reset-btn');

const sliderS = document.getElementById('toggle-s-slider');
const r1s = document.getElementById('r1-s');
const r2s = document.getElementById('r2-s');
const r1stip = document.getElementById('r1-s-tip');
const r2stip = document.getElementById('r2-s-tip');

const ratingS = document.getElementById('toggle-s-slider-rating');
const r1sr = document.getElementById('r1-s-r');
const r2sr = document.getElementById('r2-s-r');
const r1srangetip = document.getElementById('r1-s-range-tip');
const r2srangetip = document.getElementById('r2-s-range-tip');

const sliderD = document.getElementById('toggle-d-slider');
const r1d = document.getElementById('r1-d')
const r2d = document.getElementById('r2-d')
const r1dtip = document.getElementById('r1-d-tip');
const r2dtip = document.getElementById('r2-d-tip');

const ratingD = document.getElementById('toggle-d-slider-rating');
const r1dr = document.getElementById('r1-d-r');
const r2dr = document.getElementById('r2-d-r');
const r1drangetip = document.getElementById('r1-d-range-tip');
const r2drangetip = document.getElementById('r2-d-range-tip');

const sliderB = document.getElementById('toggle-b-slider');
var r1b // Loaded in function filters_reset
var r2b // Loaded in function filters_reset
const r1btip = document.getElementById('r1-b-tip');
const r2btip = document.getElementById('r2-b-tip');

const toggleMix = document.getElementById('toggle-mix');
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
    "Afghanistan": "af",
    "Albania": "al",
    "Algeria": "dz",
    "Andorra": "ad",
    "Angola": "ao",
    "Antigua and Barbuda": "ag",
    "Argentina": "ar",
    "Armenia": "am",
    "Australia": "au",
    "Austria": "at",
    "Azerbaijan": "az",
    "Bahamas": "bs",
    "Bahrain": "bh",
    "Bangladesh": "bd",
    "Barbados": "bb",
    "Belarus": "by",
    "Belgium": "be",
    "Belize": "bz",
    "Benin": "bj",
    "Bhutan": "bt",
    "Bolivia": "bo",
    "Bosnia and Herzegovina": "ba",
    "Botswana": "bw",
    "Brazil": "br",
    "Brunei": "bn",
    "Bulgaria": "bg",
    "Burkina Faso": "bf",
    "Burundi": "bi",
    "Cabo Verde": "cv",
    "Cambodia": "kh",
    "Cameroon": "cm",
    "Canada": "ca",
    "Central African Republic": "cf",
    "Chad": "td",
    "Chile": "cl",
    "China": "cn",
    "Colombia": "co",
    "Comoros": "km",
    "Congo, Democratic Republic of the": "cd",
    "Congo, Republic of the": "cg",
    "Costa Rica": "cr",
    "Croatia": "hr",
    "Cuba": "cu",
    "Cyprus": "cy",
    "Czech Republic": "cz",
    "Denmark": "dk",
    "Djibouti": "dj",
    "Dominica": "dm",
    "Dominican Republic": "do",
    "Ecuador": "ec",
    "Egypt": "eg",
    "El Salvador": "sv",
    "Equatorial Guinea": "gq",
    "Eritrea": "er",
    "Estonia": "ee",
    "Eswatini": "sz",
    "Ethiopia": "et",
    "Fiji": "fj",
    "Finland": "fi",
    "France": "fr",
    "Gabon": "ga",
    "Gambia": "gm",
    "Georgia": "ge",
    "Germany": "de",
    "Ghana": "gh",
    "Greece": "gr",
    "Grenada": "gd",
    "Guatemala": "gt",
    "Guinea": "gn",
    "Guinea-Bissau": "gw",
    "Guyana": "gy",
    "Haiti": "ht",
    "Honduras": "hn",
    "Hungary": "hu",
    "Iceland": "is",
    "India": "in",
    "Indonesia": "id",
    "Iran": "ir",
    "Iraq": "iq",
    "Ireland": "ie",
    "Israel": "il",
    "Italy": "it",
    "Jamaica": "jm",
    "Japan": "jp",
    "Jordan": "jo",
    "Kazakhstan": "kz",
    "Kenya": "ke",
    "Kiribati": "ki",
    "Korea, North": "kp",
    "Korea, South": "kr",
    "Kuwait": "kw",
    "Kyrgyzstan": "kg",
    "Laos": "la",
    "Latvia": "lv",
    "Lebanon": "lb",
    "Lesotho": "ls",
    "Liberia": "lr",
    "Libya": "ly",
    "Liechtenstein": "li",
    "Lithuania": "lt",
    "Luxembourg": "lu",
    "Madagascar": "mg",
    "Malawi": "mw",
    "Malaysia": "my",
    "Maldives": "mv",
    "Mali": "ml",
    "Malta": "mt",
    "Marshall Islands": "mh",
    "Mauritania": "mr",
    "Mauritius": "mu",
    "Mexico": "mx",
    "Micronesia": "fm",
    "Moldova": "md",
    "Monaco": "mc",
    "Mongolia": "mn",
    "Montenegro": "me",
    "Morocco": "ma",
    "Mozambique": "mz",
    "Myanmar": "mm",
    "Namibia": "na",
    "Nauru": "nr",
    "Nepal": "np",
    "Netherlands": "nl",
    "New Zealand": "nz",
    "Nicaragua": "ni",
    "Niger": "ne",
    "Nigeria": "ng",
    "North Macedonia": "mk",
    "Norway": "no",
    "Oman": "om",
    "Pakistan": "pk",
    "Palau": "pw",
    "Palestine": "ps",
    "Panama": "pa",
    "Papua New Guinea": "pg",
    "Paraguay": "py",
    "Peru": "pe",
    "Philippines": "ph",
    "Poland": "pl",
    "Portugal": "pt",
    "Qatar": "qa",
    "Romania": "ro",
    "Russia": "ru",
    "Rwanda": "rw",
    "Saint Kitts and Nevis": "kn",
    "Saint Lucia": "lc",
    "Saint Vincent and the Grenadines": "vc",
    "Samoa": "ws",
    "San Marino": "sm",
    "Sao Tome and Principe": "st",
    "Saudi Arabia": "sa",
    "Senegal": "sn",
    "Serbia": "rs",
    "Seychelles": "sc",
    "Sierra Leone": "sl",
    "Singapore": "sg",
    "Slovakia": "sk",
    "Slovenia": "si",
    "Solomon Islands": "sb",
    "Somalia": "so",
    "South Africa": "za",
    "South Sudan": "ss",
    "Spain": "es",
    "Sri Lanka": "lk",
    "Sudan": "sd",
    "Suriname": "sr",
    "Sweden": "se",
    "Switzerland": "ch",
    "Syria": "sy",
    "Taiwan": "tw",
    "Tajikistan": "tj",
    "Tanzania": "tz",
    "Thailand": "th",
    "Timor-Leste": "tl",
    "Togo": "tg",
    "Tonga": "to",
    "Trinidad and Tobago": "tt",
    "Tunisia": "tn",
    "Turkey": "tr",
    "Turkmenistan": "tm",
    "Tuvalu": "tv",
    "Uganda": "ug",
    "Ukraine": "ua",
    "United Arab Emirates": "ae",
    "United Kingdom": "gb",
    "United States": "us",
    "Uruguay": "uy",
    "Uzbekistan": "uz",
    "Vanuatu": "vu",
    "Vatican City": "va",
    "Venezuela": "ve",
    "Vietnam": "vn",
    "Yemen": "ye",
    "Zambia": "zm",
    "Zimbabwe": "zw",
    "Hong Kong": "hk"
};

const countryGroups = {
    "central europe": ["at", "be", "ch", "cz", "de", "fi", "fr", "gb", "hu", "ie", "it", "lu", "nl", "pl", "se"],
    "north america": ["ca", "us", "mx"],
    "south america": ["ar", "bo", "br", "cl", "co", "ec", "gy", "pe", "py", "sr", "uy", "ve"],
    "asia": ["af", "am", "az", "bd", "bh", "bn", "bt", "cn", "ge", "hk", "id", "in", "ir", "iq", "il", "jp", "jo", "kz", "kh", "kp", "kr", "kw", "kg", "la", "lb", "lk", "mm", "mn", "my", "np", "om", "ph", "pk", "qa", "sg", "sy", "th", "tj", "tl", "tm", "tw", "uz", "vn", "ye"],
    "oceania": ["au", "fj", "ki", "mh", "fm", "nr", "nz", "pw", "pg", "ws", "sb", "to", "tv", "vu"],
    "middle east": ["ae", "bh", "cy", "eg", "il", "iq", "jo", "kw", "lb", "om", "ps", "qa", "sa", "sy", "tr", "ye"],
    "africa": ["dz", "ao", "bj", "bw", "bf", "bi", "cv", "cm", "cf", "td", "km", "cg", "cd", "dj", "eg", "gq", "er", "sz", "et", "ga", "gm", "gh", "gn", "gw", "ci", "ke", "ls", "lr", "ly", "mg", "mw", "ml", "mr", "mu", "ma", "mz", "na", "ne", "ng", "rw", "st", "sn", "sc", "sl", "so", "za", "ss", "sd", "tz", "tg", "tn", "ug", "zm", "zw"],
    "eurasia": ["am", "az", "by", "ge", "kz", "kg", "md", "ru", "tj", "tm", "ua", "uz"]
};

function getDefaultFilters() {
    return {
        "difficultyMix": true,
        "sliderS": {
            "toggle": true,
            "min": MIN_TIER,
            "max": MAX_TIER
        },
        "ratingS": {
            "toggle": true,
            "min": MIN_RATING,
            "max": MAX_RATING
        },
        "sliderD": {
            "toggle": true,
            "min": MIN_TIER,
            "max": MAX_TIER
        },
        "ratingD": {
            "toggle": true,
            "min": MIN_RATING,
            "max": MAX_RATING
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