import { useState, useEffect, useRef } from 'react'
import localFoods from '../data/localFoods.json'
import { searchOpenFoodFacts } from '../api/openFoodFacts'

export default function AddFoodModal({ pasto, customFoods = [], onSaveCustomFood, onClose, onConfirm }) {
  const [tab, setTab] = useState('cerca')
  const [query, setQuery] = useState('')
  const [offResults, setOffResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [quantita, setQuantita] = useState(100)
  const debounceRef = useRef(null)

  const q = query.trim().toLowerCase()

  const customResults = q.length >= 2
    ? customFoods.filter((f) => f.nome.toLowerCase().includes(q))
    : []

  const localResults = q.length >= 2
    ? localFoods.filter((f) => f.nome.toLowerCase().includes(q))
    : []

  useEffect(() => {
    if (query.trim().length < 2) {
      setOffResults([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const results = await searchOpenFoodFacts(query.trim())
        setOffResults(results)
      } catch {
        setError('Ricerca non riuscita. Controlla la connessione.')
      } finally {
        setLoading(false)
      }
    }, 450)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  function handleConfirm() {
    if (!selected || !quantita || quantita <= 0) return
    onConfirm({
      entryId: `e-${Date.now()}`,
      nome: selected.nome,
      kcal: selected.kcal,
      proteine: selected.proteine,
      carboidrati: selected.carboidrati,
      grassi: selected.grassi,
      quantita: Number(quantita),
      pasto,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Aggiungi a {pasto}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Chiudi">
            ×
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={tab === 'cerca' ? 'active' : ''}
            onClick={() => {
              setTab('cerca')
              setSelected(null)
            }}
          >
            Cerca
          </button>
          <button
            className={tab === 'manuale' ? 'active' : ''}
            onClick={() => {
              setTab('manuale')
              setSelected(null)
            }}
          >
            Inserimento manuale
          </button>
        </div>

        {tab === 'cerca' && !selected && (
          <div className="modal-body">
            <input
              className="search-input"
              type="text"
              placeholder="Es. ceci, petto di pollo, yogurt…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />

            {customResults.length > 0 && (
              <div className="results-group">
                <span className="results-label">I tuoi alimenti</span>
                {customResults.map((f) => (
                  <ResultRow key={f.id} food={f} onSelect={setSelected} />
                ))}
              </div>
            )}

            {localResults.length > 0 && (
              <div className="results-group">
                <span className="results-label">Alimenti generici</span>
                {localResults.map((f) => (
                  <ResultRow key={f.id} food={f} onSelect={setSelected} />
                ))}
              </div>
            )}

            {loading && <p className="hint-text">Ricerca su Open Food Facts…</p>}
            {error && <p className="hint-text error">{error}</p>}

            {offResults.length > 0 && (
              <div className="results-group">
                <span className="results-label">Prodotti confezionati</span>
                {offResults.map((f) => (
                  <ResultRow key={f.id} food={f} onSelect={setSelected} />
                ))}
              </div>
            )}

            {!loading &&
              query.trim().length >= 2 &&
              customResults.length === 0 &&
              localResults.length === 0 &&
              offResults.length === 0 &&
              !error && <p className="hint-text">Nessun risultato per "{query}".</p>}
          </div>
        )}

        {tab === 'cerca' && selected && (
          <QuantityStep
            food={selected}
            quantita={quantita}
            setQuantita={setQuantita}
            onBack={() => setSelected(null)}
            onConfirm={handleConfirm}
          />
        )}

        {tab === 'manuale' && (
          <ManualEntry
            quantita={quantita}
            setQuantita={setQuantita}
            onConfirm={(food, salvaNelDatabase) => {
              setSelected(food)
              if (salvaNelDatabase && onSaveCustomFood) {
                onSaveCustomFood(food)
              }
              onConfirm({
                entryId: `e-${Date.now()}`,
                ...food,
                quantita: Number(quantita),
                pasto,
              })
            }}
          />
        )}
      </div>
    </div>
  )
}

function ResultRow({ food, onSelect }) {
  return (
    <button className="result-row" onClick={() => onSelect(food)}>
      <span className="result-name">{food.nome}</span>
      <span className="result-kcal">{Math.round(food.kcal)} kcal /100g</span>
    </button>
  )
}

function QuantityStep({ food, quantita, setQuantita, onBack, onConfirm }) {
  const fattore = quantita / 100
  return (
    <div className="modal-body">
      <button className="back-link" onClick={onBack}>
        ‹ Cambia alimento
      </button>
      <p className="selected-food-name">{food.nome}</p>

      <label className="field-label" htmlFor="qty">
        Quantità (g)
      </label>
      <input
        id="qty"
        className="search-input"
        type="number"
        min="1"
        value={quantita}
        onChange={(e) => setQuantita(e.target.value)}
        autoFocus
      />

      <div className="preview-grid">
        <PreviewStat label="kcal" value={Math.round(food.kcal * fattore)} />
        <PreviewStat label="proteine" value={round1(food.proteine * fattore)} unit="g" />
        <PreviewStat label="carbo" value={round1(food.carboidrati * fattore)} unit="g" />
        <PreviewStat label="grassi" value={round1(food.grassi * fattore)} unit="g" />
      </div>

      <button className="confirm-btn" onClick={onConfirm}>
        Aggiungi
      </button>
    </div>
  )
}

function ManualEntry({ quantita, setQuantita, onConfirm }) {
  const [nome, setNome] = useState('')
  const [kcal, setKcal] = useState('')
  const [proteine, setProteine] = useState('')
  const [carboidrati, setCarboidrati] = useState('')
  const [grassi, setGrassi] = useState('')
  const [salvaNelDatabase, setSalvaNelDatabase] = useState(true)

  const valid = nome.trim() && kcal !== '' && quantita > 0

  return (
    <div className="modal-body">
      <p className="hint-text">Valori per 100 g di prodotto.</p>
      <label className="field-label" htmlFor="m-nome">Nome</label>
      <input
        id="m-nome"
        className="search-input"
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <div className="manual-grid">
        <div>
          <label className="field-label" htmlFor="m-kcal">kcal</label>
          <input id="m-kcal" className="search-input" type="number" value={kcal} onChange={(e) => setKcal(e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="m-prot">Proteine (g)</label>
          <input id="m-prot" className="search-input" type="number" value={proteine} onChange={(e) => setProteine(e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="m-carb">Carboidrati (g)</label>
          <input id="m-carb" className="search-input" type="number" value={carboidrati} onChange={(e) => setCarboidrati(e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="m-fat">Grassi (g)</label>
          <input id="m-fat" className="search-input" type="number" value={grassi} onChange={(e) => setGrassi(e.target.value)} />
        </div>
      </div>

      <label className="field-label" htmlFor="m-qty">Quantità (g)</label>
      <input
        id="m-qty"
        className="search-input"
        type="number"
        min="1"
        value={quantita}
        onChange={(e) => setQuantita(e.target.value)}
      />

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={salvaNelDatabase}
          onChange={(e) => setSalvaNelDatabase(e.target.checked)}
        />
        Salva anche nei miei alimenti (per ritrovarlo nelle ricerche future)
      </label>

      <button
        className="confirm-btn"
        disabled={!valid}
        onClick={() =>
          onConfirm(
            {
              nome: nome.trim(),
              kcal: Number(kcal) || 0,
              proteine: Number(proteine) || 0,
              carboidrati: Number(carboidrati) || 0,
              grassi: Number(grassi) || 0,
            },
            salvaNelDatabase
          )
        }
      >
        Aggiungi
      </button>
    </div>
  )
}

function PreviewStat({ label, value, unit = '' }) {
  return (
    <div className="preview-stat">
      <span className="preview-value">{value}{unit}</span>
      <span className="preview-label">{label}</span>
    </div>
  )
}

function round1(n) {
  return Math.round(n * 10) / 10
}
