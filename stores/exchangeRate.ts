import { defineStore } from 'pinia';
import type { ExchangeRate } from '../src/domain/entities/ExchangeRate';
import { FirebaseExchangeRateRepository } from '../src/infrastructure/adapters/FirebaseExchangeRateRepository';

export const useExchangeRateStore = defineStore('exchangeRate', () => {
  // Estado reactivo con valores por defecto
  const purchasePrice = ref<number>(3.924);
  const salePrice = ref<number>(3.945);
  const lastUpdated = ref<Date>(new Date());
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Repository lazy - solo en cliente
  let repository: FirebaseExchangeRateRepository | null = null;

  const getRepository = () => {
    console.log('🔍 getRepository called:', {
      hasRepository: !!repository,
      isClient: import.meta.client,
      environment: import.meta.env?.SSR ? 'server' : 'client'
    });
    
    if (!repository && import.meta.client) {
      console.log('📝 Creating new FirebaseExchangeRateRepository...');
      try {
        repository = new FirebaseExchangeRateRepository();
        console.log('✅ Repository created successfully');
      } catch (error) {
        console.error('❌ Error creating repository:', error);
      }
    }
    return repository;
  };

  // Acciones
  const fetchRates = async () => {
    const repo = getRepository();
    if (!repo) return; // No hacer nada en servidor

    try {
      isLoading.value = true;
      error.value = null;

      const rates = await repo.getExchangeRates();

      purchasePrice.value = rates.purchasePrice;
      salePrice.value = rates.salePrice;
      lastUpdated.value = new Date(rates.timestamp);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error fetching rates';
      console.error('Error fetching exchange rates:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Suscripción a cambios en tiempo real
  let unsubscribe: (() => void) | null = null;

  const subscribeToRates = () => {
    const repo = getRepository();
    if (!repo) return; // No hacer nada en servidor

    try {
      unsubscribe = repo.subscribeToRates((rates: ExchangeRate) => {
        purchasePrice.value = rates.purchasePrice;
        salePrice.value = rates.salePrice;
        lastUpdated.value = new Date(rates.timestamp);
        isLoading.value = false;
      });
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error subscribing to rates';
    }
  };

  const unsubscribeFromRates = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };

  // Getters computados
  const rates = computed(() => ({
    purchasePrice: purchasePrice.value,
    salePrice: salePrice.value,
    lastUpdated: lastUpdated.value,
  }));

  return {
    // Estado
    purchasePrice,
    salePrice,
    lastUpdated,
    isLoading,
    error,

    // Getters
    rates,

    // Acciones
    fetchRates,
    subscribeToRates,
    unsubscribeFromRates,
  };
});
