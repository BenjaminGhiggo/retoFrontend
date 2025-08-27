import type { ConversionResult } from '../entities/ExchangeRate';

export interface IExchangeRateService {
  // interface para el servicio de tasas de cambio
  convertPenToUsd(penAmount: number): Promise<ConversionResult>; //metodo para convertir de PEN a USD
  convertUsdToPen(usdAmount: number): Promise<ConversionResult>; //metodo para convertir de USD a PEN
}
