// the pointer itself: a small crystal standing on its tip, the tip exactly
// on the hotspot. it spins, leans into the way the mouse is moving, turns
// gold and spins up when the hud locks onto something, and squashes on a
// click. the hud's own colour tints it, so it follows the theme.
import * as THREE from "three";

import { createStage } from "./stage";

const HEIGHT = 1.15; // tip to tip, in scene units

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
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.5).scale(0.62, HEIGHT, 0.62), material);
  gem.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(gem.geometry),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })
    )
  );
  // pivot on the tip, so leaning never moves the hotspot
  gem.position.y = HEIGHT / 2;
  const pivot = new THREE.Group();
  pivot.position.y = -HEIGHT / 2;
  pivot.add(gem);
  scene.add(pivot);

  const hud = new THREE.Color();
  const gold = new THREE.Color(0xffc23d);
  const tint = () => {
    hud.set(getComputedStyle(document.documentElement).getPropertyValue("--hud").trim() || "#5ad8ff");
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

    material.color.copy(hud).lerp(gold, lock);
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
