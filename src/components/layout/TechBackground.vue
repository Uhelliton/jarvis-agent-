<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let rafId = 0;
let width = 0;
let height = 0;
let dpr = 1;
let gridOffset = 0;
let mouseX = -9999;
let mouseY = -9999;

const LINK_DIST = 140; // distância máx. para conectar partículas
const GRID = 46; // espaçamento do grid de fundo

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function seedParticles() {
  // densidade proporcional à área, com limites sãos
  const count = Math.round(Math.min(130, Math.max(40, (width * height) / 16000)));
  particles = Array.from({ length: count }, () => ({
    x: rand(0, width),
    y: rand(0, height),
    vx: rand(-0.25, 0.25),
    vy: rand(-0.25, 0.25),
    r: rand(0.6, 1.8),
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

function drawGrid() {
  if (!ctx) return;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(140, 170, 255, 0.045)";
  const off = gridOffset % GRID;
  ctx.beginPath();
  for (let x = -GRID + off; x <= width; x += GRID) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = -GRID + off; y <= height; y += GRID) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
}

function step() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);

  gridOffset += 0.15;
  drawGrid();

  // atualiza posições
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
  }

  // linhas de conexão
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < LINK_DIST) {
        const alpha = (1 - dist / LINK_DIST) * 0.4;
        ctx.strokeStyle = `rgba(150, 130, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // realce ao redor do cursor (parallax sutil de atração visual)
    const mdx = a.x - mouseX;
    const mdy = a.y - mouseY;
    const mdist = Math.hypot(mdx, mdy);
    if (mdist < 180) {
      const alpha = (1 - mdist / 180) * 0.5;
      ctx.strokeStyle = `rgba(120, 220, 255, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    }
  }

  // nós (partículas) com glow
  for (const p of particles) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(160, 215, 255, 0.85)";
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(120, 200, 255, 0.9)";
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  rafId = requestAnimationFrame(step);
}

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}
function onMouseLeave() {
  mouseX = -9999;
  mouseY = -9999;
}

onMounted(() => {
  resize();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    // quadro estático único
    if (ctx) {
      drawGrid();
      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(160, 215, 255, 0.6)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else {
    step();
  }
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseout", onMouseLeave);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener("resize", resize);
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseout", onMouseLeave);
});
</script>

<template>
  <canvas
    ref="canvas"
    class="pointer-events-none fixed inset-0 -z-10"
    aria-hidden="true"
  />
</template>
