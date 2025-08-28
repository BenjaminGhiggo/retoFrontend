<template>
  <div class="container">
    <div class="content">
      <div class="hero-text">
        <h1>El mejor<br >tipo de cambio</h1>
        <p>para cambiar dólares y soles<br >online en Perú</p>
      </div>

      <div class="exchange-card">
        <div class="rates">
          <div 
            class="rate-item"
            :class="{ active: isUsdToPen }"
            @click="switchToBuyRate"
          >
            <span class="label">Dólar compra</span>
            <span class="value">{{ (purchasePrice || 3.924).toFixed(4) }}</span>
          </div>
          <div 
            class="rate-item"
            :class="{ active: !isUsdToPen }"
            @click="switchToSellRate"
          >
            <span class="label">Dólar venta</span>
            <span class="value">{{ (salePrice || 3.945).toFixed(4) }}</span>
          </div>
        </div>

        <div class="converter">
          <div class="input-group">

            <div class="currency-input">
              <div class="currency-info">
                <span class="currency-label">Dólares</span>
              </div>
              <div class="amount-display">
                <span class="send-label">{{ isUsdToPen ? 'Envías' : 'Recibes' }}</span>
                <div class="amount-wrapper">
                  <span class="amount-symbol">$</span>
                  <input 
                    v-model.number="usdAmount" 
                    type="number" 
                    class="amount-input"
                    :readonly="!isUsdToPen"
                    @input="onUsdInput"
                  >
                </div>
              </div>
            </div>


          </div>

          <div class="converter-button">
            <img
              src="/boton_convertion.png"
              alt="Convertir"
              class="converter-icon"
              @click="toggleConversion"
            >
          </div>

          <div class="input-group">
            <div class="currency-input">
              <div class="currency-info">
                <span class="currency-label">Soles</span>
              </div>
              <div class="amount-display">
                <span class="receive-label">{{ isUsdToPen ? 'Recibes' : 'Envías' }}</span>
                <div class="amount-wrapper">
                  <span class="amount-symbol">S/</span>
                  <input 
                    v-model.number="penAmount" 
                    type="number" 
                    class="amount-input"
                    :readonly="isUsdToPen"
                    @input="onPenInput"
                  >
                </div>
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
// Import del composable (comentado temporalmente para debug)
// import { useConverter } from '../composables/useConverter';

const exchangeStore = useExchangeRateStore();

// Computados con valores por defecto para SSR
const purchasePrice = computed(() => {
  return exchangeStore.purchasePrice || 3.924;
});

const salePrice = computed(() => {
  return exchangeStore.salePrice || 3.945;
});

// Estados locales para los inputs
const usdAmount = ref(1000);
const penAmount = ref(3924);
const isUsdToPen = ref(true); // true = USD → PEN, false = PEN → USD

// Conversión automática usando tasas directamente (sin composable)
const convertCurrency = async () => {
  try {
    if (isUsdToPen.value) {
      // Convertir USD → PEN usando purchase_price
      penAmount.value = Math.round(usdAmount.value * purchasePrice.value * 100) / 100;
    } else {
      // Convertir PEN → USD usando sale_price  
      usdAmount.value = Math.round(penAmount.value / salePrice.value * 100) / 100;
    }
  } catch (error) {
    console.error('Error en conversión:', error);
  }
};

// Handlers para inputs
const onUsdInput = () => {
  if (isUsdToPen.value) {
    convertCurrency();
  }
};

const onPenInput = () => {
  if (!isUsdToPen.value) {
    convertCurrency();
  }
};

// Función para alternar la dirección de conversión
const toggleConversion = () => {
  isUsdToPen.value = !isUsdToPen.value;
  convertCurrency();
};

// Funciones para manejar clicks en tabs
const switchToBuyRate = () => {
  if (!isUsdToPen.value) {
    toggleConversion();
  }
};

const switchToSellRate = () => {
  if (isUsdToPen.value) {
    toggleConversion();
  }
};

// Solo ejecutar en cliente
if (import.meta.client) {
  onMounted(() => {
    exchangeStore.subscribeToRates();
    // Conversión inicial
    convertCurrency();
  });

  onUnmounted(() => {
    exchangeStore.unsubscribeFromRates();
  });
}
</script>
