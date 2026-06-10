<script setup lang="ts">
import { computed, type Component } from "vue";
import { BarChart3, CheckCircle2, Briefcase, Clock } from "lucide-vue-next";
import BaseCard from "./BaseCard.vue";
import { summary, productivity } from "@/data/mock";

const icons: Record<string, Component> = {
  tasks: CheckCircle2,
  meetings: Briefcase,
  focus: Clock,
};

const R = 34;
const CIRC = 2 * Math.PI * R;
const dash = computed(() => (productivity / 100) * CIRC);
</script>

<template>
  <BaseCard title="Resumo do dia" :icon="BarChart3" action="Ontem">
    <div class="flex items-center justify-between gap-4">
      <ul class="flex flex-col gap-3">
        <li v-for="(stat, i) in summary" :key="i" class="flex items-center gap-3">
          <span class="grid size-8 place-items-center rounded-lg bg-white/5 text-neon-cyan">
            <component :is="icons[stat.icon]" class="size-4" />
          </span>
          <div class="leading-tight">
            <p class="text-base font-semibold text-foreground">{{ stat.value }}</p>
            <p class="text-xs text-muted-foreground">{{ stat.label }}</p>
          </div>
        </li>
      </ul>

      <div class="relative grid shrink-0 place-items-center">
        <svg width="92" height="92" viewBox="0 0 92 92" class="-rotate-90">
          <defs>
            <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="oklch(0.8 0.13 210)" />
              <stop offset="100%" stop-color="oklch(0.7 0.2 300)" />
            </linearGradient>
          </defs>
          <circle cx="46" cy="46" :r="R" fill="none" stroke="oklch(1 0 0 / 0.08)" stroke-width="8" />
          <circle
            cx="46"
            cy="46"
            :r="R"
            fill="none"
            stroke="url(#ring-grad)"
            stroke-width="8"
            stroke-linecap="round"
            :stroke-dasharray="`${dash} ${CIRC}`"
            style="filter: drop-shadow(0 0 5px oklch(0.7 0.18 280 / 0.6));"
          />
        </svg>
        <span class="absolute text-lg font-bold text-foreground">{{ productivity }}%</span>
      </div>
    </div>

    <p class="text-center text-xs text-muted-foreground">
      Produtividade <span class="text-foreground/90">Muito bom!</span> 🎉
    </p>
  </BaseCard>
</template>
