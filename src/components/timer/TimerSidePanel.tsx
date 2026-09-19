import { Puzzle } from '../../domain/puzzle'
import { SolveDTO, UpdateSolveDTO } from '../../types/dtos/solve'
import { SessionStatsDTO } from '../../types/dtos/statistics'
import SessionSummary from './SessionSummary'
import SolveTable from './SolveTable'

interface TimerSidePanelProps {
  puzzle: Puzzle
  stats?: SessionStatsDTO
  solves: SolveDTO[]
  onUpdate: (solve: UpdateSolveDTO) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function TimerSidePanel({ puzzle, stats, solves, onUpdate, onDelete }: TimerSidePanelProps) {
  return (
    <aside className="flex h-screen w-74 flex-col border-r border-divider bg-background">
      <SessionSummary puzzle={puzzle} stats={stats} />
      <SolveTable solves={solves} onUpdate={onUpdate} onDelete={onDelete} />
    </aside>
  )
}

export default TimerSidePanel
