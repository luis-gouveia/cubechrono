import { useCallback, useEffect, useState } from 'react'
import { Puzzle, PUZZLES } from '../domain/puzzle'
import { PuzzleStatsDTO } from '../types/dtos/statistics'

type PuzzlesStatsDTO = Record<Puzzle, PuzzleStatsDTO>

export function useStats() {
  const [stats, setStats] = useState<PuzzlesStatsDTO | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)

  const loadStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(undefined)

      const result = {} as PuzzlesStatsDTO
      for (const puzzle of Object.keys(PUZZLES)) {
        const puzzleStats = await window.api.stats.getByPuzzle(puzzle as Puzzle)
        result[puzzle as Puzzle] = puzzleStats
      }
      setStats(result)
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load stats'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadStats()
  }, [loadStats])

  return {
    stats,
    loading,
    error,
    reload: loadStats,
  }
}
