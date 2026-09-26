'use client';

import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useEffect, useMemo, useState } from 'react';

type StoredWorkout = {
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
  completed?: boolean;
};

const tabs = ['Today\'s Plan', 'Saved'];

const defaultPlanItems: StoredWorkout[] = [
  {
    id: 101,
    name: 'Russian Twist',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    muscleGroups: ['Core'],
    equipment: 'Medicine Ball',
    difficulty: 'Intermediate',
    duration: 8,
    caloriesBurned: 70,
    sets: 4,
    reps: '6-8',
    rating: 4.1,
    description: 'Rotational power and oblique engagement.',
  },
  {
    id: 102,
    name: 'Pull-Up',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    muscleGroups: ['Back'],
    equipment: 'Pull-up Bar',
    difficulty: 'Intermediate',
    duration: 15,
    caloriesBurned: 120,
    sets: 4,
    reps: '6-8',
    rating: 4.7,
    description: 'Upper-body pulling strength with strict control.',
  },
];

export default function MyPlanPage() {
  const [activeTab, setActiveTab] = useState<'plan' | 'saved'>('plan');
  const [planItems, setPlanItems] = useState<StoredWorkout[]>(defaultPlanItems);
  const [savedItems, setSavedItems] = useState<StoredWorkout[]>([]);
  const [planCount, setPlanCount] = useState(defaultPlanItems.length);
  const [savedCount, setSavedCount] = useState(0);
  const [sortBy, setSortBy] = useState<'Duration' | 'Calories' | 'Rating'>('Duration');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const syncFromStorage = () => {
    if (typeof window === 'undefined') return;

    const storedPlanRaw = window.localStorage.getItem('fitlog-plan');
    const storedSavedRaw = window.localStorage.getItem('fitlog-saved');
    const storedPlan = storedPlanRaw ? JSON.parse(storedPlanRaw) : defaultPlanItems;
    const storedSaved = storedSavedRaw ? JSON.parse(storedSavedRaw) : [];

    if (!storedPlanRaw) {
      window.localStorage.setItem('fitlog-plan', JSON.stringify(storedPlan));
    }
    if (!storedSavedRaw) {
      window.localStorage.setItem('fitlog-saved', JSON.stringify(storedSaved));
    }

    setPlanItems(storedPlan);
    setSavedItems(storedSaved);
    setPlanCount(storedPlan.length);
    setSavedCount(storedSaved.length);
  };

  useEffect(() => {
    syncFromStorage();
    window.addEventListener('fitlog-plan-change', syncFromStorage);
    return () => window.removeEventListener('fitlog-plan-change', syncFromStorage);
  }, []);

  const sortOptions = ['Duration', 'Calories', 'Rating'] as const;

  const visibleItems = useMemo(() => {
    const items = activeTab === 'plan' ? planItems : savedItems;
    const activeItems = items.filter((item) => !item.completed);
    const completedItems = items.filter((item) => item.completed);

    const sortedActive = [...activeItems].sort((a, b) => {
      if (sortBy === 'Calories') return b.caloriesBurned - a.caloriesBurned;
      if (sortBy === 'Rating') return b.rating - a.rating;
      return b.duration - a.duration;
    });

    return [...sortedActive, ...completedItems];
  }, [activeTab, planItems, savedItems, sortBy]);

  const activeSummaryItems = activeTab === 'plan' ? planItems : savedItems;

  const summaryStats = [
    { label: 'Exercises', value: String(activeSummaryItems.length) },
    { label: 'Minutes', value: String(activeSummaryItems.reduce((sum, item) => sum + item.duration, 0)) },
    { label: 'Calories', value: String(activeSummaryItems.reduce((sum, item) => sum + item.caloriesBurned, 0)) },
  ];

  const updateStorageState = (nextPlan: StoredWorkout[], nextSaved: StoredWorkout[]) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('fitlog-plan', JSON.stringify(nextPlan));
    window.localStorage.setItem('fitlog-saved', JSON.stringify(nextSaved));
    window.dispatchEvent(new Event('fitlog-plan-change'));
    setPlanItems(nextPlan);
    setSavedItems(nextSaved);
    setPlanCount(nextPlan.length);
    setSavedCount(nextSaved.length);
  };

  const handleRemoveItem = (id: number) => {
    if (activeTab === 'plan') {
      const nextPlan = planItems.filter((item) => item.id !== id);
      updateStorageState(nextPlan, savedItems);
      toast.success('Workout removed');
      return;
    }

    const nextSaved = savedItems.filter((item) => item.id !== id);
    updateStorageState(planItems, nextSaved);
    toast.success('Saved workout removed');
  };

  const handleMarkDone = (id: number) => {
    if (activeTab === 'plan') {
      const nextPlan = planItems
        .map((item) => (item.id === id ? { ...item, completed: true } : item))
        .sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return Number(a.completed) - Number(b.completed);
        });

      updateStorageState(nextPlan, savedItems);
      toast.success('Workout marked as done');
      return;
    }

    const nextSaved = savedItems.filter((item) => item.id !== id);
    updateStorageState(planItems, nextSaved);
    toast.success('Saved workout marked as done');
  };

  return (
    <div className="page-shell page-plan-shell">
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

            <Link href="/" className="brand" aria-label="FitLog home">
              <Image src="/logo.png" alt="FitLog logo" width={28} height={28} className="brand-logo" />
              <span className="brand-text">FITLOG</span>
            </Link>
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            <Link href="/" className="nav-link">
              Workouts
            </Link>
            <Link href="/my-plan" className="nav-link active">
              My Plan
            </Link>
          </nav>

          <div className={`mobile-nav-panel ${mobileNavOpen ? 'open' : ''}`} aria-label="Mobile navigation">
            <Link href="/" className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>
              Workouts
            </Link>
            <Link href="/my-plan" className="mobile-nav-link active" onClick={() => setMobileNavOpen(false)}>
              My Plan
            </Link>
          </div>

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

      <main className="page-main my-plan-page" aria-label="My plan page">
        <section className="container my-plan-wrapper">
          <div className="plan-header-row">
            <div>
              <h1>MY PLAN</h1>
              <p>Cap of five lifts for today. Finish them, then load more.</p>
            </div>
          </div>

          <div className="plan-stats-row">
            {summaryStats.map((stat, index) => (
              <div key={stat.label} className="plan-stat-card">
                <span className="plan-stat-label">{stat.label}</span>
                <strong className={index === 0 ? 'plan-stat-value plan-stat-value-accent' : 'plan-stat-value'}>{stat.value}</strong>
              </div>
            ))}
          </div>

          <div className="plan-controls">
            <div className="plan-tabs" role="tablist" aria-label="Plan tabs">
              {tabs.map((tab, index) => {
                const isPlanTab = index === 0;
                return (
                  <button
                    key={tab}
                    type="button"
                    className={`plan-tab ${isPlanTab && activeTab === 'plan' ? 'active' : !isPlanTab && activeTab === 'saved' ? 'active' : ''}`}
                    aria-selected={isPlanTab ? activeTab === 'plan' : activeTab === 'saved'}
                    onClick={() => setActiveTab(isPlanTab ? 'plan' : 'saved')}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="sort-wrap plan-sort-wrap">
              <label htmlFor="plan-sort-by">Sort By</label>
              <div className="sort-select-shell">
                <select
                  id="plan-sort-by"
                  aria-label="Sort plan items"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as 'Duration' | 'Calories' | 'Rating')}
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="sort-chevron">▾</span>
              </div>
            </div>
          </div>

          {visibleItems.length === 0 ? (
            <div className="plan-empty-state">
              <div className="empty-state-box">
                <span className="empty-state-icon">✦</span>
                <h2>NOTHING HERE YET</h2>
                <p>Browse the library and add a lift to get today moving.</p>
                <Link href="/" className="empty-state-button">
                  Go to workouts
                </Link>
              </div>
            </div>
          ) : (
            <div className="plan-item-grid">
              {visibleItems.map((workout) => (
                <article key={`${activeTab}-${workout.id}`} className="plan-item-card">
                  <div className="plan-item-image">
                    <img src={workout.image} alt={workout.name} />
                  </div>

                  <div className="plan-item-main">
                    <div className="plan-item-copy">
                      <h3>{workout.name.toUpperCase()}</h3>
                      <p className="plan-item-equipment">{workout.equipment}</p>
                      <div className="plan-item-meta">
                        <span>⏱ {workout.duration} min</span>
                        <span>⚡ {workout.caloriesBurned} kcal</span>
                        <span>★ {Number(workout.rating).toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="plan-item-actions">
                      <Link href={`/workout/${workout.id}`} className="plan-detail-btn">
                        View Details
                      </Link>
                      {activeTab === 'plan' ? (
                        <button
                          type="button"
                          className="plan-done-btn"
                          onClick={() => handleMarkDone(workout.id)}
                          disabled={Boolean(workout.completed)}
                        >
                          {workout.completed ? 'Completed' : 'Mark as Done'}
                        </button>
                      ) : null}
                      <button type="button" className="plan-close-btn" aria-label={`Remove ${workout.name}`} onClick={() => handleRemoveItem(workout.id)}>
                        ×
                      </button>
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
            <Image src="/logo.png" alt="FitLog logo" width={24} height={24} className="brand-logo" />
            <span className="brand-text">FITLOG</span>
          </div>

          <p className="copyright">© 2026 FitLog — Workout Library. Train hard, log honest.</p>
        </div>
      </footer>
    </div>
  );
}
