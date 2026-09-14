import { useState } from 'react'

export default function SaveTemplateModal({ pasto, defaultName, onClose, onSave }) {
  const [nome, setNome] = useState(defaultName)

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

          <button
            className="confirm-btn"
            disabled={!nome.trim()}
            onClick={() => onSave(nome.trim())}
          >
            Salva template
          </button>
        </div>
      </div>
    </div>
  )
}
