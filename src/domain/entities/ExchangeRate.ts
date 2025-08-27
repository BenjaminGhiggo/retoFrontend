export interface ExchangeRate {
  // interface para las tasas de cambio
  purchasePrice: number; // precio de compra
  salePrice: number; // precio de venta
  timestamp: string; // marca de tiempo
}

export interface ConversionResult {
  // interface para el resultado de la conversion
  originalAmount: number; // monto original
  convertedAmount: number; // monto convertido
  rate: number; // tasa de cambio utilizada
  fromCurrency: 'USD' | 'PEN'; // moneda de origen
  toCurrency: 'USD' | 'PEN'; // moneda de destino
}
