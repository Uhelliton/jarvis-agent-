<script setup lang="ts">
import { CalendarDays, Plus } from "lucide-vue-next";
import BaseCard from "./BaseCard.vue";
import { agenda } from "@/data/mock";
</script>

<template>
  <BaseCard title="Agenda de hoje" :icon="CalendarDays" action="Ver agenda">
    <ul class="flex flex-col gap-1">
      <li
        v-for="(item, i) in agenda"
        :key="i"
        class="group/item flex gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/5"
      >
        <span class="w-12 shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-foreground/90">
          {{ item.time }}
        </span>
        <span
          class="mt-1 h-auto w-1 shrink-0 self-stretch rounded-full bg-gradient-to-b"
          :class="item.accent"
        />
        <div class="min-w-0">
          <p class="truncate text-sm font-medium text-foreground">{{ item.title }}</p>
          <p class="truncate text-xs text-muted-foreground">{{ item.subtitle }}</p>
        </div>
      </li>
    </ul>

    <button
      type="button"
      class="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/10 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-neon-purple/40 hover:text-neon-cyan"
    >
      <Plus class="size-3.5" />
      Adicionar compromisso
    </button>
  </BaseCard>
</template>
