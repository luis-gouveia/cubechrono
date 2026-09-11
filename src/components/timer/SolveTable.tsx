import { useState } from 'react'
import { SolveItem } from '../../types/solve'
import { formatTime } from '../../utils/time'
import { Solve } from '../../domain/solve'
import SolveModal from '../solves/SolveModal'

function SolveTable({ solves }: { solves: SolveItem[] }) {
  const [selectedSolve, setSelectedSolve] = useState<Solve | null>(null)

  const handleSelectSolve = (solve: SolveItem) => {
    const solveEntity = Solve.from({
      id: crypto.randomUUID(),
      time: solve.time,
      penalty: 'none',
      scramble: "D' R2 D B2 R2 D L2 F2 L2 U2 L' U' B' F L U L' R' D F'",
      puzzle: '3x3', // TODO:
      comment: undefined,
      createdAt: new Date(),
    })

    setSelectedSolve(solveEntity)
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
        {solves.map((solve) => (
          <div
            key={solve.index}
            onClick={() => handleSelectSolve(solve)}
            className="grid grid-cols-4 px-1 py-1 text-primary text-sm text-center transition-all hover:bg-button-full-hover hover:cursor-pointer"
          >
            <div>{solve.index}</div>
            <div>{formatTime(solve.time)}</div>
            <div>{formatTime(solve.ao5)}</div>
            <div>{formatTime(solve.ao12)}</div>
          </div>
        ))}
      </div>
      {selectedSolve && (
        <SolveModal
          open
          solve={selectedSolve}
          onClose={() => setSelectedSolve(null)}
          onUpdate={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  )
}

export default SolveTable
