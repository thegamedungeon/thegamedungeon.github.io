// Main UI and Global State
const colorMap = {
    '#e74c3c': 'red', '#3498db': 'blue', '#2ecc71': 'green', '#f1c40f': 'yellow',
    '#9b59b6': 'purple', '#e67e22': 'orange', '#1abc9c': 'teal', '#ecf0f1': 'white'
};
const colors = Object.keys(colorMap);

let mode = '1p';
let p1Color = colors[0], p2Color = colors[1];
let selectingPlayer = 1;
let sandboxSelectedColor = colors[0];

// Scramble Text Animation
function initTitleAnimation() {
    const container = document.getElementById('scramble-text');
    if(!container) return;
    const phrases = [
        { text: "RAGDOLL MELON", accentIndices: [8,9,10,11,12] },
        { text: "RAD MOLLELON", accentIndices: [4,5,6,7,8,9,10,11,12] },
        { text: "DOLL ON REALM", accentIndices: [8,9,10,11,12] },
        { text: "MODERN LOLLA", accentIndices: [0,1,2,3,4,5] }
    ];
    let currentPhase = 0;

    function updateText(phase) {
        container.innerHTML = '';
        phase.text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.className = `scramble-letter ${phase.accentIndices.includes(i) ? 'accent' : ''}`;
            span.style.setProperty('--x', Math.random() * 800 - 400);
            span.style.setProperty('--y', Math.random() * 600 - 300);
            span.style.setProperty('--r', Math.random() * 720 - 360);
            span.style.opacity = '0';
            span.style.transform = `translate(calc(var(--x) * 1px), calc(var(--y) * 1px)) rotate(calc(var(--r) * 1deg)) scale(0)`;
            container.appendChild(span);
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translate(0, 0) rotate(0) scale(1)';
            }, 50 + (i * 30));
        });
    }

    updateText(phrases[0]);
    setInterval(() => {
        const letters = container.querySelectorAll('.scramble-letter');
        letters.forEach((l, i) => {
            setTimeout(() => {
                l.style.opacity = '0';
                l.style.transform = `translate(calc(var(--x) * 1px), calc(var(--y) * 1px)) rotate(calc(var(--r) * 1deg)) scale(0)`;
            }, i * 20);
        });
        setTimeout(() => {
            currentPhase = (currentPhase + 1) % phrases.length;
            updateText(phrases[currentPhase]);
        }, 1000); 
    }, 4500);
}

// Menu Functions
function showCharSelect(m) {
    mode = m; selectingPlayer = 1;
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('char-select').classList.remove('hidden');
    document.getElementById('overlay').style.display = 'flex';
    renderColorGrid();
}

function renderColorGrid() {
    const grid = document.getElementById('color-grid');
    const title = document.getElementById('select-title');
    grid.innerHTML = '';
    title.innerText = selectingPlayer === 1 ? "SELECT P1 COLOR" : "SELECT P2 COLOR";
    colors.forEach((c) => {
        const div = document.createElement('div');
        div.className = 'color-square';
        div.style.backgroundColor = c;
        if (selectingPlayer === 2 && c === p1Color) div.classList.add('disabled');
        div.onclick = () => selectColor(c);
        grid.appendChild(div);
    });
}

function selectColor(c) {
    if (selectingPlayer === 1) {
        p1Color = c;
        if (mode === '1p') {
            let otherColors = colors.filter(col => col !== p1Color);
            p2Color = otherColors[Math.floor(Math.random() * otherColors.length)];
            startGame();
        } else {
            selectingPlayer = 2; renderColorGrid();
        }
    } else { p2Color = c; startGame(); }
}

function startGame() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('hud').style.display = 'flex';
    document.getElementById('game-ui').classList.remove('hidden');
    document.getElementById('sandbox-hint').classList.add('hidden');
    document.getElementById('battle-hint').classList.remove('hidden');
    document.getElementById('sandbox-controls').classList.add('hidden');
    document.getElementById('exit-sandbox').classList.add('hidden');
    initPhysics();
}

function startSandbox() {
    mode = 'sandbox';
    sandboxSelectedColor = colors[0];
    document.getElementById('overlay').style.display = 'none';
    
    const hud = document.getElementById('hud');
    hud.classList.add('hidden');
    hud.style.display = 'none';
    
    document.getElementById('game-ui').classList.remove('hidden');
    document.getElementById('sandbox-hint').classList.remove('hidden');
    document.getElementById('battle-hint').classList.add('hidden');
    document.getElementById('sandbox-controls').classList.remove('hidden');
    document.getElementById('exit-sandbox').classList.remove('hidden');
    
    renderSandboxToolbar();
    initPhysics();
}

function renderSandboxToolbar() {
    const toolbar = document.getElementById('sandbox-toolbar');
    toolbar.innerHTML = '';

    const noneSwatch = document.createElement('div');
    noneSwatch.className = `spawn-swatch none ${sandboxSelectedColor === null ? 'active' : ''}`;
    noneSwatch.title = "None (Grab Only)";
    noneSwatch.onclick = (e) => {
        e.stopPropagation();
        sandboxSelectedColor = null;
        renderSandboxToolbar();
    };
    toolbar.appendChild(noneSwatch);

    colors.forEach(c => {
        const swatch = document.createElement('div');
        swatch.className = `spawn-swatch ${c === sandboxSelectedColor ? 'active' : ''}`;
        swatch.style.backgroundColor = c;
        swatch.onclick = (e) => {
            e.stopPropagation();
            sandboxSelectedColor = (sandboxSelectedColor === c) ? null : c;
            renderSandboxToolbar();
        };
        toolbar.appendChild(swatch);
    });
}

function restartMatch() {
    document.getElementById('ko-screen').style.display = 'none';
    initPhysics();
}

function changeCharacter() {
    document.getElementById('ko-screen').style.display = 'none';
    document.getElementById('hud').style.display = 'none';
    document.getElementById('game-ui').classList.add('hidden');
    showCharSelect(mode);
}

function goToMainMenu() {
    cleanupPhysics();
    document.getElementById('ko-screen').style.display = 'none';
    document.getElementById('hud').style.display = 'none';
    document.getElementById('game-ui').classList.add('hidden');
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('char-select').classList.add('hidden');
    document.getElementById('sandbox-controls').classList.add('hidden');
    document.getElementById('exit-sandbox').classList.add('hidden');
}

window.onload = initTitleAnimation;
