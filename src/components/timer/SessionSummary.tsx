import { Circle } from 'lucide-react'
import { SessionStats } from '../../types/sessionStats'
import { formatTime } from '../../utils/time'

interface SessionSummaryProps {
  stats: SessionStats
}

function SessionSummary({ stats }: SessionSummaryProps) {
  return (
    <>
      <div className="flex items-center gap-4 border-b border-divider p-4">
        <Circle size={40} className="text-accent shrink-0 ml-2" />
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
          <p className="text-lg">{formatTime(stats.best.single)}</p>
          <p className="text-lg">{formatTime(stats.best.ao5)}</p>
          <p className="text-lg">{formatTime(stats.best.ao12)}</p>
        </div>
      </div>
    </>
  )
}

export default SessionSummary
