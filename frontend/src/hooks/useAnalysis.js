import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'https://rubixbackend.pxxl.click'

// The backend requires a job_id-driven polling flow after the initial POST; this split between
// `startAnalysis` and `pollJob` avoids firing a second `/analyze` call on the processing screen.
export function useAnalysis() {
  const [jobId, setJobId] = useState(null)
  const [status, setStatus] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const startAnalysis = useCallback(async (repoUrl, repoRef = 'main') => {
    setLoading(true)
    setError(null)
    setResult(null)
    setStatus(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        repo_url: repoUrl,
        repo_ref: repoRef,
      })

      const nextJobId = response.data?.job_id

      if (!nextJobId) {
        throw new Error('No job_id returned by the backend')
      }

      setJobId(nextJobId)
      return nextJobId
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to start analysis')
      setLoading(false)
      return null
    }
  }, [])

  const pollJob = useCallback((nextJobId) => {
    setJobId(nextJobId)
    setLoading(true)
    setError(null)
  }, [])

  useEffect(() => {
    if (!jobId || status?.status === 'done' || status?.status === 'failed') {
      return undefined
    }

    const interval = window.setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/analyze/${jobId}/status`)
        const nextStatus = res.data
        setStatus(nextStatus)

        if (nextStatus.status === 'done') {
          const resultRes = await axios.get(`${API_BASE_URL}/analyze/${jobId}/result`)
          setResult(resultRes.data)
          setLoading(false)
        } else if (nextStatus.status === 'failed') {
          setError(nextStatus.current_step || 'Analysis failed')
          setLoading(false)
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Error polling status')
        setLoading(false)
      }
    }, 1000)

    return () => window.clearInterval(interval)
  }, [jobId, status?.status])

  return {
    startAnalysis,
    pollJob,
    jobId,
    status,
    result,
    error,
    loading,
  }
}

export default useAnalysis
