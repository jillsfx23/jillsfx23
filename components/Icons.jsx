export function Bolt({ className = "bolt", id = "boltgrad" }) {
  return (
    <svg className={className} viewBox="0 0 48 96" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe27a" />
          <stop offset="45%" stopColor="#ffc529" />
          <stop offset="100%" stopColor="#ff8a00" />
        </linearGradient>
      </defs>
      <path d="M30 0 L6 52 h14 L14 96 L44 38 H28 Z" fill={`url(#${id})`} />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <path d="M3.5 7.5 12 13.5 20.5 7.5" />
    </svg>
  );
}

export function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      {open ? (
        <>
          <path d="M5 5 19 19" />
          <path d="M19 5 5 19" />
        </>
      ) : (
        <>
          <path d="M3.5 7h17" />
          <path d="M3.5 12h17" />
          <path d="M3.5 17h17" />
        </>
      )}
    </svg>
  );
}
