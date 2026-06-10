<script setup lang="ts">
import type { Component } from "vue";
import {
  Sparkles,
  Mail,
  CalendarClock,
  Dumbbell,
  FileText,
} from "lucide-vue-next";
import { feed } from "@/data/mock";
import { useAssistant } from "@/composables/useAssistant";

const { sendCommand } = useAssistant();

const icons: Record<string, Component> = {
  mail: Mail,
  calendar: CalendarClock,
  run: Dumbbell,
  file: FileText,
};
</script>

<template>
  <section class="flex flex-col gap-2.5">
    <header class="flex items-center gap-2 px-1">
      <Sparkles class="size-3.5 text-neon-cyan/80" />
      <h2 class="text-xs font-medium tracking-wide text-muted-foreground">
        No seu radar
      </h2>
    </header>

    <ul class="flex flex-col gap-1.5">
      <li v-for="item in feed" :key="item.id">
        <div
          class="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-2.5 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-white/[0.05]"
        >
          <span
            class="grid size-8 shrink-0 place-items-center rounded-xl bg-white/5 text-neon-cyan/90"
          >
            <component :is="icons[item.icon]" class="size-4" />
          </span>
          <span class="flex-1 text-sm text-foreground/85">{{ item.text }}</span>
          <button
            type="button"
            class="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-neon-cyan/70 opacity-0 transition-all hover:bg-neon-cyan/10 hover:text-neon-cyan group-hover:opacity-100 max-sm:opacity-100"
            @click="sendCommand(item.command)"
          >
            {{ item.action }}
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>