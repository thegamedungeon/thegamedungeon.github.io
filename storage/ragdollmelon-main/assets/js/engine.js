// Matter.js Engine Logic
const { Engine, Render, Runner, Bodies, Composite, Constraint, Body, Events, Query, Vector } = Matter;

let engine, render, runner;
let p1, p2;
let dolls = []; 
let spawnCounter = 0;
let p1Health = 100, p2Health = 100;
let walls = [];
let isGameOver = false;
let vitalsVisible = false;

const activeHits = new Set();
const activeTouches = {}; 

const CAT_DEFAULT = 0x0001;
const CAT_P1 = 0x0002;
const CAT_P2 = 0x0004;
const CAT_WALLS = 0x0008;

const PUNCH_DMG = 10; 
const KICK_DMG = 14.3; 
const REGEN_RATE = 5 / 60; 
const SLAM_MIN_VELOCITY = 15;

function cleanupPhysics() {
    if (runner) { Runner.stop(runner); runner = null; }
    if (render) {
        Render.stop(render);
        if (render.canvas) render.canvas.remove();
        render = null;
    }
    if (engine) {
        Engine.clear(engine);
        Composite.clear(engine.world);
        engine = null;
    }
    activeHits.clear();
    Object.keys(activeTouches).forEach(id => delete activeTouches[id]);
    isGameOver = false;
    p1Health = 100; p2Health = 100;
    dolls = [];
    spawnCounter = 0;
    vitalsVisible = false;
    if (document.getElementById('vitals-menu')) document.getElementById('vitals-menu').style.display = 'none';
}

function initPhysics() {
    cleanupPhysics();
    engine = Engine.create();
    render = Render.create({
        element: document.body, engine: engine,
        options: { 
            width: window.innerWidth, 
            height: window.innerHeight, 
            wireframes: false, 
            background: 'transparent'
        }
    });

    updateWalls();
    
    if (mode !== 'sandbox') {
        p1 = createRagdoll(window.innerWidth * 0.2, window.innerHeight - 200, p1Color, 'p1', CAT_P1);
        p2 = createRagdoll(window.innerWidth * 0.8, window.innerHeight - 200, p2Color, 'p2', CAT_P2);
        dolls.push(p1, p2);
    }
    
    setupMultiTouch(render.canvas);
    
    Render.run(render);
    runner = Runner.create();
    Runner.run(runner, engine);
    
    Events.on(engine, 'beforeUpdate', updateGame);
    Events.on(engine, 'afterUpdate', renderFloatingHUD);
    Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach(pair => handleCombat(pair.bodyA, pair.bodyB));
    });
    Events.on(engine, 'collisionEnd', (event) => {
        event.pairs.forEach(pair => {
            const hitKey = pair.bodyA.id + "_" + pair.bodyB.id;
            activeHits.delete(hitKey);
        });
    });
}

function setupMultiTouch(canvas) {
    const getPos = (t) => {
        const rect = canvas.getBoundingClientRect();
        return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        Array.from(e.changedTouches).forEach(t => {
            const pos = getPos(t);
            const bodies = Composite.allBodies(engine.world).filter(b => b.label && (b.label.includes('p1') || b.label.includes('p2') || b.label.includes('sandbox') || b.label === 'brick'));
            const clicked = Query.point(bodies, pos)[0];

            if (clicked) {
                const doll = dolls.find(d => d.parts.includes(clicked));
                if (doll && doll.dead) return;

                const constraint = Constraint.create({
                    pointA: pos,
                    bodyB: clicked,
                    stiffness: 0.1,
                    length: 0,
                    render: { visible: false }
                });
                activeTouches[t.identifier] = { constraint, body: clicked };
                Composite.add(engine.world, constraint);
            } else if (mode === 'sandbox' && sandboxSelectedColor !== null) {
                if (pos.y > 100) { 
                    // Tactical Brick Check
                    if (sandboxSelectedColor === 'brick') {
                        spawnBrick(pos.x, pos.y);
                    } else {
                        const newDoll = createRagdoll(pos.x, pos.y, sandboxSelectedColor, 'sandbox', CAT_DEFAULT);
                        dolls.push(newDoll);
                    }
                }
            }
        });
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        Array.from(e.changedTouches).forEach(t => {
            const touchData = activeTouches[t.identifier];
            if (touchData) touchData.constraint.pointA = getPos(t);
        });
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        Array.from(e.changedTouches).forEach(t => {
            const touchData = activeTouches[t.identifier];
            if (touchData) {
                Composite.remove(engine.world, touchData.constraint);
                delete activeTouches[t.identifier];
            }
        });
    });
}

