<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import gsap from "gsap";
import type { AssistantState } from "@/composables/useAssistant";

const props = withDefaults(
  defineProps<{ state?: AssistantState; size?: number }>(),
  { state: "idle", size: 300 }
);

const root = ref<HTMLElement | null>(null);
const halo = ref<HTMLElement | null>(null);
const glowLayer = ref<HTMLElement | null>(null);
const ring = ref<HTMLElement | null>(null);
const core = ref<HTMLElement | null>(null);
const dotsWrap = ref<HTMLElement | null>(null);

const currentState = ref<AssistantState>(props.state);

/* Waveform reativa --------------------------------------------------------- */
const WIDTH = 240;
const HEIGHT = 120;
const POINTS = 96;

const amplitude = ref(6);
const speed = ref(0.5);
let phase = 0;
let rafId = 0;
let frame = 0;

/* Três camadas de onda para um visual rico de "voz" */
const pathBack = ref("");
const pathMid = ref("");
const pathFront = ref("");

/* Modulação por segmento — simula fala (equalizer orgânico) */
const voiceMod = new Float32Array(POINTS + 1).fill(1);
const voiceTarget = new Float32Array(POINTS + 1).fill(1);

const voiceActive = computed(
  () => currentState.value === "listening" || currentState.value === "responding"
);

function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}

function updateVoice() {
  if (voiceActive.value) {
    // re-sorteia alvos periodicamente para um movimento de fala natural
    if (frame % 5 === 0) {
      for (let i = 0; i <= POINTS; i++) {
        voiceTarget[i] = clamp(0.45 + Math.random() * 1.05, 0.3, 1.6);
      }
    }
    for (let i = 0; i <= POINTS; i++) {
      voiceMod[i] += (voiceTarget[i] - voiceMod[i]) * 0.18;
    }
  } else {
    // relaxa de volta para uma onda uniforme
    for (let i = 0; i <= POINTS; i++) {
      voiceMod[i] += (1 - voiceMod[i]) * 0.12;
    }
  }
}

