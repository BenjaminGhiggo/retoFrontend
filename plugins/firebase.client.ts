import { defineNuxtPlugin } from 'nuxt/app';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export default defineNuxtPlugin((nuxtApp) => {
  console.log('🔧 Firebase plugin initializing...');

  const firebaseConfig = {
    apiKey: 'AIzaSyAvoWBm4sf53VyqFUuFvzerV6uC4XgYtD0',
    authDomain: 'cotizadorreto.firebaseapp.com',
    projectId: 'cotizadorreto',
    storageBucket: 'cotizadorreto.firebasestorage.app',
    messagingSenderId: '959567209702',
    appId: '1:959567209702:web:10315f08a0d012b641c727',
    measurementId: 'G-PWPF10N4RL',
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const firebasePlugin = {
    app,
    db,
    collections: {
      RATES: 'rates',
    },
    documents: {
      EXCHANGE_RATES: 'awaOMswZ8JGxjmHCpVZ4',
    },
  };

  console.log('📦 Firebase plugin object:', firebasePlugin);

  nuxtApp.provide('firebase', firebasePlugin);
});
