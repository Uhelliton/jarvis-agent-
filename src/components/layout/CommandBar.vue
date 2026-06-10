<script setup lang="ts">
import { ref } from "vue";
import { Sparkles, Mic, Paperclip, ArrowUp } from "lucide-vue-next";
import { useAssistant } from "@/composables/useAssistant";

const { state, startListening, stopListening, sendCommand } = useAssistant();
const text = ref("");

function submit() {
  if (!text.value.trim()) return;
  sendCommand(text.value);
  text.value = "";
}

function toggleMic() {
  if (state.value === "listening") stopListening();
  else startListening();
}
</script>

<template>
  <div class="px-4 pb-5 pt-2 sm:px-6 lg:px-8">
    <form
      class="glass mx-auto flex max-w-3xl items-center gap-3 rounded-2xl px-3 py-2.5 transition-all focus-within:border-neon-purple/40 focus-within:shadow-[0_0_0_1px_oklch(0.7_0.16_280/0.25),0_0_40px_-12px_oklch(0.7_0.16_280/0.6)]"
      @submit.prevent="submit"
    >
      <span class="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-neon-blue/25 to-neon-purple/25 text-neon-cyan">
        <Sparkles class="size-4" />
      </span>

      <input
        v-model="text"
        type="text"
        placeholder="Fale comigo ou digite um comando..."
        class="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        @focus="state === 'idle' && startListening()"
        @blur="stopListening()"
      />

      <button
        type="button"
        class="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        aria-label="Anexar arquivo"
      >
        <Paperclip class="size-4" />
      </button>

      <button
        v-if="!text.trim()"
        type="button"
        class="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple text-white shadow-lg shadow-neon-purple/30 transition-all hover:brightness-110"
        :class="state === 'listening' && 'animate-pulse ring-2 ring-neon-purple/50'"
        aria-label="Microfone"
        @click="toggleMic"
      >
        <Mic class="size-4" />
      </button>

      <button
        v-else
        type="submit"
        class="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple text-white shadow-lg shadow-neon-purple/30 transition-all hover:brightness-110"
        aria-label="Enviar"
      >
        <ArrowUp class="size-4" />
      </button>
    </form>
  </div>
</template>
