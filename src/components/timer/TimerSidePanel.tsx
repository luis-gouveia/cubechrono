import { Puzzle } from '../../domain/puzzle'
import { SessionStats } from '../../types/session'
import { SolveItem } from '../../types/solve'
import SessionSummary from './SessionSummary'
import SolveTable from './SolveTable'

interface TimerSidePanelProps {
  puzzle: Puzzle
  stats: SessionStats
  solves: SolveItem[]
}

function TimerSidePanel({ puzzle, stats, solves }: TimerSidePanelProps) {
  return (
    <aside className="flex h-screen w-74 flex-col border-r border-divider bg-background">
      <SessionSummary puzzle={puzzle} stats={stats} />
      <SolveTable solves={solves} />
    </aside>
  )
}

export default TimerSidePanel