function updateWalls() {
    if (!engine) return;
    if (walls.length > 0) Composite.remove(engine.world, walls);
    const thickness = 200;
    const w = window.innerWidth, h = window.innerHeight;
    const wallOpts = { isStatic: true, friction: 0.5, label: 'wall', collisionFilter: { category: CAT_WALLS }, render: { visible: false } };
    const groundOpts = { isStatic: true, friction: 0.8, label: 'ground', collisionFilter: { category: CAT_WALLS }, render: { fillStyle: 'rgba(50, 50, 50, 0.4)' } };

    walls = [
        Bodies.rectangle(w / 2, h - 40, w, 80, groundOpts),
        Bodies.rectangle(w / 2, -thickness / 2, w * 2, thickness, wallOpts), 
        Bodies.rectangle(-thickness / 2, h / 2, thickness, h * 2, wallOpts), 
        Bodies.rectangle(w + thickness / 2, h / 2, thickness, h * 2, wallOpts) 
    ];
    Composite.add(engine.world, walls);
}

function createRagdoll(x, y, colorCode, label, category) {
    spawnCounter++;
    const colorName = colorMap[colorCode];
    const baseUrl = `https://thegamedungeon.github.io/storage/ragdollmelon-main/assets/png/player`;
    const opt = { friction: 0.5, collisionFilter: { category: category, mask: CAT_DEFAULT | CAT_WALLS | CAT_P1 | CAT_P2 } };
    
    const head = Bodies.circle(x, y - 45, 18, { ...opt, label: label + '_head', render: { sprite: { texture: `${baseUrl}/head/${colorName}.png`, xScale: 0.225, yScale: 0.225 } } });
    const torso = Bodies.rectangle(x, y, 30, 50, { ...opt, label: label + '_torso', render: { sprite: { texture: `${baseUrl}/body/${colorName}.png`, xScale: 0.225, yScale: 0.225 } } });
    
    const armLU = Bodies.rectangle(x - 20, y - 10, 8, 20, { ...opt, label: label + '_arm', render: { sprite: { texture: `${baseUrl}/arm/fore/universe.png`, xScale: 0.2, yScale: 0.18 } } });
    const armLL = Bodies.rectangle(x - 20, y + 10, 8, 20, { ...opt, label: label + '_arm', render: { sprite: { texture: `${baseUrl}/arm/anat/${colorName}.png`, xScale: 0.2, yScale: 0.18 } } });
    const handL = Bodies.circle(x - 20, y + 25, 8, { ...opt, label: label + '_hand', render: { sprite: { texture: `${baseUrl}/hands/${colorName}.png`, xScale: 0.11, yScale: 0.11 } } });
    const armRU = Bodies.rectangle(x + 20, y - 10, 8, 20, { ...opt, label: label + '_arm', render: { sprite: { texture: `${baseUrl}/arm/fore/universe.png`, xScale: -0.2, yScale: 0.18 } } });
    const armRL = Bodies.rectangle(x + 20, y + 10, 8, 20, { ...opt, label: label + '_arm', render: { sprite: { texture: `${baseUrl}/arm/anat/${colorName}.png`, xScale: -0.2, yScale: 0.18 } } });
    const handR = Bodies.circle(x + 20, y + 25, 8, { ...opt, label: label + '_hand', render: { sprite: { texture: `${baseUrl}/hands/${colorName}.png`, xScale: -0.11, yScale: -0.11 } } });
    const legLU = Bodies.rectangle(x - 12, y + 35, 10, 25, { ...opt, label: label + '_leg', render: { sprite: { texture: `${baseUrl}/leg/universe.png`, xScale: 0.2, yScale: 0.18 } } });
    const legLL = Bodies.rectangle(x - 12, y + 60, 10, 25, { ...opt, label: label + '_leg', render: { sprite: { texture: `${baseUrl}/leg/universe.png`, xScale: 0.2, yScale: 0.18 } } });
    const footL = Bodies.rectangle(x - 12, y + 80, 15, 10, { ...opt, label: label + '_foot', render: { sprite: { texture: `${baseUrl}/feet/universe.png`, xScale: 0.2, yScale: 0.2 } } });
    const legRU = Bodies.rectangle(x + 12, y + 35, 10, 25, { ...opt, label: label + '_leg', render: { sprite: { texture: `${baseUrl}/leg/universe.png`, xScale: -0.2, yScale: 0.18 } } });
    const legRL = Bodies.rectangle(x + 12, y + 60, 10, 25, { ...opt, label: label + '_leg', render: { sprite: { texture: `${baseUrl}/leg/universe.png`, xScale: -0.2, yScale: 0.18 } } });
    const footR = Bodies.rectangle(x + 12, y + 80, 15, 10, { ...opt, label: label + '_foot', render: { sprite: { texture: `${baseUrl}/feet/universe.png`, xScale: -0.2, yScale: 0.2 } } });
    
    const allParts = [head, torso, armLU, armLL, handL, armRU, armRL, handR, legLU, legLL, footL, legRU, legRL, footR];
    const constraints = [
        Constraint.create({ bodyA: head, bodyB: torso, pointA: {x: 0, y: 15}, pointB: {x: 0, y: -25}, stiffness: 0.9, length: 0, render: { visible: false } }),
        Constraint.create({ bodyA: torso, bodyB: armLU, pointA: {x: -15, y: -15}, pointB: {x: 0, y: -10}, stiffness: 0.5, length: 0, render: { visible: false } }),
        Constraint.create({ bodyA: armLU, bodyB: armLL, pointA: {x: 0, y: 10}, pointB: {x: 0, y: -10}, stiffness: 0.5, length: 0, render: { visible: false } }),
        Constraint.create({ bodyA: armLL, bodyB: handL, pointA: {x: 0, y: 10}, pointB: {x: 0, y: -5}, stiffness: 0.5, length: 0, render: { visible: false } }),
        Constraint.create({ bodyA: torso, bodyB: armRU, pointA: {x: 15, y: -15}, pointB: {x: 0, y: -10}, stiffness: 0.5, length: 0, render: { visible: false } }),
        Constraint.create({ bodyA: armRU, bodyB: armRL, pointA: {x: 0, y: 10}, pointB: {x: 0, y: -10}, stiffness: 0.5, length: 0, render: { visible: false } }),
        Constraint.create({ bodyA: armRL, bodyB: handR, pointA: {x: 0, y: 10}, pointB: {x: 0, y: -5}, stiffness: 0.5, length: 0, render: { visible: false } }),
        Constraint.create({ bodyA: torso, bodyB: legLU, pointA: {x: -10, y: 25}, pointB: {x: 0, y: -12}, stiffness: 0.5, length: 0, render: { visible: false } }),
        Constraint.create({ bodyA: legLU, bodyB: legLL, pointA: {x: 0, y: 12}, pointB: {x: 0, y: -12}, stiffness: 0.5, length: 0, render: { visible: false } }),
        Constraint.create({ bodyA: legLL, bodyB: footL, pointA: {x: 0, y: 12}, pointB: {x: 0, y: -5}, stiffness: 0.8, length: 0, render: { visible: false } }),
        Constraint.create({ bodyA: torso, bodyB: legRU, pointA: {x: 10, y: 25}, pointB: {x: 0, y: -12}, stiffness: 0.5, length: 0, render: { visible: false } }),
        Constraint.create({ bodyA: legRU, bodyB: legRL, pointA: {x: 0, y: 12}, pointB: {x: 0, y: -12}, stiffness: 0.5, length: 0, render: { visible: false } }),
        Constraint.create({ bodyA: legRL, bodyB: footR, pointA: {x: 0, y: 12}, pointB: {x: 0, y: -5}, stiffness: 0.8, length: 0, render: { visible: false } })
    ];
    Composite.add(engine.world, [...allParts, ...constraints]);
    return { torso, head, parts: allParts, label: label, id: Math.random(), health: 100, color: colorCode, spawnId: spawnCounter, dead: false, deathTimer: 0, flickerTimer: 0 };
}

