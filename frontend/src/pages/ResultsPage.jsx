import { useState } from 'react'
import AppNav from '../components/AppNav'
import ResultServiceCard from '../components/ResultServiceCard'
import '../styles/results.css'

function LogsModal({ logs, onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="logs-modal-title" onClick={onClose}>
      <div className="modal-content logs-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="card-kicker">Pipeline trace</p>
            <h2 id="logs-modal-title" className="modal-title">Analysis Logs</h2>
          </div>
          <button type="button" className="modal-close" aria-label="Close logs" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body logs-modal-body custom-scrollbar">
          {logs && logs.length > 0 ? (
            <ol className="logs-list">
              {logs.map((entry, i) => (
                <li key={i} className="log-entry">
                  <span className="log-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="log-text">{entry}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="logs-empty">No logs were captured for this run.</p>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="button-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

function DashboardHeader({ repoUrl, totalModules, unassignedModulesCount, onNewAnalysis, onViewLogs, hasLogs }) {
  return (
    <>
      <header className="results-header">
        <div>
          <p className="eyebrow">Microservice map</p>
          <h1 id="results-title">Boundary analysis results</h1>
        </div>

        <div className="results-header-actions">
          {hasLogs && (
            <button type="button" className="button-logs" onClick={onViewLogs}>
              <span className="button-logs__icon">▶</span>
              View analysis logs
            </button>
          )}
          <button type="button" className="button-secondary" onClick={onNewAnalysis}>
            Analyze a new repo
          </button>
        </div>
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

export default function ResultsPage({ result, logs, jobId, onNewAnalysis, onNavigate }) {
  const [showLogs, setShowLogs] = useState(false)

  const services = Array.isArray(result?.services) ? result.services : []
  const summary = result?.summary || {}
  const totalModules = summary.total_modules ?? 0
  const unassignedModulesCount = Array.isArray(summary.unassigned_modules) ? summary.unassigned_modules.length : 0
  const hasLogs = Array.isArray(logs) && logs.length > 0

  return (
    <div className="results-shell">
      <AppNav currentView="results" onNavigate={onNavigate} />

      {showLogs && <LogsModal logs={logs} onClose={() => setShowLogs(false)} />}

      <main className="results-main" aria-labelledby="results-title">
        <section className="results-panel">
          <DashboardHeader
            repoUrl={result?.repo_url}
            totalModules={totalModules}
            unassignedModulesCount={unassignedModulesCount}
            onNewAnalysis={onNewAnalysis}
            onViewLogs={() => setShowLogs(true)}
            hasLogs={hasLogs}
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
