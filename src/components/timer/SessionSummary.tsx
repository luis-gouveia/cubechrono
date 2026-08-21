import { SessionStats } from '../../types/session'
import { formatTime } from '../../utils/time'
import { Puzzle, PUZZLES } from '../../domain/puzzle'

interface SessionSummaryProps {
  puzzle: Puzzle
  stats: SessionStats
}

function SessionSummary({ puzzle, stats }: SessionSummaryProps) {
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
        <div className="grid grid-cols-3 gap-4 text-center">
          <p className="text-lg">{formatTime(stats.current.single)}</p>
          <p className="text-lg">{formatTime(stats.current.ao5)}</p>
          <p className="text-lg">{formatTime(stats.current.ao12)}</p>
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
        <div className="grid grid-cols-3 gap-4 text-center">
          <p className="text-lg">{formatTime(stats.best.single.value)}</p>
          <p className="text-lg">{formatTime(stats.best.ao5.value)}</p>
          <p className="text-lg">{formatTime(stats.best.ao12.value)}</p>
        </div>
      </div>
    </>
  )
}

export default SessionSummary
