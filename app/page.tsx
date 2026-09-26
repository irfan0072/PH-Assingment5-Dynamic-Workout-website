import Image from 'next/image';

export default function Home() {
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
