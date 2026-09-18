import { useCallback, useEffect, useState } from 'react'
import { SessionDTO, UpdateSessionDTO } from '../types/dtos/session'

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

  const updateSession = useCallback(
    async (input: UpdateSessionDTO) => {
      setError(undefined)
      try {
        const updatedSession = await window.api.sessions.update(input)
        await loadSession()
        return updatedSession
      } catch (error) {
        const normalizedError = error instanceof Error ? error : new Error('Failed to update session')
        setError(normalizedError)
        throw normalizedError
      }
    },
    [loadSession],
  )

  const deleteSession = useCallback(async () => {
    setError(undefined)
    try {
      await window.api.sessions.delete(id)
      await loadSession()
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error('Failed to delete session')
      setError(normalizedError)
      throw normalizedError
    }
  }, [id, loadSession])

  const clearSession = useCallback(async () => {
    setError(undefined)
    try {
      await window.api.sessions.clear(id)
      await loadSession()
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error('Failed to clear session')
      setError(normalizedError)
      throw normalizedError
    }
  }, [id, loadSession])

  useEffect(() => {
    void loadSession()
  }, [loadSession])

  return {
    session,
    loading,
    error,
    updateSession,
    deleteSession,
    clearSession,
    reload: loadSession,
  }
}
