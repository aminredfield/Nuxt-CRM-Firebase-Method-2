
# Nuxt CRM Test

Проект представляет собой тестовое CRM-приложение, построенное на современном стеке технологий с использованием Nuxt 4, Firebase и TypeScript.

## 🔗 Публичная ссылка

**Добавьте сюда ссылку на развернутое приложение**

---

## 📋 Описание проекта

Это полнофункциональное CRM-приложение для управления проектами, клиентами и задачами с автоматической индексацией связей через Firebase Cloud Functions.

### Основные возможности:

- ✅ **CRUD операции** для проектов, клиентов и задач
- ✅ **Управление связями** между сущностями (задачи ↔ проекты ↔ клиенты)
- ✅ **Автоматическая индексация** через Firebase Functions
- ✅ **Reverse index** для быстрого поиска задач по проектам
- ✅ **Локальная разработка** с эмуляторами Firebase

---

## 🛠 Технологический стек

### Frontend
- **[Nuxt 4.2.1](https://nuxt.com/)** — современный Vue.js фреймворк
- **[Vue 3.5.24](https://vuejs.org/)** — прогрессивный JavaScript фреймворк
- **[TypeScript](https://www.typescriptlang.org/)** — типизированный JavaScript
- **[Tailwind CSS 6.14.0](https://tailwindcss.com/)** — утилитарный CSS фреймворк
- **[Firebase SDK 12.6.0](https://firebase.google.com/)** — для работы с Firestore и Functions

### Backend
- **[Firebase Firestore](https://firebase.google.com/products/firestore)** — NoSQL база данных в реальном времени
- **[Firebase Functions](https://firebase.google.com/products/functions)** (v2) — серверные функции
- **[Firebase Admin SDK 12.6.0](https://firebase.google.com/docs/admin/setup)** — серверный SDK
- **Node.js 22** — среда выполнения для Functions

---

## 📁 Структура проекта

```
nuxt-crm-test/
├── frontend/                  # Nuxt приложение
│   ├── app/
│   │   ├── pages/            # Страницы приложения
│   │   │   ├── crud.vue      # CRUD для всех коллекций
│   │   │   ├── relation.vue  # Управление связями
│   │   │   └── index.vue     # Главная страница
│   │   └── plugins/
│   │       └── firebase.client.ts  # Инициализация Firebase
│   ├── modules/              # Nuxt Layer с reverse-index
│   │   └── pages/
│   │       └── reverse-index.vue  # Индексированные задачи
│   ├── package.json
│   └── nuxt.config.ts
│
├── functions/                # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts         # Функции CRUD и индексации
│   ├── package.json
│   └── tsconfig.json
│
├── firebase.json             # Конфигурация Firebase
├── firestore.rules          # Правила безопасности Firestore
└── firestore.indexes.json   # Композитные индексы
```

---

## 🚀 Быстрый старт

### Предварительные требования

Убедитесь, что у вас установлены:
- **Node.js 22** или выше
- **npm** или **yarn**
- **Firebase CLI**: `npm install -g firebase-tools`

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd nuxt-crm-test
```

### 2. Настройка Frontend

```bash
cd frontend
npm install
```

### 3. Настройка Firebase Functions

```bash
cd ../functions
npm install
```

### 4. Конфигурация Firebase

#### Вариант А: Использование эмуляторов (рекомендуется для начала)

Эмуляторы позволяют работать локально без создания Firebase проекта.

1. Запустите эмуляторы (см. раздел "Локальная разработка")
2. Приложение автоматически подключится к локальным эмуляторам

#### Вариант Б: Подключение к реальному Firebase проекту

1. Создайте проект на [Firebase Console](https://console.firebase.google.com/)
2. Включите **Firestore Database** и **Cloud Functions**
3. Войдите в Firebase CLI:
```bash
firebase login
```

4. Инициализируйте проект:
```bash
firebase init
# Выберите: Firestore, Functions, TypeScript
```

5. Получите конфигурацию Firebase:
   - Firebase Console → ⚙️ Project Settings → Your apps → Web app
   - Скопируйте `firebaseConfig`

6. Обновите `frontend/app/plugins/firebase.client.ts`:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
}
```

---

## 💻 Локальная разработка

### Запуск эмуляторов Firebase

Из корневой директории проекта:

```bash
firebase emulators:start
```

Эмуляторы запустятся на следующих портах:
- **Firestore**: http://localhost:8080
- **Functions**: http://localhost:5001
- **Firebase UI**: http://localhost:4000 (веб-интерфейс для управления)

### Запуск Frontend

В отдельном терминале:

```bash
cd frontend
npm run dev
```

Приложение будет доступно по адресу: **http://localhost:3000**

### Доступные страницы:

- 🏠 **/** — Главная страница
- ✏️ **/crud** — CRUD операции для Projects, Clients, Tasks
- 🔗 **/relation** — Связывание задач с проектами и клиентами
- 📊 **/reverse-index** — Просмотр индексированных задач по проектам

---

## 🔧 Доступные команды

### Frontend (из директории `frontend/`)

```bash
# Режим разработки с hot-reload
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен сборки
npm run preview

# Генерация статического сайта
npm run generate
```

### Functions (из директории `functions/`)

```bash
# Линтинг кода
npm run lint

# Компиляция TypeScript
npm run build

# Компиляция в режиме watch
npm run build:watch

# Запуск эмуляторов с functions
npm run serve

# Деплой функций в Firebase
npm run deploy

# Просмотр логов функций
npm run logs
```

### Firebase (из корневой директории)

```bash
# Запуск всех эмуляторов
firebase emulators:start

# Запуск только Firestore
firebase emulators:start --only firestore

# Запуск только Functions
firebase emulators:start --only functions

# Деплой всего проекта
firebase deploy

# Деплой только Functions
firebase deploy --only functions

# Деплой только Firestore правил
firebase deploy --only firestore:rules

# Деплой только индексов
firebase deploy --only firestore:indexes
```

---

## 🗄️ Структура базы данных

### Коллекции Firestore:

#### `projects`
```typescript
{
  id: string,
  name: string,
  createdAt: Timestamp
}
```

#### `clients`
```typescript
{
  id: string,
  name: string,
  createdAt: Timestamp
}
```

#### `tasks`
```typescript
{
  id: string,
  name: string,
  projectId?: string | null,  // Опциональная связь с проектом
  clientId?: string | null,   // Опциональная связь с клиентом
  createdAt: Timestamp
}
```

#### `projectTaskIndex` (автоматически управляется Functions)
```typescript
{
  id: string,  // Формат: "{projectId}_{taskId}"
  projectId: string,
  taskId: string,
  taskName: string | null,
  createdAt: Timestamp
}
```

---

## 📚 Firebase Functions API

Приложение использует следующие Cloud Functions для CRUD операций:

### Projects
- **`createProject(data: {name: string})`** — Создание проекта
- **`listProjects()`** — Получение списка всех проектов
- **`deleteProject(data: {id: string})`** — Удаление проекта

### Clients
- **`createClient(data: {name: string})`** — Создание клиента
- **`listClients()`** — Получение списка всех клиентов
- **`deleteClient(data: {id: string})`** — Удаление клиента

### Tasks
- **`createTask(data: {name: string})`** — Создание задачи
- **`listTasks()`** — Получение списка всех задач
- **`updateTask(data: {id: string, projectId?: string, clientId?: string})`** — Обновление связей задачи
- **`deleteTask(data: {id: string})`** — Удаление задачи

### Trigger Functions
- **`onTaskWrite`** — Автоматически срабатывает при создании/изменении/удалении задачи
  - Обновляет `projectTaskIndex` при изменении `projectId`
  - Поддерживает синхронизацию индекса с данными

### Пример использования в коде:

```typescript
import { httpsCallable } from 'firebase/functions'

const { $functions } = useNuxtApp()

// Создать проект
const createProjectFn = httpsCallable($functions, 'createProject')
await createProjectFn({ name: "Новый проект" })

// Получить список проектов
const listProjectsFn = httpsCallable($functions, 'listProjects')
const result = await listProjectsFn()
console.log(result.data.items)

// Обновить связи задачи
const updateTaskFn = httpsCallable($functions, 'updateTask')
await updateTaskFn({ 
  id: taskId, 
  projectId: selectedProjectId,
  clientId: selectedClientId 
})
```

---

## ⚡ Как работает индексация

Проект использует **Firebase Cloud Function** `onTaskWrite`, которая автоматически:

1. **Отслеживает изменения** в коллекции `tasks`
2. **Обновляет индекс** `projectTaskIndex`
3. **Удаляет старые записи** при изменении связей или удалении задачи
4. **Создает новые записи** для новых связей

Это обеспечивает:
- 🚀 Быстрый поиск задач по проектам
- 🔄 Автоматическую синхронизацию
- 📊 Эффективные запросы с композитными индексами

### Композитный индекс

Определен в `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "projectTaskIndex",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "projectId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ]
}
```

Позволяет эффективно фильтровать по `projectId` и сортировать по `createdAt`.

---

## 🎨 Особенности реализации

### Nuxt Layer
Проект использует **Nuxt Layer** архитектуру:
- Страница `reverse-index.vue` изолирована в отдельном модуле `modules/`
- Позволяет переиспользовать компоненты между проектами
- Конфигурация в `modules/app.config.ts`

### Автоматическое подключение к эмуляторам
В `firebase.client.ts` реализовано автоматическое определение окружения:

```typescript
if (import.meta.dev) {
  connectFirestoreEmulator(firestore, 'localhost', 8080)
  connectFunctionsEmulator(functions, 'localhost', 5001)
}
```

### TypeScript строгая типизация
- Весь код покрыт TypeScript типами для безопасности разработки
- Интерфейсы для Project, Client, Task
- Типизированные вызовы Functions

### Tailwind CSS
- Utility-first подход для быстрой разработки UI
- Адаптивный дизайн
- Минимальный размер CSS благодаря JIT компилятору

---

## 📦 Деплой в продакшн

### 1. Подготовка Functions

```bash
cd functions
npm run build
```

### 2. Деплой Firebase Functions и Firestore

```bash
# Из корневой директории
firebase deploy
```

Или по отдельности:

```bash
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 3. Сборка Frontend

```bash
cd frontend
npm run build
```

### 4. Деплой Frontend

Frontend можно развернуть на:

#### Firebase Hosting

```bash
# Добавьте в firebase.json:
{
  "hosting": {
    "public": "frontend/.output/public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}

# Деплой:
firebase deploy --only hosting
```

#### Vercel (рекомендуется для Nuxt)

```bash
cd frontend
npm i -g vercel
vercel --prod
```

#### Netlify

```bash
cd frontend
npm run build
# Загрузите .output/public на Netlify
```

#### Cloudflare Pages

```bash
# Подключите GitHub репозиторий
# Build command: npm run build
# Output directory: .output/public
```

---

## 🐛 Отладка

### Просмотр данных в эмуляторах

После запуска эмуляторов откройте: **http://localhost:4000**

Здесь можно:
- Просматривать данные Firestore
- Отслеживать вызовы Functions
- Просматривать логи в реальном времени
- Очищать данные

### Логи Functions

```bash
# Локально (в эмуляторах)
# Логи отображаются в терминале где запущены эмуляторы

# В продакшене
firebase functions:log

# Следить за логами в реальном времени
firebase functions:log --follow
```

### Vue DevTools

Nuxt 4 включает встроенные DevTools:
- Откроются автоматически при запуске `npm run dev`
- Позволяют инспектировать компоненты, маршруты, payload

### Частые проблемы

**Port уже используется:**
```bash
lsof -ti:5001,8080,4000 | xargs kill -9
```

**Functions не обновляются:**
```bash
cd functions
npm run build
# Перезапустите эмуляторы
```

**Firebase не определён в компоненте:**
```typescript
// Используйте внутри setup(), не на верхнем уровне
const { $firestore, $functions } = useNuxtApp()
```

**CORS ошибка:**
- Используйте `onCall` функции вместо `onRequest`
- CORS настроен автоматически для `onCall`

---

## 🔒 Безопасность

⚠️ **ВАЖНО**: Текущие правила в `firestore.rules` открыты для разработки.

Для продакшена обязательно настройте правила безопасности:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Пример: требовать аутентификацию
    match /projects/{projectId} {
      allow read, write: if request.auth != null;
    }
    
    match /clients/{clientId} {
      allow read, write: if request.auth != null;
    }
    
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
    
    // Индекс только для чтения (изменяется только через Functions)
    match /projectTaskIndex/{indexId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

Деплой правил:
```bash
firebase deploy --only firestore:rules
```

---

## 📝 TODO / Идеи для улучшения

- [ ] Добавить аутентификацию пользователей (Firebase Auth)
- [ ] Реализовать пагинацию для больших списков
- [ ] Добавить поиск и фильтры по задачам
- [ ] Реализовать real-time updates через Firestore snapshots
- [ ] Добавить тесты (Unit с Vitest, E2E с Playwright)
- [ ] Реализовать роли и права доступа
- [ ] Добавить возможность прикреплять файлы к задачам (Firebase Storage)
- [ ] Создать дашборд с аналитикой
- [ ] Добавить уведомления
- [ ] Экспорт данных в CSV/Excel
- [ ] Темная тема

---

## 🤝 Контрибуция

Если вы хотите внести вклад в проект:

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'Add amazing feature'`)
4. Запушьте ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

### Гайдлайны:
- Следуйте существующему стилю кода
- Добавляйте TypeScript типы
- Тестируйте изменения локально с эмуляторами
- Обновляйте документацию при необходимости

---

## 🆘 Поддержка

Если возникли вопросы или проблемы:

1. Проверьте, что все зависимости установлены (`npm install`)
2. Убедитесь, что эмуляторы Firebase запущены
3. Проверьте консоль браузера на наличие ошибок (F12)
4. Проверьте логи Functions в терминале эмуляторов
5. Убедитесь, что используется Node.js 22

---

## 📚 Полезные ссылки

### Документация
- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Vue 3 Composition API](https://vuejs.org/guide/introduction.html)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Полезные ресурсы
- [Nuxt Examples](https://nuxt.com/docs/examples)
- [Firebase Samples](https://github.com/firebase/quickstart-js)
- [Vue DevTools](https://devtools.vuejs.org/)
