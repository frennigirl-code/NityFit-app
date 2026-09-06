import { calcolaVoceTotale } from '../utils/calculations'

export default function MealSection({ nome, voci, onAdd, onRemove }) {
  const kcalTotali = voci.reduce((sum, v) => sum + calcolaVoceTotale(v).kcal, 0)

  return (
    <section className="meal-section">
      <div className="meal-header">
        <h2>{nome}</h2>
        <span className="meal-kcal">{Math.round(kcalTotali)} kcal</span>
      </div>

      {voci.length > 0 && (
        <ul className="meal-list">
          {voci.map((v) => (
            <li key={v.entryId} className="meal-item">
              <div className="meal-item-info">
                <span className="meal-item-name">{v.nome}</span>
                <span className="meal-item-qty">{v.quantita} g</span>
              </div>
              <div className="meal-item-right">
                <span className="meal-item-kcal">
                  {Math.round(calcolaVoceTotale(v).kcal)} kcal
                </span>
                <button
                  className="remove-btn"
                  onClick={() => onRemove(v.entryId)}
                  aria-label={`Rimuovi ${v.nome}`}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button className="add-food-btn" onClick={onAdd}>
        + Aggiungi alimento
      </button>
    </section>
  )
}
