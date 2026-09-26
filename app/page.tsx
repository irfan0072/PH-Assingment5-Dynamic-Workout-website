'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

function MetaIcon({ type }: { type: 'clock' | 'bolt' | 'star' }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  if (type === 'clock') {
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7.5V12l3 2" />
      </svg>
    );
  }

  if (type === 'bolt') {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z" />
      </svg>
    );
  }

  return (
    <svg {...common} aria-hidden="true">
      <path d="m12 2.8 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 0l-5.2 2.7 1-5.8L3.5 9l5.9-.9L12 2.8Z" transform="translate(0 0) scale(1)" />
      <path d="m12 4.5 1.9 4 4.4.6-3.2 3.1.8 4.3-3.9-2.1-3.9 2.1.8-4.3L5.7 9.1l4.4-.6L12 4.5Z" />
    </svg>
  );
}

const API_ENDPOINTS = [
  'https://api.api-store.workers.dev/api/fitlog',
  'https://api.abcz.workers.dev/api/fitlog',
];

export default function Home() {
  const [workouts, setWorkouts] = useState<WorkoutApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'duration' | 'calories' | 'rating'>('duration');
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const updateCounters = () => {
      if (typeof window === 'undefined') return;
      setPlanCount(JSON.parse(window.localStorage.getItem('fitlog-plan') || '[]').length);
      setSavedCount(JSON.parse(window.localStorage.getItem('fitlog-saved') || '[]').length);
    };

    updateCounters();
    window.addEventListener('fitlog-plan-change', updateCounters);
    return () => window.removeEventListener('fitlog-plan-change', updateCounters);
  }, []);

  const sortedWorkouts = [...workouts].sort((a, b) => {
    if (sortBy === 'calories') return b.caloriesBurned - a.caloriesBurned;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.duration - a.duration;
  });

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      setError('');

      for (const endpoint of API_ENDPOINTS) {
        try {
          const response = await fetch(endpoint, { cache: 'no-store' });
          if (!response.ok) continue;

          const data = await response.json();
          const items = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

          if (items.length) {
            setWorkouts(items as WorkoutApiItem[]);
            setLoading(false);
            return;
          }
        } catch {
          // Try the next fallback endpoint.
        }
      }

      setWorkouts([]);
      setError('Unable to load workouts right now. Please try again later.');
      setLoading(false);
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container nav-wrap">
          <div className="header-left">
            <button
              type="button"
              className="menu-button"
              aria-label="Open menu"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>

            <a href="#" className="brand" aria-label="FitLog home">
              <Image src="/logo.png" alt="FitLog logo" width={28} height={28} className="brand-logo" />
              <span className="brand-text">FITLOG</span>
            </a>
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="/" className="nav-link active">
              Workouts
            </a>
            <a href="/my-plan" className="nav-link">
              My Plan
            </a>
          </nav>

          <div className="header-badges" aria-label="Plan and saved counters">
            <Link href="/my-plan" className="badge badge-plan">
              <span className="badge-label">Plan</span>
              <span className="badge-value">{planCount}</span>
            </Link>
            <Link href="/my-plan" className="badge badge-saved">
              <span className="badge-label">Saved</span>
              <span className="badge-value">{savedCount}</span>
            </Link>
          </div>
        </div>

        <div className={`mobile-nav-panel ${mobileNavOpen ? 'open' : ''}`} aria-label="Mobile navigation">
          <a href="/" className="mobile-nav-link active" onClick={() => setMobileNavOpen(false)}>
            Workouts
          </a>
          <a href="/my-plan" className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>
            My Plan
          </a>
        </div>
      </header>

      <main className="page-main" aria-label="Homepage content area">
        <section className="container hero-panel" aria-label="Workout library hero section">
          <div className="hero-copy">
            <p className="hero-kicker">WORKOUT LIBRARY</p>
            <h1>TRAIN WITH INTENT. LOG EVERY SET.</h1>
            <p className="hero-text">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today&apos;s plan,
              and watch the week&apos;s work add up.
            </p>
            <a href="#library" className="primary-button" aria-label="Browse workouts">
              <span aria-hidden="true">→</span>
              <span>Browse Workouts</span>
            </a>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-image-frame">
              <Image src="/banner.png" alt="" width={620} height={560} priority />
            </div>
          </div>
        </section>

        <section id="library" className="container workout-library" aria-label="Workout library cards">
          <div className="library-toolbar">
            <div className="section-heading">
              <h2>THE LIBRARY</h2>
              <p>Twelve lifts covering every major muscle group.</p>
            </div>

            <div className="sort-wrap">
              <label htmlFor="sort-by">Sort By</label>
              <div className="sort-select-shell">
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'duration' | 'calories' | 'rating')}
                  aria-label="Sort workouts"
                >
                  <option value="duration">Duration</option>
                  <option value="calories">Calories</option>
                  <option value="rating">Rating</option>
                </select>
                <span className="sort-chevron">▾</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="library-loading">Loading workouts...</div>
          ) : error ? (
            <div className="library-error">{error}</div>
          ) : (
            <div className="workout-grid">
              {sortedWorkouts.map((workout) => (
                <Link key={workout.id} href={`/workout/${workout.id}`} className="workout-card-link">
                  <article className="workout-card">
                    <div className="card-image-wrap">
                      <img src={workout.image} alt={workout.name} />
                    </div>

                    <div className="card-body">
                      <div className="tag-row">
                        {workout.muscleGroups.map((tag) => (
                          <span key={`${workout.id}-${tag}`} className="tag-pill">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h3>{workout.name.toUpperCase()}</h3>
                      <p className="exercise-subtitle">{workout.equipment}</p>

                      <div className="meta-row">
                        <span className="meta-item">
                          <span className="meta-icon">
                            <MetaIcon type="clock" />
                          </span>
                          {workout.duration} min
                        </span>
                        <span className="meta-item">
                          <span className="meta-icon">
                            <MetaIcon type="bolt" />
                          </span>
                          {workout.caloriesBurned} kcal
                        </span>
                        <span className="meta-item">
                          <span className="meta-icon">
                            <MetaIcon type="star" />
                          </span>
                          {Number(workout.rating).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <div className="brand footer-brand" aria-label="FitLog footer brand">
            <Image src="/logo.png" alt="FitLog logo" width={24} height={24} className="brand-logo" />
            <span className="brand-text">FITLOG</span>
          </div>

          <p className="copyright">© 2026 FitLog — Workout Library. Train hard, log honest.</p>
        </div>
      </footer>
    </div>
  );
}
