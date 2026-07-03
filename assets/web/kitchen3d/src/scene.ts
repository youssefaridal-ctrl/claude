import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface KitchenSceneConfig {
  widthCm: number;
  lengthCm: number;
  heightCm: number;
  layout: 'single' | 'galley' | 'l-shape' | 'u-shape' | 'island';
  style: 'modern' | 'classic' | 'wood' | 'minimal' | 'industrial';
  cabinetHex: string;
  countertopHex: string;
  flooringHex: string;
  wallHex: string;
  appliances: string[];
}

const BASE_H = 0.85;
const BASE_D = 0.6;
const WALL_CAB_H = 0.7;
const WALL_CAB_D = 0.35;
const COUNTER_T = 0.04;
const WALL_CAB_GAP = 0.5;

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let kitchenGroup: THREE.Group | null = null;
let currentConfig: KitchenSceneConfig | null = null;

function styleParams(style: KitchenSceneConfig['style']) {
  switch (style) {
    case 'modern':
      return { roughness: 0.25, metalness: 0.15, handles: 'bar' as const, trim: false, legs: false };
    case 'classic':
      return { roughness: 0.55, metalness: 0.05, handles: 'knob' as const, trim: true, legs: false };
    case 'wood':
      return { roughness: 0.7, metalness: 0.0, handles: 'bar' as const, trim: true, legs: false };
    case 'minimal':
      return { roughness: 0.3, metalness: 0.05, handles: 'none' as const, trim: false, legs: false };
    case 'industrial':
      return { roughness: 0.6, metalness: 0.5, handles: 'bar' as const, trim: false, legs: true };
    default:
      return { roughness: 0.4, metalness: 0.1, handles: 'bar' as const, trim: false, legs: false };
  }
}

function box(
  w: number,
  h: number,
  d: number,
  color: string | number,
  opts: { roughness?: number; metalness?: number } = {}
) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.5,
    metalness: opts.metalness ?? 0.1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addHandle(
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  kind: 'bar' | 'knob' | 'none',
  facing: 'z' | 'x'
) {
  if (kind === 'none') return;
  const mat = new THREE.MeshStandardMaterial({ color: '#c9ccd1', roughness: 0.3, metalness: 0.8 });
  if (kind === 'knob') {
    const geo = new THREE.SphereGeometry(0.018, 12, 12);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    parent.add(m);
  } else {
    const len = 0.18;
    const geo =
      facing === 'z'
        ? new THREE.BoxGeometry(0.015, len, 0.015)
        : new THREE.BoxGeometry(0.015, len, 0.015);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    parent.add(m);
  }
}

interface RunSpec {
  wall: 'back' | 'left' | 'right' | 'front';
  length: number;
  originX: number;
  originZ: number;
  axis: 'x' | 'z';
  dir: 1 | -1;
}

function buildRun(
  spec: RunSpec,
  cfg: KitchenSceneConfig,
  sp: ReturnType<typeof styleParams>,
  group: THREE.Group
) {
  const cabinetMat = { roughness: sp.roughness, metalness: sp.metalness };
  const runLen = spec.length;
  const cabinetUnit = 0.6;
  const count = Math.max(1, Math.floor(runLen / cabinetUnit));
  const unit = runLen / count;

  for (let i = 0; i < count; i++) {
    const centerOffset = (i + 0.5) * unit - runLen / 2;
    const base = box(
      spec.axis === 'x' ? unit * 0.96 : BASE_D,
      BASE_H,
      spec.axis === 'x' ? BASE_D : unit * 0.96,
      cfg.cabinetHex,
      cabinetMat
    );
    const wallCab = box(
      spec.axis === 'x' ? unit * 0.96 : WALL_CAB_D,
      WALL_CAB_H,
      spec.axis === 'x' ? WALL_CAB_D : unit * 0.96,
      cfg.cabinetHex,
      cabinetMat
    );

    let x = spec.originX;
    let z = spec.originZ;
    if (spec.axis === 'x') {
      x = spec.originX + centerOffset * spec.dir;
      z = spec.originZ;
    } else {
      x = spec.originX;
      z = spec.originZ + centerOffset * spec.dir;
    }

    base.position.set(x, BASE_H / 2, z);
    wallCab.position.set(x, cfg.heightCm / 100 - WALL_CAB_H / 2 - 0.05, z);
    group.add(base);
    group.add(wallCab);

    const handleY = BASE_H - 0.15;
    if (spec.axis === 'x') {
      addHandle(group, x, handleY, z + BASE_D / 2 * (spec.wall === 'back' ? 1 : -1) * 0.95, sp.handles, 'z');
    } else {
      addHandle(group, x + BASE_D / 2 * (spec.wall === 'left' ? 1 : -1) * 0.95, handleY, z, sp.handles, 'x');
    }

    if (sp.trim) {
      const trim = box(
        spec.axis === 'x' ? unit * 0.96 : BASE_D + 0.02,
        0.03,
        spec.axis === 'x' ? BASE_D + 0.02 : unit * 0.96,
        '#00000022',
        { roughness: 0.8, metalness: 0 }
      );
      trim.position.set(x, 0.05, z);
      group.add(trim);
    }
  }

  const counter = box(
    spec.axis === 'x' ? runLen + 0.05 : BASE_D + 0.05,
    COUNTER_T,
    spec.axis === 'x' ? BASE_D + 0.05 : runLen + 0.05,
    cfg.countertopHex,
    { roughness: 0.15, metalness: 0.1 }
  );
  counter.position.set(spec.originX, BASE_H + COUNTER_T / 2, spec.originZ);
  group.add(counter);
}

