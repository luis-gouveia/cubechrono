import { useState } from 'react'
import { PUZZLE, PUZZLES, type Puzzle } from '../domain/puzzle'
import { formatTime } from '../utils/time'
import PuzzleStatsModal from '../components/stats/PuzzleStatsModal'
import { PuzzleStats } from '../types/stats'

const singlePuzzleStats: PuzzleStats = {
  solves: 49,
  best: {
    single: {
      value: 10230,
      date: new Date('2025-10-15'),
    },
    ao5: {
      value: 11230,
      date: new Date('2025-10-16'),
    },
    ao12: {
      value: 12340,
      date: new Date('2025-10-17'),
    },
  },
  mean: 14230,
}
const globalStats: Record<Puzzle, PuzzleStats> = {
  [PUZZLE.THREE_BY_THREE]: singlePuzzleStats,
  [PUZZLE.TWO_BY_TWO]: singlePuzzleStats,
  [PUZZLE.PYRAMINX]: singlePuzzleStats,
  [PUZZLE.MEGAMINX]: singlePuzzleStats,
  [PUZZLE.FOUR_BY_FOUR]: singlePuzzleStats,
  [PUZZLE.FIVE_BY_FIVE]: singlePuzzleStats,
  [PUZZLE.SIX_BY_SIX]: singlePuzzleStats,
  [PUZZLE.SKEWB]: singlePuzzleStats,
  [PUZZLE.CLOCK]: singlePuzzleStats,
  [PUZZLE.SQUARE_ONE]: singlePuzzleStats,
  [PUZZLE.THREE_BY_THREE_BLIND]: singlePuzzleStats,
  [PUZZLE.KILOMINX]: singlePuzzleStats,
  [PUZZLE.SEVEN_BY_SEVEN]: singlePuzzleStats,
  [PUZZLE.THREE_BY_THREE_ONE_HANDED]: singlePuzzleStats,
}

function StatsPage() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | undefined>(undefined)

  return (
    <main className="h-full w-full overflow-y-auto bg-background text-primary scrollbar-hidden">
      <div className="mx-auto w-full max-w-3xl px-6 py-6 mb-5">
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-medium">Statistics</h1>
        </header>

        <section className="flex flex-wrap justify-center gap-4">
          {Object.keys(PUZZLES).map((puzzle) => {
            const stats = globalStats[puzzle as Puzzle]
            return (
              <div
                key={puzzle}
                onClick={() => setSelectedPuzzle(puzzle as Puzzle)}
                className="flex h-44 w-full flex-col items-center justify-center rounded-lg border border-divider bg-background transition-colors hover:border-divider/80 hover:bg-button-full-hover hover:cursor-pointer sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]"
              >
                <div className="mb-4 flex h-20 items-center justify-center">
                  <div
                    className="flex h-18 w-18 items-center justify-center rounded-lg"
                    style={{ backgroundColor: PUZZLES[puzzle as Puzzle].color }}
                  >
                    <img
                      src={PUZZLES[puzzle as Puzzle].logo}
                      alt={PUZZLES[puzzle as Puzzle].label}
                      className="h-13 w-13"
                    />
                  </div>
                </div>
                <p className="text-3xl tracking-tight">{formatTime(stats.best.single?.value)}</p>
                <p className="mt-0.5 text-xs text-secondary">{PUZZLES[puzzle as Puzzle].label}</p>
              </div>
            )
          })}
        </section>
        {selectedPuzzle && (
          <PuzzleStatsModal
            open
            puzzle={selectedPuzzle}
            stats={globalStats[selectedPuzzle]}
            onClose={() => setSelectedPuzzle(undefined)}
          />
        )}
      </div>
    </main>
  )
}

export default StatsPage
