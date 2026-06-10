<script setup lang="ts">
import { cn } from "@/lib/utils";

defineProps<{ class?: string }>();

const model = defineModel<string>();
</script>

<template>
  <input
    v-model="model"
    :class="
      cn(
        'flex h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-neon-purple/50 focus-visible:ring-2 focus-visible:ring-neon-purple/25 disabled:cursor-not-allowed disabled:opacity-50',
        $props.class
      )
    "
  />
</template>
