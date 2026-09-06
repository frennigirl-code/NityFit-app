export default function Header({ dayType, onChangeDayType, onOpenSettings }) {
  return (
    <header className="header">
      <div className="header-top">
        <span className="wordmark">NityFit</span>
        <button
          className="gear-btn"
          onClick={onOpenSettings}
          aria-label="Impostazioni obiettivi"
        >
          <GearIcon />
        </button>
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
