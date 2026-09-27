import { useState } from 'react'
import AppNav from '../components/AppNav'
import '../styles/docs.css'

const DOC_SECTIONS = [
  {
    id: 'overview',
    title: 'Rubix Overview',
    category: 'Getting Started',
    icon: '🚀',
    summary: 'AI-Powered Microservice Boundary Advisor built for IBM Bob 2.0 & LangGraph',
    content: (
      <div className="doc-article">
        <div className="doc-article-header">
          <span className="doc-category-badge">Getting Started</span>
          <h1>🚀 Rubix — Repository Decomposition Advisor</h1>
          <p className="doc-subtitle">
            Automating Domain-Driven Design (DDD) microservice extraction using IBM Bob 2.0 whole-repository reasoning and 4-step LangGraph StateGraph agents.
          </p>
        </div>

        <div className="doc-callout doc-callout--important">
          <span className="doc-callout__icon">📌</span>
          <div>
            <strong>Executive Summary</strong>
            <p>
              Decoupling a monolithic application into microservices is one of the highest-friction tasks in software engineering. Manual refactoring relies on weeks of tribal guesswork. Making the wrong architectural cut results in high-latency distributed monoliths, circular dependencies, and cascading production failures.
            </p>
          </div>
        </div>

        <h2>✨ Key Value Propositions</h2>
        <div className="doc-cards-grid">
          <div className="doc-feature-card">
            <span className="feature-number">01</span>
            <h3>4-Step DDD LangGraph Agent</h3>
            <p>Executes automated domain event extraction, bounded context discovery, coupling auditing, and candidate ranking.</p>
          </div>

          <div className="doc-feature-card">
            <span className="feature-number">02</span>
            <h3>IBM Bob 2.0 Whole-Repo Reasoning</h3>
            <p>Analyzes multi-file semantic relationships across complex monoliths rather than isolated code snippets.</p>
          </div>

          <div className="doc-feature-card">
            <span className="feature-number">03</span>
            <h3>Producer / Consumer Ownership Tracking</h3>
            <p>Explicitly distinguishes services that merely read data from services that own resource creation lifecycle.</p>
          </div>

          <div className="doc-feature-card">
            <span className="feature-number">04</span>
            <h3>3-Signal Quantitative Coupling Score</h3>
            <p>Evaluates shared writes, call frequency, and graph density to score boundary safety from 0.00 to 1.00.</p>
          </div>
        </div>

        <h2>🏗️ High-Level System Architecture</h2>
        <div className="doc-code-block">
          <pre>{`flowchart TD
    A["User Inputs GitHub Repo URL"] --> B["FastAPI Backend (/analyze)"]
    B --> C["Step 1: AST Parser & Call Graph Extractor"]
    C --> D["Step 2: IBM Bob 2.0 Whole-Repo Context Engine"]
    D --> E["Step 3: 3-Signal Coupling Audit Engine"]
    E --> F["Step 4: Extraction Candidate Ranker"]
    F --> G["Interactive Visual Boundary Cards"]`}</pre>
        </div>

        <h2>🎯 Target Audience & Impact</h2>
        <ul>
          <li><strong>Software Architects:</strong> Planning legacy monolith modernization and microservice migration.</li>
          <li><strong>Engineering Managers:</strong> Evaluating refactoring risk before allocating developer quarters.</li>
          <li><strong>DevOps Engineers:</strong> Designing clean service boundaries for containerization and Kubernetes.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'judge-checklist',
    title: 'Hackathon Judge Verification Checklist',
    category: 'Verification',
    icon: '🏆',
    summary: 'Quick evaluation guide and criteria verification for IBM Bob 2.0 Hackathon Judges',
    content: (
      <div className="doc-article">
        <div className="doc-article-header">
          <span className="doc-category-badge doc-category-badge--judge">Hackathon Evaluation</span>
          <h1>🏆 Hackathon Judge Verification Checklist</h1>
          <p className="doc-subtitle">
            Welcome IBM Bob 2.0 Hackathon Judges! This document provides quick links and step-by-step verification instructions.
          </p>
        </div>

        <div className="doc-callout doc-callout--tip">
          <span className="doc-callout__icon">🔗</span>
          <div>
            <strong>Project Deliverable Links</strong>
            <ul className="doc-links-list">
              <li>🌐 <strong>Landing Page:</strong> <a href="https://rubix-landing.pxxl.click" target="_blank" rel="noreferrer">https://rubix-landing.pxxl.click</a></li>
              <li>🚀 <strong>Production Web Application:</strong> <a href="https://rubix.pxxl.click/" target="_blank" rel="noreferrer">https://rubix.pxxl.click/</a></li>
              <li>📡 <strong>Backend API (Swagger UI):</strong> <a href="https://rubixbackend.pxxl.click/docs" target="_blank" rel="noreferrer">https://rubixbackend.pxxl.click/docs</a></li>
              <li>🐙 <strong>GitHub Backend Repository:</strong> <a href="https://github.com/techbyFEMI/Rubix_backend.git" target="_blank" rel="noreferrer">techbyFEMI/Rubix_backend.git</a></li>
              <li>📁 <strong>IBM Bob IDE Session Proof:</strong> <code>bob_sessions/</code> directory in repository</li>
            </ul>
          </div>
        </div>

        <h2>✅ Criteria Alignment Matrix</h2>
        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Evaluation Category</th>
                <th>How Rubix Addresses It</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Use of IBM Bob 2.0</strong></td>
                <td>Leverages IBM Bob 2.0 API (<code>app/engine/bob_client.py</code>) for whole-repository context reasoning and IBM Bob IDE in local workspace.</td>
              </tr>
              <tr>
                <td><strong>Technical Complexity</strong></td>
                <td>Python 3.14 + FastAPI + Pydantic v2 + LangGraph StateGraph (4-step agent pipeline) + Python AST static dependency parser.</td>
              </tr>
              <tr>
                <td><strong>User Experience & Design</strong></td>
                <td>Modern dark-mode dashboard featuring live terminal streaming, 3-signal risk meters, producer/consumer badges, and <code>#1 Extract First</code> tags.</td>
              </tr>
              <tr>
                <td><strong>Real-World Impact</strong></td>
                <td>Replaces weeks of manual refactoring guesswork with an automated 60-second microservice boundary roadmap.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>⚡ 60-Second Quick Test Flow</h2>
        <ol className="doc-steps-list">
          <li>Open <strong><a href="https://rubix-landing.pxxl.click" target="_blank" rel="noreferrer">https://rubix-landing.pxxl.click</a></strong>.</li>
          <li>Click <strong>Start Analysis</strong> to launch the web app.</li>
          <li>Paste test monolithic repo URL: <code>https://github.com/techbyFEMI/routine-backend</code> and click <strong>Analyze Repo</strong>.</li>
          <li>Observe the <strong>live terminal log</strong> executing the 4-step DDD pipeline.</li>
          <li>Review generated service boundary cards displaying <strong>Risk Scores</strong>, <strong>Producer/Consumer badges</strong>, and <strong><code>#1 Extract First</code></strong>.</li>
        </ol>
      </div>
    )
  },
  {
    id: 'api-reference',
    title: 'REST API Reference',
    category: 'Developer Guide',
    icon: '🔌',
    summary: 'FastAPI async endpoint specifications, request schemas, and response payloads',
    content: (
      <div className="doc-article">
        <div className="doc-article-header">
          <span className="doc-category-badge">Developer Reference</span>
          <h1>🔌 REST API Reference</h1>
          <p className="doc-subtitle">
            Built using Python 3.14 + FastAPI + Pydantic v2, featuring an asynchronous job-polling architecture.
          </p>
        </div>

        <div className="doc-api-endpoint">
          <div className="api-method-header">
            <span className="api-badge api-badge--post">POST</span>
            <code className="api-path">/analyze</code>
            <span className="api-status">202 Accepted</span>
          </div>
          <p>Initiates a 4-step DDD decomposition pipeline for a GitHub repository.</p>

          <h4>Request Body</h4>
          <pre className="code-block"><code>{`{\n  "repo_url": "https://github.com/techbyFEMI/routine-backend",\n  "repo_ref": "main"\n}`}</code></pre>

          <h4>Response Payload</h4>
          <pre className="code-block"><code>{`{\n  "job_id": "job_38a42f10",\n  "status": "queued"\n}`}</code></pre>
        </div>

        <div className="doc-api-endpoint">
          <div className="api-method-header">
            <span className="api-badge api-badge--get">GET</span>
            <code className="api-path">/analyze/{'{job_id}'}/status</code>
            <span className="api-status">200 OK</span>
          </div>
          <p>Polls live execution progress, progress percentages, and terminal step logs.</p>

          <h4>Response Payload (Running)</h4>
          <pre className="code-block"><code>{`{\n  "job_id": "job_38a42f10",\n  "status": "running",\n  "progress_pct": 50,\n  "current_step": "Step 3/4: Evaluated shared writes, call frequency, and producer/consumer data relationships.",\n  "logs": [\n    "[00412ms] Fetching repository source code...",\n    "[00419ms] Invoking LangGraph StateGraph pipeline...",\n    "[00845ms] [Step 1/4] Parsed repository — 12 modules indexed.",\n    "[01250ms] [Step 2/4] Identified 3 bounded context candidates via IBM Bob 2.0."\n  ]\n}`}</code></pre>
        </div>

        <div className="doc-api-endpoint">
          <div className="api-method-header">
            <span className="api-badge api-badge--get">GET</span>
            <code className="api-path">/analyze/{'{job_id}'}/result</code>
            <span className="api-status">200 OK</span>
          </div>
          <p>Retrieves final microservice decomposition map, risk scores, and extraction order.</p>

          <h4>Response Payload</h4>
          <pre className="code-block"><code>{`{\n  "job_id": "job_38a42f10",\n  "repo_url": "https://github.com/techbyFEMI/routine-backend",\n  "services": [\n    {\n      "proposed_name": "Task & Workflow Service",\n      "owned_modules": ["routine_api/routers/tasks.py", "routine_api/routers/checkins.py"],\n      "owned_data": [\n        { "resource": "tasks", "relationship": "creates" }\n      ],\n      "external_dependencies": [\n        { "resource": "users", "relationship": "reads", "produced_by": "User & Auth Service" }\n      ],\n      "risk_score": 0.18,\n      "risk_reasons": ["Low cross-context calls", "Isolated database writes"],\n      "fan_out_count": 1,\n      "recommended_extraction_order": 1\n    }\n  ],\n  "summary": {\n    "total_modules": 12,\n    "unassigned_modules": []\n  }\n}`}</code></pre>
        </div>
      </div>
    )
  },
  {
    id: 'architecture',
    title: 'Architecture & IBM Bob 2.0 Integration',
    category: 'Architecture',
    icon: '🧠',
    summary: 'Detailed mechanics of the 4-step LangGraph StateGraph pipeline and IBM Bob 2.0 client',
    content: (
      <div className="doc-article">
        <div className="doc-article-header">
          <span className="doc-category-badge">Architecture</span>
          <h1>🧠 Architecture & IBM Bob 2.0 Integration</h1>
          <p className="doc-subtitle">
            Rubix pairs Python AST static analysis with IBM Bob 2.0 semantic reasoning in a 4-stage state graph.
          </p>
        </div>

        <h2>🔄 The 4-Step LangGraph Execution Pipeline</h2>
        <div className="doc-pipeline-diagram">
          <div className="pipeline-step">
            <span className="step-num">Step 1</span>
            <h4>AST Extraction</h4>
            <p>Parses module ASTs, import trees, and raw SQL/ORM query triggers.</p>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step pipeline-step--bob">
            <span className="step-num">Step 2</span>
            <h4>IBM Bob 2.0 Context Engine</h4>
            <p>Full-repository semantic reasoning for Bounded Context discovery.</p>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">
            <span className="step-num">Step 3</span>
            <h4>3-Signal Coupling Audit</h4>
            <p>Calculates data write conflicts, call counts, and Tarjan SCC graph density.</p>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className="pipeline-step">
            <span className="step-num">Step 4</span>
            <h4>Extraction Ranker</h4>
            <p>Assigns recommended refactoring priority order (#1 Extract First).</p>
          </div>
        </div>

        <h2>📐 3-Signal Coupling Risk Formula</h2>
        <div className="doc-formula-card">
          <div className="formula-box">
            Risk Score = 0.45 × S_data + 0.35 × S_calls + 0.20 × S_density
          </div>
          <ul>
            <li><strong>S_data (Shared Write Signal):</strong> Ratio of database tables written to by multiple contexts.</li>
            <li><strong>S_calls (Call Frequency Signal):</strong> Volume of cross-boundary function invocations.</li>
            <li><strong>S_density (Graph Density Signal):</strong> Ratio of active edges to total possible edges; cyclic Tarjan SCCs add risk penalties.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'data-ownership',
    title: 'Producer/Consumer Data Ownership Model',
    category: 'Domain Design',
    icon: '📊',
    summary: 'Distinguishing authoritative data owners from data consumers to prevent database monolith traps',
    content: (
      <div className="doc-article">
        <div className="doc-article-header">
          <span className="doc-category-badge">Domain Design</span>
          <h1>📊 Producer/Consumer Data Ownership Model</h1>
          <p className="doc-subtitle">
            Preventing shared database entanglement by establishing explicit resource ownership mapping before code extraction.
          </p>
        </div>

        <h2>🔑 Data Relationship Classifications</h2>
        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Relationship</th>
                <th>Classification</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="tag-creates">creates</span></td>
                <td><strong>Producer / Owner</strong></td>
                <td>The service that owns the write lifecycle of the entity (executes INSERT / UPSERT / model creation).</td>
              </tr>
              <tr>
                <td><span className="tag-reads">reads</span></td>
                <td><strong>Consumer</strong></td>
                <td>A service that reads or queries the resource created by another service. Tagged with a <code>produced_by</code> owner badge.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>🛡️ Business Value</h2>
        <p>By identifying data producers versus data consumers before refactoring begins, Rubix prevents:</p>
        <ul>
          <li><strong>Data Ownership Ambiguity:</strong> Eliminates dual-write conflicts across service boundaries.</li>
          <li><strong>Database Monolith Traps:</strong> Guides architects on which database tables must be split or converted into asynchronous API events.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'bob-ide',
    title: 'IBM Bob IDE Session Guide & Evidence Proof',
    category: 'Evidence',
    icon: '🛠️',
    summary: 'Verification of workspace prompts, task execution proof, and bob_sessions folder assets',
    content: (
      <div className="doc-article">
        <div className="doc-article-header">
          <span className="doc-category-badge">Evidence Proof</span>
          <h1>🛠️ IBM Bob IDE Session Guide & Evidence Proof</h1>
          <p className="doc-subtitle">
            Preserving task execution session proof inside the <code>bob_sessions/</code> directory of our repository.
          </p>
        </div>

        <h2>📸 Preserved Task Session Proof</h2>
        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Screenshot File</th>
                <th>Task Session Executed in IBM Bob IDE</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>bob_sessions/team_task01_events.png</code></td>
                <td><strong>Task 1: Domain Event Storming</strong></td>
                <td>Extracted domain events, API endpoint routes, and table triggers into an interactive event map.</td>
              </tr>
              <tr>
                <td><code>bob_sessions/team_task02_contexts.png</code></td>
                <td><strong>Task 2: Bounded Context Mapping</strong></td>
                <td>Clustered codebase modules into cohesive Domain-Driven Design (DDD) bounded contexts.</td>
              </tr>
              <tr>
                <td><code>bob_sessions/team_task03_coupling.png</code></td>
                <td><strong>Task 3: Coupling Audit</strong></td>
                <td>Identified cross-boundary calls, shared database writes, and data ownership dependencies.</td>
              </tr>
              <tr>
                <td><code>bob_sessions/team_task04_ranking.png</code></td>
                <td><strong>Task 4: Candidate Ranking</strong></td>
                <td>Evaluated extraction safety and assigned recommended priority order (<code>#1 Extract First</code>).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
]

export default function DocsPage({ onNavigate }) {
  const [activeSectionId, setActiveSectionId] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const activeDoc = DOC_SECTIONS.find(s => s.id === activeSectionId) || DOC_SECTIONS[0]
  const activeIndex = DOC_SECTIONS.findIndex(s => s.id === activeSectionId)

  const filteredSections = DOC_SECTIONS.filter(section => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      section.title.toLowerCase().includes(q) ||
      section.summary.toLowerCase().includes(q) ||
      section.category.toLowerCase().includes(q)
    )
  })

  return (
    <div className="docs-shell">
      <AppNav currentView="docs" onNavigate={onNavigate} />

      <header className="docs-topbar">
        <div className="docs-topbar-inner">
          <div className="docs-brand-group">
            <span className="docs-brand-logo">📖</span>
            <span className="docs-brand-title">Rubix Documentation</span>
            <span className="docs-version-tag">v2.0 • IBM Bob 2.0</span>
          </div>

          <div className="docs-search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search documentation (API, Architecture, IBM Bob)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="docs-topbar-actions">
            <button
              type="button"
              className="button-primary-emerald"
              onClick={() => onNavigate && onNavigate('input')}
            >
              Return to Web App ➔
            </button>
          </div>
        </div>
      </header>

      <div className="docs-layout">
        {/* Left Sidebar Navigation (Paystack Style) */}
        <aside className="docs-sidebar custom-scrollbar">
          <div className="sidebar-group-title">Documentation Guide</div>
          <nav className="sidebar-nav">
            {filteredSections.map(section => {
              const isActive = section.id === activeSectionId
              return (
                <button
                  key={section.id}
                  type="button"
                  className={`sidebar-link ${isActive ? 'sidebar-link--active' : ''}`}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  <span className="sidebar-icon">{section.icon}</span>
                  <span className="sidebar-label">{section.title}</span>
                </button>
              )
            })}
          </nav>

          <div className="sidebar-footer-card">
            <span className="footer-card-icon">⚡</span>
            <strong>FastAPI & IBM Bob 2.0</strong>
            <p>Live Backend API available at <code>rubixbackend.pxxl.click</code></p>
            <a href="https://rubixbackend.pxxl.click/docs" target="_blank" rel="noreferrer" className="sidebar-api-link">
              Open Swagger UI ➔
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="docs-main custom-scrollbar">
          <div className="docs-breadcrumbs">
            <span>Docs</span>
            <span className="sep">/</span>
            <span>{activeDoc.category}</span>
            <span className="sep">/</span>
            <span className="current">{activeDoc.title}</span>
          </div>

          {activeDoc.content}

          {/* Previous / Next Navigation */}
          <div className="docs-nav-buttons">
            {activeIndex > 0 ? (
              <button
                type="button"
                className="nav-btn nav-btn--prev"
                onClick={() => setActiveSectionId(DOC_SECTIONS[activeIndex - 1].id)}
              >
                <span className="nav-btn-dir">← Previous</span>
                <span className="nav-btn-title">{DOC_SECTIONS[activeIndex - 1].title}</span>
              </button>
            ) : <div />}

            {activeIndex < DOC_SECTIONS.length - 1 ? (
              <button
                type="button"
                className="nav-btn nav-btn--next"
                onClick={() => setActiveSectionId(DOC_SECTIONS[activeIndex + 1].id)}
              >
                <span className="nav-btn-dir">Next →</span>
                <span className="nav-btn-title">{DOC_SECTIONS[activeIndex + 1].title}</span>
              </button>
            ) : <div />}
          </div>
        </main>
      </div>
    </div>
  )
}
