import { useMemo, useState } from 'react'

const SAMPLE_REPO = 'https://github.com/vercel/next.js'

function isValidRepoUrl(value) {
  if (!value?.trim()) {
    return false
  }

  const normalized = value.trim()
  const githubPattern = /^https?:\/\/[a-z0-9.-]+\.[a-z]{2,}(?:\/[A-Za-z0-9_.-]+){1,2}(?:\/[A-Za-z0-9_.-]+)?\/?$/i
  const sshPattern = /^git@github\.com:[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)?\/?$/

  return githubPattern.test(normalized) || sshPattern.test(normalized)
}

export default function RepoInputForm({ onSubmit }) {
  const [repoUrl, setRepoUrl] = useState('')
  const [error, setError] = useState('')

  const helperText = useMemo(
    () => 'We will map repo boundaries, score the risk profile, and suggest the extraction order.',
    [],
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    const normalized = repoUrl.trim()

    if (!isValidRepoUrl(normalized)) {
      setError('Enter a valid repo URL, such as https://github.com/owner/repository')
      return
    }

    setError('')

    if (typeof onSubmit === 'function') {
      onSubmit(normalized)
      return
    }

    // TODO: replace with real route transition or callback once the processing flow exists.
    console.info('Repo submit ready:', normalized)
  }

  return (
    <form className="repo-form" onSubmit={handleSubmit} noValidate>
      <div className="field-group">
        <label htmlFor="repo-url" className="field-label">
          Repository URL
        </label>
        <div className="input-shell">
          <input
            id="repo-url"
            name="repoUrl"
            type="text"
            value={repoUrl}
            onChange={(event) => {
              setRepoUrl(event.target.value)
              if (error) {
                setError('')
              }
            }}
            placeholder="https://github.com/owner/repository"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'repo-url-error' : 'repo-url-hint'}
          />
        </div>
        <p id="repo-url-hint" className="field-hint">
          {helperText}
        </p>
        {error ? (
          <p id="repo-url-error" className="field-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="form-actions">
        <button type="submit" className="button-primary">
          Analyze Repo
        </button>
        <button
          type="button"
          className="button-secondary sample-button"
          onClick={() => {
            setRepoUrl(SAMPLE_REPO)
            setError('')
          }}
        >
          Try with a sample repo
        </button>
      </div>
    </form>
  )
}
