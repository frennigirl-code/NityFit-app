import { useState, useEffect, useMemo } from 'react'
import Header from './components/Header'
import KcalGauge from './components/KcalGauge'
import MacroBar from './components/MacroBar'
import MealSection from './components/MealSection'
import AddFoodModal from './components/AddFoodModal'
import SettingsModal from './components/SettingsModal'
import SaveTemplateModal from './components/SaveTemplateModal'
import TemplateListModal from './components/TemplateListModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import { calcolaTotali, PASTI } from './utils/calculations'
import './App.css'

const DEFAULT_PROFILES = {
  low: { kcal: 1800, proteine: 140, carboidrati: 130, grassi: 55 },
  high: { kcal: 2400, proteine: 150, carboidrati: 260, grassi: 70 },
}

export default function App() {
  const [profiles, setProfiles] = useLocalStorage('nf-profiles', DEFAULT_PROFILES)
  const [dayType, setDayType] = useLocalStorage('nf-daytype', 'low')
  // Due diari persistenti, uno per gruppo (Low/High) — non legati alla data.
  // Restano com'erano finché non vengono resettati manualmente.
  const [mealsByGroup, setMealsByGroup] = useLocalStorage('nf-meals-by-group', {
    low: [],
    high: [],
  })
  const [customFoods, setCustomFoods] = useLocalStorage('nf-custom-foods', [])
  const [mealTemplates, setMealTemplates] = useLocalStorage('nf-meal-templates', [])
  const [addFoodFor, setAddFoodFor] = useState(null) // nome pasto o null
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [savingTemplateFor, setSavingTemplateFor] = useState(null) // nome pasto o null
  const [templatePickerFor, setTemplatePickerFor] = useState(null) // nome pasto o null

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--accent',
      dayType === 'high' ? 'var(--high)' : 'var(--low)'
    )
    document.documentElement.style.setProperty(
      '--accent-soft',
      dayType === 'high' ? 'var(--high-soft)' : 'var(--low-soft)'
    )
  }, [dayType])

  const oggi = mealsByGroup[dayType] || []
  const target = profiles[dayType]
  const totali = useMemo(() => calcolaTotali(oggi), [oggi])

  // Migrazione una tantum dal vecchio formato (diario per data+gruppo,
  // es. "2026-09-22-low") ai due diari persistenti low/high.
  useEffect(() => {
    if (window.localStorage.getItem('nf-migrated-groups')) return
    try {
      const vecchio = JSON.parse(window.localStorage.getItem('nf-meals') || '{}')
      const daAggiungere = { low: [], high: [] }
      Object.entries(vecchio).forEach(([chiave, voci]) => {
        if (chiave.endsWith('-low')) daAggiungere.low.push(...voci)
        else if (chiave.endsWith('-high')) daAggiungere.high.push(...voci)
      })
      if (daAggiungere.low.length || daAggiungere.high.length) {
        setMealsByGroup((prev) => ({
          low: [...(prev.low || []), ...daAggiungere.low],
          high: [...(prev.high || []), ...daAggiungere.high],
        }))
      }
    } catch {
      // niente da migrare o dato non valido, ignora
    }
    window.localStorage.setItem('nf-migrated-groups', '1')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addVoce(voce) {
    setMealsByGroup((prev) => ({
      ...prev,
      [dayType]: [...(prev[dayType] || []), voce],
    }))
    setAddFoodFor(null)
  }

  function addCustomFood(food) {
    setCustomFoods((prev) => {
      const esiste = prev.some(
        (f) => f.nome.trim().toLowerCase() === food.nome.trim().toLowerCase()
      )
      if (esiste) return prev
      return [...prev, { ...food, id: `custom-${Date.now()}` }]
    })
  }

  function removeVoce(entryId) {
    setMealsByGroup((prev) => ({
      ...prev,
      [dayType]: (prev[dayType] || []).filter((v) => v.entryId !== entryId),
    }))
  }

  function saveTemplate(pasto, nome, gruppo) {
    const voci = oggi.filter((v) => v.pasto === pasto)
    if (voci.length === 0) return
    const template = {
      id: `tpl-${Date.now()}`,
      pasto,
      nome,
      gruppo,
      voci: voci.map(({ nome, kcal, proteine, carboidrati, grassi, quantita }) => ({
        nome,
        kcal,
        proteine,
        carboidrati,
        grassi,
        quantita,
      })),
    }
    setMealTemplates((prev) => [...prev, template])
    setSavingTemplateFor(null)
  }

  function applyTemplate(template) {
    const nuoveVoci = template.voci.map((v) => ({
      ...v,
      entryId: `e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      pasto: template.pasto,
    }))
    setMealsByGroup((prev) => ({
      ...prev,
      [dayType]: [...(prev[dayType] || []), ...nuoveVoci],
    }))
    setTemplatePickerFor(null)
  }

  function deleteTemplate(id) {
    setMealTemplates((prev) => prev.filter((t) => t.id !== id))
  }

  function renameTemplate(id, nome) {
    setMealTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, nome } : t)))
  }

  function moveTemplateGroup(id, nuovoGruppo) {
    setMealTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, gruppo: nuovoGruppo } : t))
    )
  }

  function resetDay() {
    const conferma = window.confirm(
      `Svuotare completamente il piano ${dayType === 'high' ? 'High' : 'Low'}? L'azione non è reversibile.`
    )
    if (!conferma) return
    setMealsByGroup((prev) => ({ ...prev, [dayType]: [] }))
  }

  return (
    <div className="app">
      <Header
        dayType={dayType}
        onChangeDayType={setDayType}
        onOpenSettings={() => setSettingsOpen(true)}
        onResetDay={resetDay}
      />

      <main>
        <KcalGauge consumate={totali.kcal} target={target.kcal} dayType={dayType} />

        <div className="macros-block">
          <MacroBar etichetta="Proteine" consumati={totali.proteine} target={target.proteine} />
          <MacroBar etichetta="Carboidrati" consumati={totali.carboidrati} target={target.carboidrati} />
          <MacroBar etichetta="Grassi" consumati={totali.grassi} target={target.grassi} />
        </div>

        <div className="meals-block">
          {PASTI.map((pasto) => (
            <MealSection
              key={pasto}
              nome={pasto}
              voci={oggi.filter((v) => v.pasto === pasto)}
              onAdd={() => setAddFoodFor(pasto)}
              onRemove={removeVoce}
              onSaveTemplate={() => setSavingTemplateFor(pasto)}
              onOpenTemplates={() => setTemplatePickerFor(pasto)}
              templateCount={
                mealTemplates.filter(
                  (t) => t.pasto === pasto && (t.gruppo ?? dayType) === dayType
                ).length
              }
            />
          ))}
        </div>
      </main>

      {addFoodFor && (
        <AddFoodModal
          pasto={addFoodFor}
          customFoods={customFoods}
          onSaveCustomFood={addCustomFood}
          onClose={() => setAddFoodFor(null)}
          onConfirm={addVoce}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          profiles={profiles}
          onSave={setProfiles}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {savingTemplateFor && (
        <SaveTemplateModal
          pasto={savingTemplateFor}
          defaultName={savingTemplateFor}
          defaultGroup={dayType}
          onClose={() => setSavingTemplateFor(null)}
          onSave={(nome, gruppo) => saveTemplate(savingTemplateFor, nome, gruppo)}
        />
      )}

      {templatePickerFor && (
        <TemplateListModal
          pasto={templatePickerFor}
          dayType={dayType}
          templates={mealTemplates.filter(
            (t) => t.pasto === templatePickerFor && (t.gruppo ?? dayType) === dayType
          )}
          onClose={() => setTemplatePickerFor(null)}
          onApply={applyTemplate}
          onDelete={deleteTemplate}
          onRename={renameTemplate}
          onMoveGroup={moveTemplateGroup}
        />
      )}
    </div>
  )
}
