import { computed, ref } from "vue";

export type AssistantState = "idle" | "listening" | "thinking" | "responding";

const state = ref<AssistantState>("idle");
const lastCommand = ref("");
const reply = ref("");

let timers: ReturnType<typeof setTimeout>[] = [];

function clearTimers() {
  timers.forEach((t) => clearTimeout(t));
  timers = [];
}

const replies = [
  "Claro! Já estou organizando isso para você.",
  "Feito. Adicionei à sua agenda de hoje.",
  "Entendi. Vou cuidar disso e te aviso quando terminar.",
  "Perfeito, deixei tudo pronto no seu painel.",
];

export function useAssistant() {
  function startListening() {
    clearTimers();
    state.value = "listening";
  }

  function stopListening() {
    if (state.value === "listening") state.value = "idle";
  }

  function sendCommand(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    clearTimers();
    lastCommand.value = trimmed;
    reply.value = "";
    state.value = "thinking";

    timers.push(
      setTimeout(() => {
        state.value = "responding";
        reply.value = replies[Math.floor(Math.random() * replies.length)];
      }, 1600)
    );

    timers.push(
      setTimeout(() => {
        state.value = "idle";
      }, 5200)
    );
  }

  const isBusy = computed(
    () => state.value === "thinking" || state.value === "responding"
  );

  const statusLabel = computed(() => {
    switch (state.value) {
      case "listening":
        return "Ouvindo...";
      case "thinking":
        return "Pensando...";
      case "responding":
        return "Respondendo...";
      default:
        return "";
    }
  });

  return {
    state,
    lastCommand,
    reply,
    isBusy,
    statusLabel,
    startListening,
    stopListening,
    sendCommand,
  };
}
