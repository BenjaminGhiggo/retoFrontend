import { doc, getDoc, onSnapshot, type Firestore } from 'firebase/firestore';
import type { IExchangeRateRepository } from '../../domain/ports/IExchangeRateRepository';
import type { ExchangeRate } from '../../domain/entities/ExchangeRate';

interface FirebasePlugin {
  db: Firestore;
  collections: {
    RATES: string;
  };
  documents: {
    EXCHANGE_RATES: string;
  };
}

// Type guard function - más seguro que 'as'
function isFirebasePlugin(obj: unknown): obj is FirebasePlugin {
  if (!obj || typeof obj !== 'object') return false;
  
  const candidate = obj as Record<string, unknown>;
  
  return (
    'db' in candidate &&
    'collections' in candidate &&
    'documents' in candidate &&
    typeof candidate.collections === 'object' &&
    candidate.collections !== null &&
    typeof candidate.documents === 'object' &&
    candidate.documents !== null &&
    typeof (candidate.collections as Record<string, unknown>)?.RATES === 'string' &&
    typeof (candidate.documents as Record<string, unknown>)?.EXCHANGE_RATES === 'string'
  );
}

export class FirebaseExchangeRateRepository implements IExchangeRateRepository {
  private db: Firestore;
  private collectionName: string;
  private documentId: string;

  constructor() {
    try {
      // Acceder al Firebase desde el plugin
      const nuxtApp = useNuxtApp();

      // Usar type guard para validar + 'as' solo para TypeScript
      const firebaseCandidate = nuxtApp.$firebase;

      if (!isFirebasePlugin(firebaseCandidate)) {
        throw new Error('Invalid Firebase plugin structure in NuxtApp');
      }

      // Ya validamos con type guard, ahora 'as' es seguro
      const firebase = firebaseCandidate as FirebasePlugin;

      this.db = firebase.db;
      this.collectionName = firebase.collections.RATES;
      this.documentId = firebase.documents.EXCHANGE_RATES;

    } catch (error) {
      throw error;
    }
  }

  async getExchangeRates(): Promise<ExchangeRate> {
    try {
      const docRef = doc(this.db, this.collectionName, this.documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          purchasePrice: data.purchase_price,
          salePrice: data.sale_price,
          timestamp: new Date().toISOString(),
        };
      } else {
        throw new Error('No exchange rate data found');
      }
    } catch (error) {
      throw error;
    }
  }

  subscribeToRates(callback: (rates: ExchangeRate) => void): () => void {
    const docRef = doc(this.db, this.collectionName, this.documentId);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const rates: ExchangeRate = {
          purchasePrice: data.purchase_price,
          salePrice: data.sale_price,
          timestamp: new Date().toISOString(),
        };
        callback(rates);
      }
    });

    return unsubscribe;
  }
}
