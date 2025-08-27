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
function isFirebasePlugin(obj: any): obj is FirebasePlugin {
  return obj &&
    typeof obj === 'object' &&
    'db' in obj &&
    'collections' in obj &&
    'documents' in obj &&
    typeof obj.collections?.RATES === 'string' &&
    typeof obj.documents?.EXCHANGE_RATES === 'string';
}

export class FirebaseExchangeRateRepository implements IExchangeRateRepository {
  private db: Firestore;
  private collectionName: string;
  private documentId: string;

  constructor() {
    console.log('🏗️ FirebaseExchangeRateRepository constructor called');
    try {
      // Acceder al Firebase desde el plugin
      const nuxtApp = useNuxtApp();
      console.log('📱 NuxtApp obtained, keys:', Object.keys(nuxtApp));
      
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
      
      console.log('✅ Firebase repository initialized with:', {
        dbType: typeof firebase.db,
        collectionName: this.collectionName,
        documentId: this.documentId
      });
    } catch (error) {
      console.error('❌ Error in FirebaseExchangeRateRepository constructor:', error);
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
      console.error('Error fetching exchange rates:', error);
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
