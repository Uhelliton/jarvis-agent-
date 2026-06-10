<script setup lang="ts">
import { ref } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
    fallback?: string;
    online?: boolean;
    class?: string;
  }>(),
  { online: false }
);

const failed = ref(false);
</script>

<template>
  <span class="relative inline-flex shrink-0">
    <span
      :class="
        cn(
          'relative flex size-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neon-blue/40 to-neon-purple/40 ring-2 ring-white/10 text-sm font-semibold text-white',
          props.class
        )
      "
    >
      <img
        v-if="src && !failed"
        :src="src"
        :alt="alt"
        class="size-full object-cover"
        @error="failed = true"
      />
      <span v-else>{{ fallback }}</span>
    </span>
    <span
      v-if="online"
      class="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]"
    />
  </span>
</template>
