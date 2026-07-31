import { useCallback, useEffect, useState } from 'react'
import { ScrambleService } from '../services/scrambleService'
import type { Puzzle } from '../domain/puzzle'

const scrambleService = new ScrambleService()

export function useScramble(puzzle: Puzzle) {
  const [scramble, setScramble] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  const generateScramble = useCallback(async () => {
    setIsLoading(true)

    try {
      const newScramble = await scrambleService.generate(puzzle)
      setScramble(newScramble)
    } finally {
      setIsLoading(false)
    }
  }, [puzzle])

  useEffect(() => {
    generateScramble()
  }, [generateScramble])

  return {
    scramble,
    isLoading,
    generateScramble,
  }
}