function buildAppliances(
  cfg: KitchenSceneConfig,
  group: THREE.Group,
  backRun: RunSpec,
  cornerClearance: number,
  islandPos?: { x: number; z: number; w: number; d: number }
) {
  const list = cfg.appliances;
  let cursor = -backRun.length / 2 + cornerClearance + 0.45;

  if (list.includes('fridge')) {
    const fridge = box(0.75, 1.8, 0.65, '#e7e9ec', { roughness: 0.2, metalness: 0.6 });
    fridge.position.set(backRun.originX + cursor, 0.9, backRun.originZ + BASE_D / 2 + 0.05);
    group.add(fridge);
    cursor += 0.85;
  }
  if (list.includes('oven')) {
    const oven = box(0.58, 0.8, 0.58, '#2b2b2d', { roughness: 0.35, metalness: 0.4 });
    oven.position.set(backRun.originX + cursor, 0.4, backRun.originZ);
    group.add(oven);
    if (list.includes('hood')) {
      const hood = box(0.6, 0.35, 0.45, '#3a3a3c', { roughness: 0.3, metalness: 0.6 });
      hood.position.set(backRun.originX + cursor, cfg.heightCm / 100 - 0.5, backRun.originZ);
      group.add(hood);
    }
    cursor += 0.7;
  }
  if (list.includes('sink')) {
    const sink = box(0.5, 0.06, 0.4, '#c7ccd2', { roughness: 0.15, metalness: 0.8 });
    sink.position.set(backRun.originX + cursor, BASE_H + COUNTER_T + 0.01, backRun.originZ);
    group.add(sink);
    cursor += 0.65;
  }
  if (list.includes('dishwasher')) {
    const dw = box(0.55, 0.8, 0.55, '#9aa0a8', { roughness: 0.3, metalness: 0.5 });
    dw.position.set(backRun.originX + cursor, 0.4, backRun.originZ);
    group.add(dw);
    cursor += 0.65;
  }
  if (list.includes('microwave')) {
    const mw = box(0.45, 0.3, 0.35, '#26272b', { roughness: 0.3, metalness: 0.4 });
    mw.position.set(backRun.originX + cursor, cfg.heightCm / 100 - WALL_CAB_H - 0.15, backRun.originZ);
    group.add(mw);
  }
}

