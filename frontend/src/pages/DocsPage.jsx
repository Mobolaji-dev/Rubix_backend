import { useState } from 'react'
import AppNav from '../components/AppNav'
import '../styles/docs.css'

// ---------------------------------------------------------------------------
// Clean SVG Line Icons Component Helpers
// ---------------------------------------------------------------------------

const LineIcon = ({ type, className = 'line-icon' }) => {
  switch (type) {
    case 'rocket':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      )
    case 'trophy':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
        </svg>
      )
    case 'plug':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22v-5" />
          <path d="M9 8V2" />
          <path d="M15 8V2" />
          <path d="M18 8v5a6 6 0 0 1-12 0V8h12z" />
        </svg>
      )
    case 'brain':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
          <path d="M12 18v4" />
        </svg>
      )
    case 'barchart':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </svg>
      )
    case 'wrench':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    case 'book':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    case 'pin':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="17" x2="12" y2="22" />
          <path d="M5 17h14l-1.5-6H6.5L5 17z" />
          <path d="M9 11V4a3 3 0 0 1 6 0v7" />
        </svg>
      )
    case 'sparkles':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
        </svg>
      )
    case 'layers':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      )
    case 'target':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      )
    case 'link':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      )
    case 'check':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    case 'zap':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    case 'shield':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    case 'key':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7.5" cy="15.5" r="5.5" />
          <path d="m21 2-9.6 9.6" />
          <path d="m15.5 7.5 3 3" />
        </svg>
      )
    case 'camera':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      )
    case 'globe':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    case 'terminal':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      )
    case 'github':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      )
    case 'folder':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      )
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
  }
}

// ---------------------------------------------------------------------------
// Documentation Content Sections
// ---------------------------------------------------------------------------

