import { useState, useEffect, useMemo } from 'react'
import Header from './components/Header'
import KcalGauge from './components/KcalGauge'
import MacroBar from './components/MacroBar'
import MealSection from './components/MealSection'
import AddFoodModal from './components/AddFoodModal'
import SettingsModal from './components/SettingsModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import { calcolaTotali, todayKey, PASTI } from './utils/calculations'
import './App.css'

const DEFAULT_PROFILES = {
  low: { kcal: 1800, proteine: 140, carboidrati: 130, grassi: 55 },
  high: { kcal: 2400, proteine: 150, carboidrati: 260, grassi: 70 },
}

export default function App() {
  const [profiles, setProfiles] = useLocalStorage('nf-profiles', DEFAULT_PROFILES)
  const [dayType, setDayType] = useLocalStorage('nf-daytype', 'low')
  const [mealsByDate, setMealsByDate] = useLocalStorage('nf-meals', {})
  const [customFoods, setCustomFoods] = useLocalStorage('nf-custom-foods', [])
  const [addFoodFor, setAddFoodFor] = useState(null) // nome pasto o null
  const [settingsOpen, setSettingsOpen] = useState(false)

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

  const key = todayKey()
  const oggi = mealsByDate[key] || []
  const target = profiles[dayType]
  const totali = useMemo(() => calcolaTotali(oggi), [oggi])

  function addVoce(voce) {
    setMealsByDate((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), voce],
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
    setMealsByDate((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((v) => v.entryId !== entryId),
    }))
  }

  return (
    <div className="app">
      <Header
        dayType={dayType}
        onChangeDayType={setDayType}
        onOpenSettings={() => setSettingsOpen(true)}
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
    </div>
  )
}