function handleCombat(bodyA, bodyB) {
    if (isGameOver) return;
    const hitKey = bodyA.id + "_" + bodyB.id;
    if (activeHits.has(hitKey)) return;
    
    // Updated isWall to include bricks
    const isWall = bodyA.label === 'wall' || bodyB.label === 'wall' || bodyA.label === 'ground' || bodyB.label === 'ground' || bodyA.label === 'brick' || bodyB.label === 'brick';
    const part = isWall ? (bodyA.label === 'wall' || bodyA.label === 'ground' || bodyA.label === 'brick' ? bodyB : bodyA) : null;
    
    if (part && part.label && part.label.includes('torso')) {
        const doll = dolls.find(d => d.parts.includes(part));
        if (doll && !doll.dead && part.speed > SLAM_MIN_VELOCITY) {
            const slamDmg = (part.speed - SLAM_MIN_VELOCITY) * 1.5;
            doll.health = Math.max(0, doll.health - slamDmg);
            if (mode !== 'sandbox') {
                if (doll.label === 'p1') p1Health = doll.health;
                if (doll.label === 'p2') p2Health = doll.health;
                checkWin();
            }
            if (doll.health <= 0) doll.dead = true;
            showPenalty("IMPACT CRITICAL");
            activeHits.add(hitKey);
            return;
        }
    }

    const checkHit = (attackerPart, victimPart) => {
        const attackerIsLimb = attackerPart.label && (attackerPart.label.includes('hand') || attackerPart.label.includes('foot'));
        const victimIsVital = victimPart.label && (victimPart.label.includes('torso') || victimPart.label.includes('head'));
        
        if (attackerIsLimb && victimIsVital) {
            const victimDoll = dolls.find(d => d.parts.includes(victimPart));
            const attackerDoll = dolls.find(d => d.parts.includes(attackerPart));

            if (victimDoll && attackerDoll && victimDoll.id !== attackerDoll.id && !victimDoll.dead && !attackerDoll.dead) {
                const dmg = attackerPart.label.includes('hand') ? PUNCH_DMG : KICK_DMG;
                victimDoll.health = Math.max(0, victimDoll.health - dmg);
                if (mode !== 'sandbox') {
                    if (victimDoll.label === 'p1') p1Health = victimDoll.health;
                    if (victimDoll.label === 'p2') p2Health = victimDoll.health;
                    checkWin();
                }
                if (victimDoll.health <= 0) victimDoll.dead = true;
                activeHits.add(hitKey);
                return true;
            }
        }
        return false;
    };
    checkHit(bodyA, bodyB) || checkHit(bodyB, bodyA);
}

