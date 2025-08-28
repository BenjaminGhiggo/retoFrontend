# Exchange Rate Converter

Aplicación de conversión de divisas USD/PEN con arquitectura hexagonal en Nuxt3.

## Instalación

```bash
git clone git@github.com:BenjaminGhiggo/retoFrontend.git
cd retoFrontend
npm install
```

## Desarrollo

```bash
npm run dev
```

## Construcción

```bash
npm run build
npm run preview
```

## Testing

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests sin watcher (modo CI)
npm run test -- --run

# Ejecutar tests específicos
npm run test tests/stores/exchangeRate.test.ts
npm run test tests/application/usecases/ConvertCurrency.test.ts

# Ejecutar tests con cobertura
npm run test -- --coverage

# Ejecutar tests en modo watch
npm run test -- --watch
```

## Linting y Formato

```bash
npm run lint
npx prettier --write .
npx vue-tsc --noEmit
```

## Firebase CLI (opcional)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Git Workflow

```bash
git status
git add .
git commit -m "mensaje"
git push origin main
```

## Verificación del Proyecto

```bash
# Verificar tipos TypeScript
npx vue-tsc --noEmit

# Verificar build
npm run build

# Verificar que todos los tests pasan
npm run test -- --run

# Verificar linting
npm run lint
```

## Arquitectura

```
src/
├── domain/entities/ExchangeRate.ts
├── domain/ports/IExchangeRateRepository.ts
├── application/usecases/ConvertCurrency.ts
└── infrastructure/adapters/FirebaseExchangeRateRepository.ts
```

## Firebase Configuración

- Colección: rates
- Documento: awaOMswZ8JGxjmHCpVZ4
- Campos: purchase_price, sale_price

## Fórmulas

- USD a PEN: Monto USD × purchase_price
- PEN a USD: Monto PEN ÷ sale_price

## Deploy

Netlify con preset estático configurado en nuxt.config.ts
