import { useState } from 'react'

function getRiskInfo(score) {
  const numericScore = Number(score) ?? 0

  if (numericScore >= 0 && numericScore <= 0.39) {
    return {
      label: 'Low Risk',
      tone: 'low',
      badgeText: numericScore.toFixed(2),
      iconClass: 'fa-solid fa-shield-halved',
    }
  }

  if (numericScore <= 0.69) {
    return {
      label: 'Medium Risk',
      tone: 'medium',
      badgeText: numericScore.toFixed(2),
      iconClass: 'fa-solid fa-triangle-exclamation',
    }
  }

  return {
    label: 'High Risk',
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

export default function ResultServiceCard({ service, index }) {
  const [showModal, setShowModal] = useState(false)

  const extractionLabel = getExtractionLabel(service?.recommended_extraction_order, index)
  const modules = Array.isArray(service?.owned_modules) ? service.owned_modules : []
  const ownedData = Array.isArray(service?.owned_data) ? service.owned_data : []
  const externalDependencies = Array.isArray(service?.external_dependencies) ? service.external_dependencies : []
  const riskReasons = Array.isArray(service?.risk_reasons) ? service.risk_reasons : []
  const riskInfo = getRiskInfo(service?.risk_score)

  return (
    <>
      <article className="service-card">
        {/* Fixed Card Header */}
        <div className="service-card__header">
          <p className="card-kicker">Service {index + 1}</p>
          <h3 className="service-card__title" title={service?.proposed_name}>
            {service?.proposed_name || 'Untitled Service'}
          </h3>

          <div className="service-card__badges">
            <span className={`risk-badge risk-badge--${riskInfo.tone}`}>
              <i className={riskInfo.iconClass} aria-hidden="true" />
              <span>{riskInfo.badgeText} {riskInfo.label}</span>
            </span>
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

        {/* Scrollable Card Body */}
        <div className="service-card__body custom-scrollbar">
          {/* Owned Modules Section */}
          <div className="card-section">
            <h4 className="card-section__title">
              <i className="fa-solid fa-folder-tree" aria-hidden="true" />
              <span>Owned Modules</span>
            </h4>
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

          {/* Owned Data Section */}
          <div className="card-section">
            <h4 className="card-section__title">
              <i className="fa-solid fa-database" aria-hidden="true" />
              <span>Owned Data</span>
            </h4>
            <div className="resource-stack">
              {ownedData.length ? (
                ownedData.map((entry, itemIndex) => (
                  <div key={`${entry?.resource || 'data'}-${itemIndex}`} className="resource-row">
                    <span className="resource-row__label">{entry?.resource || 'Unnamed data resource'}</span>
                    <span className="relationship-tag relationship-tag--creates">
                      {entry?.relationship || 'creates'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="resource-row resource-row--empty">No owned data reported.</div>
              )}
            </div>
          </div>

          {/* External Dependencies Section */}
          <div className="card-section">
            <h4 className="card-section__title">
              <i className="fa-solid fa-link" aria-hidden="true" />
              <span>External Dependencies</span>
            </h4>
            <div className="resource-stack">
              {externalDependencies.length ? (
                externalDependencies.map((entry, itemIndex) => (
                  <div key={`${entry?.resource || 'dependency'}-${itemIndex}`} className="dependency-card">
                    <div className="dependency-card__topline">
                      <span className="resource-row__label">{entry?.resource || 'Unnamed dependency'}</span>
                      <span className="relationship-tag relationship-tag--reads">
                        {entry?.relationship || 'reads'}
                      </span>
                    </div>

                    {entry?.produced_by ? (
                      <div className="dependency-owner">
                        Produced by: <strong>{entry.produced_by}</strong>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="resource-row resource-row--empty">No inbound cross-boundary data dependencies.</div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Card Footer */}
        <div className="service-card__footer">
          <button
            type="button"
            className="details-toggle"
            onClick={() => setShowModal(true)}
            aria-label={`View details for ${service?.proposed_name || 'service'}`}
          >
            View detail
          </button>
        </div>
      </article>

      {/* Detail Modal Dialog showing Risk Reasons & Breakdown */}
      {showModal ? (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="card-kicker">Service {index + 1} — Detailed Analysis</p>
                <h2 className="modal-title">{service?.proposed_name || 'Untitled Service'}</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Close details"
              >
                &times;
              </button>
            </div>

            <div className="modal-body custom-scrollbar">
              {/* Badges & Overview */}
              <div className="modal-badges-row">
                <span className={`risk-badge risk-badge--${riskInfo.tone}`}>
                  <i className={riskInfo.iconClass} aria-hidden="true" />
                  <span>{riskInfo.badgeText} {riskInfo.label}</span>
                </span>
                <span className="extraction-badge">{extractionLabel}</span>
              </div>

              {/* Risk Reasons Section */}
              <div className="card-section">
                <h4 className="card-section__title">
                  <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
                  <span>Coupling Audit & Risk Reasons</span>
                </h4>
                {riskReasons.length ? (
                  <ul className="risk-reasons-list">
                    {riskReasons.map((reason, rIdx) => (
                      <li key={rIdx} className="risk-reason-item">
                        <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="resource-row--empty">Clean domain boundary. No major coupling risks identified.</div>
                )}
              </div>

              {/* All Owned Modules Section */}
              <div className="card-section">
                <h4 className="card-section__title">
                  <i className="fa-solid fa-folder-tree" aria-hidden="true" />
                  <span>All Owned Modules ({modules.length})</span>
                </h4>
                <ul className="resource-list">
                  {modules.map((mPath) => (
                    <li key={mPath} className="resource-list__item resource-list__item--mono">
                      {mPath}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Owned Data Section */}
              <div className="card-section">
                <h4 className="card-section__title">
                  <i className="fa-solid fa-database" aria-hidden="true" />
                  <span>Owned Data Entities ({ownedData.length})</span>
                </h4>
                <div className="resource-stack">
                  {ownedData.length ? (
                    ownedData.map((entry, itemIndex) => (
                      <div key={`${entry?.resource}-${itemIndex}`} className="resource-row">
                        <span className="resource-row__label">{entry?.resource}</span>
                        <span className="relationship-tag relationship-tag--creates">
                          {entry?.relationship || 'creates'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="resource-row resource-row--empty">No owned data reported.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="details-toggle"
                onClick={() => setShowModal(false)}
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
