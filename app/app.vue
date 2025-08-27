<template>
  <div class="container">
    <div class="content">
      <div class="hero-text">
        <h1>El mejor<br >tipo de cambio</h1>
        <p>para cambiar dólares y soles<br >online en Perú</p>
      </div>

      <div class="exchange-card">
        <div class="rates">
          <div class="rate-item active">
            <span class="label">Dólar compra</span>
            <span class="value">{{ (purchasePrice || 3.924).toFixed(4) }}</span>
          </div>
          <div class="rate-item">
            <span class="label">Dólar venta</span>
            <span class="value">{{ (salePrice || 3.945).toFixed(4) }}</span>
          </div>
        </div>

        <div class="converter">
          <div class="input-group">
            <div class="currency-input">
              <span class="currency-label">Dólares</span>
              <div class="amount-display">
                <span class="send-label">Envías</span>
                <span class="amount">$ 3945</span>
              </div>
            </div>
          </div>

          <div class="converter-button">
            <img
              src="/boton_convertion.png"
              alt="Convertir"
              class="converter-icon"
            >
          </div>

          <div class="input-group">
            <div class="currency-input">
              <span class="currency-label">Soles</span>
              <div class="amount-display">
                <span class="receive-label">Recibes</span>
                <span class="amount">S/ 3945</span>
              </div>
            </div>
          </div>
        </div>

        <button class="start-operation-btn">Iniciar operación</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import del store
import { useExchangeRateStore } from '../stores/exchangeRate';

const exchangeStore = useExchangeRateStore();

// Computados con valores por defecto para SSR
const purchasePrice = computed(() => {
  return exchangeStore.purchasePrice || 3.924;
});

const salePrice = computed(() => {
  return exchangeStore.salePrice || 3.945;
});

// Solo ejecutar en cliente
if (import.meta.client) {
  onMounted(() => {
    exchangeStore.subscribeToRates();
  });

  onUnmounted(() => {
    exchangeStore.unsubscribeFromRates();
  });
}
</script>
