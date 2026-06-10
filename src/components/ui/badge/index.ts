import { cva, type VariantProps } from "class-variance-authority";

export { default as Badge } from "./Badge.vue";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/15 text-primary",
        neon:
          "border-transparent bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-sm shadow-neon-purple/40",
        outline: "border-white/15 text-muted-foreground",
        soft: "border-white/10 bg-white/5 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
