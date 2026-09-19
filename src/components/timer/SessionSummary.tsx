import { formatTime, formatTimeAverage } from '../../utils/time'
import { Puzzle, PUZZLES } from '../../domain/puzzle'
import { SessionStatsDTO } from '../../types/dtos/statistics'

interface SessionSummaryProps {
  puzzle: Puzzle
  stats?: SessionStatsDTO
}

function SessionSummary({ puzzle, stats }: SessionSummaryProps) {
  stats = stats
    ? stats
    : {
        solves: {
          completed: 0,
          total: 0,
          dnf: 0,
          plusTwo: 0,
        },
        mean: 0,
        current: undefined,
        best: undefined,
        ao5: { status: 'unavailable' },
        ao12: { status: 'unavailable' },
        bestAo5: { status: 'unavailable' },
        bestAo12: { status: 'unavailable' },
      }

  console.log(stats)

  return (
    <>
      <div className="flex items-center gap-4 border-b border-divider p-4">
        <div className="ml-5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded"
            style={{ backgroundColor: `${PUZZLES[puzzle].color}` }}
          >
            <img src={PUZZLES[puzzle].logo} alt={PUZZLES[puzzle].label} className="h-7 w-7" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-xs text-secondary">Solves</p>
              <p className="text-primary">
                {stats.solves.completed}/{stats.solves.total}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary">Mean</p>
              <p className="text-primary">{formatTime(stats.mean)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-divider p-4">
        <div className="grid grid-cols-1 gap-4 text-center">
          <div className="text-xs text-secondary">current</div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <p className="text-sm text-secondary">single</p>
          <p className="text-sm text-secondary">ao5</p>
          <p className="text-sm text-secondary">ao12</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center text-primary">
          <p className="text-lg">{formatTime(stats.current)}</p>
          <p className="text-lg">{formatTimeAverage(stats.ao5)}</p>
          <p className="text-lg">{formatTimeAverage(stats.ao12)}</p>
        </div>
        <div className="mt-4" />
        <div className="grid grid-cols-1 gap-4 text-center">
          <div className="text-xs text-secondary">best</div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <p className="text-sm text-secondary">single</p>
          <p className="text-sm text-secondary">ao5</p>
          <p className="text-sm text-secondary">ao12</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center text-primary">
          <p className="text-lg">{formatTime(stats.best?.value)}</p>
          <p className="text-lg">{formatTimeAverage(stats.bestAo5)}</p>
          <p className="text-lg">{formatTimeAverage(stats.bestAo12)}</p>
        </div>
      </div>
    </>
  )
}

export default SessionSummary
