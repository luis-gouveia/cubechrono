import { useState } from 'react'
import { formatTime, formatTimeAverage } from '../../utils/time'
import SolveModal from '../solves/SolveModal'
import { SolveDTO } from '../../types/dtos/solve'

function SolveTable({ solves }: { solves: SolveDTO[] }) {
  const [selectedSolve, setSelectedSolve] = useState<SolveDTO | undefined>(undefined)

  const handleSelectSolve = (solve: SolveDTO) => {
    setSelectedSolve(solve)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid grid-cols-4 border-divider px-1 py-2 text-secondary text-sm text-center">
        <div>#</div>
        <div>Time</div>
        <div>ao5</div>
        <div>ao12</div>
      </div>
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        {solves.length === 0 && (
          <div className="text-center text-secondary text-sm mt-5">There are no solves in this session</div>
        )}
        {solves.map((solve, index) => (
          <div
            key={index}
            onClick={() => handleSelectSolve(solve)}
            className="grid grid-cols-4 px-1 py-1 text-primary text-sm text-center transition-all hover:bg-button-full-hover hover:cursor-pointer"
          >
            <div>{solves.length - index}</div>
            <div>{formatTime(solve.time)}</div>
            <div>{formatTimeAverage(solve.stats?.ao5)}</div>
            <div>{formatTimeAverage(solve.stats?.ao12)}</div>
          </div>
        ))}
      </div>
      {selectedSolve && (
        <SolveModal
          open
          solve={selectedSolve}
          onClose={() => setSelectedSolve(undefined)}
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  )
}

export default SolveTable
