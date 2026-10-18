// the pointer itself: a small crystal centred exactly on the hotspot, so
// it sits in the middle of the hud's brackets and what it covers is what
// gets clicked. it spins, leans into the way the mouse is moving, turns
// the signature red and spins up when the hud locks onto something, and squashes on a
// click. the page's ink tints it at rest, so it follows the theme.
import * as THREE from "three";

import { createStage } from "./stage";

// tip to tip and across, in scene units: about 20 x 11 px on the 56px
// canvas, so it fits inside the 26px idle brackets
const HEIGHT = 0.62;
const WIDTH = 0.34;

export function mountCrystal(host: HTMLElement) {
  const { scene, camera, run, dispose } = createStage(host, { fov: 30, maxDpr: 2 });
  camera.position.set(0, 0, 3.2);
  camera.lookAt(0, 0, 0);

  const key = new THREE.DirectionalLight(0xffffff, 2);
  key.position.set(2, 3, 4);
  scene.add(key);

  const material = new THREE.MeshPhysicalMaterial({
    flatShading: true,
    metalness: 0.1,
    roughness: 0.08,
    clearcoat: 1,
    // its own colour over the room's reflections, so it stays saturated
    emissiveIntensity: 0.55,
    envMapIntensity: 0.45,
  });
  // octahedron(0.5) spans 1 unit, so this scales it to WIDTH x HEIGHT
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.5).scale(WIDTH, HEIGHT, WIDTH), material);
  const edges = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.6 });
  gem.add(new THREE.LineSegments(new THREE.EdgesGeometry(gem.geometry), edges));
  // pivot on its centre, the hotspot, so leaning never moves the aim point
  const pivot = new THREE.Group();
  pivot.add(gem);
  scene.add(pivot);

  const ink = new THREE.Color();
  const red = new THREE.Color();
  // the facets are drawn in the page colour, so a white crystal on dark
  // and a black one on light both keep their shape
  const tint = () => {
    const css = getComputedStyle(document.documentElement);
    ink.set(css.getPropertyValue("--ink").trim() || "#f0f0f0");
    red.set(css.getPropertyValue("--hud").trim() || "#ff4040");
    edges.color.set(css.getPropertyValue("--canvas").trim() || "#080808");
  };
  tint();
  const themeWatch = new MutationObserver(tint);
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  // how fast the pointer is going, for the lean
  const motion = { x: 0, y: 0, vx: 0, vy: 0, px: -1, py: -1 };
  const onMove = (e: PointerEvent) => {
    if (motion.px >= 0) {
      motion.x += e.clientX - motion.px;
      motion.y += e.clientY - motion.py;
    }
    motion.px = e.clientX;
    motion.py = e.clientY;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  let locked = false;
  let lock = 0;
  let squash = 0;

  run(({ dt }) => {
    motion.vx += (motion.x - motion.vx) * 0.2;
    motion.vy += (motion.y - motion.vy) * 0.2;
    motion.x = 0;
    motion.y = 0;

    lock += ((locked ? 1 : 0) - lock) * Math.min(1, dt * 10);
    squash += (0 - squash) * Math.min(1, dt * 12);

    gem.rotation.y += dt * (1.6 + lock * 4);
    pivot.rotation.z = THREE.MathUtils.clamp(-motion.vx * 0.03, -0.6, 0.6);
    pivot.rotation.x = THREE.MathUtils.clamp(motion.vy * 0.03, -0.6, 0.6);
    pivot.scale.set(1 + squash * 0.25, (1 + lock * 0.12) * (1 - squash * 0.3), 1 + squash * 0.25);

    material.color.copy(ink).lerp(red, lock);
    material.emissive.copy(material.color);
  });

  return {
    setLocked(value: boolean) {
      locked = value;
    },
    press() {
      squash = 1;
    },
    dispose() {
      themeWatch.disconnect();
      window.removeEventListener("pointermove", onMove);
      dispose();
    },
  };
}
