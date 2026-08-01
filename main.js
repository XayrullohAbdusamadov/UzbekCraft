/* ==========================================================================
   UZBEKCRAFT 3D GAME ENGINE - PROFESSIONAL LANDMARK EDITION
   ========================================================================== */

(function() {
  'use strict';

  // --- GAME CONFIGURATION ---
  const BLOCK_SIZE = 1;
  const CHUNK_HEIGHT_MAX = 150;
  const PLANET_CURVATURE = 0.0007;

  const BLOCKS = {
    AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, SAND: 4, SNOW: 5,
    WOOD: 6, LEAVES: 7, CACTUS: 8, COAL: 9, GOLD: 10, DIAMOND: 11,
    PLANKS: 12, LANTERN: 13, WATER: 14, BLUE_TILE: 15, RED_BRICK: 16,
    WHITE_MARBLE: 17, GLAZED_BLUE: 18, BEDROCK: 19, IRON: 20,
    DARK_STONE: 21, GLASS: 22, TERRACOTTA: 23, COPPER: 24,
    SWORD: 25, BOW: 26
  };

  const BLOCK_INFO = {
    [BLOCKS.GRASS]:       { name: "O't",            color: '#4caf50' },
    [BLOCKS.DIRT]:        { name: "Tuproq",          color: '#795548' },
    [BLOCKS.STONE]:       { name: "Tosh",            color: '#9e9e9e' },
    [BLOCKS.SAND]:        { name: "Qum",             color: '#fdd835' },
    [BLOCKS.SNOW]:        { name: "Qor",             color: '#eceff1' },
    [BLOCKS.WOOD]:        { name: "Yog'och",         color: '#6d4c41' },
    [BLOCKS.LEAVES]:      { name: "Barg",            color: '#388e3c' },
    [BLOCKS.CACTUS]:      { name: "Kaktus",          color: '#2e7d32' },
    [BLOCKS.COAL]:        { name: "Ko'mir",          color: '#455a64' },
    [BLOCKS.GOLD]:        { name: "Oltin",           color: '#ffd600' },
    [BLOCKS.DIAMOND]:     { name: "Olmos",           color: '#00bcd4' },
    [BLOCKS.PLANKS]:      { name: "Taxta",           color: '#a1887f' },
    [BLOCKS.LANTERN]:     { name: "Chiroq",          color: '#ff9800' },
    [BLOCKS.WATER]:       { name: "Suv",             color: '#1e88e5' },
    [BLOCKS.BLUE_TILE]:   { name: "Moviy Koshin",    color: '#29b6f6' },
    [BLOCKS.RED_BRICK]:   { name: "G'isht",         color: '#c62828' },
    [BLOCKS.WHITE_MARBLE]:{ name: "Oq Mramor",       color: '#f5f5f5' },
    [BLOCKS.GLAZED_BLUE]: { name: "Zangori Koshin",  color: '#0288d1' },
    [BLOCKS.BEDROCK]:     { name: "Bedrock",         color: '#212121' },
    [BLOCKS.IRON]:        { name: "Temir",           color: '#b0bec5' },
    [BLOCKS.DARK_STONE]:  { name: "Qora Tosh",       color: '#37474f' },
    [BLOCKS.GLASS]:       { name: "Shisha",          color: '#80deea' },
    [BLOCKS.TERRACOTTA]:  { name: "Terrakota",       color: '#bf360c' },
    [BLOCKS.COPPER]:      { name: "Mis",             color: '#ff7043' },
    [BLOCKS.SWORD]:       { name: "Qilich",          color: '#00bcd4', isWeapon: true },
    [BLOCKS.BOW]:         { name: "Kamon",           color: '#8d6e63', isWeapon: true }
  };

  // --- AUDIO SYNTHESIZER ---
  class SoundEngine {
    constructor() { this.ctx = null; this.sfxVolume = 0.8; this.musicVolume = 0.6; this.musicTimer = null; }
    init() {
      if (!this.ctx) { const A = window.AudioContext || window.webkitAudioContext; if (A) this.ctx = new A(); }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }
    playSFX(type) {
      if (!this.ctx || this.sfxVolume <= 0) return;
      const t = this.ctx.currentTime;
      const createNoiseBuffer = (duration) => {
        const size = this.ctx.sampleRate * duration;
        const buf = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < size; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        return buf;
      };

      if (type === 'dig_loop') {
        const noise = this.ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(0.05);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500 + Math.random() * 300, t);
        filter.Q.value = 2.0;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08 * this.sfxVolume, t);
        gain.gain.linearRampToValueAtTime(0.005, t + 0.05);
        noise.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
        noise.start(t);
      } else if (type === 'break') {
        const noise = this.ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(0.18);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, t);
        filter.Q.value = 1.0;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
        noiseGain.gain.linearRampToValueAtTime(0.005, t + 0.18);
        noise.connect(filter); filter.connect(noiseGain); noiseGain.connect(this.ctx.destination);
        noise.start(t);

        const osc = this.ctx.createOscillator();
        const thumpGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.14);
        thumpGain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
        thumpGain.gain.linearRampToValueAtTime(0.005, t + 0.14);
        osc.connect(thumpGain); thumpGain.connect(this.ctx.destination);
        osc.start(t); osc.stop(t + 0.14);
      } else if (type === 'place') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.type = 'triangle'; osc.frequency.setValueAtTime(90, t); osc.frequency.exponentialRampToValueAtTime(180, t + 0.08);
        gain.gain.setValueAtTime(0.4 * this.sfxVolume, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.08);
        osc.start(t); osc.stop(t + 0.08);
      } else if (type === 'jump') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(150, t); osc.frequency.exponentialRampToValueAtTime(340, t + 0.15);
        gain.gain.setValueAtTime(0.25 * this.sfxVolume, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.15);
        osc.start(t); osc.stop(t + 0.15);
      } else if (type === 'famous') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(260, t); osc.frequency.exponentialRampToValueAtTime(200, t + 0.3);
        gain.gain.setValueAtTime(0.35 * this.sfxVolume, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
        osc.start(t); osc.stop(t + 0.3);
      } else if (type === 'swing') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.type = 'triangle'; osc.frequency.setValueAtTime(300, t); osc.frequency.exponentialRampToValueAtTime(100, t + 0.12);
        gain.gain.setValueAtTime(0.2 * this.sfxVolume, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.12);
        osc.start(t); osc.stop(t + 0.12);
      } else if (type === 'hit') {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(800, t);
        osc1.frequency.exponentialRampToValueAtTime(150, t + 0.15);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1200, t);
        osc2.frequency.exponentialRampToValueAtTime(300, t + 0.12);

        gainNode.gain.setValueAtTime(0.3 * this.sfxVolume, t);
        gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

        osc1.start(t); osc1.stop(t + 0.15);
        osc2.start(t); osc2.stop(t + 0.15);
      } else if (type === 'shoot') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(600, t); osc.frequency.exponentialRampToValueAtTime(150, t + 0.1);
        gain.gain.setValueAtTime(0.18 * this.sfxVolume, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.1);
        osc.start(t); osc.stop(t + 0.1);
      } else if (type === 'kill') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, t); osc.frequency.exponentialRampToValueAtTime(50, t + 0.35);
        gain.gain.setValueAtTime(0.35 * this.sfxVolume, t); gain.gain.linearRampToValueAtTime(0.01, t + 0.35);
        osc.start(t); osc.stop(t + 0.35);
      }
    }
    startAmbientMusic() {
      // Ambient music disabled as requested
      return;
    }
  }
  const soundEngine = new SoundEngine();

  // --- HD TEXTURE ENGINE ---
  function createPixelTexture(blockId, side = 'all') {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const colors = {
      [BLOCKS.GRASS]: side === 'top' ? '#4caf50' : side === 'bottom' ? '#6d4c41' : '#388e3c',
      [BLOCKS.DIRT]: '#5d4037', [BLOCKS.STONE]: '#757575', [BLOCKS.SAND]: '#fbc02d',
      [BLOCKS.SNOW]: '#eceff1', [BLOCKS.WOOD]: side === 'top' ? '#8d6e63' : '#4e342e',
      [BLOCKS.LEAVES]: '#1b5e20', [BLOCKS.CACTUS]: '#1b5e20', [BLOCKS.COAL]: '#546e7a',
      [BLOCKS.GOLD]: '#ffd600', [BLOCKS.DIAMOND]: '#00acc1', [BLOCKS.PLANKS]: '#8d6e63',
      [BLOCKS.LANTERN]: '#ff9800', [BLOCKS.WATER]: '#0288d1', [BLOCKS.BLUE_TILE]: '#00acc1',
      [BLOCKS.RED_BRICK]: '#c62828', [BLOCKS.WHITE_MARBLE]: '#eeeeee',
      [BLOCKS.GLAZED_BLUE]: '#01579b', [BLOCKS.BEDROCK]: '#212121',
      [BLOCKS.IRON]: '#b0bec5', [BLOCKS.DARK_STONE]: '#37474f',
      [BLOCKS.GLASS]: '#80deea', [BLOCKS.TERRACOTTA]: '#bf360c', [BLOCKS.COPPER]: '#ff7043'
    };
    ctx.fillStyle = colors[blockId] || '#ffffff';
    ctx.fillRect(0, 0, 32, 32);
    for (let x = 0; x < 32; x++) {
      for (let y = 0; y < 32; y++) {
        const r = (Math.random() - 0.5) * 30;
        ctx.fillStyle = r > 0 ? `rgba(255,255,255,${r / 200})` : `rgba(0,0,0,${-r / 200})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    if (blockId === BLOCKS.BLUE_TILE || blockId === BLOCKS.GLAZED_BLUE) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, 28, 28);
      ctx.beginPath(); ctx.moveTo(16, 2); ctx.lineTo(16, 30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(2, 16); ctx.lineTo(30, 16); ctx.stroke();
    }
    if (blockId === BLOCKS.RED_BRICK) {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      for (let r = 0; r < 4; r++) {
        const off = r % 2 === 0 ? 0 : 8;
        ctx.fillRect(off, r * 8, 14, 2); ctx.fillRect(off + 16, r * 8, 14, 2);
      }
    }
    if (blockId === BLOCKS.WHITE_MARBLE) {
      ctx.strokeStyle = 'rgba(200,200,200,0.4)'; ctx.lineWidth = 0.5;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, i * 8); ctx.lineTo(32, i * 8 + 4); ctx.stroke(); }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  // --- MATERIALS CACHE ---
  const blockMaterials = {};
  function getBlockMaterials(blockId) {
    if (blockMaterials[blockId]) return blockMaterials[blockId];
    const createMat = (map) => {
      let params = { map, roughness: 0.8, metalness: 0.1 };
      if (blockId === BLOCKS.GLASS) {
        params.transparent = true; params.opacity = 0.35; params.roughness = 0.05; params.metalness = 0.2;
      } else if (blockId === BLOCKS.WATER) {
        params.transparent = true; params.opacity = 0.55; params.roughness = 0.08; params.metalness = 0.1;
      } else if (blockId === BLOCKS.GOLD || blockId === BLOCKS.DIAMOND) {
        params.roughness = 0.15; params.metalness = 0.9;
      } else if (blockId === BLOCKS.IRON || blockId === BLOCKS.COPPER) {
        params.roughness = 0.3; params.metalness = 0.8;
      } else if (blockId === BLOCKS.BLUE_TILE || blockId === BLOCKS.GLAZED_BLUE) {
        params.roughness = 0.18; params.metalness = 0.15;
      } else if (blockId === BLOCKS.WHITE_MARBLE) {
        params.roughness = 0.12; params.metalness = 0.1;
      } else if (blockId === BLOCKS.STONE || blockId === BLOCKS.DARK_STONE) {
        params.roughness = 0.7; params.metalness = 0.1;
      } else if (blockId === BLOCKS.DIRT || blockId === BLOCKS.SAND) {
        params.roughness = 0.95; params.metalness = 0.0;
      }
      const mat = new THREE.MeshStandardMaterial(params);
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uCameraPos = { value: camera.position };
        shader.vertexShader = `uniform vec3 uCameraPos;\n${shader.vertexShader}`;
        shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
          #include <project_vertex>
          vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);
          float distSq = pow(worldPos.x - uCameraPos.x, 2.0) + pow(worldPos.z - uCameraPos.z, 2.0);
          mvPosition.y -= distSq * ${PLANET_CURVATURE};
          gl_Position = projectionMatrix * mvPosition;
        `);
      };
      return mat;
    };
    if (blockId === BLOCKS.GRASS) {
      blockMaterials[blockId] = [
        createMat(createPixelTexture(BLOCKS.GRASS, 'side')), createMat(createPixelTexture(BLOCKS.GRASS, 'side')),
        createMat(createPixelTexture(BLOCKS.GRASS, 'top')), createMat(createPixelTexture(BLOCKS.DIRT)),
        createMat(createPixelTexture(BLOCKS.GRASS, 'side')), createMat(createPixelTexture(BLOCKS.GRASS, 'side'))
      ];
    } else {
      blockMaterials[blockId] = createMat(createPixelTexture(blockId));
    }
    return blockMaterials[blockId];
  }

  // --- GAME STATE ---
  let scene, camera, renderer, clock, supabase = null;
  let sunMesh, moonMesh, sunLight, ambientLight, starsParticles;
  let playerMesh, playerSkin = 'steve', fpHandGroup = null;
  let isThirdPerson = false, thirdPersonDistance = 6.0;
  let orbitYaw = 0, orbitPitch = 0;
  let activeSlotIndex = 0;
  let hotbarBlocks = [25, 26, 1, 2, 3, 6, 17, 13, 15];
  let worldData = {}, modifiedBlocks = {};
  let currentMapRadius = 250;
  let currentWorldMeta = { name: "Mening Dunyoim", seed: "Uzbekistan2026", map: "minecraft_classic" };
  let dayTime = 0.25;
  let playerPos = new THREE.Vector3(0, 105, 0);
  let playerVel = new THREE.Vector3(0, 0, 0);
  let currentQuestState = 'not_started'; // 'not_started', 'active', 'completed'
  let activeNpc = null;
  let dialogueIndex = 0;
  let yaw = 0, pitch = 0;
  let isGrounded = false, keys = {}, isPointerLocked = false;
  let highlightBox = null, raycaster = new THREE.Raycaster();
  let npcs = [], animals = [];
  let isMiningHeld = false, miningStartTime = 0, miningTargetKey = null;
  const MINING_DURATION = 1.5;
  let touchJoystick = { active: false, startX: 0, startY: 0, moveX: 0, moveY: 0 };
  let touchLook = { active: false, lastX: 0, lastY: 0 };
  let frameCount = 0;

  // --- MULTIPLAYER REALTIME VARIABLES ---
  let multiplayerChannel = null;
  const myPlayerId = 'player_' + Math.random().toString(36).substring(2, 11);
  const otherPlayers = {};
  let broadcastCounter = 0;

  function initSupabase() {
    const url = localStorage.getItem('uzbekcraft_supabase_url') || 'https://dtpyfzzdfyxeklyrtuew.supabase.co';
    const key = localStorage.getItem('uzbekcraft_supabase_key') || 'sb_publishable_ioYdiKVpVMddnYFH3bABDg_-J9EImd1';
    if (url && key && window.supabase) {
      try {
        supabase = window.supabase.createClient(url, key);
      } catch (e) {
        console.error("Supabase initialization failed:", e);
        supabase = null;
      }
    } else {
      supabase = null;
    }
  }

  function getSkinMaterials(skinName) {
    let colorHead = 0xffdbac;
    let colorBody = 0x10b981; // Steve green
    let colorLegs = 0x1a237e; // Steve blue

    if (skinName === 'temur') {
      colorBody = 0xd97706; colorLegs = 0x991b1b;
    } else if (skinName === 'navoiy') {
      colorBody = 0x0369a1; colorLegs = 0x065f46;
    } else if (skinName === 'ulugbek') {
      colorBody = 0x6d28d9; colorLegs = 0x374151;
    }

    return {
      head: new THREE.MeshStandardMaterial({ color: colorHead, roughness: 0.6 }),
      body: new THREE.MeshStandardMaterial({ color: colorBody, roughness: 0.7 }),
      legs: new THREE.MeshStandardMaterial({ color: colorLegs, roughness: 0.8 })
    };
  }

  function buildDetailedCharacterMesh(skinName) {
    const group = new THREE.Group();
    
    // Skin colors
    const mats = getSkinMaterials(skinName);
    const matBeard = new THREE.MeshLambertMaterial({ color: 0x3d2314 }); // Beard
    const matEye = new THREE.MeshLambertMaterial({ color: 0xffffff }); // White of eye
    const matPupil = new THREE.MeshLambertMaterial({ color: 0x1e88e5 }); // Blue pupils
    const matEyebrow = new THREE.MeshLambertMaterial({ color: 0x000000 }); // Eyebrows
    const matSwordHandle = new THREE.MeshLambertMaterial({ color: 0x795548 }); // Brown handle
    const matSwordBlade = new THREE.MeshLambertMaterial({ color: 0xc0c0c0 }); // Silver blade
    const matBoots = new THREE.MeshLambertMaterial({ color: 0x271a11 }); // Dark brown boots
    const matCape = new THREE.MeshLambertMaterial({ color: 0xb71c1c }); // Dark red cape

    // 1. Head (shifted up from 1.45 to 1.55)
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), mats.head);
    head.position.y = 1.55;
    group.add(head);

    // Eyes
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.02), matEye);
    eyeL.position.set(-0.15, 0.03, 0.301);
    head.add(eyeL);
    
    const pupilL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.02), matPupil);
    pupilL.position.set(-0.13, 0.03, 0.311);
    head.add(pupilL);

    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.02), matEye);
    eyeR.position.set(0.15, 0.03, 0.301);
    head.add(eyeR);

    const pupilR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.02), matPupil);
    pupilR.position.set(0.17, 0.03, 0.311);
    head.add(pupilR);

    // Eyebrows
    const browL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.02), matEyebrow);
    browL.position.set(-0.15, 0.09, 0.305);
    head.add(browL);

    const browR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.02), matEyebrow);
    browR.position.set(0.15, 0.09, 0.305);
    head.add(browR);

    // Beard
    const beard = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.08), matBeard);
    beard.position.set(0, -0.2, 0.28);
    head.add(beard);

    // Uzbek Do'ppi (Skullcap) on top of head
    const doppi = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 0.62), new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
    doppi.position.set(0, 0.31, 0);
    head.add(doppi);
    
    // Do'ppi white mosaic patterns
    const patternL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.63), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    patternL.position.set(-0.3, 0.31, 0);
    head.add(patternL);
    const patternR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.63), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    patternR.position.set(0.3, 0.31, 0);
    head.add(patternR);
    const patternF = new THREE.Mesh(new THREE.BoxGeometry(0.63, 0.04, 0.04), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    patternF.position.set(0, 0.31, 0.3);
    head.add(patternF);
    const patternB = new THREE.Mesh(new THREE.BoxGeometry(0.63, 0.04, 0.04), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    patternB.position.set(0, 0.31, -0.3);
    head.add(patternB);

    // 2. Body (shifted up from 0.85 to 0.95)
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.35), mats.body);
    body.position.y = 0.95;
    group.add(body);

    // Belt detail (shifted up from 0.6 to 0.7)
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 0.37), new THREE.MeshLambertMaterial({ color: 0x3e2723 }));
    belt.position.set(0, 0.7, 0);
    group.add(belt);

    // Scabbard on left hip (shifted up from 0.6 to 0.7)
    const scabbard = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.06), new THREE.MeshLambertMaterial({ color: 0x3e2723 }));
    scabbard.position.set(-0.32, 0.7, 0.05);
    scabbard.rotation.z = 0.4;
    group.add(scabbard);

    // Royal Cape / Yopinchiq (shifted up from 1.15 to 1.25)
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 1.25, -0.18);
    const capeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.65, 0.04), matCape);
    capeMesh.position.y = -0.325;
    capeGroup.add(capeMesh);
    group.add(capeGroup);

    // 3. Left Leg (shifted up from 0.55 to 0.65)
    const legLGroup = new THREE.Group();
    legLGroup.position.set(-0.16, 0.65, 0);
    const legLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.6, 0.3), mats.legs);
    legLMesh.position.y = -0.3;
    legLGroup.add(legLMesh);
    
    // Boot Left
    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.15, 0.32), matBoots);
    bootL.position.set(0, -0.55, 0.01);
    legLGroup.add(bootL);
    group.add(legLGroup);

    // 4. Right Leg (shifted up from 0.55 to 0.65)
    const legRGroup = new THREE.Group();
    legRGroup.position.set(0.16, 0.65, 0);
    const legRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.6, 0.3), mats.legs);
    legRMesh.position.y = -0.3;
    legRGroup.add(legRMesh);
    
    // Boot Right
    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.15, 0.32), matBoots);
    bootR.position.set(0, -0.55, 0.01);
    legRGroup.add(bootR);
    group.add(legRGroup);

    // 5. Left Arm (shifted up from 1.1 to 1.2)
    const armLGroup = new THREE.Group();
    armLGroup.position.set(-0.41, 1.2, 0);
    const armLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.22), mats.body);
    armLMesh.position.y = -0.3;
    armLGroup.add(armLMesh);
    group.add(armLGroup);

    // 6. Right Arm (shifted up from 1.1 to 1.2)
    const armRGroup = new THREE.Group();
    armRGroup.position.set(0.41, 1.2, 0);
    const armRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.22), mats.body);
    armRMesh.position.y = -0.3;
    armRGroup.add(armRMesh);

    // Weapon: Iron Sword
    const swordGroup = new THREE.Group();
    swordGroup.position.set(0, -0.4, 0.1);
    swordGroup.rotation.x = -Math.PI / 3;
    
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.15, 0.06), matSwordHandle);
    handle.position.y = -0.05;
    swordGroup.add(handle);
    
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.06), matSwordHandle);
    guard.position.y = 0.03;
    swordGroup.add(guard);
    
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.03), matSwordBlade);
    blade.position.y = 0.25;
    swordGroup.add(blade);

    armRGroup.add(swordGroup);
    group.add(armRGroup);

    // References for animation
    group.legL = legLGroup;
    group.legR = legRGroup;
    group.armL = armLGroup;
    group.armR = armRGroup;
    group.cape = capeGroup;

    return group;
  }

  function animateCharacterWalk(mesh, speed, isMoving, grounded = true, isMining = false) {
    if (!mesh) return;
    
    if (mesh.legL && mesh.legR && mesh.armL) {
      if (isMoving && grounded && speed > 0.05) {
        const swingSpeed = 12.0;
        const angle = Math.sin(performance.now() * 0.001 * swingSpeed) * 0.6;
        mesh.legL.rotation.x = angle;
        mesh.legR.rotation.x = -angle;
        mesh.armL.rotation.x = -angle;
      } else {
        mesh.legL.rotation.x = 0;
        mesh.legR.rotation.x = 0;
        mesh.armL.rotation.x = 0;
      }
    }

    if (mesh.armR) {
      if (isMining) {
        const chopSpeed = 25.0;
        mesh.armR.rotation.x = -0.5 + Math.sin(performance.now() * 0.001 * chopSpeed) * 0.8;
      } else if (isMoving && grounded && speed > 0.05) {
        const swingSpeed = 12.0;
        mesh.armR.rotation.x = Math.sin(performance.now() * 0.001 * swingSpeed) * 0.6;
      } else {
        mesh.armR.rotation.x = 0;
      }
    }

    if (mesh.cape) {
      if (isMoving && speed > 0.05) {
        const flutter = Math.sin(performance.now() * 0.015) * 0.08 + 0.25;
        mesh.cape.rotation.x = flutter;
      } else {
        mesh.cape.rotation.x = 0.05;
      }
    }
  }

  function updateOtherPlayer(id, data) {
    if (!otherPlayers[id]) {
      const group = buildDetailedCharacterMesh(data.skin || 'steve');
      scene.add(group);
      otherPlayers[id] = { mesh: group, lastUpdate: Date.now() };
    }
    const p = otherPlayers[id];
    p.mesh.position.set(data.x, data.y, data.z);
    p.mesh.rotation.y = data.yaw + Math.PI;
    p.isMining = data.isMining || false;
    p.lastUpdate = Date.now();
  }

  function joinMultiplayerRoom() {
    if (!supabase) return;
    
    if (multiplayerChannel) {
      multiplayerChannel.unsubscribe();
    }
    
    Object.keys(otherPlayers).forEach(id => {
      if (otherPlayers[id] && otherPlayers[id].mesh) {
        scene.remove(otherPlayers[id].mesh);
      }
      delete otherPlayers[id];
    });

    const roomName = 'room_' + (currentWorldMeta.name || 'default').toLowerCase().replace(/\s+/g, '_');
    multiplayerChannel = supabase.channel(roomName);
    
    let roomSynced = false;

    multiplayerChannel
      .on('broadcast', { event: 'player_move' }, (payload) => {
        const data = payload.payload;
        if (data.id === myPlayerId) return;
        updateOtherPlayer(data.id, data);
      })
      .on('broadcast', { event: 'block_change' }, (payload) => {
        const { x, y, z, blockId } = payload.payload;
        worldData[`${x},${y},${z}`] = blockId;
        modifiedBlocks[`${x},${y},${z}`] = blockId;
        renderInstancedWorld();
      })
      .on('broadcast', { event: 'query_room_map' }, (payload) => {
        if (payload.payload && payload.payload.requesterId === myPlayerId) return;
        if (multiplayerChannel) {
          multiplayerChannel.send({
            type: 'broadcast',
            event: 'sync_room_map',
            payload: {
              map: currentWorldMeta.map,
              modifiedBlocks: modifiedBlocks
            }
          });
        }
      })
      .on('broadcast', { event: 'sync_room_map' }, (payload) => {
        if (!roomSynced) {
          roomSynced = true;
          const remoteMap = payload.payload.map;
          const remoteModified = payload.payload.modifiedBlocks || {};
          
          // Merge modified blocks
          Object.assign(modifiedBlocks, remoteModified);
          
          if (remoteMap && remoteMap !== currentWorldMeta.map) {
            currentWorldMeta.map = remoteMap;
            generateWorld("Uzbekistan2026", remoteMap);
            const hudBiome = document.getElementById('hud-biome');
            if (hudBiome) hudBiome.textContent = getMapDisplayName(remoteMap) + " (Onlayn)";
            showToast(`Xarita "${getMapDisplayName(remoteMap)}" ga sinxronizatsiya qilindi!`);
          } else {
            // Apply blocks and rebuild
            Object.keys(modifiedBlocks).forEach(k => { worldData[k] = modifiedBlocks[k]; });
            rebuildWorldMesh();
          }
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          showToast("Ko'p o'yinchi xonasiga ulandingiz!");
          // Request current map state from other players
          multiplayerChannel.send({
            type: 'broadcast',
            event: 'query_room_map',
            payload: { requesterId: myPlayerId }
          });
        }
      });
  }

  // --- INITIALIZATION ---
  function init() {
    initSupabase();
    setupThree();
    setupUI();
    setupEvents();
    setupMobileControls();
    animate();
  }

  function setupThree() {
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.FogExp2(0x87ceeb, 0.0125); // Denser fog to mask edges
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.02, 500);
    camera.position.set(0, 105, 0);
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    clock = new THREE.Clock();
    ambientLight = new THREE.HemisphereLight(0xffeedd, 0x444466, 0.85);
    scene.add(ambientLight);
    sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(60, 150, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(4096, 4096);
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 300;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0002;
    scene.add(sunLight);
    scene.add(sunLight.target);
    scene.add(camera);

    fpHandGroup = new THREE.Group();
    camera.add(fpHandGroup);

    // Sun mesh
    sunMesh = new THREE.Mesh(new THREE.SphereGeometry(6, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffee58 }));
    scene.add(sunMesh);
    // Moon mesh
    moonMesh = new THREE.Mesh(new THREE.SphereGeometry(4, 12, 12), new THREE.MeshBasicMaterial({ color: 0xeceff1 }));
    scene.add(moonMesh);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starCoords = [];
    for (let i = 0; i < 1500; i++) {
      starCoords.push((Math.random() - 0.5) * 800, Math.random() * 300 + 50, (Math.random() - 0.5) * 800);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starCoords, 3));
    starsParticles = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, transparent: true, opacity: 0 }));
    scene.add(starsParticles);

    const boxGeo = new THREE.BoxGeometry(1.02, 1.02, 1.02);
    highlightBox = new THREE.LineSegments(new THREE.EdgesGeometry(boxGeo), new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }));
    highlightBox.visible = false;
    scene.add(highlightBox);
    createPlayerMesh();
  }

  function createPlayerMesh() {
    if (playerMesh) scene.remove(playerMesh);
    playerMesh = buildDetailedCharacterMesh(playerSkin);
    playerMesh.visible = false;
    scene.add(playerMesh);
    
    updateFirstPersonHandMesh();
  }

  // ==========================================================================
  // LANDMARK WORLD GENERATORS
  // ==========================================================================

  function generateWorld(seed, mapType) {
    // Clear
    Object.keys(worldData).forEach(k => delete worldData[k]);
    scene.children.filter(c => c.isVoxelMesh || c.isNpc || c.isAnimal).forEach(c => scene.remove(c));
    npcs = []; animals = [];

    currentMapRadius = (mapType === 'earth_globe' || mapType === 'chimgon' || mapType === 'great_wall') ? 140 : 110;
    const R = currentMapRadius;
    const BASE = 90;

    // --- TERRAIN ---
    if (mapType === 'earth_globe') {
      for (let x = -R; x <= R; x++) {
        for (let z = -R; z <= R; z++) {
          const n1 = Math.sin(x * 0.025) * Math.cos(z * 0.02) * 14;
          const n2 = Math.cos(x * 0.04) * Math.sin(z * 0.035) * 8;
          const isOcean = (n1 + n2) < -3;
          const isSnow = Math.abs(z) > R * 0.72;
          const topY = Math.floor(BASE + (isOcean ? -4 : n1 + n2 * 0.5));
          worldData[`${x},0,${z}`] = BLOCKS.BEDROCK;
          for (let y = topY - 4; y <= topY; y++) {
            if (y === topY) worldData[`${x},${y},${z}`] = isOcean ? BLOCKS.WATER : (isSnow ? BLOCKS.SNOW : BLOCKS.GRASS);
            else worldData[`${x},${y},${z}`] = isOcean ? BLOCKS.SAND : BLOCKS.DIRT;
          }
        }
      }
    } else {
      const isSandy = ['pyramids', 'ichan_qala', 'desert', 'colosseum'].includes(mapType);
      const isSnowy = ['chimgon', 'everest', 'snow'].includes(mapType);
      for (let x = -R; x <= R; x++) {
        for (let z = -R; z <= R; z++) {
          const nx = Math.sin(x * 0.035 + 1.2) * 6 + Math.cos(z * 0.04) * 5;
          const topY = Math.floor(BASE + nx);
          worldData[`${x},0,${z}`] = BLOCKS.BEDROCK;
          for (let y = topY - 5; y <= topY; y++) {
            if (y === topY) worldData[`${x},${y},${z}`] = isSandy ? BLOCKS.SAND : (isSnowy ? BLOCKS.SNOW : BLOCKS.GRASS);
            else worldData[`${x},${y},${z}`] = isSandy ? BLOCKS.SAND : BLOCKS.DIRT;
          }
        }
      }
    }

    // --- LANDMARKS ---
    const gY = BASE;
    if (mapType === 'registan')         buildRegistan(0, gY, 0);
    else if (mapType === 'ichan_qala')  buildIchanQala(0, gY, 0);
    else if (mapType === 'minorai_kalon') buildMinoraiKalon(0, gY, 0);
    else if (mapType === 'tashkent_tower') buildTashkentTower(0, gY, 0);
    else if (mapType === 'chimgon')     buildChimgon(R, gY);
    else if (mapType === 'pyramids')    buildPyramids(0, gY, 0);
    else if (mapType === 'eiffel')      buildEiffelTower(0, gY, 0);
    else if (mapType === 'colosseum')   buildColosseum(0, gY, 0);
    else if (mapType === 'big_ben')     buildBigBen(0, gY, 0);
    else if (mapType === 'burj_khalifa') buildBurjKhalifa(0, gY, 0);
    else if (mapType === 'great_wall')  buildGreatWall(gY);
    else if (mapType === 'taj_mahal')   buildTajMahal(0, gY, 0);

    // Trees in green maps
    if (!['pyramids', 'colosseum', 'eiffel', 'big_ben', 'ichan_qala'].includes(mapType)) {
      spawnTrees(R, gY, mapType);
    }

    // spawnFamousFigures(gY + 1); // Famous figures removed as requested
    spawnAnimals(R, gY + 1);

    Object.keys(modifiedBlocks).forEach(k => { worldData[k] = modifiedBlocks[k]; });
    renderInstancedWorld();
    playerPos.set(5, gY + 20, 30);
  }

  // Helper: set block
  function setB(x, y, z, t) { worldData[`${x},${y},${z}`] = t; }

  // Fill box
  function fillBox(x1, y1, z1, x2, y2, z2, t) {
    for (let x = x1; x <= x2; x++)
      for (let y = y1; y <= y2; y++)
        for (let z = z1; z <= z2; z++)
          setB(x, y, z, t);
  }

  // Hollow box (walls only)
  function hollowBox(x1, y1, z1, x2, y2, z2, t, fill = null) {
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {
          const wall = x === x1 || x === x2 || z === z1 || z === z2;
          const roof = y === y2;
          const floor2 = y === y1;
          if (wall || roof || floor2) setB(x, y, z, t);
          else if (fill !== null) setB(x, y, z, fill);
        }
      }
    }
  }

  // Draw vertical ring (for domes)
  function dome(cx, cy, cz, rx, ry, rz, t) {
    for (let th = 0; th <= Math.PI; th += 0.08) {
      for (let ph = 0; ph <= Math.PI * 2; ph += 0.05) {
        const x = Math.round(cx + rx * Math.sin(th) * Math.cos(ph));
        const y = Math.round(cy + ry * Math.cos(th));
        const z = Math.round(cz + rz * Math.sin(th) * Math.sin(ph));
        if (y >= cy) setB(x, y, z, t);
      }
    }
  }

  // ==========================================================================
  // UZBEKISTAN LANDMARKS
  // ==========================================================================

  function buildRegistan(vx, vy, vz) {
    // Grand plaza floor
    fillBox(vx - 25, vy, vz - 15, vx + 25, vy, vz + 15, BLOCKS.WHITE_MARBLE);

    // Left madrasa - Ulugbek
    buildMadrasa(vx - 18, vy, vz - 2);
    // Right madrasa - Sher-Dor
    buildMadrasa(vx + 18, vy, vz - 2);
    // Central madrasa - Tillya-Kori
    buildMadrasa(vx, vy, vz - 10, true);

    showToast('Samarqand Registon maydoniga xush kelibsiz!');
  }

  function buildMadrasa(vx, vy, vz, isCentral = false) {
    const w = isCentral ? 14 : 10;
    const h = isCentral ? 22 : 20;
    // Main hall
    hollowBox(vx - w, vy + 1, vz - 6, vx + w, vy + h, vz + 6, BLOCKS.BLUE_TILE, BLOCKS.WHITE_MARBLE);
    // Floor
    fillBox(vx - w, vy, vz - 6, vx + w, vy, vz + 6, BLOCKS.WHITE_MARBLE);
    // Columns
    for (let dx = -w; dx <= w; dx += w * 2) {
      for (let cy = vy + 1; cy <= vy + h; cy++) {
        setB(vx + dx, cy, vz - 6, BLOCKS.GLAZED_BLUE);
        setB(vx + dx, cy, vz + 6, BLOCKS.GLAZED_BLUE);
      }
    }
    // Main dome
    dome(vx, vy + h + 1, vz, 7, 8, 7, BLOCKS.GLAZED_BLUE);
    // Side minarets
    const mH = h + 8;
    for (let side of [-1, 1]) {
      for (let y = vy + 1; y <= vy + mH; y++) {
        const r = y < vy + mH - 3 ? 2 : 1;
        for (let dx = -r; dx <= r; dx++) {
          for (let dz = -r; dz <= r; dz++) {
            if (Math.abs(dx) === r || Math.abs(dz) === r) {
              setB(vx + side * (w - 1) + dx, y, vz - 6 + dz, y % 4 === 0 ? BLOCKS.GLAZED_BLUE : BLOCKS.BLUE_TILE);
            }
          }
        }
      }
      // Minaret cap
      dome(vx + side * (w - 1), vy + mH + 1, vz - 6, 2, 3, 2, BLOCKS.GLAZED_BLUE);
      setB(vx + side * (w - 1), vy + mH + 4, vz - 6, BLOCKS.LANTERN);
    }
    // Archway entrance
    for (let y = vy + 1; y <= vy + 6; y++) {
      setB(vx - 2, y, vz - 6, BLOCKS.AIR);
      setB(vx - 1, y, vz - 6, BLOCKS.AIR);
      setB(vx, y, vz - 6, BLOCKS.AIR);
      setB(vx + 1, y, vz - 6, BLOCKS.AIR);
      setB(vx + 2, y, vz - 6, BLOCKS.AIR);
    }
    // Arabic tilework pattern on facade
    for (let y = vy + 7; y <= vy + h; y += 3) {
      for (let dx = -w + 2; dx <= w - 2; dx += 3) {
        setB(vx + dx, y, vz - 6, BLOCKS.GLAZED_BLUE);
      }
    }
  }

  function buildMinoraiKalon(vx, vy, vz) {
    // Ground plaza
    fillBox(vx - 8, vy, vz - 8, vx + 8, vy, vz + 8, BLOCKS.WHITE_MARBLE);
    // The Kalon Minaret - famous tapering cylinder
    const totalH = 46;
    for (let y = 1; y <= totalH; y++) {
      const r = Math.max(2, Math.round(5 - y * 0.06));
      for (let dx = -r; dx <= r; dx++) {
        for (let dz = -r; dz <= r; dz++) {
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist <= r && dist > r - 1.5) {
            const band = Math.floor(y / 3) % 2;
            setB(vx + dx, vy + y, vz + dz, band === 0 ? BLOCKS.RED_BRICK : BLOCKS.GLAZED_BLUE);
          }
        }
      }
    }
    // Lantern at top
    for (let dx = -3; dx <= 3; dx++) {
      for (let dz = -3; dz <= 3; dz++) {
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d <= 3) setB(vx + dx, vy + totalH + 1, vz + dz, BLOCKS.BLUE_TILE);
      }
    }
    setB(vx, vy + totalH + 4, vz, BLOCKS.LANTERN);
    // Adjacent mosque
    hollowBox(vx + 12, vy + 1, vz - 8, vx + 26, vy + 14, vz + 8, BLOCKS.BLUE_TILE, BLOCKS.WHITE_MARBLE);
    dome(vx + 19, vy + 15, vz, 6, 7, 6, BLOCKS.GLAZED_BLUE);
  }

  function buildIchanQala(vx, vy, vz) {
    // Outer city walls
    const w = 28;
    for (let y = vy + 1; y <= vy + 10; y++) {
      for (let x = vx - w; x <= vx + w; x++) {
        setB(x, y, vz - w, BLOCKS.RED_BRICK);
        setB(x, y, vz + w, BLOCKS.RED_BRICK);
      }
      for (let z = vz - w; z <= vz + w; z++) {
        setB(vx - w, y, z, BLOCKS.RED_BRICK);
        setB(vx + w, y, z, BLOCKS.RED_BRICK);
      }
    }
    // Battlements
    for (let x = vx - w; x <= vx + w; x += 2) {
      setB(x, vy + 11, vz - w, BLOCKS.RED_BRICK);
      setB(x, vy + 11, vz + w, BLOCKS.RED_BRICK);
    }
    // Gate towers
    for (let corner of [[-w, -w], [w, -w], [-w, w], [w, w]]) {
      const [cx, cz] = corner;
      for (let y = vy + 1; y <= vy + 16; y++) {
        for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++) {
          if (Math.abs(dx) === 3 || Math.abs(dz) === 3) setB(vx + cx + dx, y, vz + cz + dz, BLOCKS.RED_BRICK);
        }
      }
      dome(vx + cx, vy + 17, vz + cz, 4, 5, 4, BLOCKS.BLUE_TILE);
    }
    // Islam Khoja minaret (tallest in Khiva)
    buildMinaret(vx + 8, vy, vz, 38);
    // Kalta Minor (unfinished blue minaret)
    buildFatMinaret(vx - 10, vy, vz + 5, 18);
    // Inner mosque
    hollowBox(vx - 8, vy + 1, vz - 10, vx + 6, vy + 12, vz - 2, BLOCKS.WHITE_MARBLE, BLOCKS.AIR);
    dome(vx - 1, vy + 13, vz - 6, 5, 6, 5, BLOCKS.GLAZED_BLUE);
    // Floor within walls
    fillBox(vx - w + 1, vy, vz - w + 1, vx + w - 1, vy, vz + w - 1, BLOCKS.SAND);
  }

  function buildMinaret(vx, vy, vz, h) {
    for (let y = 1; y <= h; y++) {
      const r = Math.max(1, Math.round(4 - y * 0.07));
      for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
        if (Math.abs(dx) === r || Math.abs(dz) === r) {
          setB(vx + dx, vy + y, vz + dz, y % 3 === 0 ? BLOCKS.GLAZED_BLUE : BLOCKS.RED_BRICK);
        }
      }
    }
    dome(vx, vy + h + 1, vz, 3, 4, 3, BLOCKS.GLAZED_BLUE);
    setB(vx, vy + h + 5, vz, BLOCKS.LANTERN);
  }

  function buildFatMinaret(vx, vy, vz, h) {
    for (let y = 1; y <= h; y++) {
      const r = Math.round(6 - y * 0.15);
      for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
        if (Math.abs(dx) === r || Math.abs(dz) === r) {
          setB(vx + dx, vy + y, vz + dz, y % 2 === 0 ? BLOCKS.BLUE_TILE : BLOCKS.GLAZED_BLUE);
        }
      }
    }
  }

  function buildTashkentTower(vx, vy, vz) {
    fillBox(vx - 8, vy, vz - 8, vx + 8, vy, vz + 8, BLOCKS.WHITE_MARBLE);
    // Base
    fillBox(vx - 4, vy + 1, vz - 4, vx + 4, vy + 8, vz + 4, BLOCKS.DARK_STONE);
    fillBox(vx - 3, vy + 2, vz - 3, vx + 3, vy + 8, vz + 3, BLOCKS.AIR);
    // Main shaft
    for (let y = vy + 9; y <= vy + 55; y++) {
      const r = y < vy + 30 ? 2 : 1;
      for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
        setB(vx + dx, y, vz + dz, BLOCKS.IRON);
      }
    }
    // Observation deck at y+38
    fillBox(vx - 6, vy + 38, vz - 6, vx + 6, vy + 42, vz + 6, BLOCKS.GLAZED_BLUE);
    fillBox(vx - 5, vy + 39, vz - 5, vx + 5, vy + 41, vz + 5, BLOCKS.AIR);
    // Second deck at y+50
    fillBox(vx - 4, vy + 50, vz - 4, vx + 4, vy + 53, vz + 4, BLOCKS.BLUE_TILE);
    fillBox(vx - 3, vy + 51, vz - 3, vx + 3, vy + 52, vz + 3, BLOCKS.AIR);
    // Antenna
    for (let y = vy + 54; y <= vy + 70; y++) setB(vx, y, vz, BLOCKS.IRON);
    setB(vx, vy + 71, vz, BLOCKS.LANTERN);
    // Legs (3 support legs, typical TV tower style)
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      for (let h = 1; h <= 18; h++) {
        const frac = 1 - h / 18;
        const lx = Math.round(vx + Math.cos(angle) * 12 * frac);
        const lz = Math.round(vz + Math.sin(angle) * 12 * frac);
        setB(lx, vy + h, lz, BLOCKS.DARK_STONE);
      }
    }
  }

  function buildChimgon(R, vy) {
    for (let x = -R; x <= R; x += 3) {
      for (let z = -R; z <= R; z += 3) {
        const dist = Math.hypot(x, z);
        if (dist > 18) {
          const h = Math.round(12 + Math.sin(x * 0.09) * 20 + Math.cos(z * 0.07) * 18);
          const peakY = vy + h;
          for (let y = vy; y <= Math.min(CHUNK_HEIGHT_MAX - 1, peakY); y++) {
            setB(x, y, z, y > vy + h - 5 ? BLOCKS.SNOW : (y > vy + h - 12 ? BLOCKS.STONE : BLOCKS.DIRT));
          }
        }
      }
    }
  }

  // ==========================================================================
  // WORLD LANDMARKS
  // ==========================================================================

  function buildEiffelTower(vx, vy, vz) {
    fillBox(vx - 20, vy, vz - 20, vx + 20, vy, vz + 20, BLOCKS.GRASS);
    // Ground footprint - 4 leg bases
    const legOff = 16;
    const legs = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    
    // LEGS - level 1 (ground to platform 1, y: vy+1 to vy+20)
    for (let h = 1; h <= 20; h++) {
      const frac = h / 20;
      const spread = Math.round(legOff * (1 - frac * 0.85));
      for (const [sx, sz] of legs) {
        const lx = vx + sx * spread;
        const lz = vz + sz * spread;
        // Thick leg = 2x2 blocks
        setB(lx, vy + h, lz, BLOCKS.IRON);
        setB(lx + sx, vy + h, lz, BLOCKS.IRON);
        setB(lx, vy + h, lz + sz, BLOCKS.IRON);
        // Cross braces every 4 levels
        if (h % 4 === 0) {
          setB(lx + sx * 2, vy + h, lz, BLOCKS.DARK_STONE);
          setB(lx, vy + h, lz + sz * 2, BLOCKS.DARK_STONE);
        }
      }
    }
    // First platform (y = vy+20 to vy+22)
    fillBox(vx - 8, vy + 20, vz - 8, vx + 8, vy + 22, vz + 8, BLOCKS.IRON);
    fillBox(vx - 7, vy + 21, vz - 7, vx + 7, vy + 21, vz + 7, BLOCKS.DARK_STONE);

    // LEGS - level 2 (platform 1 to platform 2, y: vy+22 to vy+40)
    for (let h = 23; h <= 40; h++) {
      const frac = (h - 23) / 17;
      const spread = Math.round(8 * (1 - frac * 0.7));
      for (const [sx, sz] of legs) {
        const lx = vx + sx * spread;
        const lz = vz + sz * spread;
        setB(lx, vy + h, lz, BLOCKS.IRON);
        setB(lx + sx, vy + h, lz, BLOCKS.IRON);
        if (h % 4 === 0) {
          setB(lx + sx, vy + h, lz + sz, BLOCKS.DARK_STONE);
        }
      }
    }
    // Second platform (y = vy+40 to vy+43)
    fillBox(vx - 5, vy + 40, vz - 5, vx + 5, vy + 43, vz + 5, BLOCKS.IRON);
    fillBox(vx - 4, vy + 41, vz - 4, vx + 4, vy + 41, vz + 4, BLOCKS.DARK_STONE);

    // MAIN SHAFT (y: vy+43 to vy+80)
    for (let h = 43; h <= 80; h++) {
      const r = h < 60 ? 2 : 1;
      for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
        if (Math.abs(dx) === r || Math.abs(dz) === r || (dx === 0 && dz === 0)) {
          setB(vx + dx, vy + h, vz + dz, BLOCKS.IRON);
        }
      }
    }
    // Observation top (y: vy+80 to vy+83)
    fillBox(vx - 3, vy + 80, vz - 3, vx + 3, vy + 83, vz + 3, BLOCKS.IRON);
    // Antenna (y: vy+83 to vy+95)
    for (let h = 83; h <= 95; h++) setB(vx, vy + h, vz, BLOCKS.IRON);
    setB(vx, vy + 96, vz, BLOCKS.LANTERN);
  }

  function buildPyramids(vx, vy, vz) {
    // Great Pyramid of Giza
    const size = 22;
    for (let h = 0; h < size; h++) {
      const half = size - h;
      for (let x = vx - half; x <= vx + half; x++) {
        for (let z = vz - half; z <= vz + half; z++) {
          setB(x, vy + 1 + h, z, BLOCKS.SAND);
        }
      }
    }
    // Interior hidden chamber (for exploration)
    fillBox(vx - 3, vy + 3, vz - 3, vx + 3, vy + 8, vz + 3, BLOCKS.AIR);
    // Entrance
    setB(vx, vy + 2, vz + size - 1, BLOCKS.AIR);
    setB(vx, vy + 3, vz + size - 1, BLOCKS.AIR);
    setB(vx, vy + 4, vz + size - 1, BLOCKS.AIR);
    // Sphinx outline (crude but recognizable)
    fillBox(vx + 28, vy + 1, vz - 3, vx + 42, vy + 5, vz + 3, BLOCKS.SAND);
    // Sphinx head
    fillBox(vx + 38, vy + 5, vz - 2, vx + 42, vy + 11, vz + 2, BLOCKS.SAND);
    // Second smaller pyramid
    const size2 = 14;
    for (let h = 0; h < size2; h++) {
      const half = size2 - h;
      for (let x = (vx - 35) - half; x <= (vx - 35) + half; x++) {
        for (let z = vz - half; z <= vz + half; z++) {
          setB(x, vy + 1 + h, z, BLOCKS.SAND);
        }
      }
    }
  }

  function buildColosseum(vx, vy, vz) {
    fillBox(vx - 22, vy, vz - 16, vx + 22, vy, vz + 16, BLOCKS.WHITE_MARBLE);
    // Oval outer wall
    const aR = 20, bR = 14, height = 18;
    for (let th = 0; th < Math.PI * 2; th += 0.04) {
      const ex = Math.round(vx + aR * Math.cos(th));
      const ez = Math.round(vz + bR * Math.sin(th));
      for (let y = vy + 1; y <= vy + height; y++) {
        const mat = (y - vy) % 6 < 2 ? BLOCKS.WHITE_MARBLE : BLOCKS.STONE;
        setB(ex, y, ez, mat);
        setB(ex + 1, y, ez, mat);
      }
    }
    // Arched openings
    for (let th = 0; th < Math.PI * 2; th += Math.PI / 8) {
      const ex = Math.round(vx + aR * Math.cos(th));
      const ez = Math.round(vz + bR * Math.sin(th));
      for (let y = vy + 2; y <= vy + 7; y++) {
        setB(ex, y, ez, BLOCKS.AIR);
        setB(ex + 1, y, ez, BLOCKS.AIR);
      }
    }
    // Inner arena seating tiers
    for (let r = 2; r <= 14; r += 4) {
      for (let th = 0; th < Math.PI * 2; th += 0.15) {
        const sx = Math.round(vx + r * Math.cos(th));
        const sz = Math.round(vz + (r * 0.7) * Math.sin(th));
        const tier = Math.floor(r / 4);
        setB(sx, vy + 1 + tier, sz, BLOCKS.WHITE_MARBLE);
      }
    }
    // Arena floor
    fillBox(vx - 8, vy + 1, vz - 5, vx + 8, vy + 1, vz + 5, BLOCKS.SAND);
  }

  function buildBigBen(vx, vy, vz) {
    fillBox(vx - 8, vy, vz - 8, vx + 8, vy, vz + 8, BLOCKS.STONE);
    // Base structure - Houses of Parliament wing
    hollowBox(vx - 20, vy + 1, vz - 5, vx - 6, vy + 14, vz + 5, BLOCKS.STONE, BLOCKS.AIR);
    // Small turrets along Parliament
    for (let tx = vx - 20; tx <= vx - 6; tx += 4) {
      for (let y = vy + 15; y <= vy + 17; y++) setB(tx, y, vz - 5, BLOCKS.STONE);
      for (let y = vy + 15; y <= vy + 17; y++) setB(tx, y, vz + 5, BLOCKS.STONE);
    }
    // Clock tower - Big Ben shaft
    fillBox(vx - 4, vy + 1, vz - 4, vx + 4, vy + 40, vz + 4, BLOCKS.WHITE_MARBLE);
    fillBox(vx - 3, vy + 2, vz - 3, vx + 3, vy + 39, vz + 3, BLOCKS.AIR);
    // Clock face - 4 sides (colored differently)
    for (let face of [0, 1, 2, 3]) {
      const fz = face < 2 ? (face === 0 ? vz - 4 : vz + 4) : vz;
      const fx = face < 2 ? vx : (face === 2 ? vx - 4 : vx + 4);
      // Clock ring
      for (let y = vy + 28; y <= vy + 36; y++) {
        if (face < 2) setB(fx + 2, y, fz, BLOCKS.GLAZED_BLUE);
        else setB(fx, y, fz + 2, BLOCKS.GLAZED_BLUE);
      }
    }
    // Belfry (y+40 to y+46)
    for (let y = vy + 40; y <= vy + 46; y++) {
      const r = 4;
      for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
        if (Math.abs(dx) === r || Math.abs(dz) === r) setB(vx + dx, y, vz + dz, BLOCKS.WHITE_MARBLE);
      }
    }
    // Gothic spire
    for (let y = vy + 46; y <= vy + 60; y++) {
      const spread = Math.round(4 * (1 - (y - vy - 46) / 14));
      fillBox(vx - spread, y, vz - spread, vx + spread, y, vz + spread, BLOCKS.DARK_STONE);
    }
    setB(vx, vy + 61, vz, BLOCKS.LANTERN);
  }

  function buildBurjKhalifa(vx, vy, vz) {
    fillBox(vx - 12, vy, vz - 12, vx + 12, vy, vz + 12, BLOCKS.DARK_STONE);
    // Y-shaped footprint tapering tower
    const totalH = 90;
    for (let h = 1; h <= totalH; h++) {
      const frac = 1 - (h / totalH) * 0.85;
      const baseR = Math.max(1, Math.round(8 * frac));
      // Main core
      fillBox(vx - baseR, vy + h, vz - baseR, vx + baseR, vy + h, vz + baseR, BLOCKS.GLASS);
      // Setbacks every 12 floors
      if (h % 12 === 0 && h < 70) {
        const setR = Math.max(2, baseR - 1);
        fillBox(vx - setR - 2, vy + h, vz - setR - 2, vx + setR + 2, vy + h, vz + setR + 2, BLOCKS.IRON);
      }
    }
    // Antenna
    for (let h = totalH + 1; h <= totalH + 20; h++) setB(vx, vy + h, vz, BLOCKS.IRON);
    setB(vx, vy + totalH + 21, vz, BLOCKS.LANTERN);
  }

  function buildGreatWall(vy) {
    // Great Wall snaking across the map
    const points = [
      [-60, -40], [-45, -35], [-30, -20], [-15, -8], [0, 0],
      [15, 8], [30, 20], [45, 30], [60, 40]
    ];
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, z1] = points[i], [x2, z2] = points[i + 1];
      const steps = Math.max(Math.abs(x2 - x1), Math.abs(z2 - z1));
      for (let s = 0; s <= steps; s++) {
        const x = Math.round(x1 + (x2 - x1) * s / steps);
        const z = Math.round(z1 + (z2 - z1) * s / steps);
        // Wall height 8 blocks
        for (let y = 1; y <= 8; y++) {
          setB(x, vy + y, z, BLOCKS.STONE);
          setB(x + 1, vy + y, z, BLOCKS.STONE);
          setB(x + 2, vy + y, z, BLOCKS.STONE);
        }
        // Battlements
        for (let bx = 0; bx <= 2; bx += 2) {
          setB(x + bx, vy + 9, z, BLOCKS.STONE);
          setB(x + bx, vy + 10, z, BLOCKS.STONE);
        }
        // Watchtower every 15 steps
        if (s % 15 === 0) {
          fillBox(x - 2, vy + 1, z - 2, x + 4, vy + 14, z + 4, BLOCKS.STONE);
          fillBox(x - 1, vy + 2, z - 1, x + 3, vy + 13, z + 3, BLOCKS.AIR);
        }
      }
    }
  }

  function buildTajMahal(vx, vy, vz) {
    // Reflecting pool
    fillBox(vx - 4, vy, vz + 10, vx + 4, vy, vz + 28, BLOCKS.WATER);
    // Grand platform
    fillBox(vx - 18, vy + 1, vz - 18, vx + 18, vy + 3, vz + 12, BLOCKS.WHITE_MARBLE);
    // Main mausoleum
    hollowBox(vx - 10, vy + 3, vz - 10, vx + 10, vy + 18, vz + 10, BLOCKS.WHITE_MARBLE, BLOCKS.AIR);
    // Octagonal base
    for (let dx = -10; dx <= 10; dx++) for (let dz = -10; dz <= 10; dz++) {
      if (Math.abs(dx) + Math.abs(dz) <= 14) setB(vx + dx, vy + 3, vz + dz, BLOCKS.WHITE_MARBLE);
    }
    // Central dome - the iconic one
    dome(vx, vy + 18, vz, 9, 12, 9, BLOCKS.WHITE_MARBLE);
    // 4 corner minarets
    for (const [mx, mz] of [[-16, -16], [16, -16], [-16, 16], [16, 16]]) {
      buildMinaret(vx + mx, vy + 1, vz + mz, 30);
    }
    // 4 smaller domes on corners of main platform
    for (const [dx, dz] of [[-9, -9], [9, -9], [-9, 9], [9, 9]]) {
      dome(vx + dx, vy + 18, vz + dz, 3, 4, 3, BLOCKS.WHITE_MARBLE);
    }
    // Archways
    for (const [dx, dz] of [[0, -10], [0, 10], [-10, 0], [10, 0]]) {
      for (let y = vy + 4; y <= vy + 12; y++) {
        if (dz !== 0) setB(vx, y, vz + dz, BLOCKS.AIR);
        else setB(vx + dx, y, vz, BLOCKS.AIR);
      }
    }
  }

  // ==========================================================================
  // NATURE - Trees & Animals
  // ==========================================================================

  function getGroundHeight(x, z, defaultY) {
    for (let y = CHUNK_HEIGHT_MAX; y >= 0; y--) {
      const b = worldData[`${x},${y},${z}`];
      if (b && b !== BLOCKS.AIR && b !== BLOCKS.WATER && b !== BLOCKS.LEAVES && b !== BLOCKS.WOOD) {
        return y + 1;
      }
    }
    return defaultY;
  }

  function spawnTrees(R, baseY, mapType) {
    for (let i = 0; i < 30; i++) {
      const tx = Math.round((Math.random() - 0.5) * R * 1.5);
      const tz = Math.round((Math.random() - 0.5) * R * 1.5);
      // Find ground level
      const groundY = getGroundHeight(tx, tz, baseY) - 1;
      const treeH = 4 + Math.floor(Math.random() * 4);
      for (let h = 1; h <= treeH; h++) setB(tx, groundY + h, tz, BLOCKS.WOOD);
      for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) for (let dy = -1; dy <= 2; dy++) {
        if (Math.abs(dx) + Math.abs(dz) <= 3) setB(tx + dx, groundY + treeH + dy, tz + dz, BLOCKS.LEAVES);
      }
    }
  }

  function spawnAnimals(R, baseY) {
    const animalTypes = [
      { name: "Qo'y", color: 0xf5f5f5, bodyColor: 0xeeeeee, quote: "Qo'y: Baa! Men O'zbek dashtlarida yayrab yuraman!" },
      { name: "Sigir", color: 0x4e342e, bodyColor: 0x795548, quote: "Sigir: Moo! Sog'lom hayot - mazali sut demakdir!" },
      { name: "Tulki", color: 0xe64a19, bodyColor: 0xff7043, quote: "Tulki: Chul va yaylovlarda ehtiyotkorlik bilan kezaman." },
      { name: "Bo'ri", color: 0x607d8b, bodyColor: 0x90a4ae, quote: "Bo'ri: Hovvv! O'zbekiston chul va tog'larining erkin o'g'liman!" },
      { name: "Burgut", color: 0x795548, bodyColor: 0x4e342e, quote: "Burgut: Ozod osmonlarda baland parvoz etaman!" },
      { name: "Tuya", color: 0xd7ccc8, bodyColor: 0xffe0b2, quote: "Tuya: Qizilqum sahrolarida suvsiz kunlab yura olaman!" },
      { name: "Ot", color: 0x5d4037, bodyColor: 0x8d6e63, quote: "Ot: Qorabayir tulporiman, milliy merosimiz faxriman!" },
      { name: "Eshak", color: 0x9e9e9e, bodyColor: 0xbdbdbd, quote: "Eshak: Ih-oh! Mehnatkashlikda menga teng keladigani yo'q!" },
      { name: "Tovuq", color: 0xffffff, bodyColor: 0xffffff, quote: "Tovuq: Qoq-qoq! Tong otganda hammadan avval uyg'onaman!" },
      { name: "Qoplon", color: 0xc0ca33, bodyColor: 0xe8f5e9, quote: "Ilbirs: Chimgon tog'larining qor qoploniman, meni asrang!" }
    ];
    // Spawn more animals spread out properly
    for (let i = 0; i < 40; i++) {
      const aType = animalTypes[i % animalTypes.length];
      const ax = Math.round((Math.random() - 0.5) * R * 1.7);
      const az = Math.round((Math.random() - 0.5) * R * 1.7);
      const actualY = getGroundHeight(ax, az, baseY);
      spawnAnimal(ax, actualY, az, aType);
    }
  }

  function buildAnimalMesh(aType) {
    const group = new THREE.Group();
    group.legs = [];
    const matHead = new THREE.MeshLambertMaterial({ color: aType.color });
    const matBody = new THREE.MeshLambertMaterial({ color: aType.bodyColor });

    if (aType.name === "Tuya") {
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.55), matBody);
      body.position.set(0, 0.6, 0);
      const hump1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, 0.35), matBody);
      hump1.position.set(-0.22, 0.95, 0);
      const hump2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, 0.35), matBody);
      hump2.position.set(0.22, 0.95, 0);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.7, 0.25), matBody);
      neck.position.set(0.48, 0.95, 0);
      neck.rotation.z = -0.3;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.25, 0.25), matHead);
      head.position.set(0.65, 1.35, 0);
      group.add(body, hump1, hump2, neck, head);
      
      const legMat = new THREE.MeshLambertMaterial({ color: aType.color });
      for (const [lx, lz] of [[-0.35, -0.18], [0.35, -0.18], [-0.35, 0.18], [0.35, 0.18]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.6, 0.16), legMat);
        leg.position.set(lx, 0.3, lz);
        group.add(leg);
        group.legs.push(leg);
      }
    } 
    else if (aType.name === "Ot") {
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.6, 0.45), matBody);
      body.position.set(0, 0.65, 0);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.25), matBody);
      neck.position.set(0.45, 1.05, 0);
      neck.rotation.z = -0.4;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.3, 0.25), matHead);
      head.position.set(0.55, 1.35, 0);
      const mane = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.22), new THREE.MeshLambertMaterial({ color: 0x111111 }));
      mane.position.set(0.3, 1.1, 0);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, 0.12), new THREE.MeshLambertMaterial({ color: 0x111111 }));
      tail.position.set(-0.6, 0.6, 0);
      tail.rotation.z = 0.2;
      group.add(body, neck, head, mane, tail);

      const legMat = new THREE.MeshLambertMaterial({ color: aType.color });
      for (const [lx, lz] of [[-0.4, -0.16], [0.4, -0.16], [-0.4, 0.16], [0.4, 0.16]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.65, 0.16), legMat);
        leg.position.set(lx, 0.325, lz);
        group.add(leg);
        group.legs.push(leg);
      }
    } 
    else if (aType.name === "Eshak") {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.52, 0.42), matBody);
      body.position.set(0, 0.55, 0);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.2), matBody);
      neck.position.set(0.35, 0.85, 0);
      neck.rotation.z = -0.3;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.22), matHead);
      head.position.set(0.45, 1.05, 0);
      const earL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.08), new THREE.MeshLambertMaterial({ color: 0x424242 }));
      earL.position.set(0.4, 1.25, -0.06);
      earL.rotation.z = -0.2;
      const earR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.08), new THREE.MeshLambertMaterial({ color: 0x424242 }));
      earR.position.set(0.4, 1.25, 0.06);
      earR.rotation.z = -0.2;
      group.add(body, neck, head, earL, earR);

      const legMat = new THREE.MeshLambertMaterial({ color: aType.color });
      for (const [lx, lz] of [[-0.3, -0.14], [0.3, -0.14], [-0.3, 0.14], [0.3, 0.14]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.14), legMat);
        leg.position.set(lx, 0.275, lz);
        group.add(leg);
        group.legs.push(leg);
      }
    }
    else if (aType.name === "Tovuq") {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.3), matBody);
      body.position.set(0, 0.35, 0);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.25, 0.2), matHead);
      head.position.set(0.18, 0.6, 0);
      const beak = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.08), new THREE.MeshLambertMaterial({ color: 0xff9800 }));
      beak.position.set(0.32, 0.6, 0);
      const comb = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.08), new THREE.MeshLambertMaterial({ color: 0xe53935 }));
      comb.position.set(0.18, 0.75, 0);
      group.add(body, head, beak, comb);

      const legMat = new THREE.MeshLambertMaterial({ color: 0xff9800 });
      const legL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.06), legMat);
      legL.position.set(-0.08, 0.1, -0.06);
      const legR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.06), legMat);
      legR.position.set(-0.08, 0.1, 0.06);
      group.add(legL, legR);
      group.legs.push(legL, legR);
    }
    else if (aType.name === "Qoplon") {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.45), matBody);
      body.position.set(0, 0.45, 0);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 0.4), matHead);
      head.position.set(0.55, 0.7, 0);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.7), matBody);
      tail.position.set(-0.55, 0.5, 0.4);
      tail.rotation.y = 0.5;
      group.add(body, head, tail);

      const legMat = new THREE.MeshLambertMaterial({ color: aType.color });
      for (const [lx, lz] of [[-0.3, -0.15], [0.3, -0.15], [-0.3, 0.15], [0.3, 0.15]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.45, 0.16), legMat);
        leg.position.set(lx, 0.225, lz);
        group.add(leg);
        group.legs.push(leg);
      }
    }
    else {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.5), matBody);
      body.position.set(0, 0.5, 0);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.45), matHead);
      head.position.set(0.5, 0.85, 0);
      group.add(body, head);

      const legMat = new THREE.MeshLambertMaterial({ color: aType.color });
      for (const [lx, lz] of [[-0.25, -0.15], [0.25, -0.15], [-0.25, 0.15], [0.25, 0.15]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.4, 0.18), legMat);
        leg.position.set(lx, 0.2, lz);
        group.add(leg);
        group.legs.push(leg);
      }
    }
    return group;
  }

  function spawnAnimal(x, y, z, aType) {
    const group = buildAnimalMesh(aType);
    group.isAnimal = true;
    group.animalName = aType.name;
    group.quote = aType.quote;
    group.wanderTimer = Math.random() * 5;
    group.wanderDir = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
    group.position.set(x, y, z);
    scene.add(group);
    npcs.push(group);
    animals.push(group);
  }

  // ==========================================================================
  // FAMOUS FIGURES (NPCs)
  // ==========================================================================

  function buildHistoricNpcMesh(f, matSkin, matBody, matHat) {
    const group = new THREE.Group();
    
    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), matSkin);
    head.position.y = 1.55;
    group.add(head);

    // Beard/Mustache (for male figures)
    if (f.name !== "Bibi-Xonim") {
      const beardColor = (f.name === "Ibn Sino") ? 0xeeeeee : 0x3e2723;
      const beardMat = new THREE.MeshLambertMaterial({ color: beardColor });
      const beard = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.15), beardMat);
      beard.position.set(0, 1.38, 0.22);
      group.add(beard);
    } else {
      // Bibi-Xonim hair
      const hairMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
      const hairL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.25), hairMat);
      hairL.position.set(-0.3, 1.3, 0.05);
      const hairR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.25), hairMat);
      hairR.position.set(0.3, 1.3, 0.05);
      group.add(hairL, hairR);
    }

    // Hat / Turban
    if (f.name === "Amir Temur") {
      // Golden Crown
      const crownBase = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.15, 0.65), matHat);
      crownBase.position.y = 1.88;
      const crownPeak = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.3, 4), matHat);
      crownPeak.position.y = 2.1;
      crownPeak.rotation.y = Math.PI / 4;
      group.add(crownBase, crownPeak);
    } else {
      // Turban/Salla
      const turban = new THREE.Mesh(new THREE.SphereGeometry(0.36, 8, 8), matHat);
      turban.position.set(0, 1.9, 0);
      turban.scale.set(1.1, 0.8, 1.1);
      group.add(turban);
    }

    // Body (traditional robe)
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.4), matBody);
    body.position.y = 0.9;
    group.add(body);

    // Chapan shoulders (extra blocks for 3D robe look)
    const shoulderMat = new THREE.MeshLambertMaterial({ color: f.hat }); // trim color
    const shL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.2, 0.45), shoulderMat);
    shL.position.set(-0.32, 1.2, 0);
    const shR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.2, 0.45), shoulderMat);
    shR.position.set(0.32, 1.2, 0);
    group.add(shL, shR);

    // Arms
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.65, 0.22), matBody);
    armL.position.set(-0.38, 0.9, 0);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.65, 0.22), matBody);
    armR.position.set(0.38, 0.9, 0);
    group.add(armL, armR);
    group.userData.armL = armL;
    group.userData.armR = armR;

    // Legs
    const legMat = new THREE.MeshLambertMaterial({ color: 0x1a237e });
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.6, 0.24), legMat);
    legL.position.set(-0.14, 0.3, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.6, 0.24), legMat);
    legR.position.set(0.14, 0.3, 0);
    group.add(legL, legR);

    // Accessories
    const accessoryMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    if (f.name === "Amir Temur") {
      // Golden Sword
      const sword = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 0.1), new THREE.MeshLambertMaterial({ color: 0xffd600 }));
      sword.position.set(0.32, 0.7, 0.25);
      sword.rotation.set(0.2, 0, -0.4);
      group.add(sword);
    } else if (f.name === "Alisher Navoiy") {
      // Scroll
      const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 6), accessoryMat);
      scroll.position.set(-0.38, 0.6, 0.15);
      scroll.rotation.x = Math.PI / 2;
      group.add(scroll);
    } else if (f.name === "Ulug'bek") {
      // Astrolabe
      const astrolabe = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), new THREE.MeshLambertMaterial({ color: 0xffd600 }));
      astrolabe.position.set(0.38, 0.6, 0.15);
      group.add(astrolabe);
    } else if (f.name === "Ibn Sino") {
      // Healing Book
      const book = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.25), new THREE.MeshLambertMaterial({ color: 0xbf360c }));
      book.position.set(-0.38, 0.6, 0.15);
      group.add(book);
    } else if (f.name === "Al-Xorazmiy") {
      // Slate
      const slate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.25), new THREE.MeshLambertMaterial({ color: 0x3e2723 }));
      slate.position.set(0.38, 0.6, 0.15);
      slate.rotation.y = 0.3;
      group.add(slate);
    }

    return group;
  }

  function spawnFamousFigures(vy) {
    const figures = [
      { x: 22,  z: 24,  name: "Amir Temur",      color: 0x0d47a1, hat: 0xffd600, quote: "Sohibqiron Amir Temur: Kuch - adolatdadir! Samarqandim - dunyoning markazi!" },
      { x: -26, z: 28,  name: "Alisher Navoiy",   color: 0x2e7d32, hat: 0xffffff, quote: "Navoiy: Tilga e'tiborsiz — elga e'tiborsiz! O'zbek tili qudratlidir!" },
      { x: 30,  z: -32, name: "Ulug'bek",         color: 0x311b92, hat: 0x00e5ff, quote: "Mirzo Ulug'bek: Men 1018 yulduzni o'lchadim! Ilm - eng buyuk kuch!" },
      { x: -34, z: -25, name: "Ibn Sino",          color: 0x00796b, hat: 0xffffff, quote: "Ibn Sino (Avitsenna): Sog'liq — eng katta boylik! Kitob - do'stim!" },
      { x: 0,   z: -38, name: "Bibi-Xonim",       color: 0xf48fb1, hat: 0xe91e63, quote: "Bibi-Xonim: Men Samarqandning bebaho masjidiman! Temurning sevgilisi!" },
      { x: 36,  z: 18,  name: "Al-Xorazmiy",      color: 0xe65100, hat: 0xffffff, quote: "Al-Xorazmiy: Algebra mening ixtiroyim! Algoritm ham mening nomimdan!" },
      { x: -38, z: -15, name: "Sherdor Yo'lbars", color: 0xff7043, hat: 0xe64a19, quote: "Registon Sherdor - Men Samarqand qalqoniman!" }
    ];
    figures.forEach(f => {
      const matSkin = new THREE.MeshLambertMaterial({ color: 0xffdbac });
      const matBody = new THREE.MeshLambertMaterial({ color: f.color });
      const matHat = new THREE.MeshLambertMaterial({ color: f.hat });

      const group = buildHistoricNpcMesh(f, matSkin, matBody, matHat);
      group.isNpc = true;
      group.npcName = f.name;
      group.quote = f.quote;
      const actualY = getGroundHeight(f.x, f.z, vy);
      group.baseY = actualY;
      group.bobOffset = Math.random() * Math.PI * 2;

      // Name tag using CSS2D sprite (simulated as a lantern above)
      const lanternGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const lanternMat = new THREE.MeshBasicMaterial({ color: f.hat });
      const lantern = new THREE.Mesh(lanternGeo, lanternMat); lantern.position.y = 2.4;
      group.add(lantern);

      group.position.set(f.x, actualY, f.z);
      scene.add(group);
      npcs.push(group);
    });
  }

  // ==========================================================================
  // RENDER WORLD
  // ==========================================================================

  function renderInstancedWorld() {
    scene.children.filter(c => c.isVoxelMesh).forEach(c => scene.remove(c));
    const grouped = {};
    Object.keys(worldData).forEach(key => {
      const bType = worldData[key];
      if (bType === BLOCKS.AIR) return;
      const [x, y, z] = key.split(',').map(Number);
      const top = worldData[`${x},${y+1},${z}`];
      const bot = worldData[`${x},${y-1},${z}`];
      const px = worldData[`${x+1},${y},${z}`];
      const nx = worldData[`${x-1},${y},${z}`];
      const pz = worldData[`${x},${y},${z+1}`];
      const nz = worldData[`${x},${y},${z-1}`];
      const fullyOccluded = top && bot && px && nx && pz && nz &&
        top !== BLOCKS.AIR && bot !== BLOCKS.AIR && px !== BLOCKS.AIR &&
        nx !== BLOCKS.AIR && pz !== BLOCKS.AIR && nz !== BLOCKS.AIR &&
        top !== BLOCKS.WATER && top !== BLOCKS.GLASS;
      if (fullyOccluded) return;
      if (!grouped[bType]) grouped[bType] = [];
      grouped[bType].push(new THREE.Vector3(x, y, z));
    });

    const boxGeo = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    const dummy = new THREE.Object3D();
    Object.keys(grouped).forEach(bTypeStr => {
      const bType = Number(bTypeStr);
      const coords = grouped[bType];
      const mat = getBlockMaterials(bType);
      const mesh = new THREE.InstancedMesh(boxGeo, mat, coords.length);
      mesh.isVoxelMesh = true;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      coords.forEach((pos, idx) => {
        dummy.position.copy(pos); dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      scene.add(mesh);
    });
  }

  // ==========================================================================
  // DAY / NIGHT CYCLE
  // ==========================================================================

  function updateDayNightCycle(delta) {
    dayTime += delta * 0.002;
    if (dayTime > 1) dayTime = 0;
    const angle = dayTime * Math.PI * 2;
    const R = 180;
    sunLight.position.set(Math.cos(angle) * R + playerPos.x, Math.sin(angle) * R + playerPos.y, playerPos.z);
    sunLight.target.position.copy(playerPos);
    sunMesh.position.copy(sunLight.position);
    moonMesh.position.set(-Math.cos(angle) * R + playerPos.x, -Math.sin(angle) * R + playerPos.y, playerPos.z);

    const isDay = sunLight.position.y > 0;
    let skyR, skyG, skyB;
    const t = dayTime;
    if (t < 0.22) {
      // Dawn
      const f = t / 0.22;
      skyR = 0x87 + f * (0xff - 0x87); skyG = 0x70 + f * (0xce - 0x70); skyB = 0x50 + f * (0xeb - 0x50);
    } else if (t < 0.5) {
      skyR = 0x87; skyG = 0xce; skyB = 0xeb;
    } else if (t < 0.6) {
      const f = (t - 0.5) / 0.1;
      skyR = 0x87 + f * (0xf0 - 0x87); skyG = 0xce - f * 0x50; skyB = 0xeb - f * 0x80;
    } else {
      const f = Math.min(1, (t - 0.6) / 0.15);
      skyR = Math.round(0x0b + (1 - f) * (0xf0 - 0x0b));
      skyG = Math.round(0x0e + (1 - f) * (0x80 - 0x0e));
      skyB = Math.round(0x14 + (1 - f) * (0x14));
    }
    const skyColor = new THREE.Color(`rgb(${Math.round(skyR)},${Math.round(skyG)},${Math.round(skyB)})`);
    scene.background = skyColor;
    scene.fog.color = skyColor;
    sunLight.intensity = isDay ? Math.max(0.1, Math.sin(angle)) * 2.0 : 0.05;
    ambientLight.intensity = isDay ? 0.8 : 0.2;
    if (starsParticles) {
      starsParticles.material.opacity = isDay ? 0 : Math.min(1, (t - 0.65) * 6);
    }
    const hours = Math.floor(dayTime * 24);
    const el_time = document.getElementById('hud-time-text');
    const el_icon = document.getElementById('hud-time-icon');
    if (el_time) el_time.textContent = `${isDay ? 'Kun' : 'Tun'} ${hours.toString().padStart(2,'0')}:00`;
    if (el_icon) el_icon.textContent = '';
  }

  // ==========================================================================
  // PLAYER CONTROLLER
  // ==========================================================================

  function checkCollision(pos) {
    const r = 0.3; // player radius
    const h = 1.8; // player height
    const minX = Math.floor(pos.x - r);
    const maxX = Math.floor(pos.x + r);
    const minY = Math.floor(pos.y);
    const maxY = Math.floor(pos.y + h);
    const minZ = Math.floor(pos.z - r);
    const maxZ = Math.floor(pos.z + r);
    
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const block = worldData[`${x},${y},${z}`];
          if (block && block !== BLOCKS.AIR && block !== BLOCKS.WATER) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function updatePlayer(delta) {
    const speed = 8.0;
    const moveDir = new THREE.Vector3();
    if (keys['KeyW']) moveDir.z -= 1;
    if (keys['KeyS']) moveDir.z += 1;
    if (keys['KeyA']) moveDir.x -= 1;
    if (keys['KeyD']) moveDir.x += 1;
    if (touchJoystick.active) { moveDir.x += touchJoystick.moveX; moveDir.z += touchJoystick.moveY; }
    moveDir.normalize();

    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

    playerVel.x = (forward.x * (-moveDir.z) + right.x * moveDir.x) * speed;
    playerVel.z = (forward.z * (-moveDir.z) + right.z * moveDir.x) * speed;
    playerVel.y -= 24.0 * delta;

    if ((keys['Space'] || keys['JumpTouch']) && isGrounded) {
      playerVel.y = 9.0;
      isGrounded = false;
      soundEngine.playSFX('jump');
    }

    // Y collision and movement
    let nextPosY = playerPos.y + playerVel.y * delta;
    const tempPos = playerPos.clone();
    tempPos.y = nextPosY;
    if (checkCollision(tempPos)) {
      if (playerVel.y < 0) {
        playerPos.y = Math.floor(nextPosY) + 1.0;
        playerVel.y = 0;
        isGrounded = true;
      } else {
        playerVel.y = 0; // Ceiling hit
      }
    } else {
      playerPos.y = nextPosY;
      isGrounded = false;
      // Safety net: if fell out of world
      if (playerPos.y < 20) {
        playerPos.set(5, 110, 30);
        playerVel.set(0, 0, 0);
      }
    }

    // X collision and movement
    const r = 0.3;
    let nextPosX = playerPos.x + playerVel.x * delta;
    tempPos.copy(playerPos);
    tempPos.x = nextPosX;
    if (!checkCollision(tempPos)) {
      playerPos.x = nextPosX;
    } else {
      if (playerVel.x > 0) {
        playerPos.x = Math.floor(nextPosX + r) - r - 0.001;
      } else if (playerVel.x < 0) {
        playerPos.x = Math.floor(nextPosX - r) + 1.0 + r + 0.001;
      }
      playerVel.x = 0;
    }

    // Z collision and movement
    let nextPosZ = playerPos.z + playerVel.z * delta;
    tempPos.copy(playerPos);
    tempPos.z = nextPosZ;
    if (!checkCollision(tempPos)) {
      playerPos.z = nextPosZ;
    } else {
      if (playerVel.z > 0) {
        playerPos.z = Math.floor(nextPosZ + r) - r - 0.001;
      } else if (playerVel.z < 0) {
        playerPos.z = Math.floor(nextPosZ - r) + 1.0 + r + 0.001;
      }
      playerVel.z = 0;
    }

    // Sync orbit angles to player angles if Ctrl is not held
    const isCtrlHeld = keys['ControlLeft'] || keys['ControlRight'] || keys['Control'];
    let activeThirdPerson = isThirdPerson;
    if (isCtrlHeld) {
      activeThirdPerson = true;
    } else {
      orbitYaw = yaw;
      orbitPitch = pitch;
    }

    if (activeThirdPerson && playerMesh) {
      playerMesh.visible = true;
      playerMesh.position.copy(playerPos);
      playerMesh.rotation.y = yaw + Math.PI;

      // Centered third-person camera directly behind the player's back
      const targetX = playerPos.x - Math.sin(orbitYaw) * Math.cos(orbitPitch) * thirdPersonDistance;
      const targetY = playerPos.y + 1.35 - Math.sin(orbitPitch) * thirdPersonDistance;
      const targetZ = playerPos.z - Math.cos(orbitYaw) * Math.cos(orbitPitch) * thirdPersonDistance;
      
      camera.position.set(targetX, targetY, targetZ);
      camera.lookAt(playerPos.x, playerPos.y + 1.15, playerPos.z);
    } else {
      if (playerMesh) playerMesh.visible = false;
      camera.position.copy(playerPos);
      camera.position.y += 1.65;
      camera.rotation.set(pitch, yaw, 0, 'YXZ');
    }

    // Animate local player walking
    const isMoving = keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD'] || touchJoystick.active;
    const currentSpeed = Math.hypot(playerVel.x, playerVel.z);
    animateCharacterWalk(playerMesh, currentSpeed, isMoving, isGrounded, isMiningHeld);

    updateTargetRaycast();
    updateMiningProgress(delta);
    animateNPCs(delta);

    const deg = Math.round(((yaw * 180 / Math.PI) % 360 + 360) % 360);
    const dirs = ['K', 'KSh', 'Sh', 'JnSh', 'J', 'JG', 'G', 'KG'];
    const el_compass = document.getElementById('compass-badge');
    const el_pos = document.getElementById('hud-pos');
    if (el_compass) el_compass.textContent = `${dirs[Math.floor((deg + 22.5) / 45) % 8]}`;
    if (el_pos) el_pos.textContent = `X:${Math.round(playerPos.x)} Y:${Math.round(playerPos.y)} Z:${Math.round(playerPos.z)}`;

    checkInteractions();

    // --- MULTIPLAYER REALTIME UPDATE ---
    if (supabase && multiplayerChannel) {
      broadcastCounter++;
      if (broadcastCounter % 4 === 0) {
        multiplayerChannel.send({
          type: 'broadcast',
          event: 'player_move',
          payload: {
            id: myPlayerId,
            x: playerPos.x,
            y: playerPos.y,
            z: playerPos.z,
            yaw: yaw,
            pitch: pitch,
            skin: playerSkin,
            isMining: isMiningHeld
          }
        });
      }
    }

    // Remove idle/disconnected other players and animate movement
    const nowMulti = Date.now();
    Object.keys(otherPlayers).forEach(id => {
      const op = otherPlayers[id];
      if (nowMulti - op.lastUpdate > 4000) {
        if (op.mesh) {
          scene.remove(op.mesh);
        }
        delete otherPlayers[id];
      } else {
        const prevPos = op.prevPos || op.mesh.position.clone();
        const dist = prevPos.distanceTo(op.mesh.position);
        const moving = dist > 0.005;
        animateCharacterWalk(op.mesh, dist / delta, moving, true, op.isMining);
        op.prevPos = op.mesh.position.clone();
      }
    });

    // Update active arrows
    for (let i = activeArrows.length - 1; i >= 0; i--) {
      const arrow = activeArrows[i];
      arrow.mesh.position.addScaledVector(arrow.velocity, delta);
      arrow.time += delta;

      let hitSomething = false;
      const bx = Math.round(arrow.mesh.position.x);
      const by = Math.round(arrow.mesh.position.y);
      const bz = Math.round(arrow.mesh.position.z);
      const targetBlock = worldData[`${bx},${by},${bz}`];
      if (targetBlock && targetBlock !== BLOCKS.AIR && targetBlock !== BLOCKS.WATER) {
        hitSomething = true;
      }

      // Check animal hit
      for (let j = animals.length - 1; j >= 0; j--) {
        const animal = animals[j];
        const dist = arrow.mesh.position.distanceTo(animal.position);
        if (dist < 1.3) {
          hitSomething = true;
          damageAnimal(animal, 1.5);
          break;
        }
      }

      if (hitSomething || arrow.time > 2.0) {
        scene.remove(arrow.mesh);
        activeArrows.splice(i, 1);
      }
    }
  }

  function animateNPCs(delta) {
    frameCount++;
    npcs.forEach(npc => {
      if (npc.isAnimal) {
        let isLooking = false;
        
        if (npc.fleeingTimer > 0) {
          npc.fleeingTimer -= delta;
          npc.position.x += npc.fleeingDir.x * delta * 5.0; // Run away faster!
          npc.position.z += npc.fleeingDir.z * delta * 5.0;
          npc.rotation.y = Math.atan2(npc.fleeingDir.x, npc.fleeingDir.z);
        } else {
          // Slow look at player if nearby
          const dx = playerPos.x - npc.position.x;
          const dz = playerPos.z - npc.position.z;
          const dist = Math.hypot(dx, dz);

          if (dist < 10) {
            isLooking = true;
            const targetYaw = Math.atan2(dx, dz);
            npc.rotation.y += (targetYaw - npc.rotation.y) * 0.08;
          }

          if (!isLooking) {
            // Animal wandering
            npc.wanderTimer -= delta;
            if (npc.wanderTimer <= 0) {
              npc.wanderDir = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
              npc.wanderTimer = 3 + Math.random() * 4;
            }
            npc.position.x += npc.wanderDir.x * delta * 1.5;
            npc.position.z += npc.wanderDir.z * delta * 1.5;
            npc.rotation.y = Math.atan2(npc.wanderDir.x, npc.wanderDir.z);
          }
        }

        // Keep within map boundaries to prevent floating in the void
        const bound = currentMapRadius - 8;
        if (Math.abs(npc.position.x) > bound || Math.abs(npc.position.z) > bound) {
          if (npc.fleeingTimer > 0) {
            npc.fleeingDir.multiplyScalar(-1);
          } else if (npc.wanderDir) {
            npc.wanderDir.multiplyScalar(-1);
          }
          npc.position.x = Math.max(-bound, Math.min(bound, npc.position.x));
          npc.position.z = Math.max(-bound, Math.min(bound, npc.position.z));
        }
        
        // Follow terrain height dynamically
        const bx = Math.round(npc.position.x);
        const bz = Math.round(npc.position.z);
        const targetY = getGroundHeight(bx, bz, npc.position.y);
        npc.position.y += (targetY - npc.position.y) * 0.15; // Smooth interpolation to walk over hills

        // Swing legs when wandering or fleeing
        if (npc.legs && npc.legs.length >= 2) {
          const isWalking = (npc.fleeingTimer > 0) || (!isLooking && npc.wanderDir && npc.wanderDir.lengthSq() > 0);
          if (isWalking) {
            const swingSpeed = npc.fleeingTimer > 0 ? 24.0 : 12.0; // Swing faster when running away!
            const angle = Math.sin(performance.now() * 0.001 * swingSpeed) * 0.5;
            npc.legs.forEach((leg, index) => {
              leg.rotation.x = (index % 2 === 0) ? angle : -angle;
            });
          } else {
            npc.legs.forEach(leg => { leg.rotation.x = 0; });
          }
        }
      } else {
        // Famous person bobbing animation
        if (npc.baseY !== undefined) {
          npc.bobOffset = (npc.bobOffset || 0) + delta * 1.5;
          npc.position.y = npc.baseY + Math.sin(npc.bobOffset) * 0.12;
        }
        // Slow look at player
        const dx = playerPos.x - npc.position.x;
        const dz = playerPos.z - npc.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 15) {
          const targetYaw = Math.atan2(dx, dz);
          npc.rotation.y += (targetYaw - npc.rotation.y) * 0.05;
        }
        // Arm wave when nearby
        if (dist < 5 && npc.userData.armL) {
          npc.userData.armL.rotation.x = Math.sin(frameCount * 0.08) * 0.5;
          npc.userData.armR.rotation.x = -Math.sin(frameCount * 0.08) * 0.5;
        }
      }
    });
  }

  const ULUGBEK_QUEST_DATA = {
    location_name: "Samarqand - Registon",
    npc_name: "Mirzo Ulug'bek",
    dialogues: [
      "Assalomu alaykum, sayyoh! Yulduzlar sirlariga to'la Samarqand zaminiga xush kelibsiz. Men hukmdor va astronom Mirzo Ulug'bekman.",
      "Men 1420-yilda qurdirgan ushbu madrasa O'rta Osiyodagi eng yirik ilm-fan maskanlaridan biri bo'lib, bu yerda astronomiya va matematika o'qitilgan.",
      "Biz Samarqand rasadxonasida 1018 ta yulduzning joylashuvini aniqlab, yulduz yili davomiyligini atigi 25 soniyalik xato bilan aniq hisoblab chiqqanmiz!",
      "Menga rasadxona asboblari uchun zarur bo'lgan Moviy Koshin (BLUE_TILE) blokini olib kela olasizmi?"
    ],
    quest_title: "Yo'qolgan Sekstant",
    task_description: "Registon minorasining eng tepasiga chiqib, rasadxona asboblari uchun zarur bo'lgan Moviy Koshin (BLUE_TILE) blokini topib keling.",
    reward_item: "Olmos va Astrolyabiya"
  };

  function updateDialogueUI() {
    const titleEl = document.getElementById('dialogue-title');
    const textEl = document.getElementById('dialogue-text');
    const nextBtn = document.getElementById('btn-dialogue-next');
    const questBtn = document.getElementById('btn-dialogue-quest');
    const closeBtn = document.getElementById('btn-dialogue-close');

    if (!activeNpc) return;

    titleEl.textContent = activeNpc.npcName;
    nextBtn.classList.add('hidden');
    questBtn.classList.add('hidden');
    closeBtn.classList.remove('hidden');

    if (activeNpc.npcName === "Ulug'bek") {
      if (currentQuestState === 'completed') {
        textEl.textContent = "Sizga katta rahmat, yosh olim! Yulduzlar yo'lingizni yoritsin.";
      } else if (currentQuestState === 'active') {
        const hasTile = hotbarBlocks.includes(BLOCKS.BLUE_TILE);
        if (hasTile) {
          textEl.textContent = "Rahmat! Moviy koshin yetib keldi. Mana sizga va'da qilingan mukofot!";
          nextBtn.textContent = "Mukofotni Olish";
          nextBtn.classList.remove('hidden');
          closeBtn.classList.add('hidden');
        } else {
          textEl.textContent = "Hali ham koshinni topmadingizmi? Uni minoradan qidirib ko'ring!";
        }
      } else {
        // 'not_started' - sequential dialogue
        const dialogues = ULUGBEK_QUEST_DATA.dialogues;
        textEl.textContent = dialogues[dialogueIndex];
        
        if (dialogueIndex < dialogues.length - 1) {
          nextBtn.textContent = "Keyingi";
          nextBtn.classList.remove('hidden');
        } else {
          // Last page: show quest accept button
          questBtn.classList.remove('hidden');
        }
      }
    } else {
      // Fallback for other NPCs
      textEl.textContent = activeNpc.quote || "Salom, do'stim!";
    }
  }

  function checkInteractions() {
    npcs.forEach(npc => {
      if (npc.isAnimal) return;

      const dist = playerPos.distanceTo(npc.position);
      if (dist < 3.0 && !npc.saidHello) {
        npc.saidHello = true;
        soundEngine.playSFX('famous');
        
        if (!activeNpc) {
          // Open Dialogue Modal for famous figures
          activeNpc = npc;
          dialogueIndex = 0;
          document.exitPointerLock();
          document.getElementById('dialogue-modal').classList.remove('hidden');
          updateDialogueUI();
        }
        setTimeout(() => { npc.saidHello = false; }, 15000);
      }
    });
  }

  // ==========================================================================
  // MINING / PLACING
  // ==========================================================================

  function updateTargetRaycast() {
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hits = raycaster.intersectObjects(scene.children.filter(c => c.isVoxelMesh));
    if (hits.length > 0 && hits[0].distance < 7.0) {
      const p = hits[0].point.clone().sub(hits[0].face.normal.clone().multiplyScalar(0.01));
      highlightBox.position.set(Math.round(p.x), Math.round(p.y), Math.round(p.z));
      highlightBox.visible = true;
    } else {
      highlightBox.visible = false;
      cancelMining();
    }
  }

  function startMining() {
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hits = raycaster.intersectObjects(scene.children.filter(c => c.isVoxelMesh));
    if (hits.length > 0 && hits[0].distance < 7.0) {
      const p = hits[0].point.clone().sub(hits[0].face.normal.clone().multiplyScalar(0.01));
      const key = `${Math.round(p.x)},${Math.round(p.y)},${Math.round(p.z)}`;
      if (worldData[key] && worldData[key] !== BLOCKS.BEDROCK) {
        isMiningHeld = true; miningStartTime = performance.now(); miningTargetKey = key;
        document.getElementById('mining-progress-container').classList.remove('hidden');
      } else if (worldData[key] === BLOCKS.BEDROCK) {
        showToast("Bedrock qatlamini buzib bo'lmaydi!");
      }
    }
  }

  function updateMiningProgress(delta) {
    if (!isMiningHeld || !miningTargetKey) return;
    const elapsed = (performance.now() - miningStartTime) / 1000;
    const pct = Math.min(100, Math.floor((elapsed / MINING_DURATION) * 100));
    if (Math.random() < 0.2) soundEngine.playSFX('dig_loop');
    const label = document.getElementById('mining-progress-label');
    const fill = document.getElementById('mining-progress-fill');
    if (label) label.textContent = `Buzilmoqda: ${pct}%`;
    if (fill) fill.style.width = `${pct}%`;
    if (elapsed >= MINING_DURATION) {
      worldData[miningTargetKey] = BLOCKS.AIR;
      modifiedBlocks[miningTargetKey] = BLOCKS.AIR;
      soundEngine.playSFX('break');

      if (supabase && multiplayerChannel) {
        const coords = miningTargetKey.split(',');
        multiplayerChannel.send({
          type: 'broadcast',
          event: 'block_change',
          payload: { x: parseInt(coords[0]), y: parseInt(coords[1]), z: parseInt(coords[2]), blockId: BLOCKS.AIR }
        });
      }

      rebuildWorldMesh();
      cancelMining();
    }
  }

  function cancelMining() {
    isMiningHeld = false; miningTargetKey = null;
    const bar = document.getElementById('mining-progress-container');
    if (bar) bar.classList.add('hidden');
  }

  function placeBlock() {
    let blockId = hotbarBlocks[activeSlotIndex];
    if (BLOCK_INFO[blockId] && BLOCK_INFO[blockId].isWeapon) {
      const firstBlock = hotbarBlocks.find(b => b !== undefined && BLOCK_INFO[b] && !BLOCK_INFO[b].isWeapon);
      if (firstBlock !== undefined) {
        blockId = firstBlock;
      } else {
        blockId = BLOCKS.GRASS;
      }
    }

    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hits = raycaster.intersectObjects(scene.children.filter(c => c.isVoxelMesh));
    if (hits.length > 0 && hits[0].distance < 7.0) {
      const p = hits[0].point.clone().add(hits[0].face.normal.clone().multiplyScalar(0.5));
      const bx = Math.round(p.x), by = Math.round(p.y), bz = Math.round(p.z);
      if (by > CHUNK_HEIGHT_MAX) { showToast(`Maksimal balandlik ${CHUNK_HEIGHT_MAX} blok!`); return; }
      const key = `${bx},${by},${bz}`;
      worldData[key] = blockId;
      modifiedBlocks[key] = blockId;
      soundEngine.playSFX('place');

      if (supabase && multiplayerChannel) {
        multiplayerChannel.send({
          type: 'broadcast',
          event: 'block_change',
          payload: { x: bx, y: by, z: bz, blockId: blockId }
        });
      }

      rebuildWorldMesh();
    }
  }

  function rebuildWorldMesh() {
    renderInstancedWorld();
  }

  // ==========================================================================
  // SAVE / LOAD
  // ==========================================================================

  function saveGame() {
    const data = {
      id: currentWorldMeta.id || 'world_' + Date.now(),
      name: currentWorldMeta.name, map: currentWorldMeta.map,
      timestamp: Date.now(),
      playerPos: { x: playerPos.x, y: playerPos.y, z: playerPos.z },
      yaw, pitch, dayTime, hotbarBlocks, skin: playerSkin, modifiedBlocks,
      questState: currentQuestState
    };
    let saves = JSON.parse(localStorage.getItem('uzbekcraft_saves') || '[]');
    const idx = saves.findIndex(s => s.id === data.id);
    if (idx >= 0) saves[idx] = data; else saves.push(data);
    localStorage.setItem('uzbekcraft_saves', JSON.stringify(saves));
    
    if (supabase) {
      showToast("Bulutga saqlanmoqda...");
      const dbData = {
        id: data.id,
        name: data.name,
        map: data.map,
        timestamp: data.timestamp,
        player_pos: data.playerPos,
        yaw: data.yaw,
        pitch: data.pitch,
        day_time: data.dayTime,
        hotbar_blocks: data.hotbarBlocks,
        skin: data.skin,
        modified_blocks: data.modifiedBlocks,
        quest_state: data.questState
      };
      supabase.from('uzbekcraft_saves').upsert([dbData]).then(({ error }) => {
        if (error) {
          console.error("Supabase cloud save failed:", error);
          showToast("Mahalliy saqlandi. Bulut xatoligi!");
        } else {
          showToast("O'yin bulutga muvaffaqiyatli saqlandi!");
        }
      });
    } else {
      showToast("O'yin mahalliy saqlandi!");
    }
  }

  function loadSavedWorldsList() {
    const list = document.getElementById('saved-worlds-list');
    if (!list) return;
    list.innerHTML = '<p class="modal-text">Dunyolar ro\'yxati yuklanmoqda...</p>';
    
    const localSaves = JSON.parse(localStorage.getItem('uzbekcraft_saves') || '[]');
    
    const renderList = (saves) => {
      list.innerHTML = '';
      if (saves.length === 0) {
        list.innerHTML = '<p class="modal-text">Hozircha saqlangan dunyolar mavjud emas.</p>'; return;
      }
      saves.sort((a, b) => b.timestamp - a.timestamp);
      saves.forEach(save => {
        const item = document.createElement('div');
        item.className = 'world-item';
        const ts = new Date(save.timestamp).toLocaleDateString('uz-UZ');
        item.innerHTML = `
          <div class="world-info-box">
            <h3>${save.name}</h3>
            <p>Xarita: ${save.map || 'Registon'} &bull; ${ts}</p>
          </div>
          <div class="world-item-actions">
            <button class="btn btn-emerald btn-play-save" data-id="${save.id}">O'ynash</button>
            <button class="btn btn-red btn-del-save" data-id="${save.id}">O'chirish</button>
          </div>`;
        list.appendChild(item);
      });
      
      document.querySelectorAll('.btn-play-save').forEach(btn => {
        btn.addEventListener('click', e => {
          const id = e.target.closest('button').dataset.id;
          const target = saves.find(s => s.id === id);
          if (target) resumeWorld(target);
        });
      });
      
      document.querySelectorAll('.btn-del-save').forEach(btn => {
        btn.addEventListener('click', e => {
          const id = e.target.closest('button').dataset.id;
          const updated = saves.filter(s => s.id !== id);
          localStorage.setItem('uzbekcraft_saves', JSON.stringify(updated));
          
          if (supabase) {
            showToast("Bulutdan o'chirilmoqda...");
            supabase.from('uzbekcraft_saves').delete().eq('id', id).then(({ error }) => {
              if (error) {
                console.error("Supabase delete failed:", error);
                showToast("Bulutdan o'chirishda xatolik!");
              } else {
                showToast("Dunyolar o'chirildi!");
              }
              loadSavedWorldsList();
            });
          } else {
            showToast("Dunyo o'chirildi!");
            loadSavedWorldsList();
          }
        });
      });
    };

    if (supabase) {
      supabase.from('uzbekcraft_saves').select('*').then(({ data, error }) => {
        if (error) {
          console.error("Failed to fetch cloud saves:", error);
          showToast("Bulutdan yuklashda xatolik!");
          renderList(localSaves);
        } else {
          const cloudSaves = data.map(db => ({
            id: db.id,
            name: db.name,
            map: db.map,
            timestamp: Number(db.timestamp),
            playerPos: db.player_pos,
            yaw: db.yaw,
            pitch: db.pitch,
            dayTime: db.day_time,
            hotbarBlocks: db.hotbar_blocks,
            skin: db.skin,
            modifiedBlocks: db.modified_blocks,
            questState: db.quest_state
          }));

          const merged = [...localSaves];
          cloudSaves.forEach(cloud => {
            const idx = merged.findIndex(s => s.id === cloud.id);
            if (idx >= 0) {
              if (cloud.timestamp > merged[idx].timestamp) {
                merged[idx] = cloud;
              }
            } else {
              merged.push(cloud);
            }
          });
          localStorage.setItem('uzbekcraft_saves', JSON.stringify(merged));
          renderList(merged);
        }
      });
    } else {
      renderList(localSaves);
    }
  }

  function resumeWorld(saveData) {
    currentWorldMeta = saveData;
    modifiedBlocks = saveData.modifiedBlocks || {};
    dayTime = saveData.dayTime || 0.25;
    playerSkin = saveData.skin || 'temur';
    currentQuestState = saveData.questState || 'not_started';
    generateWorld(saveData.seed || 'Uzbekistan2026', saveData.map || 'registan');
    playerPos.set(saveData.playerPos.x, saveData.playerPos.y, saveData.playerPos.z);
    yaw = saveData.yaw || 0; pitch = saveData.pitch || 0;
    startPlayingSession();
  }

  function startPlayingSession() {
    hideAllModals();
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) { mainMenu.classList.remove('active'); mainMenu.style.display = 'none'; }
    const hud = document.getElementById('hud');
    if (hud) hud.classList.remove('hidden');
    soundEngine.init();
    soundEngine.startAmbientMusic();
    joinMultiplayerRoom();
  }

  function returnToMainMenu() {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
    hideAllModals();
    const hud = document.getElementById('hud');
    if (hud) hud.classList.add('hidden');
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) { mainMenu.style.display = 'flex'; mainMenu.classList.add('active'); }
    
    // Cleanup multiplayer
    if (multiplayerChannel) {
      multiplayerChannel.unsubscribe();
      multiplayerChannel = null;
    }
    Object.keys(otherPlayers).forEach(id => {
      if (otherPlayers[id] && otherPlayers[id].mesh) {
        scene.remove(otherPlayers[id].mesh);
      }
      delete otherPlayers[id];
    });
  }

  function hideAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  }

  // ==========================================================================
  // UI SETUP
  // ==========================================================================

  function setupUI() {
    renderHotbar();
    renderInventoryGrid();

    document.getElementById('btn-new-world').addEventListener('click', () => {
      document.getElementById('create-world-modal').classList.remove('hidden');
    });
    document.getElementById('btn-saved-worlds').addEventListener('click', () => {
      loadSavedWorldsList();
      document.getElementById('saved-worlds-modal').classList.remove('hidden');
    });
    document.getElementById('btn-skins').addEventListener('click', () => {
      document.getElementById('skins-modal').classList.remove('hidden');
    });
    document.getElementById('btn-settings').addEventListener('click', () => {
      document.getElementById('settings-modal').classList.remove('hidden');
    });
    document.getElementById('btn-exit').addEventListener('click', () => {
      document.getElementById('save-prompt-modal').classList.remove('hidden');
    });

    // --- MULTIPLAYER UI LISTENERS ---
    document.getElementById('btn-multiplayer').addEventListener('click', () => {
      document.getElementById('multiplayer-modal').classList.remove('hidden');
    });
    document.getElementById('btn-multiplayer-close').addEventListener('click', () => {
      document.getElementById('multiplayer-modal').classList.add('hidden');
    });
    document.getElementById('btn-multiplayer-join').addEventListener('click', () => {
      const roomName = document.getElementById('multiplayer-room-input').value.trim() || "dostlar";
      const map = document.getElementById('multiplayer-map-select').value || "registan";
      currentWorldMeta = { id: 'world_' + Date.now(), name: roomName, seed: "Uzbekistan2026", map: map };
      modifiedBlocks = {};
      currentQuestState = 'not_started';
      generateWorld("Uzbekistan2026", map);
      const hudBiome = document.getElementById('hud-biome');
      if (hudBiome) hudBiome.textContent = getMapDisplayName(map) + " (Onlayn)";
      startPlayingSession();
      document.getElementById('multiplayer-modal').classList.add('hidden');
      showToast(`"${roomName}" xonasiga ulanildi!`);
    });

    // --- SUPABASE UI LISTENERS ---
    document.getElementById('btn-supabase').addEventListener('click', () => {
      document.getElementById('supabase-url').value = localStorage.getItem('uzbekcraft_supabase_url') || 'https://dtpyfzzdfyxeklyrtuew.supabase.co';
      document.getElementById('supabase-key').value = localStorage.getItem('uzbekcraft_supabase_key') || 'sb_publishable_ioYdiKVpVMddnYFH3bABDg_-J9EImd1';
      const statusEl = document.getElementById('supabase-status');
      if (supabase) {
        statusEl.textContent = "Supabase bilan ulanish faol (sinxronizatsiya yoqilgan).";
        statusEl.style.display = 'block';
        statusEl.style.background = 'rgba(16, 185, 129, 0.2)';
        statusEl.style.color = '#34d399';
      } else {
        statusEl.style.display = 'none';
      }
      document.getElementById('supabase-modal').classList.remove('hidden');
    });

    document.getElementById('btn-supabase-test').addEventListener('click', () => {
      const url = document.getElementById('supabase-url').value.trim();
      const key = document.getElementById('supabase-key').value.trim();
      const statusEl = document.getElementById('supabase-status');
      statusEl.style.display = 'block';
      statusEl.style.background = 'rgba(255,255,255,0.05)';
      statusEl.style.color = '#fff';
      statusEl.textContent = "Ulanish tekshirilmoqda...";

      if (!url || !key) {
        statusEl.textContent = "Xatolik: Barcha maydonlarni to'ldiring!";
        statusEl.style.background = 'rgba(239, 68, 68, 0.2)';
        statusEl.style.color = '#f87171';
        return;
      }

      if (!window.supabase) {
        statusEl.textContent = "Xatolik: Supabase kutubxonasi yuklanmagan!";
        statusEl.style.background = 'rgba(239, 68, 68, 0.2)';
        statusEl.style.color = '#f87171';
        return;
      }

      try {
        const tempClient = window.supabase.createClient(url, key);
        tempClient.from('uzbekcraft_saves').select('id').limit(1).then(({ error }) => {
          if (error) {
            console.error(error);
            statusEl.textContent = `Xatolik: ${error.message || 'Ulanishda xatolik yuz berdi'}`;
            statusEl.style.background = 'rgba(239, 68, 68, 0.2)';
            statusEl.style.color = '#f87171';
          } else {
            statusEl.textContent = "Muvaffaqiyatli: Supabase ulanishi tekshirildi!";
            statusEl.style.background = 'rgba(16, 185, 129, 0.2)';
            statusEl.style.color = '#34d399';
          }
        });
      } catch (e) {
        statusEl.textContent = `Xatolik: ${e.message}`;
        statusEl.style.background = 'rgba(239, 68, 68, 0.2)';
        statusEl.style.color = '#f87171';
      }
    });

    document.getElementById('btn-supabase-save').addEventListener('click', () => {
      const url = document.getElementById('supabase-url').value.trim();
      const key = document.getElementById('supabase-key').value.trim();
      if (!url || !key) {
        showToast("Xatolik: Barcha maydonlarni to'ldiring!");
        return;
      }
      localStorage.setItem('uzbekcraft_supabase_url', url);
      localStorage.setItem('uzbekcraft_supabase_key', key);
      initSupabase();
      showToast("Supabase sozlamalari saqlandi!");
      document.getElementById('supabase-modal').classList.add('hidden');
    });

    document.getElementById('btn-supabase-disconnect').addEventListener('click', () => {
      localStorage.removeItem('uzbekcraft_supabase_url');
      localStorage.removeItem('uzbekcraft_supabase_key');
      supabase = null;
      document.getElementById('supabase-url').value = '';
      document.getElementById('supabase-key').value = '';
      showToast("Supabase ulanishi uzildi (Mahalliy saqlash faol).");
      document.getElementById('supabase-modal').classList.add('hidden');
    });

    document.getElementById('btn-supabase-close').addEventListener('click', () => {
      document.getElementById('supabase-modal').classList.add('hidden');
    });

    document.getElementById('btn-start-game').addEventListener('click', () => {
      const name = document.getElementById('world-name-input').value || "Mening Dunyoim";
      const seed = document.getElementById('world-seed-input').value || "Uzbekistan2026";
      const map = document.getElementById('world-map-select').value || "registan";
      currentWorldMeta = { id: 'world_' + Date.now(), name, seed, map };
      modifiedBlocks = {};
      currentQuestState = 'not_started';
      generateWorld(seed, map);
      document.getElementById('hud-biome').textContent = getMapDisplayName(map);
      startPlayingSession();
      showToast(`${name} dunyosi yaratildi!`);
    });

    document.getElementById('btn-cancel-create').addEventListener('click', () => document.getElementById('create-world-modal').classList.add('hidden'));
    document.getElementById('btn-close-saved').addEventListener('click', () => document.getElementById('saved-worlds-modal').classList.add('hidden'));
    document.getElementById('btn-close-skins').addEventListener('click', () => document.getElementById('skins-modal').classList.add('hidden'));

    document.querySelectorAll('.skin-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.skin-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        playerSkin = card.dataset.skin;
      });
    });
    document.getElementById('btn-select-skin').addEventListener('click', () => {
      showToast(`Qahramon tanlandi: ${playerSkin}`);
      document.getElementById('skins-modal').classList.add('hidden');
    });

    document.getElementById('btn-hud-pause').addEventListener('click', () => document.getElementById('pause-modal').classList.remove('hidden'));
    document.getElementById('btn-resume-game').addEventListener('click', () => document.getElementById('pause-modal').classList.add('hidden'));
    document.getElementById('btn-save-game').addEventListener('click', saveGame);
    document.getElementById('btn-pause-settings').addEventListener('click', () => document.getElementById('settings-modal').classList.remove('hidden'));
    document.getElementById('btn-main-menu').addEventListener('click', () => {
      document.getElementById('pause-modal').classList.add('hidden');
      document.getElementById('save-prompt-modal').classList.remove('hidden');
    });
    document.getElementById('btn-prompt-save').addEventListener('click', () => { saveGame(); returnToMainMenu(); });
    document.getElementById('btn-prompt-nosave').addEventListener('click', returnToMainMenu);
    document.getElementById('btn-prompt-cancel').addEventListener('click', () => document.getElementById('save-prompt-modal').classList.add('hidden'));
    document.getElementById('btn-close-inventory').addEventListener('click', () => document.getElementById('inventory-modal').classList.add('hidden'));

    document.getElementById('btn-dialogue-next').addEventListener('click', () => {
      if (activeNpc && activeNpc.npcName === "Ulug'bek") {
        if (currentQuestState === 'active' && hotbarBlocks.includes(BLOCKS.BLUE_TILE)) {
          const idx = hotbarBlocks.indexOf(BLOCKS.BLUE_TILE);
          if (idx !== -1) {
            hotbarBlocks[idx] = BLOCKS.DIAMOND;
          } else {
            hotbarBlocks[activeSlotIndex] = BLOCKS.DIAMOND;
          }
          renderHotbar();
          currentQuestState = 'completed';
          showToast("Sizga Olmos mukofoti berildi!");
          updateDialogueUI();
        } else {
          dialogueIndex++;
          updateDialogueUI();
        }
      }
    });

    document.getElementById('btn-dialogue-quest').addEventListener('click', () => {
      currentQuestState = 'active';
      showToast("Vazifa qabul qilindi: 'Yo'qolgan Sekstant'");
      updateDialogueUI();
    });

    document.getElementById('btn-dialogue-close').addEventListener('click', () => {
      document.getElementById('dialogue-modal').classList.add('hidden');
      activeNpc = null;
    });

    // --- GAME SETTINGS EVENT LISTENERS ---
    const sfxSlider = document.getElementById('slider-sfx');
    const musicSlider = document.getElementById('slider-music');
    const renderSlider = document.getElementById('slider-render-dist');
    const toggleMobile = document.getElementById('toggle-mobile');

    if (sfxSlider) {
      sfxSlider.addEventListener('input', () => {
        const val = sfxSlider.value;
        document.getElementById('sfx-vol-val').textContent = `${val}%`;
        soundEngine.sfxVolume = val / 100;
      });
    }

    if (musicSlider) {
      musicSlider.addEventListener('input', () => {
        const val = musicSlider.value;
        document.getElementById('music-vol-val').textContent = `${val}%`;
        soundEngine.musicVolume = val / 100;
      });
    }

    if (renderSlider) {
      renderSlider.addEventListener('input', () => {
        const val = renderSlider.value;
        document.getElementById('render-dist-val').textContent = `${val} Chunk`;
        if (camera) {
          camera.far = val * 64 + 100;
          camera.updateProjectionMatrix();
        }
        if (scene && scene.fog) {
          scene.fog.density = 0.08 / val;
        }
      });
    }

    if (toggleMobile) {
      toggleMobile.addEventListener('change', () => {
        const mobileCtrls = document.getElementById('mobile-controls');
        if (mobileCtrls) {
          mobileCtrls.style.display = toggleMobile.checked ? 'block' : 'none';
        }
      });
    }

    const closeSettingsBtn = document.getElementById('btn-close-settings');
    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener('click', () => {
        document.getElementById('settings-modal').classList.add('hidden');
      });
    }
  }

  function getMapDisplayName(map) {
    const names = {
      registan: 'Samarqand - Registon', ichan_qala: 'Xiva - Ichan Qal\'a',
      minorai_kalon: 'Buxoro - Minorai Kalon', tashkent_tower: 'Toshkent Teleminorasi',
      chimgon: 'Chimgon Tog\'lari', pyramids: 'Misr Piramidalar',
      eiffel: 'Parij - Eyfel Minorasi', colosseum: 'Rim - Kolizey',
      big_ben: 'London - Big Ben', burj_khalifa: 'Dubay - Burj Xalifa',
      great_wall: 'Xitoy Buyuk Devori', taj_mahal: 'Hindiston - Taj Mahal',
      earth_globe: 'Yer Globusi'
    };
    return names[map] || map;
  }

  let handSwingTime = 0;
  let activeArrows = [];

  function updateFirstPersonHandMesh() {
    if (!fpHandGroup) return;

    // Clear previous children
    while (fpHandGroup.children.length > 0) {
      fpHandGroup.remove(fpHandGroup.children[0]);
    }

    const blockId = hotbarBlocks[activeSlotIndex];
    if (blockId === undefined || blockId === BLOCKS.AIR) return;

    // 1. Blocky human arm/hand
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xe0a96d }); // skin color
    const handGeom = new THREE.BoxGeometry(0.12, 0.12, 0.45);
    const handMesh = new THREE.Mesh(handGeom, skinMat);
    handMesh.position.set(0.26, -0.22, -0.4);
    handMesh.rotation.x = -0.15;
    handMesh.rotation.y = -0.25;
    fpHandGroup.add(handMesh);

    // 2. Held Weapon/Block Model
    if (blockId === BLOCKS.SWORD) {
      const swordGroup = new THREE.Group();
      swordGroup.position.set(0.18, -0.15, -0.45);
      swordGroup.rotation.x = -Math.PI / 3;
      swordGroup.rotation.y = 0.2;

      const handleMat = new THREE.MeshLambertMaterial({ color: 0x795548 }); // Wood handle
      const bladeMat = new THREE.MeshLambertMaterial({ color: 0x00bcd4 });  // Diamond cyan blade
      const guardMat = new THREE.MeshLambertMaterial({ color: 0x37474f });  // Dark guard

      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.03), handleMat);
      handle.position.y = -0.06;
      swordGroup.add(handle);

      const guard = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.04), guardMat);
      guard.position.y = 0.01;
      swordGroup.add(guard);

      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.35, 0.02), bladeMat);
      blade.position.y = 0.19;
      swordGroup.add(blade);

      fpHandGroup.add(swordGroup);
    } else if (blockId === BLOCKS.BOW) {
      const bowGroup = new THREE.Group();
      bowGroup.position.set(0.18, -0.15, -0.42);
      bowGroup.rotation.y = -0.3;

      const bowMat = new THREE.MeshLambertMaterial({ color: 0x8d6e63 }); // brown wood
      const stringMat = new THREE.MeshBasicMaterial({ color: 0xdddddd }); // white string

      const center = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.15, 0.03), bowMat);
      
      const upper = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.03), bowMat);
      upper.position.set(-0.02, 0.11, 0.03);
      upper.rotation.z = 0.2;
      center.add(upper);

      const lower = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.03), bowMat);
      lower.position.set(-0.02, -0.11, 0.03);
      lower.rotation.z = -0.2;
      center.add(lower);

      const string = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.36, 0.005), stringMat);
      string.position.set(-0.05, 0, 0);
      center.add(string);

      bowGroup.add(center);
      fpHandGroup.add(bowGroup);
    } else {
      // Regular block
      const color = BLOCK_INFO[blockId]?.color || '#ffffff';
      const blockMat = new THREE.MeshLambertMaterial({ color: color });
      const blockMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), blockMat);
      blockMesh.position.set(0.20, -0.16, -0.45);
      blockMesh.rotation.set(0.2, 0.3, 0.1);
      fpHandGroup.add(blockMesh);
    }
  }

  function animateFirstPersonHand(delta) {
    if (!fpHandGroup) return;

    const isMoving = keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD'] || touchJoystick.active;
    const blockId = hotbarBlocks[activeSlotIndex];

    // Reset base pose
    fpHandGroup.position.set(0, 0, 0);
    fpHandGroup.rotation.set(0, 0, 0);

    // 1. Walk bobbing
    if (isMoving) {
      const bobTime = performance.now() * 0.008;
      fpHandGroup.position.y += Math.sin(bobTime * 2) * 0.012;
      fpHandGroup.position.x += Math.cos(bobTime) * 0.008;
      fpHandGroup.rotation.z += Math.cos(bobTime) * 0.02;
    }

    // 2. Active swing animation
    if (handSwingTime > 0) {
      handSwingTime -= delta;
      const pct = Math.max(0, handSwingTime / (blockId === BLOCKS.BOW ? 0.15 : 0.2));
      const swingAngle = Math.sin(pct * Math.PI) * 0.6;
      
      fpHandGroup.rotation.x = swingAngle;
      fpHandGroup.rotation.y = -swingAngle * 0.4;
      fpHandGroup.position.z += swingAngle * 0.08;
    } 
    // 3. Mining continuous oscillation
    else if (isMiningHeld) {
      const chipTime = performance.now() * 0.028;
      const chipAngle = Math.sin(chipTime) * 0.35 + 0.15;
      fpHandGroup.rotation.x = chipAngle;
      fpHandGroup.rotation.y = -chipAngle * 0.3;
    }
  }

  function damageAnimal(animal, amount) {
    if (!animal.health) animal.health = 3.0;
    animal.health -= amount;
    soundEngine.playSFX('hit');

    // Make animal flee away from player
    const fleeDir = animal.position.clone().sub(playerPos).normalize();
    fleeDir.y = 0;
    if (fleeDir.lengthSq() === 0) {
      fleeDir.set(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
    }
    animal.fleeingDir = fleeDir;
    animal.fleeingTimer = 2.5;

    // Red flash effect
    const originalColors = [];
    animal.traverse(child => {
      if (child.isMesh && child.material) {
        originalColors.push({ mesh: child, mat: child.material });
        child.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      }
    });

    setTimeout(() => {
      originalColors.forEach(item => {
        if (item.mesh && item.mesh.parent) {
          item.mesh.material = item.mat;
        }
      });
    }, 120);

    if (animal.health <= 0) {
      soundEngine.playSFX('kill');
      // Spin and scale down death animation
      let deathTimer = 0;
      function deathAnimate() {
        if (deathTimer < 0.25) {
          deathTimer += 0.016;
          animal.rotation.y += 0.5;
          animal.scale.multiplyScalar(0.85);
          requestAnimationFrame(deathAnimate);
        } else {
          scene.remove(animal);
          const aIdx = animals.indexOf(animal);
          if (aIdx >= 0) animals.splice(aIdx, 1);
          const nIdx = npcs.indexOf(animal);
          if (nIdx >= 0) npcs.splice(nIdx, 1);
        }
      }
      deathAnimate();
    }
  }

  function performSwordAttack() {
    handSwingTime = 0.2;
    soundEngine.playSFX('swing');

    const playerDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    const attackRange = 3.5;

    for (let i = animals.length - 1; i >= 0; i--) {
      const animal = animals[i];
      const dist = playerPos.distanceTo(animal.position);
      if (dist <= attackRange) {
        const dirToAnimal = animal.position.clone().sub(playerPos).normalize();
        const dot = dirToAnimal.dot(playerDir);
        if (dot > 0.45) {
          damageAnimal(animal, 1.5);
          break;
        }
      }
    }
  }

  function performBowShoot() {
    handSwingTime = 0.15;
    soundEngine.playSFX('shoot');

    const arrowGeom = new THREE.BoxGeometry(0.04, 0.04, 0.35);
    const arrowMat = new THREE.MeshLambertMaterial({ color: 0x8d6e63 });
    const arrowMesh = new THREE.Mesh(arrowGeom, arrowMat);

    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

    arrowMesh.position.copy(playerPos);
    arrowMesh.position.y += 1.45; // Camera height
    arrowMesh.position.addScaledVector(dir, 0.5);

    arrowMesh.lookAt(arrowMesh.position.clone().add(dir));
    scene.add(arrowMesh);

    activeArrows.push({
      mesh: arrowMesh,
      velocity: dir.clone().multiplyScalar(40.0),
      time: 0
    });
  }

  function renderHotbar() {
    const el = document.getElementById('hotbar');
    if (!el) return;
    el.innerHTML = '';
    hotbarBlocks.forEach((bId, idx) => {
      const slot = document.createElement('div');
      slot.className = `hotbar-slot ${idx === activeSlotIndex ? 'active' : ''}`;
      slot.innerHTML = `<span class="hotbar-slot-num">${idx + 1}</span><div class="hotbar-icon" style="background:${BLOCK_INFO[bId].color};"></div>`;
      slot.addEventListener('click', () => { activeSlotIndex = idx; renderHotbar(); });
      el.appendChild(slot);
    });
    updateFirstPersonHandMesh();
  }

  function renderInventoryGrid() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.keys(BLOCK_INFO).forEach(bIdStr => {
      const bId = Number(bIdStr);
      const item = document.createElement('div');
      item.className = 'inv-slot-item';
      item.innerHTML = `<div class="block-icon-box" style="background:${BLOCK_INFO[bId].color};"></div><span class="block-slot-name">${BLOCK_INFO[bId].name}</span>`;
      item.addEventListener('click', () => {
        hotbarBlocks[activeSlotIndex] = bId; renderHotbar();
        showToast(`Slot ${activeSlotIndex + 1}: "${BLOCK_INFO[bId].name}"`);
      });
      grid.appendChild(item);
    });
  }

  // ==========================================================================
  // EVENTS
  // ==========================================================================

  function setupEvents() {
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    window.addEventListener('keydown', e => {
      keys[e.code] = true;
      if (e.code.startsWith('Digit')) {
        const n = parseInt(e.code.replace('Digit', '')) - 1;
        if (n >= 0 && n < 9) { activeSlotIndex = n; renderHotbar(); }
      }
      if (e.code === 'KeyV') { isThirdPerson = !isThirdPerson; showToast(isThirdPerson ? "3-shaxs" : "1-shaxs"); }
      if (e.code === 'KeyE') document.getElementById('inventory-modal').classList.toggle('hidden');
      if (e.code === 'Escape') document.getElementById('pause-modal').classList.toggle('hidden');
      if (e.code === 'KeyF') { dayTime = (dayTime + 0.25) % 1; showToast("Vaqt o'tkazildi"); }
    });
    window.addEventListener('keyup', e => keys[e.code] = false);
    window.addEventListener('mousedown', e => {
      if (e.target.closest('#ui-layer') && !e.target.closest('#canvas-container')) return;
      if (document.getElementById('hud').classList.contains('hidden')) return;
      if (e.button === 0) {
        const blockId = hotbarBlocks[activeSlotIndex];
        if (blockId === BLOCKS.SWORD) {
          performSwordAttack();
        } else if (blockId === BLOCKS.BOW) {
          performBowShoot();
        } else {
          startMining();
        }
      }
      else if (e.button === 2) placeBlock();
    });
    window.addEventListener('mouseup', e => { if (e.button === 0) cancelMining(); });
    window.addEventListener('contextmenu', e => e.preventDefault());

    const container = document.getElementById('canvas-container');
    container.addEventListener('click', () => {
      if (!document.getElementById('hud').classList.contains('hidden') &&
          document.getElementById('pause-modal').classList.contains('hidden')) {
        container.requestPointerLock();
      }
    });
    document.addEventListener('pointerlockchange', () => isPointerLocked = (document.pointerLockElement === container));
    document.addEventListener('mousemove', e => {
      if (isPointerLocked) {
        const isCtrlHeld = keys['ControlLeft'] || keys['ControlRight'] || keys['Control'] || e.ctrlKey;
        if (isCtrlHeld) {
          orbitYaw -= e.movementX * 0.002;
          orbitPitch -= e.movementY * 0.002;
          orbitPitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, orbitPitch));
        } else {
          yaw -= e.movementX * 0.002;
          pitch -= e.movementY * 0.002;
          pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, pitch));
          orbitYaw = yaw;
          orbitPitch = pitch;
        }
      }
    });
    // Scroll wheel for hotbar and camera zoom
    window.addEventListener('wheel', e => {
      const isCtrlHeld = keys['ControlLeft'] || keys['ControlRight'] || keys['Control'] || e.ctrlKey;
      if (isCtrlHeld) {
        thirdPersonDistance = Math.max(2.0, Math.min(15.0, thirdPersonDistance + Math.sign(e.deltaY) * 0.5));
        e.preventDefault();
      } else {
        activeSlotIndex = (activeSlotIndex + Math.sign(e.deltaY) + 9) % 9;
        renderHotbar();
      }
    }, { passive: false });
  }

  function setupMobileControls() {
    const jZone = document.getElementById('joystick-zone');
    const jStick = document.getElementById('joystick-stick');
    if (!jZone) return;

    jZone.addEventListener('touchstart', e => {
      const t = e.touches[0], rect = jZone.getBoundingClientRect();
      touchJoystick.active = true;
      touchJoystick.startX = rect.left + rect.width / 2;
      touchJoystick.startY = rect.top + rect.height / 2;
    }, { passive: true });
    jZone.addEventListener('touchmove', e => {
      if (!touchJoystick.active) return;
      const t = e.touches[0];
      const dx = t.clientX - touchJoystick.startX, dy = t.clientY - touchJoystick.startY;
      const dist = Math.min(45, Math.hypot(dx, dy)), angle = Math.atan2(dy, dx);
      jStick.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
      touchJoystick.moveX = (Math.cos(angle) * dist) / 45;
      touchJoystick.moveY = (Math.sin(angle) * dist) / 45;
    }, { passive: true });
    jZone.addEventListener('touchend', () => {
      touchJoystick.active = false; touchJoystick.moveX = 0; touchJoystick.moveY = 0;
      jStick.style.transform = 'translate(0px, 0px)';
    });

    const lookZone = document.getElementById('touch-look-zone');
    lookZone.addEventListener('touchstart', e => {
      const t = e.touches[0]; touchLook.active = true;
      touchLook.lastX = t.clientX; touchLook.lastY = t.clientY;
    }, { passive: true });
    lookZone.addEventListener('touchmove', e => {
      if (!touchLook.active) return;
      const t = e.touches[0];
      yaw -= (t.clientX - touchLook.lastX) * 0.005;
      pitch -= (t.clientY - touchLook.lastY) * 0.005;
      pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, pitch));
      camera.rotation.set(pitch, yaw, 0, 'YXZ');
      touchLook.lastX = t.clientX; touchLook.lastY = t.clientY;
    }, { passive: true });
    lookZone.addEventListener('touchend', () => touchLook.active = false);

    document.getElementById('btn-touch-jump').addEventListener('touchstart', () => keys['JumpTouch'] = true);
    document.getElementById('btn-touch-jump').addEventListener('touchend', () => keys['JumpTouch'] = false);
    const btnBreak = document.getElementById('btn-touch-break');
    btnBreak.addEventListener('touchstart', e => {
      e.preventDefault();
      const blockId = hotbarBlocks[activeSlotIndex];
      if (blockId === BLOCKS.SWORD) {
        performSwordAttack();
      } else if (blockId === BLOCKS.BOW) {
        performBowShoot();
      } else {
        startMining();
      }
    });
    btnBreak.addEventListener('touchend', e => { e.preventDefault(); cancelMining(); });
    document.getElementById('btn-touch-place').addEventListener('click', placeBlock);
    document.getElementById('btn-touch-cam').addEventListener('click', () => {
      isThirdPerson = !isThirdPerson; showToast(isThirdPerson ? "3-shaxs" : "1-shaxs");
    });
    document.getElementById('btn-touch-inv').addEventListener('click', () => document.getElementById('inventory-modal').classList.toggle('hidden'));
  }

  function showToast(text) {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = text;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  // ==========================================================================
  // MAIN LOOP
  // ==========================================================================

  function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(0.08, clock.getDelta());
    const hud = document.getElementById('hud');
    const pause = document.getElementById('pause-modal');
    const dialogue = document.getElementById('dialogue-modal');

    // Position floating bubble if activeNpc is set
    if (activeNpc) {
      const tempV = new THREE.Vector3();
      activeNpc.getWorldPosition(tempV);
      tempV.y += 2.0; // height offset above NPC
      tempV.project(camera);
      if (tempV.z > 1) {
        dialogue.style.display = 'none';
      } else {
        dialogue.style.display = 'block';
        const x = (tempV.x * 0.5 + 0.5) * window.innerWidth;
        const y = (tempV.y * -0.5 + 0.5) * window.innerHeight;
        dialogue.style.left = `${x}px`;
        dialogue.style.top = `${y}px`;
      }
    } else {
      dialogue.style.display = '';
    }

    if (hud && !hud.classList.contains('hidden') && 
        pause && pause.classList.contains('hidden') && 
        dialogue && dialogue.classList.contains('hidden')) {
      updatePlayer(delta);
      updateDayNightCycle(delta);
      animateFirstPersonHand(delta);
    }

    if (fpHandGroup) {
      const isCtrlHeld = keys['ControlLeft'] || keys['ControlRight'] || keys['Control'];
      const showingThirdPerson = isThirdPerson || isCtrlHeld;
      const isHudVisible = hud && !hud.classList.contains('hidden');
      fpHandGroup.visible = !showingThirdPerson && isHudVisible;
    }

    renderer.render(scene, camera);
    const fpsEl = document.getElementById('hud-fps');
    if (fpsEl && frameCount % 30 === 0) fpsEl.textContent = Math.round(1 / Math.max(0.001, delta));
    frameCount++;
  }

  window.addEventListener('DOMContentLoaded', init);

})();
