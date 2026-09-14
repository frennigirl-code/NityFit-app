import { calcolaTotali } from '../utils/calculations'

export default function TemplateListModal({ pasto, templates, onClose, onApply, onDelete }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Pasti salvati — {pasto}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Chiudi">
            ×
          </button>
        </div>

        <div className="modal-body">
          {templates.length === 0 && (
            <p className="hint-text">Nessun template salvato per {pasto.toLowerCase()}.</p>
          )}

          <ul className="meal-list">
            {templates.map((t) => {
              const tot = calcolaTotali(t.voci)
              return (
                <li key={t.id} className="template-row">
                  <button className="template-row-main" onClick={() => onApply(t)}>
                    <span className="meal-item-name">{t.nome}</span>
                    <span className="meal-item-qty">
                      {t.voci.length} alimenti · {Math.round(tot.kcal)} kcal
                    </span>
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => onDelete(t.id)}
                    aria-label={`Elimina template ${t.nome}`}
                  >
                    ×
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
