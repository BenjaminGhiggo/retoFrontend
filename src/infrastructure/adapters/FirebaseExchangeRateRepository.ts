  import { doc, getDoc, onSnapshot, type Firestore } from 'firebase/firestore';
  import type { IExchangeRateRepository } from '../../domain/ports/IExchangeRateRepository';
  import type { ExchangeRate } from '../../domain/entities/ExchangeRate';

  export class FirebaseExchangeRateRepository implements IExchangeRateRepository {
    private db: Firestore;
    private collectionName: string;
    private documentId: string;

    constructor() {
      // Acceder al Firebase desde el plugin
      const { $firebase } = useNuxtApp();
      this.db = $firebase.db;
      this.collectionName = $firebase.collections.RATES;
      this.documentId = $firebase.documents.EXCHANGE_RATES;
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
            timestamp: new Date()
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
            timestamp: new Date()
          };
          callback(rates);
        }
      });

      return unsubscribe;
    }
  }