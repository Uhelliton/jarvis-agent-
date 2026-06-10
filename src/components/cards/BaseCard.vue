<script setup lang="ts">
import type { Component } from "vue";
import { cn } from "@/lib/utils";

withDefaults(
  defineProps<{
    title?: string;
    icon?: Component;
    action?: string;
    glow?: boolean;
    class?: string;
  }>(),
  { glow: false }
);

defineEmits<{ (e: "action"): void }>();
</script>

<template>
  <section
    :class="
      cn(
        'glass glass-hover group relative flex flex-col gap-4 rounded-2xl p-5',
        glow && 'neon-ring',
        $props.class
      )
    "
  >
    <header v-if="title" class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <span
          v-if="icon"
          class="grid size-7 place-items-center rounded-lg bg-white/5 text-neon-cyan"
        >
          <component :is="icon" class="size-4" />
        </span>
        <h2 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {{ title }}
        </h2>
      </div>
      <button
        v-if="action"
        type="button"
        class="text-xs font-medium text-neon-cyan/80 transition-colors hover:text-neon-cyan"
        @click="$emit('action')"
      >
        {{ action }}
      </button>
    </header>

    <slot />
  </section>
</template>
