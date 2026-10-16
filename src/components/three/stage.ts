// what every mesh scene here shares: a transparent renderer filling its
// host, studio light from a room environment, eased pointer parallax, and
// a loop that only runs while the host is on screen and the tab is
// visible. (the hero's point cloud predates this and keeps its own loop.)
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type Frame = { t: number; dt: number; look: { x: number; y: number } };

export function createStage(
  host: HTMLElement,
  { fov = 32, maxDpr = 1.75, onResize }: { fov?: number; maxDpr?: number; onResize?: (camera: THREE.PerspectiveCamera) => void } = {}
) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 60);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    onResize?.(camera);
    camera.updateProjectionMatrix();
  };
  const sizeWatch = new ResizeObserver(resize);
  sizeWatch.observe(host);
  resize();

  const look = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e: PointerEvent) => {
    look.tx = (e.clientX / window.innerWidth) * 2 - 1;
    look.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  let onScreen = true;
  let frame = 0;
  let draw: ((f: Frame) => void) | undefined;
  let ready: (() => void) | undefined;
  const start = performance.now();
  let last = start;

  const loop = () => {
    cancelAnimationFrame(frame);
    if (!onScreen || document.hidden || !draw) return;
    frame = requestAnimationFrame(loop);

    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    look.x += (look.tx - look.x) * 0.05;
    look.y += (look.ty - look.y) * 0.05;

    draw({ t: (now - start) / 1000, dt, look });
    renderer.render(scene, camera);
    ready?.();
    ready = undefined;
  };

  const seen = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) loop();
  });
  seen.observe(host);
  const onVisibility = () => !document.hidden && loop();
  document.addEventListener("visibilitychange", onVisibility);

  return {
    scene,
    camera,
    renderer,
    /** begin drawing; `onReady` fires after the first frame */
    run(update: (f: Frame) => void, onReady?: () => void) {
      draw = update;
      ready = onReady;
      loop();
    },
    dispose() {
      cancelAnimationFrame(frame);
      seen.disconnect();
      sizeWatch.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh || node instanceof THREE.LineSegments || node instanceof THREE.Points) {
          node.geometry.dispose();
          for (const material of [node.material].flat()) {
            for (const value of Object.values(material)) if (value instanceof THREE.Texture) value.dispose();
            material.dispose();
          }
        }
      });
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

/** how far `section` has scrolled through the viewport, 0..1 */
export const sectionProgress = (section: HTMLElement) => {
  const rect = section.getBoundingClientRect();
  return Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight)));
};
