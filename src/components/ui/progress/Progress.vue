<script setup lang="ts">
import { computed } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    value?: number;
    gradient?: string;
    trackClass?: string;
    class?: string;
  }>(),
  {
    value: 0,
    gradient: "from-neon-blue to-neon-purple",
  }
);

const clamped = computed(() => Math.max(0, Math.min(100, props.value)));
</script>

<template>
  <div
    :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-white/8', trackClass)"
  >
    <div
      :class="cn('h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out', gradient, $props.class)"
      :style="{ width: clamped + '%' }"
    />
  </div>
</template>
