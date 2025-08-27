import { ConvertCurrencyUseCase } from '../src/application/usecases/ConvertCurrency';
import { FirebaseExchangeRateRepository } from '../src/infrastructure/adapters/FirebaseExchangeRateRepository';

export const useConverter = () => {
  // Repository lazy - solo en cliente
  let repository: FirebaseExchangeRateRepository | null = null;
  let convertCurrency: ConvertCurrencyUseCase | null = null;

  const getConverter = () => {
    if (!convertCurrency && import.meta.client) {
      repository = new FirebaseExchangeRateRepository();
      convertCurrency = new ConvertCurrencyUseCase(repository);
    }
    return convertCurrency;
  };

  const convertPenToUsd = async (penAmount: number) => {
    const converter = getConverter();
    if (!converter) {
      // Fallback con valores por defecto si no hay converter
      return {
        originalAmount: penAmount,
        convertedAmount: penAmount / 3.945, // sale_price por defecto
        rate: 3.945,
        fromCurrency: 'PEN' as const,
        toCurrency: 'USD' as const
      };
    }
    return await converter.convertPenToUsd(penAmount);
  };

  const convertUsdToPen = async (usdAmount: number) => {
    const converter = getConverter();
    if (!converter) {
      // Fallback con valores por defecto si no hay converter
      return {
        originalAmount: usdAmount,
        convertedAmount: usdAmount * 3.924, // purchase_price por defecto
        rate: 3.924,
        fromCurrency: 'USD' as const,
        toCurrency: 'PEN' as const
      };
    }
    return await converter.convertUsdToPen(usdAmount);
  };

  return {
    convertPenToUsd,
    convertUsdToPen,
  };
};
