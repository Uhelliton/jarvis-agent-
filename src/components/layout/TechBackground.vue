<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);

type Particle = { x: number; y: number; vx: number; vy: number; r: number; a: number };

let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let rafId = 0;
let width = 0;
let height = 0;
let dpr = 1;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function seedParticles() {
  // densidade discreta, proporcional à área
  const count = Math.round(Math.min(70, Math.max(28, (width * height) / 34000)));
  particles = Array.from({ length: count }, () => ({
    x: rand(0, width),
    y: rand(0, height),
    vx: rand(-0.08, 0.08),
    vy: rand(-0.08, 0.08),
    r: rand(0.6, 1.6),
    a: rand(0.15, 0.5),
  }));
}

function resize() {
  if (!canvas.value) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.value.width = width * dpr;
  canvas.value.height = height * dpr;
  canvas.value.style.width = `${width}px`;
  canvas.value.style.height = `${height}px`;
  ctx = canvas.value.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  seedParticles();
}

function drawParticle(p: Particle) {
  if (!ctx) return;
  ctx.beginPath();
  ctx.fillStyle = `rgba(180, 205, 255, ${p.a})`;
  ctx.shadowBlur = 12;
  ctx.shadowColor = "rgba(150, 190, 255, 0.6)";
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
}

function step() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);

  for (const p of particles) {
    // deriva lenta, com wrap suave nas bordas
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;
    drawParticle(p);
  }
  ctx.shadowBlur = 0;

  rafId = requestAnimationFrame(step);
}

onMounted(() => {
  resize();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    if (ctx) {
      for (const p of particles) drawParticle(p);
      ctx.shadowBlur = 0;
    }
  } else {
    step();
  }
  window.addEventListener("resize", resize);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener("resize", resize);
});
</script>

<template>
  <canvas
    ref="canvas"
    class="pointer-events-none fixed inset-0 -z-10"
    aria-hidden="true"
  />
</template>
