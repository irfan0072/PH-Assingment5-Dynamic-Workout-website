import Link from 'next/link';
import { notFound } from 'next/navigation';

type WorkoutApiItem = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
};

const API_ENDPOINTS = [
  'https://api.api-store.workers.dev/api/fitlog',
  'https://api.abcz.workers.dev/api/fitlog',
];

async function fetchWorkoutById(id: string): Promise<WorkoutApiItem | null> {
  for (const endpoint of API_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, { cache: 'no-store' });
      if (!response.ok) continue;

      const data = await response.json();
      const items = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      const workout = items.find((item: Partial<WorkoutApiItem>) => String(item.id) === id);

      if (workout) {
        return workout as WorkoutApiItem;
      }
    } catch {
      // Try the next fallback endpoint.
    }
  }

  return null;
}

export default async function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workout = await fetchWorkoutById(id);

  if (!workout) {
    notFound();
  }

  const detailRows = [
    { label: 'Equipment', value: workout.equipment },
    { label: 'Difficulty', value: workout.difficulty },
    { label: 'Sets', value: String(workout.sets) },
    { label: 'Reps', value: workout.reps },
    { label: 'Duration', value: `${workout.duration} min` },
    { label: 'Calories', value: `${workout.caloriesBurned} kcal` },
    { label: 'Rating', value: Number(workout.rating).toFixed(1) },
  ];

  return (
    <div className="page-shell detail-page-shell">
      <header className="topbar">
        <div className="container nav-wrap">
          <div className="header-left">
            <button type="button" className="menu-button" aria-label="Open menu">
              <span />
              <span />
              <span />
            </button>

            <Link href="/" className="brand" aria-label="FitLog home">
              <span className="brand-mark">F</span>
              <span className="brand-text">FITLOG</span>
            </Link>
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            <Link href="/" className="nav-link active">
              Workouts
            </Link>
            <Link href="/my-plan" className="nav-link">
              My Plan
            </Link>
          </nav>

          <div className="header-badges" aria-label="Plan and saved counters">
            <Link href="/my-plan" className="badge badge-plan">
              <span className="badge-label">Plan</span>
              <span className="badge-value">0</span>
            </Link>
            <Link href="/my-plan" className="badge badge-saved">
              <span className="badge-label">Saved</span>
              <span className="badge-value">0</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container detail-page-main" aria-label="Workout details page">
        <div className="detail-layout">
          <div className="detail-visual">
            <img src={workout.image} alt={workout.name} />
          </div>

          <div className="detail-panel">
            <h1>{workout.name.toUpperCase()}</h1>
            <p className="detail-description">{workout.description}</p>

            <div className="detail-tags">
              {workout.muscleGroups.map((tag) => (
                <span key={`${workout.id}-${tag}`} className="tag-pill detail-tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="detail-table-wrap">
              <dl className="detail-table">
                {detailRows.map((row) => (
                  <div key={row.label} className="detail-row">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="detail-instructions">
              <h2>INSTRUCTIONS</h2>
              <ol>
                {workout.instructions.map((step, index) => (
                  <li key={`${workout.id}-instruction-${index}`}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="detail-actions">
              <button type="button" className="primary-action">
                Add to today&apos;s plan
              </button>
              <button type="button" className="secondary-action">
                Save for later
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <div className="brand footer-brand" aria-label="FitLog footer brand">
            <span className="brand-mark">F</span>
            <span className="brand-text">FITLOG</span>
          </div>

          <p className="copyright">© 2026 FitLog — Workout Library. Train hard, log honest.</p>
        </div>
      </footer>
    </div>
  );
}