function updateGame() {
    if (isGameOver) return;
    const toRemove = [];

    dolls.forEach((doll, index) => {
        if (!doll.dead) {
            balance(doll);
            if (doll.health < 100) doll.health = Math.min(100, doll.health + REGEN_RATE);
            if (doll.label === 'p1') p1Health = doll.health;
            if (doll.label === 'p2') p2Health = doll.health;
            if (mode === '1p' && doll.label === 'p2') handleAI(doll, p1);
        } else {
            doll.deathTimer += 16.6;
            if (doll.deathTimer >= 1000) {
                doll.flickerTimer += 16.6;
                const visible = Math.floor(doll.flickerTimer / 50) % 2 === 0;
                doll.parts.forEach(p => p.render.visible = visible);
                if (doll.deathTimer >= 1500) toRemove.push(index);
            }
        }
    });

    toRemove.sort((a, b) => b - a).forEach(idx => {
        const doll = dolls[idx];
        Composite.remove(engine.world, doll.parts);
        dolls.splice(idx, 1);
    });

    updateHUD();
    if (vitalsVisible) updateVitalsMenu();
}

function renderFloatingHUD() {
    if (!render || !render.context) return;
    const ctx = render.context;
    dolls.forEach(doll => {
        if (doll.dead) return;
        const pos = doll.head.position;
        const barWidth = 40;
        const barHeight = 5;
        const yOffset = 40;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(pos.x - barWidth/2, pos.y - yOffset, barWidth, barHeight);
        const fillWidth = (doll.health / 100) * barWidth;
        ctx.fillStyle = doll.health > 50 ? '#2ecc71' : (doll.health > 25 ? '#f1c40f' : '#e74c3c');
        ctx.fillRect(pos.x - barWidth/2, pos.y - yOffset, fillWidth, barHeight);
        if (mode === 'sandbox') {
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`#${doll.spawnId}`, pos.x, pos.y - yOffset - 5);
        }
    });
}

