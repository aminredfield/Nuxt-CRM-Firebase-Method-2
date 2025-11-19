<template>
  <main class="space-y-6">
    <h1 class="text-2xl font-semibold mb-2">
      Reverse index: задачи по проекту
    </h1>

    <p class="text-sm text-slate-400">
      Страница живёт в Nuxt-layer (<code>modules</code>) и использует коллекцию
      <code>projectTaskIndex</code>, обновляемую функцией
      <code>onTaskWrite</code>.
    </p>

    <section class="border rounded p-4 space-y-3">
      <div class="flex gap-3 items-center">
        <label class="text-sm font-medium"> Проект: </label>

        <select
          v-model="selectedProjectId"
          class="border rounded px-2 py-1 !text-black min-w-[220px]"
          v-on:change="reloadIndex"
        >
          <option value="">— выберите проект —</option>
          <option v-for="p in projects" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>

        <button
          class="border px-3 py-1 rounded text-sm"
          :disabled="!selectedProjectId || loadingIndex"
          @click="reloadIndex"
        >
          {{ loadingIndex ? "Обновление…" : "Обновить" }}
        </button>
      </div>

      <p class="text-xs text-slate-400">
        Фильтрация выполняется по полю <code>projectId</code> и сортировке по
        <code>createdAt DESC</code>, что использует композитный индекс из
        <code>firestore.indexes.json</code>.
      </p>
    </section>

    <section class="border rounded p-4">
      <h2 class="text-lg font-semibold mb-3">Задачи по выбранному проекту</h2>

      <div v-if="!selectedProjectId" class="text-sm text-slate-400">
        Сначала выберите проект.
      </div>

      <div v-else-if="loadingIndex" class="text-sm">Загрузка индекса…</div>

      <div v-else-if="!indexEntries.length" class="text-sm text-slate-400">
        Для этого проекта задач в индексе пока нет.
      </div>

      <ul v-else class="space-y-2 text-sm">
        <li
          v-for="item in indexEntries"
          :key="item.id"
          class="border rounded px-3 py-2 flex justify-between items-center"
        >
          <div>
            <div class="font-medium">
              {{ item.taskName || "(без названия)" }}
            </div>
            <div class="text-xs text-slate-400">taskId: {{ item.taskId }}</div>
          </div>
          <div class="text-xs text-slate-400 text-right">
            projectId: {{ item.projectId }}
          </div>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useNuxtApp } from "nuxt/app";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

const { $firestore } = useNuxtApp();

type Project = { id: string; name: string };
type IndexEntry = {
  id: string;
  projectId: string;
  taskId: string;
  taskName?: string | null;
  createdAt?: any;
};

const projects = ref<Project[]>([]);
const selectedProjectId = ref<string>("");
const indexEntries = ref<IndexEntry[]>([]);
const loadingProjects = ref(false);
const loadingIndex = ref(false);

const loadProjects = async () => {
  if (!$firestore) return;
  loadingProjects.value = true;
  try {
    const colRef = collection($firestore, "projects");
    const snap = await getDocs(colRef);
    projects.value = snap.docs.map((d) => ({
      id: d.id,
      name: ((d.data() as any).name as string) ?? "(no name)",
    }));
  } finally {
    loadingProjects.value = false;
  }
};

const loadIndex = async () => {
  if (!$firestore || !selectedProjectId.value) {
    indexEntries.value = [];
    return;
  }
  loadingIndex.value = true;
  try {
    const colRef = collection($firestore, "projectTaskIndex");
    const q = query(
      colRef,
      where("projectId", "==", selectedProjectId.value),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    indexEntries.value = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        projectId: data.projectId as string,
        taskId: data.taskId as string,
        taskName: data.taskName as string | undefined,
        createdAt: data.createdAt,
      };
    });
  } finally {
    loadingIndex.value = false;
  }
};

const reloadIndex = () => {
  void loadIndex();
};

onMounted(async () => {
  await loadProjects();
});
</script>
