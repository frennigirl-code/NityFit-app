// Wrapper minimale attorno alla API pubblica di Open Food Facts.
// Nessuna API key richiesta. Cerca prodotti confezionati/marche,
// preferendo risultati italiani quando disponibili.

const SEARCH_URL = 'https://it.openfoodfacts.org/cgi/search.pl'

/**
 * Cerca prodotti su Open Food Facts.
 * @param {string} query - termine di ricerca (es. "ceci in scatola")
 * @returns {Promise<Array>} lista di alimenti normalizzati
 */
export async function searchOpenFoodFacts(query) {
  if (!query || query.trim().length < 2) return []

  const params = new URLSearchParams({
    search_terms: query,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '15',
    fields: 'product_name,product_name_it,brands,nutriments,code,quantity',
  })

  const res = await fetch(`${SEARCH_URL}?${params.toString()}`)
  if (!res.ok) {
    throw new Error('Errore nella ricerca su Open Food Facts')
  }
  const data = await res.json()
  const products = data.products || []

  return products
    .map(normalizeProduct)
    .filter((p) => p !== null)
}

function normalizeProduct(product) {
  const n = product.nutriments || {}
  const kcal = n['energy-kcal_100g']
  // Scarta prodotti senza dati calorici utilizzabili
  if (kcal === undefined || kcal === null) return null

  const nome = product.product_name_it || product.product_name || 'Prodotto senza nome'
  const marca = product.brands ? product.brands.split(',')[0].trim() : null

  return {
    id: `off-${product.code}`,
    nome: marca ? `${nome} — ${marca}` : nome,
    fonte: 'openfoodfacts',
    // Valori per 100g, come da convenzione OFF
    kcal: round(kcal),
    proteine: round(n['proteins_100g'] ?? 0),
    carboidrati: round(n['carbohydrates_100g'] ?? 0),
    grassi: round(n['fat_100g'] ?? 0),
  }
}

function round(value) {
  return Math.round(value * 10) / 10
}
