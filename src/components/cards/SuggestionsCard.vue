<script setup lang="ts">
import type { Component } from "vue";
import {
  Lightbulb,
  ChevronRight,
  CalendarCheck,
  FileText,
  Mail,
  Dumbbell,
} from "lucide-vue-next";
import BaseCard from "./BaseCard.vue";
import { suggestions } from "@/data/mock";
import { useAssistant } from "@/composables/useAssistant";

const { sendCommand } = useAssistant();

const icons: Record<string, Component> = {
  calendar: CalendarCheck,
  file: FileText,
  mail: Mail,
  run: Dumbbell,
};
</script>

<template>
  <BaseCard title="Sugestões para hoje" :icon="Lightbulb" glow>
    <ul class="flex flex-col gap-2">
      <li v-for="s in suggestions" :key="s.id">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3.5 py-3 text-left transition-all hover:border-neon-purple/40 hover:bg-white/[0.05]"
          @click="sendCommand(s.text)"
        >
          <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 text-neon-cyan">
            <component :is="icons[s.icon]" class="size-4" />
          </span>
          <span class="flex-1 text-sm text-foreground/90">{{ s.text }}</span>
          <ChevronRight class="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>
      </li>
    </ul>
  </BaseCard>
</template>
