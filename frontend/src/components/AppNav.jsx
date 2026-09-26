const navItems = ['Overview', 'Security', 'Docs', 'Pricing']

export default function AppNav() {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <a className="brand" href="/" aria-label="Rubix home">
          <img src="/logo.svg" alt="Rubix logo" className="brand-logo" />
          <span className="brand-copy">
            <span className="brand-name">rubix</span>
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
  )
}
