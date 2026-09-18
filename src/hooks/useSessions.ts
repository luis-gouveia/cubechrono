import { useCallback, useEffect, useState } from 'react'
import { CreateSessionDTO, SessionDTO, UpdateSessionDTO } from '../types/dtos/session'

export function useSessions() {
  const [sessions, setSessions] = useState<SessionDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)

  const loadSessions = useCallback(async () => {
    setLoading(true)
    setError(undefined)
    try {
      const result = await window.api.sessions.list()
      setSessions(result)
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load sessions'))
    } finally {
      setLoading(false)
    }
  }, [])

  const createSession = useCallback(async (input: CreateSessionDTO) => {
    setError(undefined)
    try {
      const session = await window.api.sessions.create(input)
      setSessions((current) => [...current, session])
      return session
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error('Failed to create session')
      setError(normalizedError)
      throw normalizedError
    }
  }, [])

  const updateSession = useCallback(
    async (input: UpdateSessionDTO) => {
      setError(undefined)
      try {
        const updatedSession = await window.api.sessions.update(input)
        await loadSessions()
        return updatedSession
      } catch (error) {
        const normalizedError = error instanceof Error ? error : new Error('Failed to update session')
        setError(normalizedError)
        throw normalizedError
      }
    },
    [loadSessions],
  )

  const deleteSession = useCallback(
    async (id: string) => {
      setError(undefined)
      try {
        await window.api.sessions.delete(id)
        await loadSessions()
      } catch (error) {
        const normalizedError = error instanceof Error ? error : new Error('Failed to delete session')
        setError(normalizedError)
        throw normalizedError
      }
    },
    [loadSessions],
  )

  const clearSession = useCallback(
    async (id: string) => {
      setError(undefined)
      try {
        await window.api.sessions.clear(id)
        await loadSessions()
      } catch (error) {
        const normalizedError = error instanceof Error ? error : new Error('Failed to clear session')
        setError(normalizedError)
        throw normalizedError
      }
    },
    [loadSessions],
  )

  useEffect(() => {
    void loadSessions()
  }, [loadSessions])

  return {
    sessions,
    loading,
    error,
    reloadSessions: loadSessions,
    createSession,
    updateSession,
    deleteSession,
    clearSession,
  }
}
