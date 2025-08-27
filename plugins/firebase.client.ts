import { defineNuxtPlugin } from '#imports';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: 'AIzaSyDo6COAASZuyGVEwILN3gBooJqRJ6p0IAk',
    authDomain: 'exchangeratecs.firebaseapp.com',
    projectId: 'exchangeratecs',
    storageBucket: 'exchangeratecs.appspot.com',
    messagingSenderId: '391759386229',
    appId: '1:391759386229:web:3c4d332a4bceb4756b4a3c',
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return {
    provide: {
      firebase: {
        app,
        db,
        collections: {
          RATES: 'rates',
        },
        documents: {
          EXCHANGE_RATES: 'awaOMswZ8JGxjmHCpVZ4',
        },
      },
    },
  };
});
