import { computed } from "vue";

export function useGreeting(name: string) {
  const now = new Date();

  const greeting = computed(() => {
    const h = now.getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  });

  const fullDate = computed(() => {
    const formatted = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(now);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  });

  const message = computed(() => `${greeting.value}, ${name}!`);

  return { greeting, fullDate, message };
}
