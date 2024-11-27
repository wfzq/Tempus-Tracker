const MIN_TIER = 0;
const MAX_TIER = 6;
var maps_filtered = [...maps_json];
var authorsList = {};
var map_authors_count = {};
var mostBonuses = 0;
var mapFilters = {};
var mascots = 3;
var currentMascot = 0;

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

// Audio
async function playSound(sound) {
    switch (sound) {
        case "click":
            const clickAudio = new Audio("../src/data/sounds/medal_click.wav");
            clickAudio.play();
            break;
        case "click_rare":
            const rareClickAudio = new Audio("../src/data/sounds/medal_click_rare.wav");
            rareClickAudio.play();
            break;
        case "soldier":
            const sa = new Audio("../src/data/sounds/soldier_laughevil02.mp3");
            sa.play();
            break;
        case "demoman":
            const da = new Audio("../src/data/sounds/demoman_laughevil02.mp3");
            da.play();
            break;
        case "fox":
            const fa = new Audio("../src/data/sounds/oneandonly.mp3");
            fa.play();
            break;
        case "half_life":
            const hl = new Audio("../src/data/sounds/hl1scream.mp3");
            hl.play();
            break;
        default:
            break;
    }
    const audio = new Audio(path);
    audio.play();
}

// Logo
const mascot = document.getElementById('mascot');
const logo = document.getElementById('tf-logo');
const logoBackground = document.getElementById('logo-container');

mascot.addEventListener('click', () => {
    playSound("click");

    mascot.style.animation = 'none';
    logo.style.animation = 'none';
    void mascot.offsetWidth;
    void logo.offsetWidth;

    let roll = Math.random();
    if (roll > .9) {
        mascot.style.animation = 'bounce-change 0.1s cubic-bezier(.17,.67,.83,.67)';

        if (roll > .98) {
            // Remove background
            logoBackground.style.setProperty('--background-image', 'none');

            const tempusText = document.getElementById('tempus');
            const trackerText = document.getElementById('tracker');
            mascot.className = '';

            let mascotRoll;
            while (1) {
                mascotRoll = Math.floor(Math.random() * mascots) + 1;
                if (currentMascot != mascotRoll) break;
            }
            switch (mascotRoll) {
                // Demoman
                case 1:
                    playSound("demoman");
                    mascot.classList.add('demoman');
                    logoBackground.style.backgroundImage = "url('../src/data/thumbnails/jump_mireal2_final.jpg')";
                    logoBackground.style.backgroundSize = "cover";
                    logoBackground.style.backgroundPosition = "center";
                    break;

                // Soldier
                case 2:
                    playSound("soldier");
                    mascot.classList.add('soldier');
                    logoBackground.style.backgroundImage = "url('../src/data/thumbnails/jump_ionizer_tpn4.jpg')";
                    logoBackground.style.backgroundSize = "cover";
                    logoBackground.style.backgroundPosition = "center";
                    break;

                // Fox
                case 3:
                    playSound("fox");
                    mascot.classList.add('fox');
                    logoBackground.style.backgroundImage = "url('../src/data/ico/fox-background.jpg')";
                    logoBackground.style.backgroundSize = "cover";
                    logoBackground.style.backgroundPosition = "center";
                    break;
                case 4:
                    playSound("half_life");
                    mascot.classList.add('half-life');
                    logoBackground.style.backgroundImage = "url('../src/data/ico/hl1office.jpg')";
                    logoBackground.style.backgroundSize = "cover";
                    logoBackground.style.backgroundPosition = "center";
                    logoBackground.style.backgroundRepeat = "no-repeat";
            }
            currentMascot = mascotRoll;
        }
        else {
            playSound("click_rare");
        }
    } else {
        mascot.style.animation = 'bounce 0.07s cubic-bezier(.17,.67,.83,.67)';
    }

    logo.style.animation = 'fast-slow-spin 6s ease-out';
});

logo.addEventListener('animationend', (event) => {
    if (event.animationName === 'fast-slow-spin') {
        logo.style.animation = 'none';
        void logo.offsetWidth; // Trigger reflow
        logo.style.animation = 'spin 15s linear infinite';
    }
});