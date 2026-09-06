const R = 80
const CX = 100
const CY = 100
const STROKE = 14
const ARC_FRACTION = 0.75 // gauge covers 270° of the 360° circle
const CIRC = 2 * Math.PI * R
const TRACK_LEN = CIRC * ARC_FRACTION
const ROTATE = 135 // starts bottom-left, sweeps clockwise to bottom-right

export default function KcalGauge({ consumate, target, dayType }) {
  const fraction = target > 0 ? Math.min(consumate / target, 1) : 0
  const progressLen = TRACK_LEN * fraction
  const rimanenti = Math.round(target - consumate)
  const sopraTarget = rimanenti < 0

  return (
    <div className="gauge-wrap">
      <svg viewBox="0 0 200 200" className="gauge-svg">
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="var(--line)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${TRACK_LEN} ${CIRC - TRACK_LEN}`}
          transform={`rotate(${ROTATE} ${CX} ${CY})`}
        />
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${progressLen} ${CIRC - progressLen}`}
          transform={`rotate(${ROTATE} ${CX} ${CY})`}
          className="gauge-progress"
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-kcal">{Math.round(consumate)}</span>
        <span className="gauge-unit">kcal di {Math.round(target)}</span>
        <span className={`gauge-remaining ${sopraTarget ? 'over' : ''}`}>
          {sopraTarget
            ? `+${Math.abs(rimanenti)} oltre il target`
            : `${rimanenti} rimanenti`}
        </span>
      </div>
    </div>
  )
}
