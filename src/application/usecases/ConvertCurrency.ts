import type { IExchangeRateRepository } from "../../domain/ports/IExchangeRateRepository"
import type { ConversionResult } from "../../domain/entities/ExchangeRate"

export class ConvertCurrencyUseCase { // caso de uso para convertir moneda
    constructor(
        private exchangeRateRepository: IExchangeRateRepository // estamos inyectando el repositorio de tasas de cambio
    ){}

    async convertPenToUsd(penAmount: number): Promise<ConversionResult> { // metodo para convertir de PEN a USD
        // del reto tecnico: (monto en soles)/ sale_price = monto en dolares
        const rates = await this.exchangeRateRepository.getExchangeRate() // obtenemos las tasas de cambio
        const convertedAmount = penAmount / rates.salePrice

        return {
            originalAmount: penAmount,
            convertedAmount,
            rate: rates.salePrice,
            fromCurrency: 'PEN',
            toCurrency: 'USD'
        }
    }

    async convertUsdToPen(usdAmount: number): Promise<ConversionResult> { // metodo para convertir de USD a PEN
        // del reto tecnico: (monto en dolares) * purchase_price = monto en soles
        const rates = await this.exchangeRateRepository.getExchangeRate() // obtenemos las tasas de cambio
        const convertedAmount = usdAmount * rates.purchasePrice

        return {
            originalAmount: usdAmount,
            convertedAmount,
            rate: rates.purchasePrice,
            fromCurrency: 'USD',
            toCurrency: 'PEN'
        }
    }
}