function updateHUD() {
    const hud = document.getElementById('hud');
    if (!hud) return;
    if (mode === 'sandbox') {
        hud.classList.add('hidden');
        hud.style.display = 'none';
        return;
    } else {
        hud.classList.remove('hidden');
        hud.style.display = 'flex';
    }
    const p1Bar = document.getElementById('p1-health-bar');
    const p2Bar = document.getElementById('p2-health-bar');
    if (p1Bar) p1Bar.style.width = p1Health + '%';
    if (p2Bar) p2Bar.style.width = p2Health + '%';
}

function checkWin() {
    if (mode === 'sandbox' || isGameOver) return;
    if (p1Health <= 0 || p2Health <= 0) {
        isGameOver = true;
        const winText = document.getElementById('winner-text');
        if (winText) winText.innerText = p1Health <= 0 ? "P2 DOMINATED" : "P1 DOMINATED";
        if (document.getElementById('ko-screen')) document.getElementById('ko-screen').style.display = 'flex';
    }
}

function balance(player) {
    player.torso.torque += (0 - player.torso.angle) * 0.12;
    player.head.torque += (0 - player.head.angle) * 0.05;
}

function handleAI(ai, target) {
    if (!target || target.dead || ai.dead) return;
    const dir = target.torso.position.x - ai.torso.position.x > 0 ? 1 : -1;
    Body.applyForce(ai.torso, ai.torso.position, { x: dir * 0.003, y: 0 });
    if (Math.random() > 0.98 && ai.torso.position.y > window.innerHeight - 250) {
        Body.applyForce(ai.torso, ai.torso.position, { x: dir * 0.02, y: -0.045 });
    }
}

function toggleVitals() {
    vitalsVisible = !vitalsVisible;
    if (document.getElementById('vitals-menu')) document.getElementById('vitals-menu').style.display = vitalsVisible ? 'flex' : 'none';
}

function updateVitalsMenu() {
    const menu = document.getElementById('vitals-menu');
    if (!menu) return;
    menu.innerHTML = `<h3 class="text-xs font-bold border-b border-gray-600 mb-2 pb-1">LIVE VITALS</h3>`;
    dolls.forEach(doll => {
        const row = document.createElement('div');
        row.className = 'vital-row';
        if (doll.dead) row.style.opacity = '0.5';
        row.innerHTML = `
            <div class="vital-swatch" style="background: ${doll.color}"></div>
            <span class="w-8">#${doll.spawnId}</span>
            <div class="vital-bar-bg">
                <div class="vital-bar-fill" style="width: ${doll.health}%; background: ${doll.dead ? '#555' : (doll.health > 30 ? '#2ecc71' : '#e74c3c')}"></div>
            </div>
            <span class="w-8 text-right">${Math.ceil(doll.health)}%</span>
        `;
        menu.appendChild(row);
    });
}

function showPenalty(text) {
    const alert = document.getElementById('penalty-alert');
    if (!alert) return;
    alert.innerText = text;
    alert.style.opacity = '1'; 
    setTimeout(() => alert.style.opacity = '0', 1000);
}

window.addEventListener('resize', () => {
    if (render && render.canvas) {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight;
        updateWalls();
    }
});

// STEP 1: FOUNDATION - The Spawn Brick Function
function spawnBrick(x, y) {
    const brick = Bodies.rectangle(x, y, 60, 30, {
        mass: 15,
        friction: 0.8,
        label: 'brick',
        render: {
            fillStyle: '#e67e22' // Starting with orange color for testing
        }
    });
    Composite.add(engine.world, brick);
    return brick;
}
