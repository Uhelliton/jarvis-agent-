<script setup lang="ts">
import { ref } from "vue";
import { Bell, Check, Plus } from "lucide-vue-next";
import BaseCard from "./BaseCard.vue";
import { reminders as source } from "@/data/mock";

const reminders = ref(source.map((r) => ({ ...r })));

function toggle(id: string) {
  const item = reminders.value.find((r) => r.id === id);
  if (item) item.done = !item.done;
}
</script>

<template>
  <BaseCard title="Lembretes" :icon="Bell" action="Ver todos">
    <ul class="flex flex-col gap-0.5">
      <li
        v-for="item in reminders"
        :key="item.id"
        class="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/5"
      >
        <button
          type="button"
          class="grid size-5 shrink-0 place-items-center rounded-md border transition-all"
          :class="
            item.done
              ? 'border-transparent bg-gradient-to-br from-neon-blue to-neon-purple text-white shadow-sm shadow-neon-purple/40'
              : 'border-white/20 text-transparent hover:border-neon-purple/50'
          "
          @click="toggle(item.id)"
        >
          <Check class="size-3.5" />
        </button>
        <span
          class="flex-1 truncate text-sm transition-colors"
          :class="item.done ? 'text-muted-foreground line-through' : 'text-foreground'"
        >
          {{ item.label }}
        </span>
        <span class="shrink-0 text-xs text-muted-foreground">{{ item.when }}</span>
      </li>
    </ul>

    <button
      type="button"
      class="flex items-center gap-1.5 self-start text-xs font-medium text-neon-cyan/80 transition-colors hover:text-neon-cyan"
    >
      <Plus class="size-3.5" />
      Novo lembrete
    </button>
  </BaseCard>
</template>
