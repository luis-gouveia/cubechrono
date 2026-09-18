import { useState } from 'react'
import { PUZZLES, type Puzzle } from '../domain/puzzle'
import { formatTime } from '../utils/time'
import PuzzleStatsModal from '../components/stats/PuzzleStatsModal'
import { useStats } from '../hooks/useStats'

function StatsPage() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | undefined>(undefined)

  const { stats, loading } = useStats()

  return (
    <main className="h-full w-full overflow-y-auto bg-background text-primary scrollbar-hidden">
      <div className="mx-auto w-full max-w-3xl px-6 py-6 mb-5">
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-medium">Statistics</h1>
        </header>

        <section className="flex flex-wrap justify-center gap-4">
          {loading && 'Loading stats....'}
          {stats &&
            Object.keys(PUZZLES).map((puzzle) => {
              const puzzleStats = stats[puzzle as Puzzle]
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
                  <p className="text-3xl tracking-tight">{formatTime(puzzleStats.best?.value)}</p>
                  <p className="mt-0.5 text-xs text-secondary">{PUZZLES[puzzle as Puzzle].label}</p>
                </div>
              )
            })}
        </section>
        {stats && selectedPuzzle && (
          <PuzzleStatsModal
            open
            puzzle={selectedPuzzle}
            stats={stats[selectedPuzzle]}
            onClose={() => setSelectedPuzzle(undefined)}
          />
        )}
      </div>
    </main>
  )
}

export default StatsPage
