/**
 * CITY DRIFTER PRO - CORE ENGINE
 * Built for The Game Dungeon (The Crib)
 * Uses Ammo.js for high-fidelity physics (Daimyan-proof)
 */

let physicsWorld, scene, camera, renderer, vehicle, carMesh;
let chassisBody, wheelMeshes = [];
const actions = { forward: 0, back: 0, left: 0, right: 0 };
const bullets = [];

// --- PROCEDURAL 3D TEXTURES ---
// We generate these on the fly so we don't need external image files
function createRoadTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Dark Asphalt
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 512, 512);
    
    // Noise/Grain for realism
    for(let i=0; i<8000; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.03})`;
        ctx.fillRect(Math.random()*512, Math.random()*512, 1, 1);
    }
    
    // Double Yellow Lines
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(245, 0, 6, 512);
    ctx.fillRect(261, 0, 6, 512);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(40, 40); // Tiling the road
    return tex;
}

function createBuildingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Concrete Base
    ctx.fillStyle = '#22222b';
    ctx.fillRect(0, 0, 256, 256);
    
    // Windows with glow
    for(let y=15; y<240; y+=35) {
        for(let x=15; x<240; x+=30) {
            const isLit = Math.random() > 0.4;
            ctx.fillStyle = isLit ? '#ffd700' : '#111';
            if(isLit) ctx.shadowBlur = 10;
            if(isLit) ctx.shadowColor = '#ffd700';
            ctx.fillRect(x, y, 18, 22);
            ctx.shadowBlur = 0;
        }
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

// --- AMMO.JS INITIALIZATION ---
Ammo().then((AmmoLib) => {
    Ammo = AmmoLib;
    init();
    animate();
});

function init() {
    document.getElementById('loading').style.display = 'none';

    // 1. Setup Physics World
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    const overlappingPairCache = new Ammo.btDbvtBroadphase();
    const solver = new Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0));

    // 2. Setup Three.js Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010103);
    scene.fog = new THREE.FogExp2(0x010103, 0.008);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 3000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    // Performance cap for iPad Pro/Air screens
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // 3. Lighting
    scene.add(new THREE.AmbientLight(0x202040, 0.6));
    const moon = new THREE.DirectionalLight(0x8888ff, 1.2);
    moon.position.set(50, 150, 50);
    moon.castShadow = true;
    moon.shadow.camera.left = -200;
    moon.shadow.camera.right = 200;
    moon.shadow.camera.top = 200;
    moon.shadow.camera.bottom = -200;
    moon.shadow.mapSize.width = 1024;
    moon.shadow.mapSize.height = 1024;
    scene.add(moon);

    // 4. The Map
    const roadTex = createRoadTexture();
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000), 
        new THREE.MeshPhongMaterial({ map: roadTex })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Physics Ground
    const groundShape = new Ammo.btBoxShape(new Ammo.btVector3(1000, 1, 1000));
    const groundTrans = new Ammo.btTransform();
    groundTrans.setIdentity();
    groundTrans.setOrigin(new Ammo.btVector3(0, -1, 0));
    const groundBody = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(0, new Ammo.btDefaultMotionState(groundTrans), groundShape, new Ammo.btVector3(0,0,0)));
    physicsWorld.addRigidBody(groundBody);

    // City Generation
    const buildTex = createBuildingTexture();
    for(let i=0; i<70; i++) {
        const h = 40 + Math.random() * 120;
        const x = (Math.random() - 0.5) * 500;
        const z = (Math.random() - 0.5) * 500;
        if (Math.abs(x) < 30 && Math.abs(z) < 30) continue; 
        
        const bGeo = new THREE.BoxGeometry(25, h, 25);
        const bMat = new THREE.MeshPhongMaterial({ map: buildTex, shininess: 10 });
        const bMesh = new THREE.Mesh(bGeo, bMat);
        bMesh.position.set(x, h/2, z);
        bMesh.castShadow = true;
        bMesh.receiveShadow = true;
        scene.add(bMesh);

        // Physics for building
        const bShape = new Ammo.btBoxShape(new Ammo.btVector3(12.5, h/2, 12.5));
        const bT = new Ammo.btTransform();
        bT.setIdentity();
        bT.setOrigin(new Ammo.btVector3(x, h/2, z));
        const bBody = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(0, new Ammo.btDefaultMotionState(bT), bShape, new Ammo.btVector3(0,0,0)));
        physicsWorld.addRigidBody(bBody);
    }

    createVehicle(new THREE.Vector3(0, 5, 0));
    setupInputs();
}

function createVehicle(pos) {
    const w = 2.2, h = 1.1, l = 4.8;
    const mass = 1600;

    // Car Body
    const geometry = new THREE.BoxGeometry(w, h, l);
    carMesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x00ff88, shininess: 100 }));
    
    // Headlight detail
    const light = new THREE.PointLight(0x00ffcc, 4, 60);
    light.position.set(0, 0, 2.5);
    carMesh.add(light);
    
    carMesh.castShadow = true;
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
        const info = vehicle.addWheel(new Ammo.btVector3(x, y, z), new Ammo.btVector3(0,-1,0), new Ammo.btVector3(-1,0,0), rest, radius, tuning, isF);
        info.set_m_suspensionStiffness(35);
        info.set_m_wheelsDampingRelaxation(2.8);
        info.set_m_wheelsDampingCompression(4.8);
        info.set_m_frictionSlip(12); // High drift potential
        const wm = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.7, 32), new THREE.MeshPhongMaterial({color: 0x080808}));
        wm.rotateZ(Math.PI/2);
        scene.add(wm);
        wheelMeshes.push(wm);
    };
    addW(true, w/2, -h/4, l/2-0.7); addW(true, -w/2, -h/4, l/2-0.7);
    addW(false, w/2, -h/4, -l/2+0.7); addW(false, -w/2, -h/4, -l/2+0.7);
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
    const localInertia = new Ammo.btVector3(0,0,0);
    shape.calculateLocalInertia(20, localInertia);
    const body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(20, new Ammo.btDefaultMotionState(transform), shape, localInertia));
    
    const vel = forward.multiplyScalar(250);
    body.setLinearVelocity(new Ammo.btVector3(vel.x, vel.y, vel.z));
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
        el.addEventListener('touchstart', e => { 
            e.preventDefault(); 
            if(act==='shoot') shoot(); else actions[act]=1; 
        });
        el.addEventListener('touchend', e => { 
            e.preventDefault(); 
            if(act!=='shoot') actions[act]=0; 
        });
    };
    touch('up', 'forward'); touch('down', 'back'); touch('left', 'left'); touch('right', 'right'); touch('shoot', 'shoot');
}

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();

    // Physics Update
    vehicle.applyEngineForce(4500 * (actions.forward - actions.back), 2);
    vehicle.applyEngineForce(4500 * (actions.forward - actions.back), 3);
    vehicle.setSteeringValue(0.45 * (actions.left - actions.right), 0);
    vehicle.setSteeringValue(0.45 * (actions.left - actions.right), 1);

    physicsWorld.stepSimulation(dt, 10);

    // Sync Graphics to Physics
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

    // Cleanup Bullets
    for(let i=bullets.length-1; i>=0; i--) {
        const b = bullets[i];
        b.body.getMotionState().getWorldTransform(trans);
        const bp = trans.getOrigin();
        b.mesh.position.set(bp.x(), bp.y(), bp.z());
        if(Date.now()-b.time > 1200) {
            scene.remove(b.mesh); physicsWorld.removeRigidBody(b.body); bullets.splice(i, 1);
        }
    }

    // Dynamic Follow Camera
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