function buildWave(freq: number, ampFactor: number, phaseOffset: number) {
  const mid = HEIGHT / 2;
  let d = `M 0 ${mid}`;
  for (let i = 0; i <= POINTS; i++) {
    const x = (i / POINTS) * WIDTH;
    // envelope suaviza as pontas (zero nas bordas, máximo no centro)
    const envelope = Math.sin((i / POINTS) * Math.PI);
    const t = (i / POINTS) * Math.PI * freq + phase + phaseOffset;
    const y =
      mid + Math.sin(t) * amplitude.value * ampFactor * envelope * voiceMod[i];
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

function buildPaths() {
  pathBack.value = buildWave(3, 1.15, 0.9);
  pathMid.value = buildWave(4, 0.8, 0.0);
  pathFront.value = buildWave(6, 0.45, 2.1);
}

function loop() {
  frame++;
  phase += speed.value * 0.06;
  updateVoice();
  buildPaths();
  rafId = requestAnimationFrame(loop);
}

/* Tweens contínuos --------------------------------------------------------- */
let breatheTween: gsap.core.Tween | null = null;
let ringTween: gsap.core.Tween | null = null;
let dotsTween: gsap.core.Tween | null = null;

type StateCfg = {
  amp: number;
  spd: number;
  spin: number;
  scale: number;
  glow: number;
};

const config: Record<AssistantState, StateCfg> = {
  idle: { amp: 5, spd: 0.5, spin: 30, scale: 1.0, glow: 0.5 },
  listening: { amp: 20, spd: 1.2, spin: 16, scale: 1.04, glow: 0.85 },
  thinking: { amp: 9, spd: 2.4, spin: 5, scale: 1.02, glow: 0.72 },
  responding: { amp: 28, spd: 1.6, spin: 12, scale: 1.06, glow: 1.0 },
};

function applyState(state: AssistantState) {
  currentState.value = state;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const c = config[state];

  gsap.to(amplitude, { value: reduce ? 5 : c.amp, duration: 0.8, ease: "power2.out" });
  gsap.to(speed, { value: c.spd, duration: 0.8, ease: "power2.out" });

  if (core.value) {
    gsap.to(core.value, { scale: c.scale, duration: 0.9, ease: "power2.out" });
  }

  if (glowLayer.value) {
    gsap.to(glowLayer.value, { opacity: c.glow, duration: 0.9, ease: "power2.out" });
  }

  if (ring.value && !reduce) {
    ringTween?.kill();
    ringTween = gsap.to(ring.value, {
      rotate: "+=360",
      duration: c.spin,
      ease: "none",
      repeat: -1,
    });
  }

  // Partículas orbitando apenas em "thinking" (sensação de processamento)
  if (dotsWrap.value && !reduce) {
    dotsTween?.kill();
    if (state === "thinking") {
      gsap.to(dotsWrap.value, { opacity: 1, duration: 0.4 });
      dotsTween = gsap.to(dotsWrap.value, {
        rotate: "+=360",
        duration: 2.2,
        ease: "none",
        repeat: -1,
      });
    } else {
      gsap.to(dotsWrap.value, { opacity: 0, duration: 0.4 });
    }
  }
}

onMounted(() => {
  buildPaths();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    loop();
    if (halo.value) {
      breatheTween = gsap.to(halo.value, {
        scale: 1.12,
        opacity: 0.95,
        duration: 3.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }
  applyState(props.state);
});

watch(
  () => props.state,
  (s) => applyState(s)
);

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
  breatheTween?.kill();
  ringTween?.kill();
  dotsTween?.kill();
});

const dimension = computed(() => `${props.size}px`);
</script>

<template>
  <div
    ref="root"
    class="relative grid place-items-center"
    :style="{ width: dimension, height: dimension }"
    role="img"
    aria-label="Assistente JARVIS"
  >
    <!-- Glow externo controlado por estado -->
    <div
      ref="glowLayer"
      class="pointer-events-none absolute inset-0 rounded-full blur-2xl"
      style="
        opacity: 0.5;
        background: radial-gradient(
          circle at 50% 50%,
          oklch(0.7 0.24 300 / 0.65),
          oklch(0.6 0.2 280 / 0.32) 50%,
          transparent 72%
        );
      "
    />

    <!-- Halo respirando -->
    <div
      ref="halo"
      class="pointer-events-none absolute inset-[6%] rounded-full blur-xl"
      style="
        background: radial-gradient(
          circle at 50% 45%,
          oklch(0.72 0.22 300 / 0.45),
          transparent 68%
        );
      "
    />

    <!-- Anel neon violeta (base sólida brilhante, como na referência) -->
    <div
      class="absolute rounded-full"
      :style="{ width: '94%', height: '94%' }"
      style="
        background: transparent;
        border: 2px solid oklch(0.72 0.2 300 / 0.85);
        box-shadow:
          0 0 24px oklch(0.68 0.24 300 / 0.85),
          0 0 60px oklch(0.6 0.2 290 / 0.5),
          inset 0 0 22px oklch(0.7 0.22 300 / 0.55);
      "
    />

    <!-- Arco rotativo (vida no anel) -->
    <div
      ref="ring"
      class="absolute rounded-full"
      :style="{ width: '94%', height: '94%' }"
      style="
        background: conic-gradient(
          from 0deg,
          transparent 0deg,
          oklch(0.92 0.13 200 / 0.95) 30deg,
          oklch(0.85 0.18 300 / 0.95) 90deg,
          transparent 160deg,
          transparent 360deg
        );
        -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px));
        mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px));
      "
    />

    <!-- Partículas orbitando (estado: pensando) -->
    <div
      ref="dotsWrap"
      class="pointer-events-none absolute"
      :style="{ width: '88%', height: '88%', opacity: 0 }"
    >
      <span
        v-for="i in 3"
        :key="i"
        class="absolute left-1/2 top-1/2 size-2 rounded-full"
        :style="{
          transform: `translate(-50%, -50%) rotate(${(i - 1) * 120}deg) translateY(-${props.size * 0.41}px)`,
          background: 'oklch(0.92 0.13 200)',
          boxShadow: '0 0 10px oklch(0.85 0.16 240 / 0.9)',
        }"
      />
    </div>

    <!-- Núcleo escuro profundo -->
    <div
      ref="core"
      class="relative grid place-items-center overflow-hidden rounded-full"
      :style="{ width: '80%', height: '80%' }"
      style="
        background:
          radial-gradient(circle at 38% 30%, oklch(0.5 0.18 290 / 0.45), transparent 48%),
          radial-gradient(circle at 60% 72%, oklch(0.32 0.16 285 / 0.7), oklch(0.12 0.04 270 / 0.98) 72%);
        box-shadow:
          inset 0 0 70px oklch(0.45 0.2 285 / 0.55),
          inset 0 0 22px oklch(0.8 0.12 290 / 0.35),
          0 0 50px -6px oklch(0.6 0.22 290 / 0.5);
      "
    >
      <!-- Reflexo superior -->
      <div
        class="absolute left-1/2 top-3 h-1/3 w-1/2 -translate-x-1/2 rounded-full blur-md"
        style="background: radial-gradient(circle, oklch(1 0 0 / 0.35), transparent 70%);"
      />

      <!-- Waveform (3 camadas) -->
      <svg
        :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
        class="relative w-[74%]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="wave-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="oklch(0.85 0.14 200)" />
            <stop offset="50%" stop-color="oklch(0.9 0.1 250)" />
            <stop offset="100%" stop-color="oklch(0.75 0.2 300)" />
          </linearGradient>
        </defs>
        <path
          :d="pathBack"
          fill="none"
          stroke="url(#wave-grad)"
          stroke-width="2"
          stroke-linecap="round"
          opacity="0.35"
          style="filter: drop-shadow(0 0 5px oklch(0.7 0.16 270 / 0.6));"
        />
        <path
          :d="pathMid"
          fill="none"
          stroke="url(#wave-grad)"
          stroke-width="2.2"
          stroke-linecap="round"
          opacity="0.6"
        />
        <path
          :d="pathFront"
          fill="none"
          stroke="url(#wave-grad)"
          stroke-width="2.6"
          stroke-linecap="round"
          style="filter: drop-shadow(0 0 7px oklch(0.78 0.16 250 / 0.9));"
        />
      </svg>
    </div>
  </div>
</template>