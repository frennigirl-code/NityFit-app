import { useState } from 'react'
import { calcolaTotali } from '../utils/calculations'

export default function TemplateListModal({ pasto, templates, onClose, onApply, onDelete, onRename }) {
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  function startEdit(t) {
    setEditingId(t.id)
    setEditValue(t.nome)
  }

  function confirmEdit() {
    if (editValue.trim()) {
      onRename(editingId, editValue.trim())
    }
    setEditingId(null)
  }

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

              if (editingId === t.id) {
                return (
                  <li key={t.id} className="template-row template-row-editing">
                    <input
                      className="search-input template-rename-input"
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <button className="template-action-btn" onClick={confirmEdit}>
                      Salva
                    </button>
                    <button className="template-action-btn" onClick={() => setEditingId(null)}>
                      Annulla
                    </button>
                  </li>
                )
              }

              return (
                <li key={t.id} className="template-row">
                  <button className="template-row-main" onClick={() => onApply(t)}>
                    <span className="meal-item-name">{t.nome}</span>
                    <span className="meal-item-qty">
                      {t.voci.length} alimenti · {Math.round(tot.kcal)} kcal
                    </span>
                  </button>
                  <div className="template-row-icons">
                    <button
                      className="icon-btn"
                      onClick={() => startEdit(t)}
                      aria-label={`Rinomina ${t.nome}`}
                    >
                      ✎
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => onDelete(t.id)}
                      aria-label={`Elimina template ${t.nome}`}
                    >
                      ×
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
