import { SessionStats } from '../../types/sessionStats'
import { SolveItem } from '../../types/solve'
import SessionSummary from './SessionSummary'
import SolveTable from './SolveTable'

interface TimerSidePanelProps {
  stats: SessionStats
  solves: SolveItem[]
}

function TimerSidePanel({ stats, solves }: TimerSidePanelProps) {
  return (
    <aside className="flex h-screen w-74 flex-col border-r border-divider bg-background">
      <SessionSummary stats={stats} />
      <SolveTable solves={solves} />
    </aside>
  )
}

export default TimerSidePanel
