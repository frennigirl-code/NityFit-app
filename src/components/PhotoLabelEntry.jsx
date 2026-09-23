import { useState, useRef } from 'react'
import { analyzeLabelPhoto } from '../api/analyzeLabel'

export default function PhotoLabelEntry({ quantita, setQuantita, onConfirm }) {
  const [status, setStatus] = useState('idle') // idle | analizzando | pronto | errore
  const [errorMsg, setErrorMsg] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [nome, setNome] = useState('')
  const [kcal, setKcal] = useState('')
  const [proteine, setProteine] = useState('')
  const [carboidrati, setCarboidrati] = useState('')
  const [grassi, setGrassi] = useState('')
  const [salvaNelDatabase, setSalvaNelDatabase] = useState(true)
  const inputRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreviewUrl(URL.createObjectURL(file))
    setStatus('analizzando')
    setErrorMsg('')

    try {
      const risultato = await analyzeLabelPhoto(file)
      setNome(risultato.nome || '')
      setKcal(risultato.kcal ?? '')
      setProteine(risultato.proteine ?? '')
      setCarboidrati(risultato.carboidrati ?? '')
      setGrassi(risultato.grassi ?? '')
      setStatus('pronto')
    } catch {
      setStatus('errore')
      setErrorMsg(
        "Non sono riuscito a leggere l'etichetta. Riprova con una foto più nitida e dritta, oppure inserisci i valori a mano qui sotto."
      )
    }
  }

  const valid = nome.trim() && kcal !== '' && quantita > 0
  const showForm = status === 'pronto' || status === 'errore'

  return (
    <div className="modal-body">
      {status === 'idle' && (
        <p className="hint-text">Inquadra la tabella nutrizionale, ben illuminata e il più dritta possibile.</p>
      )}

      {(status === 'idle' || status === 'analizzando') && (
        <button
          className="add-food-btn"
          onClick={() => inputRef.current?.click()}
          disabled={status === 'analizzando'}
        >
          {status === 'analizzando' ? 'Lettura in corso…' : '📷 Scatta foto etichetta'}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      {previewUrl && <img src={previewUrl} alt="Etichetta fotografata" className="label-preview" />}

      {status === 'errore' && (
        <>
          <p className="hint-text error">{errorMsg}</p>
          <button className="secondary-btn" onClick={() => inputRef.current?.click()}>
            Riprova con un'altra foto
          </button>
        </>
      )}

      {showForm && (
        <>
          <p className="hint-text">Controlla e correggi i valori prima di aggiungere (per 100 g).</p>

          <label className="field-label" htmlFor="p-nome">Nome</label>
          <input
            id="p-nome"
            className="search-input"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <div className="manual-grid">
            <div>
              <label className="field-label" htmlFor="p-kcal">kcal</label>
              <input id="p-kcal" className="search-input" type="number" value={kcal} onChange={(e) => setKcal(e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="p-prot">Proteine (g)</label>
              <input id="p-prot" className="search-input" type="number" value={proteine} onChange={(e) => setProteine(e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="p-carb">Carboidrati (g)</label>
              <input id="p-carb" className="search-input" type="number" value={carboidrati} onChange={(e) => setCarboidrati(e.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="p-fat">Grassi (g)</label>
              <input id="p-fat" className="search-input" type="number" value={grassi} onChange={(e) => setGrassi(e.target.value)} />
            </div>
          </div>

          <label className="field-label" htmlFor="p-qty">Quantità (g)</label>
          <input
            id="p-qty"
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
        </>
      )}
    </div>
  )
}
