import { useState } from 'react'

function getOrdinalLabel(value) {
  const safeValue = Number(value) || 1
  const suffixes = ['th', 'st', 'nd', 'rd']
  const remainder = safeValue % 100
  const suffix = suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]
  return `${safeValue}${suffix}`
}

function getRiskInfo(score) {
  const numericScore = Number(score) ?? 0

  if (numericScore >= 0 && numericScore <= 0.39) {
    return {
      label: 'Low Risk',
      description: 'Clean Boundary',
      tone: 'low',
      badgeText: numericScore.toFixed(2),
      iconClass: 'fa-solid fa-shield-halved',
    }
  }

  if (numericScore <= 0.69) {
    return {
      label: 'Medium Risk',
      description: 'Manageable Coupling',
      tone: 'medium',
      badgeText: numericScore.toFixed(2),
      iconClass: 'fa-solid fa-triangle-exclamation',
    }
  }

  return {
    label: 'High Risk',
    description: 'Deep Entanglement',
    tone: 'high',
    badgeText: numericScore.toFixed(2),
    iconClass: 'fa-solid fa-circle-exclamation',
  }
}

function getExtractionLabel(value, index) {
  const safeValue = Number(value)
  const extractionOrder = Number.isFinite(safeValue) ? safeValue : index + 1

  if (extractionOrder === 1) return '#1 Extract First'
  if (extractionOrder === 2) return '#2 Extract Second'
  if (extractionOrder === 3) return '#3 Extract Third'
  if (extractionOrder === 4) return '#4 Extract Fourth'
  if (extractionOrder === 5) return '#5 Extract Fifth'

  return `#${extractionOrder} Extract Later`
}

function RiskBadge({ score }) {
  const riskInfo = getRiskInfo(score)

  return (
    <span className={`risk-badge risk-badge--${riskInfo.tone}`}>
      <i className={riskInfo.iconClass} aria-hidden="true" />
      <span className="risk-badge__value">{riskInfo.badgeText}</span>
      <span>{riskInfo.label}</span>
    </span>
  )
}

function SectionHeader({ iconClass, label }) {
  return (
    <h4 className="card-section__title">
      <i className={iconClass} aria-hidden="true" />
      <span>{label}</span>
    </h4>
  )
}

export default function ResultServiceCard({ service, index }) {
  const extractionLabel = getExtractionLabel(service?.recommended_extraction_order, index)
  const modules = Array.isArray(service?.owned_modules) ? service.owned_modules : []
  const ownedData = Array.isArray(service?.owned_data) ? service.owned_data : []
  const externalDependencies = Array.isArray(service?.external_dependencies) ? service.external_dependencies : []

  return (
    <article className="service-card">
      <div className="service-card__header">
        <div className="service-card__header-copy">
          <p className="card-kicker">Service {index + 1}</p>
          <h3>{service?.proposed_name || 'Untitled Service'}</h3>
        </div>

        <div className="service-card__header-right">
          <RiskBadge score={service?.risk_score} />
          <span className="extraction-badge">{extractionLabel}</span>
        </div>

        <div className="service-card__metrics">
          <div className="service-card__meta-block">
            <span className="service-card__metric-caption">Modules Owned</span>
            <span className="service-card__metric-value">{modules.length}</span>
          </div>

          <div className="service-card__meta-block service-card__meta-block--right">
            <span className="service-card__metric-caption">Fan-out</span>
            <span className="service-card__metric-value">{Number(service?.fan_out_count ?? 0)}</span>
          </div>
        </div>
      </div>

      <div className="service-card__body">
        <div className="card-section">
          <SectionHeader iconClass="fa-solid fa-folder-tree" label="Owned Modules" />
          <ul className="resource-list">
            {modules.length ? (
              modules.map((modulePath) => (
                <li key={modulePath} className="resource-list__item resource-list__item--mono">
                  {modulePath}
                </li>
              ))
            ) : (
              <li className="resource-list__item resource-list__item--empty">No owned modules reported.</li>
            )}
          </ul>
        </div>

        <div className="card-section">
          <SectionHeader iconClass="fa-solid fa-database" label="Owned Data" />
          <div className="resource-stack">
            {ownedData.length ? (
              ownedData.map((entry, itemIndex) => (
                <div key={`${entry?.resource || 'data'}-${itemIndex}`} className="resource-row">
                  <span className="resource-row__label">{entry?.resource || 'Unnamed data resource'}</span>
                  <span className="relationship-tag relationship-tag--creates">{entry?.relationship || 'creates'}</span>
                </div>
              ))
            ) : (
              <div className="resource-row resource-row--empty">No owned data reported.</div>
            )}
          </div>
        </div>

        <div className="card-section">
          <SectionHeader iconClass="fa-solid fa-link" label="External Dependencies" />
          <div className="resource-stack">
            {externalDependencies.length ? (
              externalDependencies.map((entry, itemIndex) => (
                <div key={`${entry?.resource || 'dependency'}-${itemIndex}`} className="dependency-card">
                  <div className="dependency-card__topline">
                    <span className="resource-row__label">{entry?.resource || 'Unnamed dependency'}</span>
                    <span className="relationship-tag relationship-tag--reads">{entry?.relationship || 'reads'}</span>
                  </div>

                  {entry?.produced_by ? (
                    <span className="dependency-warning">Produced by: {entry.produced_by}</span>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="resource-row resource-row--empty">No inbound cross-boundary data dependencies.</div>
            )}
          </div>
        </div>
      </div>

      <div className="service-card__footer">
        <button type="button" className="details-toggle" aria-label={`View details for ${service?.proposed_name || 'service'}`}>
          View detail
        </button>
      </div>
    </article>
  )
}

