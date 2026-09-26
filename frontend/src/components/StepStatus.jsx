import { useEffect, useRef } from 'react'

export default function StepStatus({ status, loading }) {
  const terminalRef = useRef(null)
  const progressPct = Number(status?.progress_pct ?? 0)
  const safeProgress = Number.isFinite(progressPct) ? Math.min(100, Math.max(0, progressPct)) : 0
  const logs = Array.isArray(status?.logs) ? status.logs : []

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs.length])

  return (
    <div className="step-status" aria-live="polite">
      <div className="step-status__meta">
        <span className="step-status__label">Bob status</span>
        <span className="step-status__count">{safeProgress}%</span>
      </div>

      <div className="progress-track" aria-hidden="true">
        <span className="progress-fill" style={{ width: `${safeProgress}%` }} />
      </div>

      <p className="step-status__text">
        {status?.current_step || (loading ? 'Waiting for the backend to emit the next step...' : 'Waiting for analysis to start...')}
      </p>

      <div className="terminal-window" ref={terminalRef} aria-live="polite">
        <pre>{logs.length ? logs.join('\n') : 'Awaiting repository analysis output...'}</pre>
      </div>
    </div>
  )
}
