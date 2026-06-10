<script setup lang="ts">
import { Motion } from "motion-v";
import { Mic, Keyboard, Paperclip, Cloud } from "lucide-vue-next";
import AssistantOrb from "@/components/orb/AssistantOrb3D.vue";
import AgendaCard from "@/components/cards/AgendaCard.vue";
import RemindersCard from "@/components/cards/RemindersCard.vue";
import GoalsCard from "@/components/cards/GoalsCard.vue";
import SuggestionsCard from "@/components/cards/SuggestionsCard.vue";
import SummaryCard from "@/components/cards/SummaryCard.vue";
import LifeCard from "@/components/cards/LifeCard.vue";
import QuickNotesCard from "@/components/cards/QuickNotesCard.vue";
import { useAssistant } from "@/composables/useAssistant";
import { useGreeting } from "@/composables/useGreeting";
import { user, weather } from "@/data/mock";

const { state, statusLabel, reply, startListening } = useAssistant();
const { message, fullDate } = useGreeting(user.name);

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});
</script>

<template>
  <div
    class="mx-auto grid w-full max-w-440 gap-5 px-4 pb-4 sm:px-6 lg:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)_minmax(0,0.85fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]"
  >
    <!-- Coluna esquerda -->
    <div class="order-2 flex flex-col gap-5 lg:order-1">
      <Motion v-bind="fade(0.05)"><AgendaCard /></Motion>
      <Motion v-bind="fade(0.12)"><RemindersCard /></Motion>
      <Motion v-bind="fade(0.19)"><GoalsCard /></Motion>
    </div>

    <!-- Coluna central -->
    <div class="order-1 flex flex-col items-center gap-6 lg:order-2 lg:pt-2">
      <Motion
        :initial="{ opacity: 0, y: -10 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
        class="text-center"
      >
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
          {{ message }} <span class="inline-block animate-float">👋</span>
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">{{ fullDate }}</p>
        <p class="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          {{ weather.description }} <Cloud class="size-3.5" /> {{ weather.temperature }}
        </p>
      </Motion>

      <Motion
        :initial="{ opacity: 0, scale: 0.85 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }"
        class="relative grid place-items-center"
      >
        <AssistantOrb :state="state" :size="300" />
        <Transition
          enter-active-class="transition duration-300"
          enter-from-class="opacity-0 translate-y-1"
          leave-active-class="transition duration-200"
          leave-to-class="opacity-0"
        >
          <span
            v-if="statusLabel"
            class="absolute -bottom-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-neon-cyan backdrop-blur"
          >
            {{ statusLabel }}
          </span>
        </Transition>
      </Motion>

      <Motion v-bind="fade(0.2)" class="flex flex-col items-center gap-5">
        <Transition mode="out-in"
          enter-active-class="transition duration-300"
          enter-from-class="opacity-0 translate-y-1"
          leave-active-class="transition duration-200"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <p
            v-if="reply"
            key="reply"
            class="max-w-md text-center text-lg font-medium text-foreground/90"
          >
            {{ reply }}
          </p>
          <h2 v-else key="prompt" class="text-2xl font-semibold text-foreground sm:text-3xl">
            Como posso ajudar?
          </h2>
        </Transition>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="glass glass-hover flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground"
            @click="startListening"
          >
            <Mic class="size-4 text-neon-cyan" /> Falar
          </button>
          <button
            type="button"
            class="glass glass-hover flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground"
          >
            <Keyboard class="size-4 text-neon-cyan" /> Digitar
          </button>
          <button
            type="button"
            class="glass glass-hover flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground"
          >
            <Paperclip class="size-4 text-neon-cyan" /> Anexar
          </button>
        </div>
      </Motion>

      <Motion v-bind="fade(0.28)" class="w-full">
        <SuggestionsCard />
      </Motion>
    </div>

    <!-- Coluna direita -->
    <div class="order-3 flex flex-col gap-5">
      <Motion v-bind="fade(0.08)"><SummaryCard /></Motion>
      <Motion v-bind="fade(0.15)"><LifeCard /></Motion>
      <Motion v-bind="fade(0.22)"><QuickNotesCard /></Motion>
    </div>
  </div>
</template>
