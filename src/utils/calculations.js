export function todayKey() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Calcola i totali di kcal e macro per una lista di voci pasto.
 * Ogni voce ha { kcal, proteine, carboidrati, grassi } per 100g e una quantità in grammi.
 */
export function calcolaTotali(voci) {
  return voci.reduce(
    (tot, v) => {
      const fattore = v.quantita / 100
      return {
        kcal: tot.kcal + v.kcal * fattore,
        proteine: tot.proteine + v.proteine * fattore,
        carboidrati: tot.carboidrati + v.carboidrati * fattore,
        grassi: tot.grassi + v.grassi * fattore,
      }
    },
    { kcal: 0, proteine: 0, carboidrati: 0, grassi: 0 }
  )
}

export function calcolaVoceTotale(v) {
  const fattore = v.quantita / 100
  return {
    kcal: v.kcal * fattore,
    proteine: v.proteine * fattore,
    carboidrati: v.carboidrati * fattore,
    grassi: v.grassi * fattore,
  }
}

export const PASTI = ['Colazione', 'Pranzo', 'Cena', 'Spuntini']
