import { onCall } from 'firebase-functions/v2/https'
import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

if (!getApps().length) {
  initializeApp()
}

const db = getFirestore()

const projectsCol = db.collection('projects')
const clientsCol = db.collection('clients')
const tasksCol = db.collection('tasks')
const projectTaskIndexCol = db.collection('projectTaskIndex')
const clientTaskIndexCol = db.collection('clientTaskIndex')

type ProjectPayload = { name: string }
type ClientPayload = { name: string }
type TaskPayload = {
  id?: string
  name: string
  projectId?: string | null
  clientId?: string | null
}

export const createProject = onCall(async (req) => {
  const data = req.data as ProjectPayload
  if (!data || !data.name) {
    throw new Error('name is required')
  }

  const now = FieldValue.serverTimestamp()
  const docRef = await projectsCol.add({
    name: data.name,
    createdAt: now,
  })

  return { id: docRef.id, name: data.name }
})

export const listProjects = onCall(async () => {
  const snap = await projectsCol.orderBy('createdAt', 'desc').get()
  const items = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
  }))
  return { items }
})

export const deleteProject = onCall(async (req) => {
  const { id } = req.data as { id: string }
  if (!id) throw new Error('id is required')
  await projectsCol.doc(id).delete()
  return { ok: true }
})


export const createClient = onCall(async (req) => {
  const data = req.data as ClientPayload
  if (!data || !data.name) {
    throw new Error('name is required')
  }

  const now = FieldValue.serverTimestamp()
  const docRef = await clientsCol.add({
    name: data.name,
    createdAt: now,
  })

  return { id: docRef.id, name: data.name }
})

export const listClients = onCall(async () => {
  const snap = await clientsCol.orderBy('createdAt', 'desc').get()
  const items = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
  }))
  return { items }
})

export const deleteClient = onCall(async (req) => {
  const { id } = req.data as { id: string }
  if (!id) throw new Error('id is required')
  await clientsCol.doc(id).delete()
  return { ok: true }
})


async function updateReverseIndexForTask(
  taskId: string,
  before: any | null,
  after: any | null
) {
  const batch = db.batch()

  if (before) {
    if (before.projectId) {
      const ref = projectTaskIndexCol.doc(`${before.projectId}_${taskId}`)
      batch.delete(ref)
    }
    if (before.clientId) {
      const ref = clientTaskIndexCol.doc(`${before.clientId}_${taskId}`)
      batch.delete(ref)
    }
  }

  if (!after) {
    await batch.commit()
    return
  }

  if (after.projectId) {
    const ref = projectTaskIndexCol.doc(`${after.projectId}_${taskId}`)
    batch.set(ref, {
      projectId: after.projectId,
      taskId,
      taskName: after.name ?? null,
      createdAt: after.createdAt ?? FieldValue.serverTimestamp(),
    })
  }

  if (after.clientId) {
    const ref = clientTaskIndexCol.doc(`${after.clientId}_${taskId}`)
    batch.set(ref, {
      clientId: after.clientId,
      taskId,
      taskName: after.name ?? null,
      createdAt: after.createdAt ?? FieldValue.serverTimestamp(),
    })
  }

  await batch.commit()
}


export const upsertTask = onCall(async (req) => {
  const data = req.data as TaskPayload
  if (!data || !data.name) {
    throw new Error('name is required')
  }

  const now = FieldValue.serverTimestamp()

  if (!data.id) {
    const docRef = await tasksCol.add({
      name: data.name,
      projectId: data.projectId ?? null,
      clientId: data.clientId ?? null,
      createdAt: now,
      updatedAt: now,
    })

    const after = {
      name: data.name,
      projectId: data.projectId ?? null,
      clientId: data.clientId ?? null,
      createdAt: now,
    }

    await updateReverseIndexForTask(docRef.id, null, after)

    return { id: docRef.id }
  }

  const docRef = tasksCol.doc(data.id)
  const beforeSnap = await docRef.get()
  const beforeData = beforeSnap.exists ? beforeSnap.data() : null

  const patch: any = {
    name: data.name,
    projectId: data.projectId ?? null,
    clientId: data.clientId ?? null,
    updatedAt: now,
  }

  await docRef.update(patch)

  const afterData = {
    ...(beforeData ?? {}),
    ...patch,
  }

  await updateReverseIndexForTask(data.id, beforeData, afterData)

  return { id: data.id }
})

export const listTasks = onCall(async () => {
  const snap = await tasksCol.orderBy('createdAt', 'desc').get()
  const items = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
  }))
  return { items }
})

export const deleteTask = onCall(async (req) => {
  const { id } = req.data as { id: string }
  if (!id) throw new Error('id is required')

  const docRef = tasksCol.doc(id)
  const beforeSnap = await docRef.get()
  const beforeData = beforeSnap.exists ? beforeSnap.data() : null

  await docRef.delete()
  await updateReverseIndexForTask(id, beforeData, null)

  return { ok: true }
})

export const listTasksByProjectIndex = onCall(async (req) => {
  const { projectId } = req.data as { projectId: string }
  if (!projectId) throw new Error('projectId is required')

  const snap = await projectTaskIndexCol
    .where('projectId', '==', projectId)
    .orderBy('createdAt', 'desc')
    .get()

  const items = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
  }))
  return { items }
})
