import { useCallback, useEffect, useState } from 'react'
import { SessionDTO } from '../types/dtos/session'

export function useSession(id: string) {
  const [session, setSession] = useState<SessionDTO | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)

  const loadSession = useCallback(async () => {
    try {
      setLoading(true)
      setError(undefined)

      const result = await window.api.sessions.get(id)
      setSession(result ?? undefined)
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load session'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void loadSession
  }, [loadSession])

  return {
    session,
    loading,
    error,
    reload: loadSession,
  }
}
