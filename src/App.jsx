import { useState } from 'react'
import axios from 'axios'
import './styles/repoInput.css'
import './styles/processing.css'
import AppFooter from './components/AppFooter'
import ProcessingPage from './pages/ProcessingPage'
import RepoInputPage from './pages/RepoInputPage'
import ResultsPage from './pages/ResultsPage'

const API_BASE_URL = 'https://rubixbackend.pxxl.click/'

function App() {
  const [view, setView] = useState('input')
  const [jobId, setJobId] = useState(null)
  const [result, setResult] = useState(null)

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

  const handleProcessingComplete = (nextResult) => {
    setResult(nextResult)
    setView('results')
  }

  const handleNewAnalysis = () => {
    setView('input')
    setJobId(null)
    setResult(null)
  }

  return (
    <>
      {view === 'input' ? <RepoInputPage onSubmit={handleSubmit} /> : null}
      {view === 'processing' ? (
        <ProcessingPage jobId={jobId} onComplete={handleProcessingComplete} onBack={handleNewAnalysis} />
      ) : null}
      {view === 'results' ? <ResultsPage result={result} onNewAnalysis={handleNewAnalysis} /> : null}
      <AppFooter />
    </>
  )
}

export default App
