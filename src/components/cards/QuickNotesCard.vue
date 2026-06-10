<script setup lang="ts">
import { StickyNote, Plus } from "lucide-vue-next";
import BaseCard from "./BaseCard.vue";
import { quickNotes } from "@/data/mock";
</script>

<template>
  <BaseCard title="Notas rápidas" :icon="StickyNote" action="Ver todas">
    <ul class="flex flex-col gap-2">
      <li
        v-for="(note, i) in quickNotes"
        :key="i"
        class="flex items-start gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5 text-sm text-foreground/90"
      >
        <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple" />
        {{ note }}
      </li>
    </ul>

    <button
      type="button"
      class="flex items-center gap-1.5 self-start text-xs font-medium text-neon-cyan/80 transition-colors hover:text-neon-cyan"
    >
      <Plus class="size-3.5" />
      Nova nota
    </button>
  </BaseCard>
</template>
