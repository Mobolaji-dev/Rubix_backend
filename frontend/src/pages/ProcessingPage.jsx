import { useEffect } from 'react'
import AppNav from '../components/AppNav'
import CubeAnimation from '../components/CubeAnimation'
import StepStatus from '../components/StepStatus'
import useAnalysis from '../hooks/useAnalysis'

export default function ProcessingPage({ jobId, onComplete, onBack, onNavigate }) {
  const { pollJob, status, result, error, loading } = useAnalysis()

  useEffect(() => {
    if (!jobId) {
      return
    }

    pollJob(jobId)
  }, [jobId, pollJob])

  useEffect(() => {
    if (result && typeof onComplete === 'function') {
      onComplete(result, status?.logs || [])
    }
  }, [result, onComplete])

  const failureMessage = status?.current_step || error || 'Analysis failed'

  if (status?.status === 'failed' || error) {
    return (
      <div className="app-shell processing-shell">
        <AppNav currentView="processing" onNavigate={onNavigate} />

        <main className="container processing-main" aria-labelledby="processing-error-title">
          <section className="processing-panel processing-panel--error">
            <span className="processing-kicker">Status</span>
            <h1 id="processing-error-title">Analysis failed</h1>
            <p className="processing-error-message">{failureMessage}</p>
            <button type="button" className="button-secondary" onClick={onBack}>
              Back to repo intake
            </button>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell processing-shell">
      <AppNav currentView="processing" onNavigate={onNavigate} />

      <main className="container processing-main" aria-labelledby="processing-title">
        <section className="processing-panel">
          <div className="processing-visual">
            <span className="processing-kicker">Live analysis</span>
            <h1 id="processing-title">Bob is working</h1>
          </div>

          <CubeAnimation />
          <StepStatus status={status} loading={loading} />
        </section>
      </main>
    </div>
  )
}
