export default function AppNav({ currentView, onNavigate }) {
  const handleNavClick = (e, item) => {
    e.preventDefault()
    if (item === 'Docs' || item === 'Security' || item === 'Pricing') {
      if (typeof onNavigate === 'function') onNavigate('docs')
    } else if (item === 'Overview' || item === 'Home') {
      if (typeof onNavigate === 'function') onNavigate('input')
    }
  }

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('input') }} aria-label="Rubix home">
          <img src="/logo.svg" alt="Rubix logo" className="brand-logo" />
          <span className="brand-copy">
            <span className="brand-name">rubix</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          {['Docs'].map((item) => (
            <a
              key={item}
              href="#"
              onClick={(e) => handleNavClick(e, item)}
              className={`nav-item ${item === 'Docs' && currentView === 'docs' ? 'nav-item--active' : ''}`}
            >
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
  )
}
