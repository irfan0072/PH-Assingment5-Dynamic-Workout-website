'use client';

import Link from 'next/link';

const summaryStats = [
  { label: 'Exercises', value: '0' },
  { label: 'Minutes', value: '0' },
  { label: 'Calories', value: '0' },
];

const tabs = ['Today\'s Plan', 'Saved'];

export default function MyPlanPage() {
  return (
    <div className="page-shell page-plan-shell">
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
            <Link href="/" className="nav-link">
              Workouts
            </Link>
            <Link href="/my-plan" className="nav-link active">
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

      <main className="page-main my-plan-page" aria-label="My plan page">
        <section className="container my-plan-wrapper">
          <div className="plan-header-row">
            <div>
              <h1>MY PLAN</h1>
              <p>Cap of five lifts for today. Finish them, then load more.</p>
            </div>
          </div>

          <div className="plan-stats-row">
            {summaryStats.map((stat) => (
              <div key={stat.label} className="plan-stat-card">
                <span className="plan-stat-label">{stat.label}</span>
                <strong className="plan-stat-value">{stat.value}</strong>
              </div>
            ))}
          </div>

          <div className="plan-controls">
            <div className="plan-tabs" role="tablist" aria-label="Plan tabs">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`plan-tab ${index === 0 ? 'active' : ''}`}
                  aria-selected={index === 0}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="sort-wrap plan-sort-wrap">
              <label htmlFor="plan-sort-by">Sort By</label>
              <div className="sort-select-shell">
                <select id="plan-sort-by" aria-label="Sort plan items">
                  <option>Duration</option>
                  <option>Calories</option>
                  <option>Rating</option>
                </select>
                <span className="sort-chevron">▾</span>
              </div>
            </div>
          </div>

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
