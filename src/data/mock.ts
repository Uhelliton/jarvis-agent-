export interface AgendaItem {
  time: string;
  title: string;
  subtitle: string;
  accent: string;
}

export interface ReminderItem {
  id: string;
  label: string;
  when: string;
  done: boolean;
}

export interface GoalItem {
  label: string;
  detail: string;
  value: number;
  gradient: string;
}

export interface SummaryStat {
  icon: "tasks" | "meetings" | "focus";
  value: string;
  label: string;
}

export interface LifeItem {
  icon: "sleep" | "exercise" | "reading" | "finance";
  title: string;
  subtitle: string;
  metric: string;
  value: number;
  gradient: string;
}

export interface Suggestion {
  id: string;
  icon: "calendar" | "file" | "mail" | "run";
  text: string;
}

export const user = {
  name: "Lucas",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
};

export const weather = {
  description: "Parcialmente nublado",
  temperature: "22°C",
};

export const agenda: AgendaItem[] = [
  {
    time: "09:00",
    title: "Reunião com time de Produto",
    subtitle: "Online – Google Meet",
    accent: "from-neon-blue to-neon-cyan",
  },
  {
    time: "11:30",
    title: "Consulta Dentista",
    subtitle: "Clínica Sorriso",
    accent: "from-neon-purple to-neon-blue",
  },
  {
    time: "16:00",
    title: "Academia",
    subtitle: "Smart Fit – Unidade Centro",
    accent: "from-emerald-400 to-neon-cyan",
  },
];

export const reminders: ReminderItem[] = [
  { id: "r1", label: "Pagar a fatura da internet", when: "Hoje", done: true },
  { id: "r2", label: "Comprar presente da Ana", when: "Amanhã", done: true },
  { id: "r3", label: "Renovar CNH", when: "15/06", done: false },
  { id: "r4", label: "Enviar relatório mensal", when: "16/06", done: false },
];

export const goals: GoalItem[] = [
  {
    label: "Projeto SaaS",
    detail: "80%",
    value: 80,
    gradient: "from-neon-blue to-neon-purple",
  },
  {
    label: "Ler 12 livros em 2025",
    detail: "6/12",
    value: 50,
    gradient: "from-neon-purple to-fuchsia-400",
  },
];

export const summary: SummaryStat[] = [
  { icon: "tasks", value: "7", label: "Tarefas concluídas" },
  { icon: "meetings", value: "2", label: "Reuniões" },
  { icon: "focus", value: "1h 12m", label: "Tempo de foco" },
];

export const productivity = 82;

export const life: LifeItem[] = [
  {
    icon: "sleep",
    title: "Sono",
    subtitle: "Qualidade: 85%",
    metric: "7h 32m",
    value: 85,
    gradient: "from-neon-purple to-neon-blue",
  },
  {
    icon: "exercise",
    title: "Exercícios",
    subtitle: "Meta: 5x",
    metric: "4x esta semana",
    value: 80,
    gradient: "from-emerald-400 to-neon-cyan",
  },
  {
    icon: "reading",
    title: "Leitura",
    subtitle: "Hábitos Atômicos",
    metric: "72% do livro atual",
    value: 72,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    icon: "finance",
    title: "Finanças",
    subtitle: "este mês",
    metric: "R$ 1.240,00 livres",
    value: 64,
    gradient: "from-neon-cyan to-neon-blue",
  },
];

export const suggestions: Suggestion[] = [
  {
    id: "s1",
    icon: "calendar",
    text: "Confirmar reunião das 9h com o time de Produto",
  },
  { id: "s2", icon: "file", text: "Revisar proposta do cliente até as 14h" },
  { id: "s3", icon: "mail", text: "Responder 5 e-mails pendentes" },
  {
    id: "s4",
    icon: "run",
    text: "Treinar antes das 15h (chuva prevista às 17h)",
  },
];

export const quickNotes: string[] = [
  "Ideia de feature: modo offline",
  "Ligar para o João sobre a parceria",
];
