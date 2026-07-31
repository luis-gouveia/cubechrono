import { TwistyPlayer } from 'cubing/twisty'
import { useEffect, useRef } from 'react'
import { Puzzle, PUZZLES } from '../../domain/puzzle'

interface PuzzleRendererProps {
  puzzle: Puzzle
  alg: string
}

function PuzzleRenderer({ puzzle, alg }: PuzzleRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const player = new TwistyPlayer({
      puzzle: PUZZLES[puzzle].renderer,
      alg,
      background: 'none',
      visualization: '2D',
      controlPanel: 'none',
    })

    player.style.width = '100%'
    player.style.height = '100%'

    container.appendChild(player)

    return () => player.remove()
  }, [puzzle, alg])

  return <div ref={containerRef} className="h-full w-full max-w-full"></div>
}

export default PuzzleRenderer
