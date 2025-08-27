import { ConvertCurrencyUseCase } from '~/src/application/usecases/ConvertCurrency';
import { FirebaseExchangeRateRepository } from '~/src/infrastructure/adapters/FirebaseExchangeRateRepository';

export const useConverter = () => {
  const repository = new FirebaseExchangeRateRepository();
  const convertCurrency = new ConvertCurrencyUseCase(repository);

  const convertPenToUsd = async (penAmount: number) => {
    return await convertCurrency.convertPenToUsd(penAmount);
  };

  const convertUsdToPen = async (usdAmount: number) => {
    return await convertCurrency.convertUsdToPen(usdAmount);
  };

  return {
    convertPenToUsd,
    convertUsdToPen,
  };
};
