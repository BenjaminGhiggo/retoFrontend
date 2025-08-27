import type { ExchangeRate } from '../entities/ExchangeRate';

export interface IExchangeRateRepository {
  // interface para el repositorio de tasas de cambio
  getExchangeRates(): Promise<ExchangeRate>; // metodo para obtener las tasas de cambio
  subscribeToRates(callback: (rates: ExchangeRate) => void): () => void; // metodo para suscribirse a las tasas de cambio
}
