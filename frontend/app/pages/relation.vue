<template>
  <main class="space-y-6">
    <h1 class="text-2xl font-semibold mb-4">
      Relation (tasks → project / client) через Firebase Functions
    </h1>

    <div v-if="loading" class="text-sm">Загрузка…</div>

    <table v-else class="w-full text-sm border-collapse">
      <thead>
        <tr class="border-b">
          <th class="text-left py-2 px-2">Task</th>
          <th class="text-left py-2 px-2">Project</th>
          <th class="text-left py-2 px-2">Client</th>
          <th class="text-left py-2 px-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in rows" :key="t.id" class="border-b">
          <td class="py-1 px-2">{{ t.name }}</td>
          <td class="py-1 px-2">
            <select
              v-model="t.projectId"
              class="border rounded px-2 py-1 text-xs text-black"
            >
              <option :value="null">— нет —</option>
              <option v-for="p in projects" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </td>
          <td class="py-1 px-2">
            <select
              v-model="t.clientId"
              class="border rounded px-2 py-1 text-xs text-black"
            >
              <option :value="null">— нет —</option>
              <option v-for="c in clients" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </td>
          <td class="py-1 px-2">
            <button
              class="text-xs border rounded px-2 py-1"
              :disabled="savingId === t.id"
              @click="saveRow(t)"
            >
              {{ savingId === t.id ? "Сохранение…" : "Сохранить" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="message" class="text-xs text-slate-400">
      {{ message }}
    </p>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { httpsCallable } from "firebase/functions";

type Item = { id: string; name: string };

type TaskRow = {
  id: string;
  name: string;
  projectId: string | null;
  clientId: string | null;
};

const { $functions } = useNuxtApp();

const projects = ref<Item[]>([]);
const clients = ref<Item[]>([]);
const rows = ref<TaskRow[]>([]);

const loading = ref(false);
const savingId = ref<string | null>(null);
const message = ref("");

const loadAll = async () => {
  loading.value = true;
  try {
    const listProjectsFn = httpsCallable($functions, "listProjects");
    const listClientsFn = httpsCallable($functions, "listClients");
    const listTasksFn = httpsCallable($functions, "listTasks");

    const [pRes, cRes, tRes] = await Promise.all([
      listProjectsFn(),
      listClientsFn(),
      listTasksFn(),
    ]);

    projects.value = ((pRes.data as any).items ?? []) as Item[];
    clients.value = ((cRes.data as any).items ?? []) as Item[];

    const tasksRaw = ((tRes.data as any).items ?? []) as any[];
    rows.value = tasksRaw.map((t) => ({
      id: t.id,
      name: t.name,
      projectId: (t.projectId as string | null) ?? null,
      clientId: (t.clientId as string | null) ?? null,
    }));
  } finally {
    loading.value = false;
  }
};

const saveRow = async (row: TaskRow) => {
  savingId.value = row.id;
  message.value = "";
  try {
    const fn = httpsCallable($functions, "upsertTask");
    await fn({
      id: row.id,
      name: row.name,
      projectId: row.projectId ?? null,
      clientId: row.clientId ?? null,
    });
    message.value = "Сохранено";
  } finally {
    savingId.value = null;
  }
};

onMounted(async () => {
  await loadAll();
});
</script>
