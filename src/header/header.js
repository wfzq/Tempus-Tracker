var currentMascot = 0;

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
            const response = await fetch('src/data/splash.txt');
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

// Header (nav) menu listeners
const headerOptions = document.querySelectorAll('.header-option');
document.querySelectorAll('.header-option').forEach(option => {
    // Exclude discord button
    if (option.id == 'discord-container' || option.id == 'report') { return; }

    option.addEventListener('click', () => {
        // Remove the 'header-selected' class from all options
        headerOptions.forEach(opt => opt.classList.remove('header-selected'));

        // Add the 'header-selected' class to the clicked option
        option.classList.add('header-selected');
    });
});

// Audio
async function playSound(sound) {
    let int_vol = 0.2;

    switch (sound) {
        case "click":
            const clickAudio = new Audio("src/data/sounds/medal_click.wav");
            clickAudio.volume = int_vol;
            clickAudio.play();
            break;
        case "click_rare":
            const rareClickAudio = new Audio("src/data/sounds/medal_click_rare.wav");
            rareClickAudio.volume = int_vol;
            rareClickAudio.play();
            break;
        case "soldier":
            const sa = new Audio("src/data/sounds/soldier_laughevil02.mp3");
            sa.volume = int_vol;
            sa.play();
            break;
        case "demoman":
            const da = new Audio("src/data/sounds/demoman_laughevil02.mp3");
            da.volume = int_vol;
            da.play();
            break;
        case "fox":
            const fa = new Audio("src/data/sounds/oneandonly.mp3");
            fa.volume = int_vol;
            fa.play();
            break;
        case "half_life":
            const hl = new Audio("src/data/sounds/hl1scream.mp3");
            hl.volume = int_vol;
            hl.play();
            break;
        case "me":
            const ta = new Audio("src/data/sounds/offToVisitYourMother.mp3");
            ta.volume = int_vol;
            ta.play();
            break;
        default:
            break;
    }
}

// Logo
mascot.addEventListener('mousedown', () => {
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
            tempusText.style = "color: white;";
            trackerText.style = "color: white;";
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
                    logoBackground.style.backgroundImage = `url('${githubBaseUrl}/map-backgrounds/jump_mireal2_final.jpg')`;
                    logoBackground.style.backgroundSize = "cover";
                    logoBackground.style.backgroundPosition = "center";
                    break;

                // Soldier
                case 2:
                    playSound("soldier");
                    mascot.classList.add('soldier');
                    logoBackground.style.backgroundImage = `url('${githubBaseUrl}/map-backgrounds/jump_ionizer_tpn4.jpg')`;
                    logoBackground.style.backgroundSize = "cover";
                    logoBackground.style.backgroundPosition = "center";
                    break;

                // Fox
                case 3:
                    playSound("fox");
                    mascot.classList.add('fox');
                    logoBackground.style.backgroundImage = "url('src/data/ico/fox-background.jpg')";
                    logoBackground.style.backgroundSize = "cover";
                    logoBackground.style.backgroundPosition = "center";
                    break;
                // Half life
                case 4:
                    playSound("half_life");
                    mascot.classList.add('half-life');
                    logoBackground.style.backgroundImage = "url('src/data/ico/hl1office.jpg')";
                    logoBackground.style.backgroundSize = "cover";
                    logoBackground.style.backgroundPosition = "center";
                    logoBackground.style.backgroundRepeat = "no-repeat";
                    break;
                // Me
                case 5:
                    playSound("me");
                    mascot.classList.add('me');
                    logoBackground.style.backgroundImage = "url('src/data/ico/hesfuckingcringe.png')";
                    logoBackground.style.backgroundSize = "25% 50%";
                    logoBackground.style.backgroundPosition = "left";
                    logoBackground.style.backgroundRepeat = "no-repeat";

                    tempusText.style = "color: transparent; background-clip: text; animation: rainbow 4s linear infinite;";
                    trackerText.style = "color: transparent; background-clip: text; animation: rainbow 4s linear infinite;";
                    break;
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