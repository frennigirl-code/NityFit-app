# NityFit

App standalone per tracciare calorie e macro (proteine, carboidrati, grassi) con due profili di target giornaliero — **Low** e **High** — selezionabili manualmente ogni volta che apri l'app.

## Stack

- React + Vite
- Nessun backend: i dati (profili, pasti) sono salvati in `localStorage` sul dispositivo
- [Open Food Facts](https://it.openfoodfacts.org) per la ricerca di prodotti confezionati (gratuito, nessuna API key)
- Dataset locale precaricato (`src/data/localFoods.json`) per alimenti generici/freschi italiani (legumi, cereali, verdure, carne, ecc.)

## Avvio in locale

```bash
npm install
npm run dev
```

## Build di produzione

```bash
npm run build
```

Il risultato viene generato nella cartella `dist/`, pronta per il deploy su Vercel (collegando il repo GitHub, build command `npm run build`, output directory `dist`).

## Struttura

```
src/
  api/openFoodFacts.js     ricerca prodotti confezionati
  data/localFoods.json     alimenti generici precaricati
  components/              Header, gauge, barre macro, sezioni pasto, modali
  hooks/useLocalStorage.js persistenza locale
  utils/calculations.js    calcolo totali kcal/macro
  App.jsx                  stato principale e layout
```

## Come funziona

1. All'apertura scegli se il giorno è **Low** o **High** (in alto)
2. Aggiungi alimenti ai pasti (Colazione, Pranzo, Cena, Spuntini) cercandoli — prima nel dataset locale, poi su Open Food Facts — oppure inserendoli manualmente
3. Per ogni alimento selezionato inserisci la quantità in grammi: l'app calcola kcal e macro in automatico
4. L'icona ⚙️ in alto a destra apre le impostazioni per modificare i target (kcal + macro) dei due profili Low/High quando il tuo piano cambia

## Limiti noti / possibili estensioni future

- Lo storico è salvato per data (`nf-meals` in localStorage) ma l'interfaccia mostra solo il giorno corrente — una vista storico/statistiche è un'estensione naturale
- Open Food Facts ha buona copertura di prodotti italiani ma è crowd-sourced: i dati non sono garantiti al 100%
