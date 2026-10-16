// the "inside a build" scene: a procedural gamepad that turns, travels and
// comes apart as the page scrolls — shells, board, sticks and buttons each
// on their own path — with dice, coins, a gem and a health heart in orbit
// over a receding grid. its own module so three.js stays out of the first
// load; nothing here is a downloaded model, every part is built below.
import * as THREE from "three";

import { createStage, sectionProgress } from "./stage";

type Pose = { p: number; x: number; y: number; rx: number; ry: number; rz: number; e: number };
type Key = Exclude<keyof Pose, "p">;
const KEYS: Key[] = ["x", "y", "rx", "ry", "rz", "e"];

/* where the pad is at each beat of the scroll (p = section progress, e =
   how far apart it is). the beats sit mid-chapter in Build.tsx, so the pad
   arrives on its side of the screen just as that chapter's copy is read */
const POSES: Pose[] = [
  { p: 0.0, x: 0, y: -1.6, rx: 1.2, ry: 0, rz: 0, e: 0 },
  { p: 0.1, x: 0, y: -0.95, rx: 0.32, ry: -0.3, rz: 0, e: 0 },
  { p: 0.31, x: 1.55, y: 0, rx: 0.35, ry: -0.8, rz: 0.08, e: 0.3 },
  { p: 0.52, x: -1.55, y: 0, rx: 0.55, ry: 0.85, rz: -0.1, e: 1 },
  { p: 0.72, x: 1.55, y: 0, rx: -0.2, ry: 2.5, rz: 0.08, e: 0.85 },
  { p: 0.9, x: 0, y: 0.95, rx: 0.3, ry: Math.PI * 2, rz: 0, e: 0 },
  { p: 1.0, x: 0, y: 0.95, rx: 0.3, ry: Math.PI * 2, rz: 0, e: 0 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

function poseAt(p: number, out: Record<Key, number>) {
  let i = 0;
  while (i < POSES.length - 2 && p > POSES[i + 1].p) i++;
  const a = POSES[i];
  const b = POSES[i + 1];
  const t = smooth(clamp01((p - a.p) / (b.p - a.p)));
  for (const k of KEYS) out[k] = a[k] + (b[k] - a[k]) * t;
}

/* the controller's outline, face on: a body with two grips */
function padShape() {
  const s = new THREE.Shape();
  s.moveTo(-1, 0.95);
  s.lineTo(1, 0.95);
  s.bezierCurveTo(1.55, 0.98, 1.8, 0.75, 1.9, 0.35);
  s.bezierCurveTo(2.05, -0.2, 2.1, -0.8, 1.95, -1.25);
  s.bezierCurveTo(1.82, -1.6, 1.35, -1.62, 1.18, -1.3);
  s.bezierCurveTo(1, -0.95, 0.75, -0.62, 0.45, -0.6);
  s.lineTo(-0.45, -0.6);
  s.bezierCurveTo(-0.75, -0.62, -1, -0.95, -1.18, -1.3);
  s.bezierCurveTo(-1.35, -1.62, -1.82, -1.6, -1.95, -1.25);
  s.bezierCurveTo(-2.1, -0.8, -2.05, -0.2, -1.9, 0.35);
  s.bezierCurveTo(-1.8, 0.75, -1.55, 0.98, -1, 0.95);
  return s;
}

function heartShape() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.35);
  s.bezierCurveTo(-0.05, -0.3, -0.45, -0.05, -0.45, 0.15);
  s.bezierCurveTo(-0.45, 0.38, -0.22, 0.45, 0, 0.28);
  s.bezierCurveTo(0.22, 0.45, 0.45, 0.38, 0.45, 0.15);
  s.bezierCurveTo(0.45, -0.05, 0.05, -0.3, 0, -0.35);
  return s;
}

/* the circuit board between the shells: traces on a deterministic walk,
   so every visit sees the same board */
function boardTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#081030";
  g.fillRect(0, 0, 512, 512);

  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  g.lineWidth = 2.5;
  g.lineCap = "round";
  for (let i = 0; i < 110; i++) {
    let x = Math.round(rnd() * 32) * 16;
    let y = Math.round(rnd() * 32) * 16;
    g.strokeStyle = rnd() < 0.25 ? "#8eaaff" : "#5ad8ff";
    g.globalAlpha = 0.35 + rnd() * 0.6;
    g.beginPath();
    g.moveTo(x, y);
    for (let s = 0; s < 4; s++) {
      const step = 16 * Math.ceil(rnd() * 5) * (rnd() < 0.5 ? -1 : 1);
      if (rnd() < 0.5) x += step;
      else y += step;
      g.lineTo(x, y);
    }
    g.stroke();
    g.fillStyle = g.strokeStyle;
    g.fillRect(x - 4, y - 4, 8, 8);
  }

  // the chip in the middle, with its pins
  g.globalAlpha = 1;
  g.fillStyle = "#0d1428";
  g.fillRect(196, 176, 120, 120);
  g.strokeStyle = "#8eaaff";
  g.lineWidth = 3;
  g.strokeRect(196, 176, 120, 120);
  g.fillStyle = "#5ad8ff";
  for (let i = 0; i < 8; i++) {
    g.fillRect(204 + i * 14, 166, 6, 10);
    g.fillRect(204 + i * 14, 296, 6, 10);
    g.fillRect(186, 184 + i * 14, 10, 6);
    g.fillRect(316, 184 + i * 14, 10, 6);
  }

  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  // shape uvs are the outline's own coordinates; this maps them onto 0..1
  texture.repeat.set(0.25, 0.3);
  texture.offset.set(0.5, 0.52);
  texture.anisotropy = 4;
  return texture;
}

type Part = { obj: THREE.Object3D; base: THREE.Vector3; off: THREE.Vector3; delay: number };

/** mounts the scene into `host`, driven by how far `section` has scrolled.
 *  returns a cleanup. throws without webgl */
