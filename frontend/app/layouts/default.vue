<template>
  <div class="min-h-screen bg-slate-900 text-slate-100">
    <header class="border-b border-slate-700">
      <nav class="max-w-5xl mx-auto flex items-center gap-4 px-4 py-3">
        <h1 class="font-semibold text-lg">Nuxt CRM Test</h1>

        <ul class="flex gap-3 text-sm">
          <li v-for="item in menuItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              :class="[
                'px-2 py-1 rounded',
                route.path.startsWith(item.to) && item.to !== '/'
                  ? 'bg-slate-700'
                  : route.path === item.to
                  ? 'bg-slate-700'
                  : 'hover:bg-slate-800',
              ]"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useAppConfig } from "nuxt/app";

const route = useRoute();
const appConfig = useAppConfig() as {
  menu?: { label: string; to: string }[];
};
console.log(appConfig.menu);

const menuItems = computed(() => appConfig.menu ?? []);
</script>