const DOC_SECTIONS = [
  {
    id: 'overview',
    title: 'Rubix Overview',
    category: 'Getting Started',
    iconType: 'rocket',
    summary: 'AI-Powered Microservice Boundary Advisor built for IBM Bob 2.0 & LangGraph',
    content: (
      <div className="doc-article">
        <div className="doc-article-header">
          <span className="doc-category-badge">Getting Started</span>
          <h1>
            <LineIcon type="rocket" className="doc-title-icon" /> Rubix — Repository Decomposition Advisor
          </h1>
          <p className="doc-subtitle">
            Automating Domain-Driven Design (DDD) microservice extraction using IBM Bob 2.0 whole-repository reasoning and 4-step LangGraph StateGraph agents.
          </p>
        </div>

        <div className="doc-callout doc-callout--important">
          <span className="doc-callout__icon">
            <LineIcon type="pin" />
          </span>
          <div>
            <strong>Executive Summary</strong>
            <p>
              Decoupling a monolithic application into microservices is one of the highest-friction tasks in software engineering. Manual refactoring relies on weeks of tribal guesswork. Making the wrong architectural cut results in high-latency distributed monoliths, circular dependencies, and cascading production failures.
            </p>
          </div>
        </div>

        <h2>
          <LineIcon type="sparkles" className="section-title-icon" /> Key Value Propositions
        </h2>
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

        <h2>
          <LineIcon type="layers" className="section-title-icon" /> High-Level System Architecture
        </h2>
        <div className="doc-code-block">
          <pre>{`flowchart TD
    A["User Inputs GitHub Repo URL"] --> B["FastAPI Backend (/analyze)"]
    B --> C["Step 1: AST Parser & Call Graph Extractor"]
    C --> D["Step 2: IBM Bob 2.0 Whole-Repo Context Engine"]
    D --> E["Step 3: 3-Signal Coupling Audit Engine"]
    E --> F["Step 4: Extraction Candidate Ranker"]
    F --> G["Interactive Visual Boundary Cards"]`}</pre>
        </div>

        <h2>
          <LineIcon type="target" className="section-title-icon" /> Target Audience & Impact
        </h2>
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
    iconType: 'trophy',
    summary: 'Quick evaluation guide and criteria verification for IBM Bob 2.0 Hackathon Judges',
    content: (
      <div className="doc-article">
        <div className="doc-article-header">
          <span className="doc-category-badge doc-category-badge--judge">Hackathon Evaluation</span>
          <h1>
            <LineIcon type="trophy" className="doc-title-icon" /> Hackathon Judge Verification Checklist
          </h1>
          <p className="doc-subtitle">
            Welcome IBM Bob 2.0 Hackathon Judges! This document provides quick links and step-by-step verification instructions.
          </p>
        </div>

        <div className="doc-callout doc-callout--tip">
          <span className="doc-callout__icon">
            <LineIcon type="link" />
          </span>
          <div>
            <strong>Project Deliverable Links</strong>
            <ul className="doc-links-list">
              <li>
                <LineIcon type="globe" className="link-icon-inline" /> <strong>Landing Page:</strong> <a href="https://rubix-landing.pxxl.click" target="_blank" rel="noreferrer">https://rubix-landing.pxxl.click</a>
              </li>
              <li>
                <LineIcon type="rocket" className="link-icon-inline" /> <strong>Production Web Application:</strong> <a href="https://rubix.pxxl.click/" target="_blank" rel="noreferrer">https://rubix.pxxl.click/</a>
              </li>
              <li>
                <LineIcon type="terminal" className="link-icon-inline" /> <strong>Backend API (Swagger UI):</strong> <a href="https://rubixbackend.pxxl.click/docs" target="_blank" rel="noreferrer">https://rubixbackend.pxxl.click/docs</a>
              </li>
              <li>
                <LineIcon type="github" className="link-icon-inline" /> <strong>GitHub Backend Repository:</strong> <a href="https://github.com/techbyFEMI/Rubix_backend.git" target="_blank" rel="noreferrer">techbyFEMI/Rubix_backend.git</a>
              </li>
              <li>
                <LineIcon type="folder" className="link-icon-inline" /> <strong>IBM Bob IDE Session Proof:</strong> <code>bob_sessions/</code> directory in repository
              </li>
            </ul>
          </div>
        </div>

        <h2>
          <LineIcon type="check" className="section-title-icon" /> Criteria Alignment Matrix
        </h2>
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

        <h2>
          <LineIcon type="zap" className="section-title-icon" /> 60-Second Quick Test Flow
        </h2>
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
    iconType: 'plug',
    summary: 'FastAPI async endpoint specifications, request schemas, and response payloads',
    content: (
      <div className="doc-article">
        <div className="doc-article-header">
          <span className="doc-category-badge">Developer Reference</span>
          <h1>
            <LineIcon type="plug" className="doc-title-icon" /> REST API Reference
          </h1>
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
    iconType: 'brain',
    summary: 'Detailed mechanics of the 4-step LangGraph StateGraph pipeline and IBM Bob 2.0 client',
    content: (
      <div className="doc-article">
        <div className="doc-article-header">
          <span className="doc-category-badge">Architecture</span>
          <h1>
            <LineIcon type="brain" className="doc-title-icon" /> Architecture & IBM Bob 2.0 Integration
          </h1>
          <p className="doc-subtitle">
            Rubix pairs Python AST static analysis with IBM Bob 2.0 semantic reasoning in a 4-stage state graph.
          </p>
        </div>

        <h2>The 4-Step LangGraph Execution Pipeline</h2>
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

        <h2>3-Signal Coupling Risk Formula</h2>
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
    iconType: 'barchart',
    summary: 'Distinguishing authoritative data owners from data consumers to prevent database monolith traps',
    content: (
      <div className="doc-article">
        <div className="doc-article-header">
          <span className="doc-category-badge">Domain Design</span>
          <h1>
            <LineIcon type="barchart" className="doc-title-icon" /> Producer/Consumer Data Ownership Model
          </h1>
          <p className="doc-subtitle">
            Preventing shared database entanglement by establishing explicit resource ownership mapping before code extraction.
          </p>
        </div>

        <h2>
          <LineIcon type="key" className="section-title-icon" /> Data Relationship Classifications
        </h2>
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

        <h2>
          <LineIcon type="shield" className="section-title-icon" /> Business Value
        </h2>
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
    iconType: 'wrench',
    summary: 'Verification of workspace prompts, task execution proof, and bob_sessions folder assets',
    content: (
      <div className="doc-article">
        <div className="doc-article-header">
          <span className="doc-category-badge">Evidence Proof</span>
          <h1>
            <LineIcon type="wrench" className="doc-title-icon" /> IBM Bob IDE Session Guide & Evidence Proof
          </h1>
          <p className="doc-subtitle">
            Preserving task execution session proof inside the <code>bob_sessions/</code> directory of our repository.
          </p>
        </div>

        <h2>
          <LineIcon type="camera" className="section-title-icon" /> Preserved Task Session Proof
        </h2>
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
            <LineIcon type="book" className="docs-brand-icon" />
            <span className="docs-brand-title">Rubix Documentation</span>
            <span className="docs-version-tag">v2.0 • IBM Bob 2.0</span>
          </div>

          <div className="docs-search-bar">
            <span className="search-icon">
              <LineIcon type="target" className="search-svg" />
            </span>
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
                  <span className="sidebar-icon">
                    <LineIcon type={section.iconType} />
                  </span>
                  <span className="sidebar-label">{section.title}</span>
                </button>
              )
            })}
          </nav>

          <div className="sidebar-footer-card">
            <span className="footer-card-icon">
              <LineIcon type="zap" />
            </span>
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
