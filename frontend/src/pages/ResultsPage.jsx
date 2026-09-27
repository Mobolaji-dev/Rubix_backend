import AppNav from '../components/AppNav'
import ResultServiceCard from '../components/ResultServiceCard'
import '../styles/results.css'

function DashboardHeader({ repoUrl, totalModules, unassignedModulesCount, onNewAnalysis }) {
  return (
    <>
      <header className="results-header">
        <div>
          <p className="eyebrow">Microservice map</p>
          <h1 id="results-title">Boundary analysis results</h1>
        </div>

        <button type="button" className="button-secondary" onClick={onNewAnalysis}>
          Start a new analysis
        </button>
      </header>

      <section className="results-summary-row" aria-label="Repository summary">
        <div className="summary-stat summary-stat--repo">
          <span className="meta-label">Repo</span>
          <span className="metric-value metric-value--wide">{repoUrl || 'Repository URL unavailable'}</span>
        </div>

        <div className="summary-stat">
          <span className="meta-label">Total Modules</span>
          <span className="metric-value metric-value--numeric">{totalModules ?? 0}</span>
        </div>

        <div className="summary-stat">
          <span className="meta-label">Unassigned</span>
          <span className="metric-value metric-value--numeric metric-value--success">{unassignedModulesCount ?? 0}</span>
        </div>
      </section>
    </>
  )
}

function CoverageBanner({ unassignedModulesCount }) {
  if (unassignedModulesCount > 0) {
    return (
      <div className="coverage-banner coverage-banner--warning" role="status">
        <span className="coverage-banner__icon">!</span>
        <p>
          <strong>Module Coverage:</strong> {unassignedModulesCount} module(s) remain unassigned and may require a manual review.
        </p>
      </div>
    )
  }

  return (
    <div className="coverage-banner coverage-banner--success" role="status">
      <span className="coverage-banner__icon">✓</span>
      <p>
        <strong>Module Coverage:</strong> All modules were successfully assigned to a proposed service boundary by IBM Bob 2.0.
      </p>
    </div>
  )
}

export default function ResultsPage({ result, onNewAnalysis }) {
  const services = Array.isArray(result?.services) ? result.services : []
  const summary = result?.summary || {}
  const totalModules = summary.total_modules ?? 0
  const unassignedModulesCount = Array.isArray(summary.unassigned_modules) ? summary.unassigned_modules.length : 0

  return (
    <div className="results-shell">
      <AppNav />

      <main className="results-main" aria-labelledby="results-title">
        <section className="results-panel">
          <DashboardHeader
            repoUrl={result?.repo_url}
            totalModules={totalModules}
            unassignedModulesCount={unassignedModulesCount}
            onNewAnalysis={onNewAnalysis}
          />

          <CoverageBanner unassignedModulesCount={unassignedModulesCount} />

          <div className="results-grid" aria-live="polite">
            {services.length ? (
              services.map((service, index) => (
                <ResultServiceCard key={`${service?.proposed_name || 'service'}-${index}`} service={service} index={index} />
              ))
            ) : (
              <div className="empty-state">
                <p>No service results are available yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
