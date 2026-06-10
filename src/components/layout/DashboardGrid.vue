<script setup lang="ts">
import { computed } from "vue";
import { Motion } from "motion-v";
import { MessageCircle, Keyboard, Paperclip } from "lucide-vue-next";
import AssistantOrb from "@/components/orb/AssistantOrb3D.vue";
import AgendaCard from "@/components/cards/AgendaCard.vue";
import RemindersCard from "@/components/cards/RemindersCard.vue";
import GoalsCard from "@/components/cards/GoalsCard.vue";
import ContextFeed from "@/components/cards/ContextFeed.vue";
import SummaryCard from "@/components/cards/SummaryCard.vue";
import LifeCard from "@/components/cards/LifeCard.vue";
import QuickNotesCard from "@/components/cards/QuickNotesCard.vue";
import { useAssistant } from "@/composables/useAssistant";
import { useGreeting } from "@/composables/useGreeting";
import { user, agenda, reminders, goals } from "@/data/mock";

const { state, statusLabel, reply, startListening } = useAssistant();
const { greeting } = useGreeting(user.name);

/* Resumo inteligente derivado dos dados do dia */
const pendingReminders = reminders.filter((r) => !r.done).length;
const mainGoal = goals[0];

const highlights = computed(() => [
  `${agenda.length} compromissos amanhã`,
  `${pendingReminders} lembretes pendentes`,
  `${mainGoal.label} com ${mainGoal.detail} de progresso`,
]);

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
    <!-- Coluna esquerda — contexto de apoio, peso visual reduzido -->
    <div
      class="order-2 flex flex-col gap-5 opacity-[0.82] transition-opacity duration-500 hover:opacity-100 lg:order-1 lg:pt-10"
    >
      <Motion v-bind="fade(0.05)"><AgendaCard /></Motion>
      <Motion v-bind="fade(0.12)"><RemindersCard /></Motion>
      <Motion v-bind="fade(0.19)"><GoalsCard /></Motion>
    </div>

    <!-- Coluna central — o assistente é o centro de gravidade -->
    <div class="order-1 flex flex-col items-center gap-8 lg:order-2">
      <!-- Orbe com halo + ondas: ocupa o foco visual -->
      <Motion
        :initial="{ opacity: 0, scale: 0.85 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }"
        class="relative grid place-items-center"
      >
        <div class="absolute inset-0 -z-10 grid place-items-center">
          <span class="orb-halo size-[125%]" />
          <span class="orb-wave size-[78%]" style="animation-delay: 0s" />
          <span class="orb-wave size-[78%]" style="animation-delay: 1.5s" />
          <span class="orb-wave size-[78%]" style="animation-delay: 3s" />
        </div>

        <AssistantOrb :state="state" :size="360" />

        <Transition
          enter-active-class="transition duration-300"
          enter-from-class="opacity-0 translate-y-1"
          leave-active-class="transition duration-200"
          leave-to-class="opacity-0"
        >
          <span
            v-if="statusLabel"
            class="absolute -bottom-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-neon-cyan backdrop-blur"
          >
            {{ statusLabel }}
          </span>
        </Transition>
      </Motion>

      <!-- Resumo inteligente -->
      <Motion v-bind="fade(0.2)" class="flex w-full max-w-md flex-col items-center gap-6">
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

          <div v-else key="summary" class="flex flex-col items-center gap-5 text-center">
            <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
              {{ greeting }}, <span class="text-gradient">{{ user.name }}</span>.
            </h1>

            <div class="text-left">
              <p class="mb-2 text-sm text-muted-foreground">Você possui:</p>
              <ul class="flex flex-col gap-1.5">
                <li
                  v-for="(item, i) in highlights"
                  :key="i"
                  class="flex items-center gap-2.5 text-[15px] text-foreground/90"
                >
                  <span class="size-1.5 shrink-0 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple" />
                  {{ item }}
                </li>
              </ul>
            </div>

            <p class="text-lg font-medium text-foreground/70">O que deseja fazer?</p>
          </div>
        </Transition>

        <!-- Ações: "Conversar" em destaque, demais secundárias -->
        <div class="flex items-center gap-2.5">
          <button
            type="button"
            class="flex items-center gap-2 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-neon-purple/30 transition-all hover:brightness-110 hover:shadow-neon-purple/50"
            @click="startListening"
          >
            <MessageCircle class="size-4" /> Conversar
          </button>
          <button
            type="button"
            class="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <Keyboard class="size-4" /> Digitar
          </button>
          <button
            type="button"
            class="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <Paperclip class="size-4" /> Anexar
          </button>
        </div>
      </Motion>

      <!-- Feed contextual da IA -->
      <Motion v-bind="fade(0.28)" class="w-full max-w-md">
        <ContextFeed />
      </Motion>
    </div>

    <!-- Coluna direita — contexto de apoio, peso visual reduzido -->
    <div
      class="order-3 flex flex-col gap-5 opacity-[0.82] transition-opacity duration-500 hover:opacity-100 lg:pt-10"
    >
      <Motion v-bind="fade(0.08)"><SummaryCard /></Motion>
      <Motion v-bind="fade(0.15)"><LifeCard /></Motion>
      <Motion v-bind="fade(0.22)"><QuickNotesCard /></Motion>
    </div>
  </div>
</template>
