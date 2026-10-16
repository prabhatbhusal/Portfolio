// the hero's point cloud. its own module so three.js (the heavy part) is a
// separate chunk, fetched after the page is already interactive.
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uBuild;
  uniform float uScan;
  uniform float uPixel;
  attribute vec3 aFrom;
  attribute float aSeed;
  varying float vGlow;
  varying float vHeight;
  varying float vAlpha;

  void main() {
    // each point lands at its own moment, like a reconstruction resolving
    float t = clamp((uBuild - aSeed * 0.6) / 0.4, 0.0, 1.0);
    t = 1.0 - pow(1.0 - t, 3.0);
    vec3 p = mix(aFrom, position, t);

    // the lidar sweep: a band travelling front to back lights what it passes
    float d = p.z - uScan;
    vGlow = exp(-d * d * 5.0) * t;
    p.y += vGlow * 0.06;

    vHeight = position.y;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.0 + vGlow * 3.0 + aSeed * 1.0) * uPixel * (7.0 / -mv.z);
    // far points thin out into haze
    vAlpha = t * smoothstep(-24.0, -7.0, mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uLight;
  uniform float uFade;
  varying float vGlow;
  varying float vHeight;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.05, r);

    // elevation ramp: valley floor deep blue, ridges brand blue, peaks snow
    float h = clamp((vHeight + 0.6) / 2.8, 0.0, 1.0);
    vec3 col = mix(vec3(0.16, 0.30, 0.85), vec3(0.45, 0.65, 1.0), h);
    col = mix(col, vec3(0.93, 0.96, 1.0), smoothstep(0.72, 1.0, h));
    col = mix(col, vec3(0.36, 0.86, 1.0), vGlow);

    float a = soft * vAlpha * uFade * (0.6 + 0.6 * h + vGlow);
    // on a light page additive light vanishes, so the points go ink-dark
    if (uLight > 0.5) { col = mix(vec3(0.16, 0.32, 0.88) * (0.55 + 0.45 * h), vec3(0.0, 0.55, 0.85), vGlow); a *= 0.9; }
    gl_FragColor = vec4(col, a);
  }
`;

// value noise -> ridged fbm. deterministic, so every visit sees the same range
const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const noise = (x: number, y: number) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
};

const ridged = (x: number, y: number) => {
  let sum = 0;
  let amp = 0.55;
  let freq = 1;
  let prev = 1;
  for (let o = 0; o < 5; o++) {
    let n = 1 - Math.abs(noise(x * freq, y * freq) * 2 - 1);
    n *= n;
    sum += n * amp * prev;
    prev = n;
    freq *= 2.03;
    amp *= 0.5;
  }
  return sum;
};

/** mounts the scene into `host`; returns a cleanup. throws without webgl */
export function mountTerrain(host: HTMLElement, onReady: () => void) {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 60);

  // fewer points on small screens, which are also the weaker gpus
  const small = window.matchMedia("(max-width: 768px)").matches;
  const COLS = small ? 150 : 260;
  const ROWS = small ? 110 : 180;
  const WIDTH = 18;
  const DEPTH = 12;
  const count = COLS * ROWS;

  const position = new Float32Array(count * 3);
  const from = new Float32Array(count * 3);
  const seed = new Float32Array(count);

  for (let j = 0, k = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++, k++) {
      // jittered off the grid so it reads as scan returns, not graph paper
      const x = (i / (COLS - 1) - 0.5) * WIDTH + (hash(i, j) - 0.5) * (WIDTH / COLS);
      const z = (j / (ROWS - 1) - 0.5) * DEPTH + (hash(j, i) - 0.5) * (DEPTH / ROWS);
      // a valley down the middle, ranges rising behind it — a city in a bowl
      const valley = Math.min(1, Math.abs(x) / 5.5) ** 1.6;
      const back = THREE.MathUtils.smoothstep(-z, -4, 6);
      const y = ridged(x * 0.22 + 7.3, z * 0.22 + 2.1) * (0.6 + 2.8 * back) * (0.3 + 0.7 * valley) - 0.6;

      position.set([x, y, z], k * 3);
      from.set([x * 1.6 + (hash(k, 1) - 0.5) * 6, y + 5 + hash(k, 2) * 8, z + (hash(k, 3) - 0.5) * 6], k * 3);
      seed[k] = hash(k, 7);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("aFrom", new THREE.BufferAttribute(from, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

  const uniforms = {
    uBuild: { value: 0 },
    uScan: { value: 99 },
    uPixel: { value: renderer.getPixelRatio() },
    uLight: { value: 0 },
    uFade: { value: 1 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // the page theme decides the blend: glowing light on dark, ink on light
  const applyTheme = () => {
    const light = !document.documentElement.classList.contains("dark");
    uniforms.uLight.value = light ? 1 : 0;
    material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    material.needsUpdate = true;
  };
  applyTheme();
  const themeWatch = new MutationObserver(applyTheme);
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // portrait phones see a narrow slice; widen the lens so the range fits
    camera.fov = camera.aspect < 1 ? 66 : 48;
    camera.updateProjectionMatrix();
  };
  const sizeWatch = new ResizeObserver(resize);
  sizeWatch.observe(host);
  resize();

  // pointer parallax, eased toward the target every frame
  const look = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e: PointerEvent) => {
    look.tx = (e.clientX / window.innerWidth) * 2 - 1;
    look.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  // only draw while the hero is on screen and the tab is visible
  let onScreen = true;
  const seen = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) loop();
  });
  seen.observe(host);

  const start = performance.now();
  let frame = 0;
  let readyFired = false;

  const loop = () => {
    cancelAnimationFrame(frame);
    if (!onScreen || document.hidden) return;
    frame = requestAnimationFrame(loop);

    const t = (performance.now() - start) / 1000;
    uniforms.uBuild.value = Math.min(1, t / 2.6);

    // sweep for 4.5s, rest 1.5s, repeat
    const cycle = (t % 6) / 4.5;
    uniforms.uScan.value = cycle <= 1 ? 7 - cycle * 14 : 99;

    // scrolling the hero away flies the camera in and fades the cloud
    const scrolled = Math.min(1, window.scrollY / Math.max(1, host.clientHeight));
    uniforms.uFade.value = 1 - scrolled * 0.7;

    look.x += (look.tx - look.x) * 0.04;
    look.y += (look.ty - look.y) * 0.04;
    // low and close: the valley fills the lower half, ranges rise behind the name
    camera.position.set(look.x * 0.9, 1.25 - scrolled * 0.5 - look.y * 0.25, 7.4 - scrolled * 3);
    camera.lookAt(0, 0.95, -2);
    points.rotation.y = Math.sin(t * 0.05) * 0.08;

    renderer.render(scene, camera);

    if (!readyFired) {
      readyFired = true;
      onReady();
    }
  };

  const onVisibility = () => !document.hidden && loop();
  document.addEventListener("visibilitychange", onVisibility);
  loop();

  return () => {
    cancelAnimationFrame(frame);
    seen.disconnect();
    sizeWatch.disconnect();
    themeWatch.disconnect();
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
