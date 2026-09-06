export default function MacroBar({ etichetta, consumati, target, unita = 'g' }) {
  const fraction = target > 0 ? Math.min(consumati / target, 1) : 0
  const over = consumati > target

  return (
    <div className="macro-row">
      <div className="macro-row-labels">
        <span className="macro-name">{etichetta}</span>
        <span className="macro-values">
          <strong>{Math.round(consumati)}</strong>
          <span className="macro-target"> / {Math.round(target)}{unita}</span>
        </span>
      </div>
      <div className="macro-track">
        <div
          className={`macro-fill ${over ? 'over' : ''}`}
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
    </div>
  )
}
