// the disciplines' turntable: a d20, a wooden crate and a point-cloud globe
// on one rotating plate. as each card stacks on the last, the plate turns a
// third to bring that card's object to the front.
import * as THREE from "three";

import { stackProgress } from "@/lib/stack";
import { createStage } from "./stage";

export type Model = "d20" | "crate" | "globe";

const smooth = (t: number) => t * t * (3 - 2 * t);

function build(model: Model) {
  if (model === "d20") {
    const die = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.78),
      new THREE.MeshStandardMaterial({ color: 0x9a9a9a, flatShading: true, metalness: 0.25, roughness: 0.3 })
    );
    die.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(die.geometry),
        new THREE.LineBasicMaterial({ color: 0xc8c8c8, transparent: true, opacity: 0.7 })
      )
    );
    return die;
  }

  // the wooden crate from the 3d work, built in code like the others: dark
  // slats sunk into four faces, a brace across the sides, a cap on each corner
  if (model === "crate") {
    const crate = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({ color: 0x9c5a28, roughness: 0.7 });
    const metal = new THREE.MeshStandardMaterial({ color: 0x1e1c24, metalness: 0.4, roughness: 0.45 });
    crate.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), wood));

    // one bar through the box shows as a slat on the front and back;
    // turned a quarter, on the top and bottom
    for (const x of [-0.24, 0, 0.24]) {
      const upright = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.72, 1.02), metal);
      const flat = upright.clone();
      upright.position.x = flat.position.x = x;
      flat.rotation.x = Math.PI / 2;
      crate.add(upright, flat);
    }

    // stays inside the box except at the two sides, where it reads as an x
    const brace = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.09, 1.25), metal);
    brace.rotation.x = Math.PI / 4;
    crate.add(brace);

    const cap = new THREE.BoxGeometry(0.22, 0.22, 0.22);
    for (const x of [-0.5, 0.5]) {
      for (const y of [-0.5, 0.5]) {
        for (const z of [-0.5, 0.5]) {
          const corner = new THREE.Mesh(cap, metal);
          corner.position.set(x, y, z);
          crate.add(corner);
        }
      }
    }

    crate.rotation.set(0.35, 0.6, 0);
    return crate;
  }

  // the globe: a fibonacci sphere of points over a dark core, with an orbit
  const globe = new THREE.Group();
  const count = 900;
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * Math.PI * (3 - Math.sqrt(5));
    points.set([Math.cos(a) * r * 0.8, y * 0.8, Math.sin(a) * r * 0.8], i * 3);
  }
  const cloud = new THREE.BufferGeometry();
  cloud.setAttribute("position", new THREE.BufferAttribute(points, 3));
  globe.add(new THREE.Points(cloud, new THREE.PointsMaterial({ color: 0xffffff, size: 0.035 })));
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(0.77, 32, 24), new THREE.MeshStandardMaterial({ color: 0x0b0b0b, roughness: 0.8 })));
  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(1.08, 0.008, 6, 96),
    new THREE.MeshBasicMaterial({ color: 0xc8c8c8, transparent: true, opacity: 0.6 })
  );
  orbit.rotation.set(1.2, 0.3, 0);
  globe.add(orbit);
  return globe;
}

/** mounts the turntable into `host`. the plate follows the cards marked
 *  [data-stack-card] inside `section`, and each card's data-model says
 *  which object it brings round. returns a cleanup */
export function mountTurntable(host: HTMLElement, section: HTMLElement, onReady: () => void) {
  const cards = [...section.querySelectorAll<HTMLElement>("[data-stack-card]")];
  const models = cards.map((card) => (card.dataset.model ?? "d20") as Model);
  const { scene, camera, run, dispose } = createStage(host, { fov: 30 });

  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 5, 6);
  const rim = new THREE.DirectionalLight(0xffffff, 2.6);
  rim.position.set(-5, 2, -4);
  scene.add(key, rim);

  const RADIUS = 1.9;
  const step = (Math.PI * 2) / models.length;
  const table = new THREE.Group();
  const objects = models.map((model, i) => {
    const object = build(model);
    object.position.set(Math.sin(i * step) * RADIUS, 0, Math.cos(i * step) * RADIUS);
    table.add(object);
    return object;
  });

  // the plate, its lit rim, and a notch under each object
  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(2.7, 2.7, 0.06, 96),
    // matte: at this low angle any sheen mirrors the room and reads grey
    new THREE.MeshLambertMaterial({ color: 0x070707 })
  );
  plate.position.y = -1.05;
  const rimGlow = new THREE.Mesh(
    new THREE.TorusGeometry(2.7, 0.012, 8, 160),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  rimGlow.rotation.x = Math.PI / 2;
  rimGlow.position.y = -1.02;
  table.add(plate, rimGlow);
  for (let i = 0; i < models.length; i++) {
    const notch = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.06), new THREE.MeshBasicMaterial({ color: 0x9a9a9a }));
    notch.position.set(Math.sin(i * step) * 2.55, -1.01, Math.cos(i * step) * 2.55);
    notch.rotation.y = i * step;
    table.add(notch);
  }
  scene.add(table);

  let turn = 0;

  run(({ t, dt, look }) => {
    // snap toward each card's object: eased within every third of a turn
    const stacked = Math.min(models.length - 1, stackProgress(cards));
    const whole = Math.floor(stacked);
    const target = whole + smooth(smooth(stacked - whole));
    turn += (target - turn) * Math.min(1, dt * 8);

    table.rotation.y = -turn * step + look.x * 0.15;
    objects.forEach((object, i) => {
      // the one facing the camera grows; the others step back
      const facing = Math.max(0, 1 - Math.abs(turn - i));
      object.scale.setScalar(0.72 + facing * 0.38);
      object.rotation.y += dt * (0.25 + facing * 0.5);
      object.position.y = Math.sin(t * 1.3 + i * 2) * 0.06 + facing * 0.1;
    });

    camera.position.set(look.x * 0.3, 0.75 - look.y * 0.2, 7.4);
    camera.lookAt(0, -0.05, 0);
  }, onReady);

  return dispose;
}
