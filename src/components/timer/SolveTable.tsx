import { SolveItem } from '../../types/solve'
import { formatTime } from '../../utils/time'

function SolveTable({ solves }: { solves: SolveItem[] }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid grid-cols-4 border-divider px-1 py-2 text-secondary text-sm text-center">
        <div>#</div>
        <div>Time</div>
        <div>ao5</div>
        <div>ao12</div>
      </div>
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        {solves.map((solve) => (
          <div
            key={solve.index}
            className="grid grid-cols-4 px-1 py-1 text-sm text-center transition-all hover:bg-button-full-hover hover:cursor-pointer"
          >
            <div>{solve.index}</div>
            <div>{formatTime(solve.time)}</div>
            <div>{formatTime(solve.ao5)}</div>
            <div>{formatTime(solve.ao12)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SolveTable
