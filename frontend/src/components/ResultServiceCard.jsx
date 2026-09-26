import { useState } from 'react'

function getOrdinalLabel(value) {
  const safeValue = Number(value) || 1
  const suffixes = ['th', 'st', 'nd', 'rd']
  const remainder = safeValue % 100
  const suffix = suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]
  return `${safeValue}${suffix}`
}

function getRiskInfo(score) {
  const numericScore = Number(score) || 0

  if (numericScore <= 0.39) {
    return {
      label: 'Low Risk',
      description: 'Clean Boundary',
      variant: 'low',
    }
  }

  if (numericScore <= 0.69) {
    return {
      label: 'Medium Risk',
      description: 'Manageable Coupling',
      variant: 'medium',
    }
  }

  return {
    label: 'High Risk',
    description: 'Deep Entanglement',
    variant: 'high',
  }
}

function getExtractionLabel(value) {
  const safeValue = Number(value) || 1
  const ordinal = getOrdinalLabel(safeValue)
  const positions = {
    1: 'Extract First',
    2: 'Extract Second',
    3: 'Extract Third',
    4: 'Extract Fourth',
    5: 'Extract Fifth',
  }

  return `#${safeValue} ${positions[safeValue] || `Extract ${ordinal}`}`
}

export default function ResultServiceCard({ service, index }) {
  const [expanded, setExpanded] = useState(false)
  const riskInfo = getRiskInfo(service.risk_score)
  const extractionLabel = getExtractionLabel(service.recommended_extraction_order ?? index + 1)

  return (
    <article className="service-card">
      <div className="service-card__header">
        <div>
          <span className="card-kicker">Service {index + 1}</span>
          <h3>{service.proposed_name}</h3>
        </div>

        <div className="service-card__badges">
          <span className={`risk-badge risk-badge--${riskInfo.variant}`}>
            <span className="risk-badge__value">{Number(service.risk_score ?? 0).toFixed(2)}</span>
            <span>{riskInfo.label}</span>
          </span>
          <span className={`extraction-badge ${index === 0 ? 'is-primary' : ''}`}>
            {extractionLabel}
          </span>
        </div>
      </div>

      <div className="service-card__meta">
        <div className="meta-block">
          <span className="meta-label">owned modules</span>
          <ul className="meta-list module-list">
            {(service.owned_modules || []).map((modulePath) => (
              <li key={modulePath} className="module-name">{modulePath}</li>
            ))}
          </ul>
        </div>

        <div className="meta-block">
          <span className="meta-label">fan-out</span>
          <strong className="metric-value">{service.fan_out_count ?? 0}</strong>
        </div>
      </div>

      <div className="ownership-grid">
        <div className="ownership-panel">
          <div className="ownership-panel__header">
            <span className="meta-label">owned data</span>
            <span className="tag tag--creates">creates</span>
          </div>
          <ul className="meta-list">
            {(service.owned_data || []).map((entry) => (
              <li key={`${entry.resource}-${entry.relationship}`} className="ownership-item">
                <span className="resource-name">{entry.resource}</span>
                <span className="tag tag--creates">{entry.relationship}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ownership-panel">
          <div className="ownership-panel__header">
            <span className="meta-label">external dependencies</span>
            <span className="tag tag--reads">reads</span>
          </div>
          <ul className="meta-list">
            {(service.external_dependencies || []).map((entry) => (
              <li key={`${entry.resource}-${entry.relationship}`} className="ownership-item ownership-item--stacked">
                <div className="ownership-item__line">
                  <span className="resource-name">{entry.resource}</span>
                  <span className="tag tag--reads">{entry.relationship}</span>
                </div>
                {entry.produced_by ? (
                  <span className="produced-by">Produced by: {entry.produced_by}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        className="details-toggle"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
      >
        {expanded ? 'Hide detail' : 'View detail'}
      </button>

      {expanded ? (
        <div className="service-card__details">
          <div>
            <span className="meta-label">risk reasons</span>
            <ul className="meta-list">
              {(service.risk_reasons || []).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="meta-label">boundary signal</span>
            <p className="detail-summary">{riskInfo.description}</p>
          </div>
        </div>
      ) : null}
    </article>
  )
}

