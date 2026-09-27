import { useState } from 'react'
import axios from 'axios'
import './styles/repoInput.css'
import './styles/processing.css'
import AppFooter from './components/AppFooter'
import ProcessingPage from './pages/ProcessingPage'
import RepoInputPage from './pages/RepoInputPage'
import ResultsPage from './pages/ResultsPage'
import DocsPage from './pages/DocsPage'

const API_BASE_URL = 'https://rubixbackend.pxxl.click'

function App() {
  const [view, setView] = useState('input')
  const [jobId, setJobId] = useState(null)
  const [result, setResult] = useState(null)
  const [analysisLogs, setAnalysisLogs] = useState([])

  const handleSubmit = async (repoUrl, repoRef = 'main') => {
    const response = await axios.post(`${API_BASE_URL}/analyze`, {
      repo_url: repoUrl,
      repo_ref: repoRef,
    })

    const nextJobId = response.data?.job_id

    if (!nextJobId) {
      throw new Error('No job_id returned from backend')
    }

    setJobId(nextJobId)
    setView('processing')
    return nextJobId
  }

  const handleProcessingComplete = (nextResult, logs) => {
    setResult(nextResult)
    setAnalysisLogs(logs || [])
    setView('results')
  }

  const handleNewAnalysis = () => {
    setView('input')
    setJobId(null)
    setResult(null)
    setAnalysisLogs([])
  }

  const handleNavigate = (nextView) => {
    setView(nextView)
  }

  return (
    <>
      {view === 'input' ? <RepoInputPage onSubmit={handleSubmit} onNavigate={handleNavigate} /> : null}
      {view === 'processing' ? (
        <ProcessingPage jobId={jobId} onComplete={handleProcessingComplete} onBack={handleNewAnalysis} onNavigate={handleNavigate} />
      ) : null}
      {view === 'results' ? (
        <ResultsPage result={result} logs={analysisLogs} jobId={jobId} onNewAnalysis={handleNewAnalysis} onNavigate={handleNavigate} />
      ) : null}
      {view === 'docs' ? <DocsPage onNavigate={handleNavigate} /> : null}
      <AppFooter />
    </>
  )
}

export default App
