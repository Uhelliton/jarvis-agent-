<script setup lang="ts">
import { Target, Plus } from "lucide-vue-next";
import BaseCard from "./BaseCard.vue";
import { Progress } from "@/components/ui/progress";
import { goals } from "@/data/mock";
</script>

<template>
  <BaseCard title="Metas" :icon="Target" action="Ver todas">
    <div class="flex flex-col gap-4">
      <div v-for="(goal, i) in goals" :key="i" class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-foreground">{{ goal.label }}</span>
          <span class="text-sm font-semibold text-foreground/90">{{ goal.detail }}</span>
        </div>
        <Progress :value="goal.value" :gradient="goal.gradient" />
      </div>
    </div>

    <button
      type="button"
      class="flex items-center gap-1.5 self-start text-xs font-medium text-neon-cyan/80 transition-colors hover:text-neon-cyan"
    >
      <Plus class="size-3.5" />
      Nova meta
    </button>
  </BaseCard>
</template>
