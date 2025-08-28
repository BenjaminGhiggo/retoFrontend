import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useExchangeRateStore } from '../../stores/exchangeRate'

// Mock Firebase
vi.mock('../../firebase.config', () => ({
  db: {},
  collection: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn(),
}))

describe('Exchange Rate Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default values', () => {
    const store = useExchangeRateStore()
    
    expect(store.purchasePrice).toBe(0)
    expect(store.salePrice).toBe(0)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('should set rates correctly', () => {
    const store = useExchangeRateStore()
    
    store.setRates(3.924, 3.945)
    
    expect(store.purchasePrice).toBe(3.924)
    expect(store.salePrice).toBe(3.945)
  })

  it('should set loading state', () => {
    const store = useExchangeRateStore()
    
    store.setLoading(true)
    expect(store.isLoading).toBe(true)
    
    store.setLoading(false)
    expect(store.isLoading).toBe(false)
  })

  it('should set error state', () => {
    const store = useExchangeRateStore()
    const testError = 'Test error'
    
    store.setError(testError)
    expect(store.error).toBe(testError)
  })

  it('should clear error', () => {
    const store = useExchangeRateStore()
    
    store.setError('Test error')
    expect(store.error).toBe('Test error')
    
    store.clearError()
    expect(store.error).toBe(null)
  })
})