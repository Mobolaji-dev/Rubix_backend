import './styles/repoInput.css'
import AppFooter from './components/AppFooter'
import RepoInputPage from './pages/RepoInputPage'

function App() {
  const handleSubmit = (repoUrl) => {
    // TODO: replace with the real route transition or callback once the processing flow exists.
    console.info('Submitting repository for analysis:', repoUrl)
  }

  return (
    <>
      <RepoInputPage onSubmit={handleSubmit} />
      <AppFooter />
    </>
  )
}

export default App
