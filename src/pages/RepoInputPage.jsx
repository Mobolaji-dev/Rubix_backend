import RepoInputForm from '../components/RepoInputForm'

const navItems = ['Overview', 'Security', 'Docs', 'Pricing']

export default function RepoInputPage({ onSubmit }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <a className="brand" href="/" aria-label="Rubix home">
            <span className="brand-mark">R</span>
            <span className="brand-copy">
              <span className="brand-name">Rubix</span>
              <span className="brand-tag">Turnstile</span>
            </span>
          </a>

          <nav className="site-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item} href="#" className="nav-item">
                {item}
              </a>
            ))}
          </nav>

          <button type="button" className="menu-button" aria-label="Open menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <main className="container page-main">
        <section className="panel hero-panel" aria-labelledby="repo-input-title">
          <div className="hero-copy">
            <p className="eyebrow">Repository intake</p>
            <h1 id="repo-input-title">Analyze a repo</h1>
            <p className="lead">
              boundary map, risk scores, extraction order
            </p>
          </div>

          <RepoInputForm onSubmit={onSubmit} />
        </section>
      </main>
    </div>
  )
}
