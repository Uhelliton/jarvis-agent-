<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as THREE from "three";
import gsap from "gsap";
import type { AssistantState } from "@/composables/useAssistant";

const props = withDefaults(
  defineProps<{ state?: AssistantState; size?: number }>(),
  { state: "idle", size: 300 }
);

const canvasWrap = ref<HTMLElement | null>(null);

/* ------------------------------------------------------------------ shaders */
const noiseGLSL = /* glsl */ `
// Ashima Arts — Simplex 3D noise (MIT)
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uSpeed;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  ${noiseGLSL}
  void main(){
    vNormal = normalize(normalMatrix * normal);
    float t = uTime * uSpeed;
    // ruído de baixa frequência (forma do "blob") + ondulação fina
    float n  = snoise(position * uFrequency + t);
    float n2 = snoise(position * (uFrequency * 2.7) + t * 1.6) * 0.4;
    float displacement = (n + n2) * uAmplitude;
    vElevation = displacement;
    vec3 newPos = position + normal * displacement;
    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uGlow;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main(){
    vec3 viewDir = normalize(vViewPosition);
    // fresnel — borda brilhante (rim light)
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);
    vec3 color = mix(uColorA, uColorB, smoothstep(-0.25, 0.35, vElevation));
    color += fresnel * uGlow;
    float alpha = clamp(0.55 + fresnel * 0.9, 0.0, 1.0);
    gl_FragColor = vec4(color, alpha);
  }
`;

/* --------------------------------------------------------------- three setup */
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let mesh: THREE.Mesh | null = null;
let points: THREE.Points | null = null;
let material: THREE.ShaderMaterial | null = null;
let clock: THREE.Clock | null = null;
let rafId = 0;

const uniforms = {
  uTime: { value: 0 },
  uAmplitude: { value: 0.12 },
  uFrequency: { value: 1.4 },
  uSpeed: { value: 0.35 },
  uGlow: { value: 0.6 },
  uColorA: { value: new THREE.Color("#3a1d6e") },
  uColorB: { value: new THREE.Color("#22d3ee") },
};

/* parâmetros por estado */
type StateCfg = {
  amp: number;
  freq: number;
  speed: number;
  glow: number;
  colorA: string;
  colorB: string;
  spin: number;
};

const config: Record<AssistantState, StateCfg> = {
  idle:       { amp: 0.10, freq: 1.3, speed: 0.30, glow: 0.55, colorA: "#3a1d6e", colorB: "#7c5cff", spin: 0.10 },
  listening:  { amp: 0.26, freq: 1.6, speed: 0.75, glow: 0.95, colorA: "#1e3a8a", colorB: "#22d3ee", spin: 0.25 },
  thinking:   { amp: 0.16, freq: 3.0, speed: 1.60, glow: 0.80, colorA: "#4c1d95", colorB: "#a855f7", spin: 0.55 },
  responding: { amp: 0.34, freq: 1.9, speed: 1.10, glow: 1.20, colorA: "#5b21b6", colorB: "#38bdf8", spin: 0.35 },
};

const spinSpeed = { value: config.idle.spin };

function applyState(state: AssistantState) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const c = config[state];

  gsap.to(uniforms.uAmplitude, { value: reduce ? 0.08 : c.amp, duration: 0.9, ease: "power2.out" });
  gsap.to(uniforms.uFrequency, { value: c.freq, duration: 0.9, ease: "power2.out" });
  gsap.to(uniforms.uSpeed, { value: reduce ? 0.2 : c.speed, duration: 0.9, ease: "power2.out" });
  gsap.to(uniforms.uGlow, { value: c.glow, duration: 0.9, ease: "power2.out" });
  gsap.to(spinSpeed, { value: reduce ? 0.05 : c.spin, duration: 1.2, ease: "power2.out" });
  gsap.to(uniforms.uColorA.value, { ...new THREE.Color(c.colorA), duration: 1.0, ease: "power2.out" });
  gsap.to(uniforms.uColorB.value, { ...new THREE.Color(c.colorB), duration: 1.0, ease: "power2.out" });
}

function buildParticles() {
  const COUNT = 1200;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    // distribuição em casca esférica (raio 1.35–1.7)
    const r = 1.35 + Math.random() * 0.35;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.025,
    color: new THREE.Color("#9bd9ff"),
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  return new THREE.Points(geo, mat);
}

function init() {
  const wrap = canvasWrap.value;
  if (!wrap) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.0;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(props.size, props.size);
  renderer.setClearColor(0x000000, 0);
  wrap.appendChild(renderer.domElement);

  material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const geometry = new THREE.IcosahedronGeometry(1, 32);
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  points = buildParticles();
  scene.add(points);

  clock = new THREE.Clock();
  applyState(props.state);
  animate();
}

function animate() {
  rafId = requestAnimationFrame(animate);
  if (!renderer || !scene || !camera || !clock) return;
  const dt = clock.getDelta();
  uniforms.uTime.value += dt;
  if (mesh) {
    mesh.rotation.y += spinSpeed.value * dt;
    mesh.rotation.x += spinSpeed.value * 0.4 * dt;
  }
  if (points) {
    points.rotation.y -= spinSpeed.value * 0.6 * dt;
  }
  renderer.render(scene, camera);
}

function resize() {
  if (!renderer || !camera) return;
  renderer.setSize(props.size, props.size);
  camera.aspect = 1;
  camera.updateProjectionMatrix();
}

onMounted(init);

watch(() => props.state, (s) => applyState(s));
watch(() => props.size, resize);

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
  mesh?.geometry.dispose();
  material?.dispose();
  if (points) {
    points.geometry.dispose();
    (points.material as THREE.Material).dispose();
  }
  renderer?.dispose();
  if (renderer?.domElement && canvasWrap.value?.contains(renderer.domElement)) {
    canvasWrap.value.removeChild(renderer.domElement);
  }
});

const dimension = computed(() => `${props.size}px`);
</script>

<template>
  <div
    ref="canvasWrap"
    class="relative grid place-items-center"
    :style="{ width: dimension, height: dimension }"
    role="img"
    aria-label="Assistente JARVIS"
  />
</template>
