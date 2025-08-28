import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ConvertCurrencyUseCase } from '../../../src/application/usecases/ConvertCurrency'
import type { IExchangeRateRepository } from '../../../src/domain/ports/IExchangeRateRepository'
import type { ExchangeRate } from '../../../src/domain/entities/ExchangeRate'

describe('ConvertCurrency Use Case', () => {
  // Mock del repository
  const mockRepository: IExchangeRateRepository = {
    getExchangeRates: vi.fn(),
    subscribeToRates: vi.fn(),
  }

  const mockRates: ExchangeRate = {
    purchasePrice: 3.924,
    salePrice: 3.945,
    timestamp: new Date().toISOString(),
  }

  beforeEach(() => {
    vi.mocked(mockRepository.getExchangeRates).mockResolvedValue(mockRates)
  })

  it('should convert USD to PEN correctly', async () => {
    const useCase = new ConvertCurrencyUseCase(mockRepository)
    const usdAmount = 1000
    
    const result = await useCase.convertUsdToPen(usdAmount)
    
    expect(result.originalAmount).toBe(1000)
    expect(result.convertedAmount).toBe(3924) // 1000 * 3.924
    expect(result.rate).toBe(3.924)
    expect(result.fromCurrency).toBe('USD')
    expect(result.toCurrency).toBe('PEN')
  })

  it('should convert PEN to USD correctly', async () => {
    const useCase = new ConvertCurrencyUseCase(mockRepository)
    const penAmount = 3945
    
    const result = await useCase.convertPenToUsd(penAmount)
    
    expect(result.originalAmount).toBe(3945)
    expect(result.convertedAmount).toBe(1000) // 3945 / 3.945
    expect(result.rate).toBe(3.945)
    expect(result.fromCurrency).toBe('PEN')
    expect(result.toCurrency).toBe('USD')
  })

  it('should handle zero amounts', async () => {
    const useCase = new ConvertCurrencyUseCase(mockRepository)
    
    const result1 = await useCase.convertUsdToPen(0)
    const result2 = await useCase.convertPenToUsd(0)
    
    expect(result1.convertedAmount).toBe(0)
    expect(result2.convertedAmount).toBe(0)
  })

  it('should call repository to get exchange rates', async () => {
    const useCase = new ConvertCurrencyUseCase(mockRepository)
    
    await useCase.convertUsdToPen(100)
    
    expect(mockRepository.getExchangeRates).toHaveBeenCalled()
  })
})