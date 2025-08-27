import { defineStore } from 'pinia';
import type { ExchangeRate } from '~/src/domain/entities/ExchangeRate';
import { FirebaseExchangeRateRepository } from
'~/src/infrastructure/adapters/FirebaseExchangeRateRepository';

export const useExchangeRateStore = defineStore('exchangeRate', () => {
// Estado reactivo
const purchasePrice = ref<number>(0);
const salePrice = ref<number>(0);
const lastUpdated = ref<Date>(new Date());
const isLoading = ref<boolean>(true);
const error = ref<string | null>(null);

// Repository (inyección de dependencia)
const repository = new FirebaseExchangeRateRepository();

// Acciones
const fetchRates = async () => {
    try {
    isLoading.value = true;
    error.value = null;

    const rates = await repository.getExchangeRates();

    purchasePrice.value = rates.purchasePrice;
    salePrice.value = rates.salePrice;
    lastUpdated.value = rates.timestamp;
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
    try {
    unsubscribe = repository.subscribeToRates((rates: ExchangeRate) => {
        purchasePrice.value = rates.purchasePrice;
        salePrice.value = rates.salePrice;
        lastUpdated.value = rates.timestamp;
        isLoading.value = false;
    });
    } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error subscribing to rates';
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
    lastUpdated: lastUpdated.value
}));

return {
    // Estado
    purchasePrice: readonly(purchasePrice),
    salePrice: readonly(salePrice),
    lastUpdated: readonly(lastUpdated),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Getters
    rates,

    // Acciones
    fetchRates,
    subscribeToRates,
    unsubscribeFromRates
};
});