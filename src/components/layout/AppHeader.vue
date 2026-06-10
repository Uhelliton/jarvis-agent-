<script setup lang="ts">
import { Search, Bell, Settings } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { user } from "@/data/mock";
</script>

<template>
  <header
    class="sticky top-0 z-40 flex items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8"
  >
    <!-- Logo -->
    <div class="flex items-center gap-2.5">
      <span class="relative grid size-9 place-items-center">
        <span class="absolute inset-0 rounded-full border-2 border-neon-purple/60" />
        <span class="size-3.5 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple shadow-[0_0_12px_2px_oklch(0.7_0.18_290/0.7)]" />
      </span>
      <span class="text-lg font-semibold tracking-tight">
        <span class="text-gradient">JARVIS</span>
      </span>
    </div>

    <!-- Busca global -->
    <div class="relative ml-auto hidden w-full max-w-md md:block lg:ml-8 lg:mr-auto">
      <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Pesquisar em tudo..."
        class="h-10 rounded-xl border-white/8 bg-white/[0.04] pl-9 backdrop-blur-xl"
      />
    </div>

    <div class="ml-auto flex items-center gap-2 lg:ml-0">
      <Button variant="glass" size="icon" class="md:hidden" aria-label="Pesquisar">
        <Search class="size-4" />
      </Button>

      <Button variant="glass" size="icon" class="relative" aria-label="Notificações">
        <Bell class="size-4" />
        <span class="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-gradient-to-br from-neon-blue to-neon-purple text-[10px] font-bold text-white">
          3
        </span>
      </Button>

      <Button variant="glass" size="icon" class="hidden sm:inline-flex" aria-label="Configurações">
        <Settings class="size-4" />
      </Button>

      <button type="button" class="ml-1 rounded-full transition-transform hover:scale-105">
        <Avatar :src="user.avatar" :fallback="user.name.charAt(0)" :alt="user.name" online />
      </button>
    </div>
  </header>
</template>
