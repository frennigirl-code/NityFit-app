import { useState } from 'react'

export default function SaveTemplateModal({ pasto, defaultName, defaultGroup, onClose, onSave }) {
  const [nome, setNome] = useState(defaultName)
  const [gruppo, setGruppo] = useState(defaultGroup)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Salva {pasto} come template</h2>
          <button className="close-btn" onClick={onClose} aria-label="Chiudi">
            ×
          </button>
        </div>

        <div className="modal-body">
          <label className="field-label" htmlFor="tpl-nome">Nome template</label>
          <input
            id="tpl-nome"
            className="search-input"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoFocus
          />

          <label className="field-label">Gruppo</label>
          <div className="day-toggle" role="group" aria-label="Gruppo template" style={{ marginBottom: 16 }}>
            <button
              type="button"
              className={`day-toggle-btn ${gruppo === 'low' ? 'active low' : ''}`}
              onClick={() => setGruppo('low')}
              aria-pressed={gruppo === 'low'}
            >
              Low
            </button>
            <button
              type="button"
              className={`day-toggle-btn ${gruppo === 'high' ? 'active high' : ''}`}
              onClick={() => setGruppo('high')}
              aria-pressed={gruppo === 'high'}
            >
              High
            </button>
          </div>

          <button
            className="confirm-btn"
            disabled={!nome.trim()}
            onClick={() => onSave(nome.trim(), gruppo)}
          >
            Salva template
          </button>
        </div>
      </div>
    </div>
  )
}
