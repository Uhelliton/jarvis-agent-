<script setup lang="ts">
import type { Component } from "vue";
import { HeartPulse, Moon, Activity, BookOpen, Wallet } from "lucide-vue-next";
import BaseCard from "./BaseCard.vue";
import { Progress } from "@/components/ui/progress";
import { life } from "@/data/mock";

const icons: Record<string, Component> = {
  sleep: Moon,
  exercise: Activity,
  reading: BookOpen,
  finance: Wallet,
};
</script>

<template>
  <BaseCard title="Minha vida" :icon="HeartPulse">
    <ul class="flex flex-col gap-4">
      <li v-for="(item, i) in life" :key="i" class="flex flex-col gap-2">
        <div class="flex items-center gap-3">
          <span class="grid size-9 shrink-0 place-items-center rounded-xl bg-white/5 text-neon-cyan">
            <component :is="icons[item.icon]" class="size-4" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm font-medium text-foreground">{{ item.title }}</p>
              <p class="shrink-0 text-sm font-semibold text-foreground/90">{{ item.metric }}</p>
            </div>
            <p class="truncate text-xs text-muted-foreground">{{ item.subtitle }}</p>
          </div>
        </div>
        <div class="pl-12">
          <Progress :value="item.value" :gradient="item.gradient" />
        </div>
      </li>
    </ul>
  </BaseCard>
</template>
