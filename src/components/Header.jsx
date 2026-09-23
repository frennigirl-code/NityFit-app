export default function Header({ dayType, onChangeDayType, onOpenSettings, onResetDay }) {
  return (
    <header className="header">
      <div className="header-top">
        <span className="wordmark">NityFit</span>
        <div className="header-icons">
          <button
            className="gear-btn"
            onClick={onResetDay}
            aria-label={`Resetta il piano ${dayType === 'high' ? 'High' : 'Low'}`}
          >
            <ResetIcon />
          </button>
          <button
            className="gear-btn"
            onClick={onOpenSettings}
            aria-label="Impostazioni obiettivi"
          >
            <GearIcon />
          </button>
        </div>
      </div>

      <div className="day-toggle" role="group" aria-label="Tipo di giorno">
        <button
          className={`day-toggle-btn ${dayType === 'low' ? 'active low' : ''}`}
          onClick={() => onChangeDayType('low')}
          aria-pressed={dayType === 'low'}
        >
          Low
        </button>
        <button
          className={`day-toggle-btn ${dayType === 'high' ? 'active high' : ''}`}
          onClick={() => onChangeDayType('high')}
          aria-pressed={dayType === 'high'}
        >
          High
        </button>
      </div>
    </header>
  )
}

function ResetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12a8 8 0 1 1 2.5 5.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M4 17v-4h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M19.4 13.5a7.4 7.4 0 0 0 0-3l1.9-1.5-2-3.4-2.2.9a7.3 7.3 0 0 0-2.6-1.5L14.1 2h-4l-.4 2.3a7.3 7.3 0 0 0-2.6 1.5l-2.2-.9-2 3.4L4.6 10a7.4 7.4 0 0 0 0 3l-1.9 1.5 2 3.4 2.2-.9c.75.65 1.63 1.16 2.6 1.5l.4 2.5h4l.4-2.3a7.3 7.3 0 0 0 2.6-1.5l2.2.9 2-3.4-1.9-1.7Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}
