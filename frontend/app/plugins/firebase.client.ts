import { defineNuxtPlugin } from 'nuxt/app'
import { getFirestore, connectFirestoreEmulator, } from 'firebase/firestore'
import { initializeApp, } from 'firebase/app'
import { getFunctions, connectFunctionsEmulator, } from 'firebase/functions'


const firebaseConfig = {
  apiKey: "AIzaSyDXvywos3OomDRHWXDTDYxGkihkXuV_8p8",
  authDomain: "nuxt-crm-test.firebaseapp.com",
  projectId: "nuxt-crm-test",
  storageBucket: "nuxt-crm-test.firebasestorage.app",
  messagingSenderId: "637777245302",
  appId: "1:637777245302:web:ce56876eebd4f8c8249b57",
  measurementId: "G-YL92V99ZPZ"
};

export default defineNuxtPlugin(() => {
  const app = initializeApp(firebaseConfig)
  const firestore = getFirestore(app)
  const functions = getFunctions(app)

  if (import.meta.dev) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
    connectFunctionsEmulator(functions, '127.0.0.1', 5001)
  }

  return {
    provide: {
      firestore,
      functions,
      firebaseApp: app,
    },
  }
})
