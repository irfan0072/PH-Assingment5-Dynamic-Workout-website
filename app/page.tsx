'use client';

import Image from 'next/image';
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
            <button type="button" className="menu-button" aria-label="Open menu">
              <span />
              <span />
              <span />
            </button>

            <a href="#" className="brand" aria-label="FitLog home">
              <span className="brand-mark">F</span>
              <span className="brand-text">FITLOG</span>
            </a>
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#" className="nav-link active">
              Workouts
            </a>
            <a href="#" className="nav-link">
              My Plan
            </a>
          </nav>

          <div className="header-badges" aria-label="Plan and saved counters">
            <a href="#" className="badge badge-plan">
              <span className="badge-label">Plan</span>
              <span className="badge-value">0</span>
            </a>
            <a href="#" className="badge badge-saved">
              <span className="badge-label">Saved</span>
              <span className="badge-value">0</span>
            </a>
          </div>
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
            <button type="button" className="primary-button">
              Browse Workouts
            </button>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-image-frame">
              <Image src="/banner.webp" alt="" width={620} height={560} priority />
            </div>
          </div>
        </section>

        <section className="container workout-library" aria-label="Workout library cards">
          <div className="section-heading">
            <h2>THE LIBRARY</h2>
            <p>Twelve lifts covering every major muscle group.</p>
          </div>

          {loading ? (
            <div className="library-loading">Loading workouts...</div>
          ) : error ? (
            <div className="library-error">{error}</div>
          ) : (
            <div className="workout-grid">
              {workouts.map((workout) => (
                <article key={workout.id} className="workout-card">
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
              ))}
            </div>
          )}
        </section>
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
