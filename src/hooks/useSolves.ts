import { useEffect, useState } from 'react'
import { SolveDTO } from '../types/dtos/solve'

export function useSolves(sessionId: string) {
  const [solves, setSolves] = useState<SolveDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    setLoading(true)

    window.api.solves
      .list(sessionId)
      .then((result) => {
        if (!cancelled) {
          setSolves(result)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [sessionId])

  return {
    solves,
    loading,
  }
}
