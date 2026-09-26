'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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

const API_ENDPOINTS = [
  'https://api.api-store.workers.dev/api/fitlog',
  'https://api.abcz.workers.dev/api/fitlog',
];

export default function WorkoutDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const [workout, setWorkout] = useState<WorkoutApiItem | null>(null);
  const [toast, setToast] = useState('');
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const syncCounts = () => {
      if (typeof window === 'undefined') return;
      const plan = JSON.parse(window.localStorage.getItem('fitlog-plan') || '[]');
      const saved = JSON.parse(window.localStorage.getItem('fitlog-saved') || '[]');
      setPlanCount(plan.length);
      setSavedCount(saved.length);
    };

    syncCounts();
    window.addEventListener('fitlog-plan-change', syncCounts);
    return () => window.removeEventListener('fitlog-plan-change', syncCounts);
  }, []);

  useEffect(() => {
    const fetchWorkoutById = async () => {
      for (const endpoint of API_ENDPOINTS) {
        try {
          const response = await fetch(endpoint, { cache: 'no-store' });
          if (!response.ok) continue;

          const data = await response.json();
          const items = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
          const currentWorkout = items.find((item: Partial<WorkoutApiItem>) => String(item.id) === id);

          if (currentWorkout) {
            setWorkout(currentWorkout as WorkoutApiItem);
            return;
          }
        } catch {
          // Try the next fallback endpoint.
        }
      }

      router.replace('/not-found');
    };

    if (id) {
      fetchWorkoutById();
    }
  }, [id, router]);

  const addWorkoutToPlan = () => {
    if (!workout || typeof window === 'undefined') return;

    const plan = JSON.parse(window.localStorage.getItem('fitlog-plan') || '[]') as WorkoutApiItem[];
    const alreadyAdded = plan.some((item) => item.id === workout.id);

    if (alreadyAdded) {
      setToast('Already in today’s plan');
      return;
    }

    if (plan.length >= 5) {
      setToast('Today’s plan is full');
      return;
    }

    const updated = [...plan, workout];
    window.localStorage.setItem('fitlog-plan', JSON.stringify(updated));
    window.dispatchEvent(new Event('fitlog-plan-change'));
    setToast('Added to today’s plan');
  };

  const addWorkoutToSaved = () => {
    if (!workout || typeof window === 'undefined') return;

    const saved = JSON.parse(window.localStorage.getItem('fitlog-saved') || '[]') as WorkoutApiItem[];
    const alreadySaved = saved.some((item) => item.id === workout.id);

    if (alreadySaved) {
      setToast('Already saved for later');
      return;
    }

    const updated = [...saved, workout];
    window.localStorage.setItem('fitlog-saved', JSON.stringify(updated));
    window.dispatchEvent(new Event('fitlog-plan-change'));
    setToast('Saved for later');
  };

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!workout) {
    return null;
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
              <img src="/logo.png" alt="FitLog logo" className="brand-logo" />
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
              <span className="badge-value">{planCount}</span>
            </Link>
            <Link href="/my-plan" className="badge badge-saved">
              <span className="badge-label">Saved</span>
              <span className="badge-value">{savedCount}</span>
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
              <button
                type="button"
                className="primary-action"
                onClick={addWorkoutToPlan}
                disabled={planCount >= 5 || typeof window !== 'undefined' && JSON.parse(window.localStorage.getItem('fitlog-plan') || '[]').some((item: { id: number }) => item.id === workout.id)}
              >
                Add to today&apos;s plan
              </button>
              <button
                type="button"
                className="secondary-action"
                onClick={addWorkoutToSaved}
                disabled={typeof window !== 'undefined' && JSON.parse(window.localStorage.getItem('fitlog-saved') || '[]').some((item: { id: number }) => item.id === workout.id)}
              >
                Save for later
              </button>
            </div>
            {toast ? <div className="plan-toast">{toast}</div> : null}
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <div className="brand footer-brand" aria-label="FitLog footer brand">
            <img src="/logo.png" alt="FitLog logo" className="brand-logo" />
            <span className="brand-text">FITLOG</span>
          </div>

          <p className="copyright">© 2026 FitLog — Workout Library. Train hard, log honest.</p>
        </div>
      </footer>
    </div>
  );
}
