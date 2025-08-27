import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // configuracion de firebase
  apikey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// inicializamos firebase
const app = initializeApp(firebaseConfig);

// incializamos firestore
export const db = getFirestore(app);

export const FIREBASE_COLLLECTIONS = {
  RATES: 'rates', // coleccion de tasas de cambio
};

export const FIREBASE_DOCUMENTS = {
  EXCHANGE_RATE: process.env.FIREBASE_EXCHANGE_RATE, // documento de tasas de cambio
};
