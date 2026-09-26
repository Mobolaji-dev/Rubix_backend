import RepoInputForm from '../components/RepoInputForm'
import AppNav from '../components/AppNav'

export default function RepoInputPage({ onSubmit }) {
  return (
    <div className="app-shell">
      <AppNav />

      <main className="container page-main">
        <section className="panel hero-panel" aria-labelledby="repo-input-title">
          <div className="hero-copy">
            <p className="eyebrow">Repository intake</p>
            <h1 id="repo-input-title">Analyze a repo</h1>
          </div>

          <RepoInputForm onSubmit={onSubmit} />
        </section>
      </main>
    </div>
  )
}
