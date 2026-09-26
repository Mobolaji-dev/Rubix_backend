import AppNav from '../components/AppNav'
import ResultServiceCard from '../components/ResultServiceCard'
import '../styles/results.css'

export default function ResultsPage({ result, onNewAnalysis }) {
  const services = result?.services || []
  const summary = result?.summary || {}

  return (
    <div className="app-shell results-shell">
      <AppNav />

      <main className="container results-main" aria-labelledby="results-title">
        <section className="results-panel">
          <div className="results-header">
            <div>
              <p className="eyebrow">Microservice map</p>
              <h1 id="results-title">Boundary analysis results</h1>
            </div>

            <button type="button" className="button-secondary" onClick={onNewAnalysis}>
              Start a new analysis
            </button>
          </div>

          <div className="results-summary-row">
            <div className="summary-stat">
              <span className="meta-label">repo</span>
              <span className="metric-value metric-value--wide">{result?.repo_url || 'Repository URL unavailable'}</span>
            </div>
            <div className="summary-stat">
              <span className="meta-label">total modules</span>
              <span className="metric-value">{summary.total_modules ?? 0}</span>
            </div>
            <div className="summary-stat">
              <span className="meta-label">unassigned modules</span>
              <span className="metric-value">{(summary.unassigned_modules || []).length}</span>
            </div>
          </div>

          {summary.unassigned_modules?.length ? (
            <div className="summary-list-panel">
              <span className="meta-label">unassigned modules</span>
              <ul className="summary-list">
                {(summary.unassigned_modules || []).map((modulePath) => (
                  <li key={modulePath} className="resource-name">{modulePath}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="summary-list-panel summary-list-panel--empty">
              <span className="meta-label">module coverage</span>
              <p>All modules were assigned to a proposed service boundary.</p>
            </div>
          )}

          <div className="results-scroll">
            <div className="results-grid">
              {services.length ? (
                services.map((service, index) => (
                  <ResultServiceCard key={`${service.proposed_name}-${index}`} service={service} index={index} />
                ))
              ) : (
                <div className="empty-state">
                  <p>No service results are available yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
