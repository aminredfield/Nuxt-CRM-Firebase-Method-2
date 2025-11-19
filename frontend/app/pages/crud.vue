<template>
  <main class="space-y-8">
    <h1 class="text-2xl font-semibold mb-4">
      CRUD через Firebase Functions (projects / clients / tasks)
    </h1>

    <section class="border p-4 rounded">
      <h2 class="text-xl font-semibold mb-2">Projects</h2>

      <form class="flex gap-2 mb-3" @submit.prevent="createProject">
        <input
          v-model="newProjectName"
          class="border px-2 py-1 rounded flex-1 text-black"
          type="text"
          placeholder="Название проекта"
        />
        <button class="border px-3 py-1 rounded" :disabled="loading">
          Добавить
        </button>
      </form>

      <div v-if="loadingProjects">Загрузка projects…</div>
      <ul v-else class="space-y-1">
        <li
          v-for="p in projects"
          :key="p.id"
          class="border rounded px-2 py-1 flex justify-between items-center"
        >
          <span>{{ p.name }}</span>
          <button
            class="text-xs text-red-500 underline"
            @click="deleteProject(p.id)"
          >
            Удалить
          </button>
        </li>
      </ul>
    </section>

    <section class="border p-4 rounded">
      <h2 class="text-xl font-semibold mb-2">Clients</h2>

      <form class="flex gap-2 mb-3" @submit.prevent="createClient">
        <input
          v-model="newClientName"
          class="border px-2 py-1 rounded flex-1 text-black"
          type="text"
          placeholder="Имя клиента"
        />
        <button class="border px-3 py-1 rounded" :disabled="loading">
          Добавить
        </button>
      </form>

      <div v-if="loadingClients">Загрузка clients…</div>
      <ul v-else class="space-y-1">
        <li
          v-for="c in clients"
          :key="c.id"
          class="border rounded px-2 py-1 flex justify-between items-center"
        >
          <span>{{ c.name }}</span>
          <button
            class="text-xs text-red-500 underline"
            @click="deleteClient(c.id)"
          >
            Удалить
          </button>
        </li>
      </ul>
    </section>

    <section class="border p-4 rounded">
      <h2 class="text-xl font-semibold mb-2">Tasks</h2>

      <form class="flex gap-2 mb-3" @submit.prevent="createTask">
        <input
          v-model="newTaskTitle"
          class="border px-2 py-1 rounded flex-1 text-black"
          type="text"
          placeholder="Название задачи"
        />
        <button class="border px-3 py-1 rounded" :disabled="loading">
          Добавить
        </button>
      </form>

      <div v-if="loadingTasks">Загрузка tasks…</div>
      <ul v-else class="space-y-1">
        <li
          v-for="t in tasks"
          :key="t.id"
          class="border rounded px-2 py-1 flex justify-between items-center"
        >
          <span>{{ t.name }}</span>
          <button
            class="text-xs text-red-500 underline"
            @click="deleteTask(t.id)"
          >
            Удалить
          </button>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { httpsCallable } from "firebase/functions";

type Item = { id: string; name: string };

const { $functions } = useNuxtApp();

const projects = ref<Item[]>([]);
const clients = ref<Item[]>([]);
const tasks = ref<Item[]>([]);

const newProjectName = ref("");
const newClientName = ref("");
const newTaskTitle = ref("");

const loading = ref(false);
const loadingProjects = ref(false);
const loadingClients = ref(false);
const loadingTasks = ref(false);

const loadProjects = async () => {
  loadingProjects.value = true;
  try {
    const fn = httpsCallable($functions, "listProjects");
    const res = await fn();
    projects.value = ((res.data as any).items ?? []) as Item[];
  } finally {
    loadingProjects.value = false;
  }
};

const loadClients = async () => {
  loadingClients.value = true;
  try {
    const fn = httpsCallable($functions, "listClients");
    const res = await fn();
    clients.value = ((res.data as any).items ?? []) as Item[];
  } finally {
    loadingClients.value = false;
  }
};

const loadTasks = async () => {
  loadingTasks.value = true;
  try {
    const fn = httpsCallable($functions, "listTasks");
    const res = await fn();
    tasks.value = ((res.data as any).items ?? []) as Item[];
  } finally {
    loadingTasks.value = false;
  }
};

const createProject = async () => {
  if (!newProjectName.value.trim()) return;
  loading.value = true;
  try {
    const fn = httpsCallable($functions, "createProject");
    await fn({ name: newProjectName.value });
    newProjectName.value = "";
    await loadProjects();
  } finally {
    loading.value = false;
  }
};

const deleteProject = async (id: string) => {
  const fn = httpsCallable($functions, "deleteProject");
  await fn({ id });
  await loadProjects();
};

const createClient = async () => {
  if (!newClientName.value.trim()) return;
  loading.value = true;
  try {
    const fn = httpsCallable($functions, "createClient");
    await fn({ name: newClientName.value });
    newClientName.value = "";
    await loadClients();
  } finally {
    loading.value = false;
  }
};

const deleteClient = async (id: string) => {
  const fn = httpsCallable($functions, "deleteClient");
  await fn({ id });
  await loadClients();
};

const createTask = async () => {
  if (!newTaskTitle.value.trim()) return;
  loading.value = true;
  try {
    const fn = httpsCallable($functions, "upsertTask");
    await fn({ name: newTaskTitle.value });
    newTaskTitle.value = "";
    await loadTasks();
  } finally {
    loading.value = false;
  }
};

const deleteTask = async (id: string) => {
  const fn = httpsCallable($functions, "deleteTask");
  await fn({ id });
  await loadTasks();
};

onMounted(async () => {
  await Promise.all([loadProjects(), loadClients(), loadTasks()]);
});
</script>
