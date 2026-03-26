/**
 * VOID RUNNER - MULTIPLAYER ENGINE (V2)
 * Assets Path: assets/js/engine.js
 * Built for The Game Dungeon - "The Crib"
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, doc, setDoc, onSnapshot, collection, deleteDoc } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

// --- CONFIG & GLOBALS ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'void-runner-default';

let physicsWorld, scene, camera, renderer, vehicle, carMesh;
let chassisBody, wheelMeshes = [];
const actions = { forward: 0, back: 0, left: 0, right: 0 };
const bullets = [];

// Multiplayer State
let user = null;
let lobbyId = null;
let remotePlayers = {}; // { uid: { mesh: ThreeMesh, wheels: [] } }
let isHost = false;

// --- PROCEDURAL 3D TEXTURES ---
function createRoadTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 512, 512);
    for(let i=0; i<8000; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.03})`;
        ctx.fillRect(Math.random()*512, Math.random()*512, 1, 1);
    }
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(245, 0, 6, 512);
    ctx.fillRect(261, 0, 6, 512);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(40, 40);
    return tex;
}

function createBuildingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#22222b';
    ctx.fillRect(0, 0, 256, 256);
    for(let y=15; y<240; y+=35) {
        for(let x=15; x<240; x+=30) {
            const isLit = Math.random() > 0.4;
            ctx.fillStyle = isLit ? '#ffd700' : '#111';
            if(isLit) { ctx.shadowBlur = 10; ctx.shadowColor = '#ffd700'; }
            ctx.fillRect(x, y, 18, 22);
            ctx.shadowBlur = 0;
        }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

// --- LOBBY SYSTEM ---
async function startMultiplayer(mode, code = null) {
    if (!user) return;
    
    lobbyId = code || Math.random().toString(36).substring(2, 8).toUpperCase();
    isHost = !code;
    
    const statusText = document.querySelector('.loader-text');
    if(statusText) statusText.innerText = `JOINING LOBBY: ${lobbyId}`;

    // Listen for other players
    const playersRef = collection(db, 'artifacts', appId, 'public', 'data', `lobbies_${lobbyId}`);
    onSnapshot(playersRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            const id = change.doc.id;
            if (id === user.uid) return;

            if (change.type === "added") {
                createRemoteCar(id, data.color);
            }
            if (change.type === "modified") {
                updateRemoteCar(id, data);
            }
            if (change.type === "removed") {
                removeRemoteCar(id);
            }
        });
    }, (err) => console.error("Lobby Sync Fail:", err));

    initGame();
}

// --- AMMO.JS & AUTH ---
Ammo().then((AmmoLib) => {
    Ammo = AmmoLib;
    
    const initAuth = async () => {
        await signInAnonymously(auth);
    };
    initAuth();
    
    onAuthStateChanged(auth, (u) => {
        user = u;
        // In a real build, we'd trigger the UI menu here. 
        // For now, let's auto-create a lobby if none exists.
        if (user) {
            const params = new URLSearchParams(window.location.search);
            const joinCode = params.get('join');
            if(joinCode) startMultiplayer('join', joinCode);
            else startMultiplayer('create');
        }
    });
});

function initGame() {
    const loader = document.getElementById('loading');
    if (loader) loader.style.display = 'none';

    // 1. Physics
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    const overlappingPairCache = new Ammo.btDbvtBroadphase();
    const solver = new Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0));

    // 2. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);
    scene.fog = new THREE.FogExp2(0x010103, 0.008);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 3000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x202040, 0.6));
    const moon = new THREE.DirectionalLight(0x8888ff, 1.2);
    moon.position.set(50, 150, 50);
    moon.castShadow = true;
    scene.add(moon);

    // 3. Environment
    const roadTex = createRoadTexture();
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ map: roadTex }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    const groundShape = new Ammo.btBoxShape(new Ammo.btVector3(1000, 1, 1000));
    const groundTrans = new Ammo.btTransform();
    groundTrans.setIdentity();
    groundTrans.setOrigin(new Ammo.btVector3(0, -1, 0));
    physicsWorld.addRigidBody(new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(0, new Ammo.btDefaultMotionState(groundTrans), groundShape, new Ammo.btVector3(0,0,0))));

    const buildTex = createBuildingTexture();
    for(let i=0; i<70; i++) {
        const h = 40 + Math.random() * 120;
        const x = (Math.random() - 0.5) * 500;
        const z = (Math.random() - 0.5) * 500;
        if (Math.abs(x) < 30 && Math.abs(z) < 30) continue; 
        const bMesh = new THREE.Mesh(new THREE.BoxGeometry(25, h, 25), new THREE.MeshPhongMaterial({ map: buildTex }));
        bMesh.position.set(x, h/2, z);
        scene.add(bMesh);
        const bShape = new Ammo.btBoxShape(new Ammo.btVector3(12.5, h/2, 12.5));
        const bT = new Ammo.btTransform();
        bT.setIdentity();
        bT.setOrigin(new Ammo.btVector3(x, h/2, z));
        physicsWorld.addRigidBody(new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(0, new Ammo.btDefaultMotionState(bT), bShape, new Ammo.btVector3(0,0,0))));
    }

    createVehicle(new THREE.Vector3(0, 5, 0));
    setupInputs();
    animate();
}

function createVehicle(pos) {
    const w = 2.2, h = 1.1, l = 4.8;
    const mass = 1600;
    const myColor = isHost ? 0x00ff88 : 0xff00ff; // Host is green, guests are pink
    carMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, l), new THREE.MeshPhongMaterial({ color: myColor, shininess: 100 }));
    const light = new THREE.PointLight(myColor, 4, 60);
    light.position.set(0, 0, 2.5);
    carMesh.add(light);
    scene.add(carMesh);

    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    const shape = new Ammo.btBoxShape(new Ammo.btVector3(w/2, h/2, l/2));
    const localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);
    chassisBody = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(mass, new Ammo.btDefaultMotionState(transform), shape, localInertia));
    chassisBody.setActivationState(4);
    physicsWorld.addRigidBody(chassisBody);

    const tuning = new Ammo.btVehicleTuning();
    const raycaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld);
    vehicle = new Ammo.btRaycastVehicle(tuning, chassisBody, raycaster);
    vehicle.setCoordinateSystem(0, 1, 2);
    physicsWorld.addAction(vehicle);

    const radius = 0.55, rest = 0.75;
    const addW = (isF, x, y, z) => {
        vehicle.addWheel(new Ammo.btVector3(x, y, z), new Ammo.btVector3(0,-1,0), new Ammo.btVector3(-1,0,0), rest, radius, tuning, isF);
        const wm = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.7, 16), new THREE.MeshPhongMaterial({color: 0x080808}));
        wm.rotateZ(Math.PI/2);
        scene.add(wm);
        wheelMeshes.push(wm);
    };
    addW(true, w/2, -h/4, l/2-0.7); addW(true, -w/2, -h/4, l/2-0.7);
    addW(false, w/2, -h/4, -l/2+0.7); addW(false, -w/2, -h/4, -l/2+0.7);
}

// --- REMOTE PLAYERS ---
function createRemoteCar(id, color) {
    const w = 2.2, h = 1.1, l = 4.8;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, l), new THREE.MeshPhongMaterial({ color: color || 0x00ffff }));
    const wheels = [];
    for(let i=0; i<4; i++) {
        const wm = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.7, 16), new THREE.MeshPhongMaterial({color: 0x080808}));
        wm.rotateZ(Math.PI/2);
        scene.add(wm);
        wheels.push(wm);
    }
    scene.add(mesh);
    remotePlayers[id] = { mesh, wheels };
}

function updateRemoteCar(id, data) {
    const p = remotePlayers[id];
    if (!p) return;
    p.mesh.position.set(data.pos.x, data.pos.y, data.pos.z);
    p.mesh.quaternion.set(data.quat.x, data.quat.y, data.quat.z, data.quat.w);
    data.wheels.forEach((w, i) => {
        if(p.wheels[i]) {
            p.wheels[i].position.set(w.pos.x, w.pos.y, w.pos.z);
            p.wheels[i].quaternion.set(w.quat.x, w.quat.y, w.quat.z, w.quat.w);
        }
    });
}

function removeRemoteCar(id) {
    const p = remotePlayers[id];
    if (!p) return;
    scene.remove(p.mesh);
    p.wheels.forEach(w => scene.remove(w));
    delete remotePlayers[id];
}

async function syncToCloud() {
    if (!user || !lobbyId) return;
    const wheelsData = wheelMeshes.map(m => ({
        pos: { x: m.position.x, y: m.position.y, z: m.position.z },
        quat: { x: m.quaternion.x, y: m.quaternion.y, z: m.quaternion.z, w: m.quaternion.w }
    }));

    const playerRef = doc(db, 'artifacts', appId, 'public', 'data', `lobbies_${lobbyId}`, user.uid);
    await setDoc(playerRef, {
        pos: { x: carMesh.position.x, y: carMesh.position.y, z: carMesh.position.z },
        quat: { x: carMesh.quaternion.x, y: carMesh.quaternion.y, z: carMesh.quaternion.z, w: carMesh.quaternion.w },
        wheels: wheelsData,
        color: isHost ? 0x00ff88 : 0xff00ff,
        lastSeen: Date.now()
    }, { merge: true });
}

function shoot() {
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(carMesh.quaternion);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
    mesh.position.copy(carMesh.position).add(forward.clone().multiplyScalar(5));
    scene.add(mesh);
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(mesh.position.x, mesh.position.y, mesh.position.z));
    const shape = new Ammo.btSphereShape(0.5);
    const body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(20, new Ammo.btDefaultMotionState(transform), shape, new Ammo.btVector3(0,0,0)));
    body.setLinearVelocity(new Ammo.btVector3(forward.x*250, forward.y*250, forward.z*250));
    physicsWorld.addRigidBody(body);
    bullets.push({ mesh, body, time: Date.now() });
}

function setupInputs() {
    const handle = (e, val) => {
        if(e.code==='KeyW'||e.code==='ArrowUp') actions.forward=val;
        if(e.code==='KeyS'||e.code==='ArrowDown') actions.back=val;
        if(e.code==='KeyA'||e.code==='ArrowLeft') actions.left=val;
        if(e.code==='KeyD'||e.code==='ArrowRight') actions.right=val;
        if(e.code==='Space' && val) shoot();
    };
    window.addEventListener('keydown', e => handle(e, 1));
    window.addEventListener('keyup', e => handle(e, 0));
    const touch = (id, act) => {
        const el = document.getElementById(id);
        if(!el) return;
        el.addEventListener('touchstart', e => { e.preventDefault(); if(act==='shoot') shoot(); else actions[act]=1; });
        el.addEventListener('touchend', e => { e.preventDefault(); if(act!=='shoot') actions[act]=0; });
    };
    ['up','down','left','right','shoot'].forEach(id => touch(id, id==='up'?'forward':id==='down'?'back':id));
}

const clock = new THREE.Clock();
let lastSync = 0;

function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    if(!physicsWorld) return;

    vehicle.applyEngineForce(4500 * (actions.forward - actions.back), 2);
    vehicle.applyEngineForce(4500 * (actions.forward - actions.back), 3);
    vehicle.setSteeringValue(0.45 * (actions.left - actions.right), 0);
    vehicle.setSteeringValue(0.45 * (actions.left - actions.right), 1);
    physicsWorld.stepSimulation(dt, 10);

    const trans = new Ammo.btTransform();
    chassisBody.getMotionState().getWorldTransform(trans);
    const p = trans.getOrigin(), q = trans.getRotation();
    carMesh.position.set(p.x(), p.y(), p.z());
    carMesh.quaternion.set(q.x(), q.y(), q.z(), q.w());

    wheelMeshes.forEach((m, i) => {
        vehicle.updateWheelTransform(i, true);
        const wt = vehicle.getWheelTransformWS(i);
        const wp = wt.getOrigin(), wq = wt.getRotation();
        m.position.set(wp.x(), wp.y(), wp.z());
        m.quaternion.set(wq.x(), wq.y(), wq.z(), wq.w());
    });

    for(let i=bullets.length-1; i>=0; i--) {
        const b = bullets[i];
        b.body.getMotionState().getWorldTransform(trans);
        const bp = trans.getOrigin();
        b.mesh.position.set(bp.x(), bp.y(), bp.z());
        if(Date.now()-b.time > 1200) { scene.remove(b.mesh); physicsWorld.removeRigidBody(b.body); bullets.splice(i, 1); }
    }

    // Sync throttle (don't spam cloud every frame)
    if(Date.now() - lastSync > 50) {
        syncToCloud();
        lastSync = Date.now();
    }

    const camOffset = new THREE.Vector3(0, 8, -20).applyQuaternion(carMesh.quaternion);
    camera.position.lerp(carMesh.position.clone().add(camOffset), 0.15);
    camera.lookAt(carMesh.position);
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
