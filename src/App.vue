<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import DashboardGrid from "@/components/layout/DashboardGrid.vue";
import CommandBar from "@/components/layout/CommandBar.vue";
import TechBackground from "@/components/layout/TechBackground.vue";
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <TechBackground />
    <AppHeader />
    <main class="flex-1 py-2">
      <DashboardGrid />
    </main>
    <CommandBar />
  </div>
</template>
