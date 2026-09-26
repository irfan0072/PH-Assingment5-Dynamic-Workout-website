import Link from 'next/link';

function LiftIcon() {
  return (
    <svg viewBox="0 0 420 300" aria-hidden="true" className="not-found-icon">
      <rect x="0" y="0" width="420" height="300" rx="36" fill="rgba(15,19,22,0.8)" />
      <g transform="translate(55 45)">
        <circle cx="90" cy="105" r="74" fill="none" stroke="#d9ff3f" strokeWidth="16" />
        <circle cx="270" cy="105" r="74" fill="none" stroke="#d9ff3f" strokeWidth="16" />
        <rect x="110" y="58" width="140" height="94" rx="38" fill="rgba(217,255,63,0.18)" stroke="none" />
        <rect x="86" y="70" width="24" height="70" rx="12" fill="#f3f5f7" />
        <rect x="290" y="70" width="24" height="70" rx="12" fill="#f3f5f7" />
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <main className="not-found-page" aria-label="404 error page">
      <div className="not-found-art" aria-hidden="true">
        <LiftIcon />
      </div>

      <h1 className="not-found-title">404 — MISSED THAT LIFT</h1>

      <p className="not-found-copy">
        The page you wanted is not in the library. Head back to the floor and pick a workout that exists.
      </p>

      <Link href="/" className="not-found-button">
        Back to workouts
      </Link>
    </main>
  );
}
