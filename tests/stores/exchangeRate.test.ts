import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useExchangeRateStore } from '../../stores/exchangeRate';

// Mock Firebase y meta del entorno
vi.mock('../../firebase.config', () => ({
  db: {},
  collection: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn(),
}));

// Mock import.meta.client para simular entorno del servidor
Object.defineProperty(import.meta, 'client', {
  value: false,
  writable: true,
});

describe('Exchange Rate Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default values', () => {
    const store = useExchangeRateStore();

    expect(store.purchasePrice).toBe(3.924);
    expect(store.salePrice).toBe(3.945);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBe(null);
  });

  it('should have computed rates getter', () => {
    const store = useExchangeRateStore();

    expect(store.rates).toEqual({
      purchasePrice: 3.924,
      salePrice: 3.945,
      lastUpdated: expect.any(Date),
    });
  });

  it('should have all required methods', () => {
    const store = useExchangeRateStore();

    expect(typeof store.fetchRates).toBe('function');
    expect(typeof store.subscribeToRates).toBe('function');
    expect(typeof store.unsubscribeFromRates).toBe('function');
  });

  it('should handle fetchRates when no repository available', async () => {
    const store = useExchangeRateStore();

    // En el servidor (import.meta.client = false), no debería hacer nada
    await store.fetchRates();

    expect(store.purchasePrice).toBe(3.924); // Mantiene valores por defecto
    expect(store.salePrice).toBe(3.945);
  });
});