function buildRoom(cfg: KitchenSceneConfig, sp: ReturnType<typeof styleParams>): THREE.Group {
  const group = new THREE.Group();
  const w = cfg.widthCm / 100;
  const l = cfg.lengthCm / 100;
  const h = cfg.heightCm / 100;

  const floor = box(w, 0.02, l, cfg.flooringHex, { roughness: 0.6, metalness: 0.0 });
  floor.position.set(0, -0.01, 0);
  floor.receiveShadow = true;
  group.add(floor);

  const wallMat = { roughness: 0.9, metalness: 0 };
  const backWall = box(w, h, 0.05, cfg.wallHex, wallMat);
  backWall.position.set(0, h / 2, -l / 2);
  group.add(backWall);

  const leftWall = box(0.05, h, l, cfg.wallHex, wallMat);
  leftWall.position.set(-w / 2, h / 2, 0);
  group.add(leftWall);

  if (cfg.layout === 'u-shape') {
    const rightWall = box(0.05, h, l, cfg.wallHex, wallMat);
    rightWall.position.set(w / 2, h / 2, 0);
    group.add(rightWall);
  }

  const backRun: RunSpec = {
    wall: 'back',
    length: w - 0.05,
    originX: 0,
    originZ: -l / 2 + BASE_D / 2,
    axis: 'x',
    dir: 1,
  };

  buildRun(backRun, cfg, sp, group);

  if (cfg.layout === 'l-shape' || cfg.layout === 'u-shape' || cfg.layout === 'island') {
    const leftRun: RunSpec = {
      wall: 'left',
      length: l - BASE_D - 0.05,
      originX: -w / 2 + BASE_D / 2,
      originZ: -0.05,
      axis: 'z',
      dir: 1,
    };
    buildRun(leftRun, cfg, sp, group);
  }

  if (cfg.layout === 'u-shape') {
    const rightRun: RunSpec = {
      wall: 'right',
      length: l - BASE_D - 0.05,
      originX: w / 2 - BASE_D / 2,
      originZ: -0.05,
      axis: 'z',
      dir: 1,
    };
    buildRun(rightRun, cfg, sp, group);
  }

  if (cfg.layout === 'galley') {
    const frontRun: RunSpec = {
      wall: 'front',
      length: w - 0.05,
      originX: 0,
      originZ: l / 2 - BASE_D / 2 - 0.4,
      axis: 'x',
      dir: 1,
    };
    buildRun(frontRun, cfg, sp, group);
  }

  let islandInfo;
  if (cfg.layout === 'island') {
    const iw = Math.min(1.8, w * 0.4);
    const id = 0.9;
    const iBase = box(iw, BASE_H, id, cfg.cabinetHex, { roughness: sp.roughness, metalness: sp.metalness });
    const iZ = l / 2 - id / 2 - 0.5;
    iBase.position.set(0, BASE_H / 2, iZ);
    group.add(iBase);
    const iCounter = box(iw + 0.08, COUNTER_T, id + 0.08, cfg.countertopHex, { roughness: 0.15, metalness: 0.1 });
    iCounter.position.set(0, BASE_H + COUNTER_T / 2, iZ);
    group.add(iCounter);

    if (sp.legs) {
      const legMat = new THREE.MeshStandardMaterial({ color: '#3a3a3c', roughness: 0.4, metalness: 0.8 });
      [-1, 1].forEach((sx) => {
        [-1, 1].forEach((sz) => {
          const legGeo = new THREE.CylinderGeometry(0.02, 0.02, BASE_H, 8);
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set((sx * iw) / 2 - sx * 0.06, BASE_H / 2, iZ + (sz * id) / 2 - sz * 0.06);
          group.add(leg);
        });
      });
    }
    islandInfo = { x: 0, z: iZ, w: iw, d: id };
  }

  const hasLeftCorner = cfg.layout === 'l-shape' || cfg.layout === 'u-shape' || cfg.layout === 'island';
  const cornerClearance = hasLeftCorner ? BASE_D : 0;
  buildAppliances(cfg, group, backRun, cornerClearance, islandInfo);

  if (cfg.style === 'industrial') {
    const ductGeo = new THREE.BoxGeometry(0.3, 0.3, l * 0.6);
    const ductMat = new THREE.MeshStandardMaterial({ color: '#54565b', roughness: 0.5, metalness: 0.7 });
    const duct = new THREE.Mesh(ductGeo, ductMat);
    duct.position.set(0, h - 0.2, 0);
    group.add(duct);
  }

  return group;
}

function frameCamera(cfg: KitchenSceneConfig) {
  const w = cfg.widthCm / 100;
  const l = cfg.lengthCm / 100;
  const h = cfg.heightCm / 100;

  const vFOV = THREE.MathUtils.degToRad(camera.fov);
  const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * camera.aspect);

  const marginW = w / 2 + 0.5;
  const marginD = Math.max(l, h) / 2 + 0.5;
  const distForWidth = marginW / Math.tan(hFOV / 2);
  const distForDepth = marginD / Math.tan(vFOV / 2);
  const dist = Math.max(distForWidth, distForDepth, 2.4);

  camera.position.set(dist * 0.5, h * 0.55 + 0.7, dist * 0.9);
  controls.target.set(0, h / 2.4, 0);
  controls.minDistance = dist * 0.25;
  controls.maxDistance = dist * 2.5;
  controls.update();
}

export function updateConfig(cfg: KitchenSceneConfig) {
  currentConfig = cfg;
  if (kitchenGroup) {
    scene.remove(kitchenGroup);
    kitchenGroup.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        const mat = mesh.material as THREE.Material | THREE.Material[];
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    });
  }
  const sp = styleParams(cfg.style);
  kitchenGroup = buildRoom(cfg, sp);
  scene.add(kitchenGroup);
  frameCamera(cfg);
}

export function init(canvas: HTMLCanvasElement) {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  scene = new THREE.Scene();
  scene.background = new THREE.Color('#eef1f4');
  scene.fog = new THREE.Fog('#eef1f4', 14, 26);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

  const hemi = new THREE.HemisphereLight('#ffffff', '#9a9a9a', 0.65);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight('#fff6e6', 2.2);
  dir.position.set(4, 6, 3);
  dir.castShadow = true;
  dir.shadow.mapSize.set(1024, 1024);
  dir.shadow.camera.left = -5;
  dir.shadow.camera.right = 5;
  dir.shadow.camera.top = 5;
  dir.shadow.camera.bottom = -5;
  scene.add(dir);
  const fill = new THREE.PointLight('#ffd9a0', 0.6);
  fill.position.set(-3, 2, -3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight('#ffffff', 0.5);
  rim.position.set(-4, 3, 5);
  scene.add(rim);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 1.5;
  controls.maxDistance = 14;
  controls.maxPolarAngle = Math.PI * 0.49;

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

export function getCurrentConfig() {
  return currentConfig;
}