export function mountGamepad(host: HTMLElement, section: HTMLElement, onReady: () => void) {
  let portrait = false;
  const { scene, camera, run, dispose } = createStage(host, {
    onResize: (lens) => {
      portrait = lens.aspect < 0.9;
      // phones stack the copy under the pad, so the pad goes up and the lens widens
      lens.fov = portrait ? 52 : 32;
    },
  });
  // matches the section's floor colour, so the grid melts into it
  scene.fog = new THREE.Fog(0x05060b, 11, 30);

  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 5, 6);
  const rim = new THREE.DirectionalLight(0x5ad8ff, 3);
  rim.position.set(-5, 2, -4);
  const fill = new THREE.DirectionalLight(0x3364ff, 1.6);
  fill.position.set(5, -3, -2);
  scene.add(key, rim, fill);

  // ---------------------------------------------------------------- materials
  const shellLight = new THREE.MeshPhysicalMaterial({
    color: 0xdfe3ec,
    roughness: 0.38,
    metalness: 0.05,
    clearcoat: 0.6,
    clearcoatRoughness: 0.3,
  });
  const shellDark = new THREE.MeshPhysicalMaterial({ color: 0x1b1e29, roughness: 0.45, metalness: 0.2, clearcoat: 0.4 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x23262f, roughness: 0.5, metalness: 0.3 });
  const glow = new THREE.MeshStandardMaterial({ color: 0x5ad8ff, emissive: 0x5ad8ff, emissiveIntensity: 1.6 });
  const board = boardTexture();
  const boardMat = new THREE.MeshStandardMaterial({
    map: board,
    emissiveMap: board,
    emissive: 0xffffff,
    emissiveIntensity: 0.9,
    roughness: 0.55,
    metalness: 0.2,
    side: THREE.DoubleSide,
  });
  const button = (hex: number) =>
    new THREE.MeshStandardMaterial({ color: hex, emissive: hex, emissiveIntensity: 0.35, roughness: 0.3, metalness: 0.1 });

  // -------------------------------------------------------------- the pad
  const pad = new THREE.Group();
  const parts: Part[] = [];
  const add = (obj: THREE.Object3D, base: [number, number, number], off: [number, number, number], delay = 0) => {
    obj.position.set(...base);
    pad.add(obj);
    parts.push({ obj, base: new THREE.Vector3(...base), off: new THREE.Vector3(...off), delay });
    return obj;
  };

  const outline = padShape();
  const shellGeometry = new THREE.ExtrudeGeometry(outline, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.1,
    bevelSegments: 5,
    curveSegments: 40,
  });
  shellGeometry.translate(0, 0, -0.08);

  add(new THREE.Mesh(shellGeometry, shellLight), [0, 0, 0.19], [0, 0, 0.8], 0.25);
  add(new THREE.Mesh(shellGeometry, shellDark), [0, 0, -0.19], [0, 0, -0.9], 0.25);

  const boardGeometry = new THREE.ShapeGeometry(outline, 40);
  boardGeometry.scale(0.9, 0.9, 1);
  add(new THREE.Mesh(boardGeometry, boardMat), [0, 0, 0], [0, 0, 0]);
  add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.08), graphite), [0, 0.06, 0.05], [0, 0, 0.35], 0.4);

  const FACE = 0.39; // the front shell's surface

  const stick = () => {
    const g = new THREE.Group();
    const well = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.04, 12, 48), graphite);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.3, 24), graphite);
    shaft.rotation.x = Math.PI / 2;
    shaft.position.z = 0.15;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.25, 0.1, 40), graphite);
    cap.rotation.x = Math.PI / 2;
    cap.position.z = 0.32;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.255, 0.022, 10, 48), glow);
    ring.position.z = 0.375;
    g.add(well, shaft, cap, ring);
    return g;
  };
  add(stick(), [-1.15, 0.3, FACE], [0, 0, 1.6]);
  add(stick(), [0.6, -0.22, FACE], [0, 0, 1.6], 0.05);

  const dpad = new THREE.Group();
  const arm = new THREE.BoxGeometry(0.52, 0.17, 0.1);
  dpad.add(new THREE.Mesh(arm, graphite));
  dpad.add(new THREE.Mesh(arm, graphite).rotateZ(Math.PI / 2));
  add(dpad, [-0.6, -0.22, FACE + 0.05], [0, 0, 1.35], 0.05);

  const buttonGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 32).rotateX(Math.PI / 2);
  const faces: [number, number, number][] = [
    [0, -0.27, 0x34c759],
    [0.27, 0, 0xff4d6d],
    [-0.27, 0, 0x3364ff],
    [0, 0.27, 0xffc23d],
  ];
  for (const [dx, dy, hex] of faces) {
    add(new THREE.Mesh(buttonGeometry, button(hex)), [1.15 + dx, 0.3 + dy, FACE + 0.05], [dx * 0.6, dy * 0.6, 1.45], 0.08);
  }

  const home = new THREE.Group();
  home.add(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.06, 32).rotateX(Math.PI / 2), shellDark));
  home.add(new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.02, 10, 40), glow));
  add(home, [0, 0.5, FACE + 0.02], [0, 0, 1.2], 0.1);

  const bumperGeometry = new THREE.CapsuleGeometry(0.08, 0.7, 6, 16).rotateZ(Math.PI / 2);
  const triggerGeometry = new THREE.BoxGeometry(0.45, 0.22, 0.35);
  for (const side of [-1, 1]) {
    add(new THREE.Mesh(bumperGeometry, graphite).rotateZ(side * -0.18), [side * 1.3, 0.93, 0.05], [0, 0.55, 0.15], 0.3);
    add(new THREE.Mesh(triggerGeometry, graphite).rotateX(-0.4), [side * 1.35, 0.92, -0.3], [0, 0.6, -0.6], 0.3);
  }

  scene.add(pad);

  // the lidar pass through the parts in the real-worlds chapter
  const scan = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 0.025),
    new THREE.MeshBasicMaterial({ color: 0x5ad8ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  scan.rotation.x = -Math.PI / 2;
  pad.add(scan);

  // -------------------------------------------------------------- the props
  const edges = new THREE.LineBasicMaterial({ color: 0x8eaaff, transparent: true, opacity: 0.55 });
  const withEdges = (mesh: THREE.Mesh) => {
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), edges));
    return mesh;
  };
  const coin = () => {
    const gold = new THREE.MeshStandardMaterial({ color: 0xf2c14e, metalness: 1, roughness: 0.22 });
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.07, 48).rotateX(Math.PI / 2), gold));
    g.add(new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.025, 8, 40), gold));
    return g;
  };
  const heart = new THREE.Mesh(
    new THREE.ExtrudeGeometry(heartShape(), {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 4,
    }).center(),
    new THREE.MeshStandardMaterial({ color: 0xff4d6d, emissive: 0xff2d55, emissiveIntensity: 0.45, roughness: 0.3 })
  );

  const props: { obj: THREE.Object3D; r: number; a: number; y: number; speed: number; spin: THREE.Vector3 }[] = [
    {
      obj: withEdges(new THREE.Mesh(new THREE.IcosahedronGeometry(0.42), new THREE.MeshStandardMaterial({ color: 0x3364ff, flatShading: true, metalness: 0.25, roughness: 0.3 }))),
      r: 3.4, a: 0.3, y: 1.45, speed: 0.9, spin: new THREE.Vector3(0.4, 0.6, 0.1),
    },
    { obj: coin(), r: 3.1, a: 2.2, y: -1.25, speed: 1.1, spin: new THREE.Vector3(0, 2.2, 0) },
    {
      obj: new THREE.Mesh(new THREE.OctahedronGeometry(0.36).scale(1, 1.4, 1), new THREE.MeshPhysicalMaterial({ color: 0x5ad8ff, emissive: 0x0b6b8a, emissiveIntensity: 0.6, flatShading: true, roughness: 0.05, metalness: 0.1, clearcoat: 1 })),
      r: 3.6, a: 3.6, y: 0.95, speed: 0.7, spin: new THREE.Vector3(0, 1.2, 0),
    },
    {
      obj: withEdges(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), graphite)),
      r: 3.0, a: 4.6, y: -1.55, speed: 1.3, spin: new THREE.Vector3(0.5, 0.3, 0.2),
    },
    { obj: heart, r: 3.3, a: 5.5, y: 1.65, speed: 0.8, spin: new THREE.Vector3(0, 1.4, 0) },
    { obj: coin(), r: 3.8, a: 1.2, y: -0.35, speed: 1, spin: new THREE.Vector3(0, -2, 0) },
  ];
  for (const prop of props) scene.add(prop.obj);

  const grid = new THREE.GridHelper(80, 80, 0x3364ff, 0x1a2a6c);
  const gridMaterial = grid.material as THREE.Material;
  gridMaterial.transparent = true;
  gridMaterial.opacity = 0.5;
  grid.position.y = -2.5;
  scene.add(grid);

  const pose = { x: 0, y: 0, rx: 0, ry: 0, rz: 0, e: 0 };
  let progress = -1;

  run(({ t, dt, look }) => {
    // the section's own scroll, eased so the pad glides rather than ticks
    const target = sectionProgress(section);
    progress = progress < 0 ? target : progress + (target - progress) * 0.09;
    poseAt(progress, pose);

    const wide = portrait ? 0 : 1;
    // phones keep the pad in the upper half; the copy sits under it
    pad.position.set(pose.x * wide, (portrait ? 1.3 : pose.y) + Math.sin(t * 1.2) * 0.05, 0);
    pad.rotation.set(pose.rx + look.y * 0.1, pose.ry + look.x * 0.2, pose.rz);
    pad.scale.setScalar(portrait ? 0.62 : 0.68);

    for (const part of parts) {
      const k = smooth(clamp01((pose.e - part.delay) / (1 - part.delay)));
      part.obj.position.copy(part.base).addScaledVector(part.off, k);
    }
    boardMat.emissiveIntensity = 0.5 + pose.e * 0.6 + Math.sin(t * 3) * 0.15 * pose.e;

    // the scan only runs in the real-worlds chapter (around p = 0.72)
    const scanning = clamp01(1 - Math.abs(progress - 0.72) / 0.1);
    scan.visible = scanning > 0.01;
    scan.position.set(0, Math.sin(t * 1.6) * 1.3, 0);
    scan.scale.set(1, 1 + scanning * 20, 1);
    (scan.material as THREE.MeshBasicMaterial).opacity = scanning * 0.8;

    // the props circle the pad, wherever it has travelled, and keep behind
    // it — so they never cross the column the copy is in
    const orbit = portrait ? 0.55 : 0.72;
    for (const prop of props) {
      const a = prop.a + progress * Math.PI * prop.speed + t * 0.05;
      prop.obj.position.set(
        pad.position.x + Math.cos(a) * prop.r * orbit,
        pad.position.y + prop.y * (portrait ? 0.9 : 0.65) + Math.sin(t * 0.8 + prop.a) * 0.12,
        Math.sin(a) * prop.r * 0.45 - 1.8
      );
      prop.obj.rotation.x += prop.spin.x * dt;
      prop.obj.rotation.y += prop.spin.y * dt;
      prop.obj.rotation.z += prop.spin.z * dt;
    }

    // the floor runs toward the camera as the page moves
    grid.position.z = (progress * 14 + t * 0.35) % 1;

    camera.position.set(look.x * 0.35, 0.35 - look.y * 0.2, portrait ? 10.5 : 9);
    camera.lookAt(0, portrait ? 0.5 : 0, 0);
  }, onReady);

  return dispose;
}
