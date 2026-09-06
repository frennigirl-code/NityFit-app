import { useState } from 'react'

export default function SettingsModal({ profiles, onSave, onClose }) {
  const [draft, setDraft] = useState(profiles)
  const [tab, setTab] = useState('low')

  function updateField(tipo, campo, valore) {
    setDraft((prev) => ({
      ...prev,
      [tipo]: { ...prev[tipo], [campo]: valore === '' ? '' : Number(valore) },
    }))
  }

  function handleSave() {
    onSave(draft)
    onClose()
  }

  const p = draft[tab]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Obiettivi</h2>
          <button className="close-btn" onClick={onClose} aria-label="Chiudi">
            ×
          </button>
        </div>

        <div className="modal-tabs">
          <button className={tab === 'low' ? 'active low' : ''} onClick={() => setTab('low')}>
            Giorno Low
          </button>
          <button className={tab === 'high' ? 'active high' : ''} onClick={() => setTab('high')}>
            Giorno High
          </button>
        </div>

        <div className="modal-body">
          <label className="field-label" htmlFor="s-kcal">Calorie (kcal)</label>
          <input
            id="s-kcal"
            className="search-input"
            type="number"
            value={p.kcal}
            onChange={(e) => updateField(tab, 'kcal', e.target.value)}
          />

          <div className="manual-grid">
            <div>
              <label className="field-label" htmlFor="s-prot">Proteine (g)</label>
              <input id="s-prot" className="search-input" type="number" value={p.proteine} onChange={(e) => updateField(tab, 'proteine', e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="s-carb">Carboidrati (g)</label>
              <input id="s-carb" className="search-input" type="number" value={p.carboidrati} onChange={(e) => updateField(tab, 'carboidrati', e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="s-fat">Grassi (g)</label>
              <input id="s-fat" className="search-input" type="number" value={p.grassi} onChange={(e) => updateField(tab, 'grassi', e.target.value)} />
            </div>
          </div>

          <button className="confirm-btn" onClick={handleSave}>
            Salva
          </button>
        </div>
      </div>
    </div>
  )
}
