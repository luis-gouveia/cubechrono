import { useCallback, useEffect, useState } from 'react'
import { CreateSolveDTO, SolveDTO, UpdateSolveDTO } from '../types/dtos/solve'

export function useSolves(sessionId: string) {
  const [solves, setSolves] = useState<SolveDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)

  const loadSolves = useCallback(async () => {
    setLoading(true)
    setError(undefined)
    try {
      const result = await window.api.solves.list(sessionId)
      setSolves(result)
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load solves'))
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  const createSolve = useCallback(async (input: CreateSolveDTO) => {
    setError(undefined)
    try {
      const solve = await window.api.solves.create(input)
      setSolves((current) => [...current, solve])
      return solve
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error('Failed to create solve')
      setError(normalizedError)
      throw normalizedError
    }
  }, [])

  const updateSolve = useCallback(
    async (input: UpdateSolveDTO) => {
      setError(undefined)
      try {
        const updatedSolve = await window.api.solves.update(input)
        await loadSolves()
        return updatedSolve
      } catch (error) {
        const normalizedError = error instanceof Error ? error : new Error('Failed to update solve')
        setError(normalizedError)
        throw normalizedError
      }
    },
    [loadSolves],
  )

  const deleteSolve = useCallback(
    async (id: string) => {
      setError(undefined)
      try {
        await window.api.solves.delete(id)
        await loadSolves()
      } catch (error) {
        const normalizedError = error instanceof Error ? error : new Error('Failed to delete session')
        setError(normalizedError)
        throw normalizedError
      }
    },
    [loadSolves],
  )

  useEffect(() => {
    void loadSolves()
  }, [loadSolves])

  return {
    solves,
    loading,
    error,
    reloadSolves: loadSolves,
    createSolve,
    updateSolve,
    deleteSolve,
  }
}
