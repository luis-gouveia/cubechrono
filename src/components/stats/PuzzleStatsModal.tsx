import { Trophy, Hash, Clock4 } from 'lucide-react'
import type { Puzzle } from '../../domain/puzzle'
import { PUZZLES } from '../../domain/puzzle'
import { formatTime } from '../../utils/time'
import { formatDate } from '../../utils/date'
import Modal from '../common/Modal'
import { PuzzleStats } from '../../types/stats'

interface PuzzleStatsModalProps {
  open: boolean
  puzzle: Puzzle
  stats: PuzzleStats
  onClose: () => void
}

function PuzzleStatsModal({ open, puzzle, stats, onClose }: PuzzleStatsModalProps) {
  return (
    <Modal title={PUZZLES[puzzle].label} open={open} onClose={onClose}>
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center flex-col gap-3">
          <div className="ml-1.25">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${PUZZLES[puzzle].color}` }}
            >
              <img src={PUZZLES[puzzle].logo} alt={PUZZLES[puzzle].label} className="h-14 w-14" />
            </div>
          </div>
          <p className="text-center">{PUZZLES[puzzle].label}</p>
        </div>

        <section className="mb-6 grid grid-cols-2 gap-2">
          <div className="rounded-md border col-span-1 border-divider bg-background px-4 py-3">
            <div className="grid grid-cols-2">
              <div className="col-span-2 flex justify-center items-center mb-3">
                <Hash size={15} className="text-blue-400 mx-2" />
                <p>Solves</p>
              </div>
              <div className="col-span-2 text-center">
                <p className="text-2xl">{stats.solves}</p>
              </div>
            </div>
          </div>
          <div className="rounded-md border col-span-1 border-divider bg-background px-4 py-3">
            <div className="grid grid-cols-2">
              <div className="col-span-2 flex justify-center items-center mb-3">
                <Clock4 size={15} className="text-blue-400 mx-2" />
                <p>Mean</p>
              </div>
              <div className="col-span-2 text-center">
                <p className="text-2xl">{formatTime(stats.mean)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-md border col-span-2 border-divider bg-background px-4 py-3">
            <div className="grid grid-cols-3">
              <div className="col-span-3 flex justify-center items-center mb-2">
                <Trophy size={15} className="text-yellow-400 mx-1" />
                <p>Times</p>
              </div>
              <div className="text-center">
                <p className="text-secondary text-xs">single</p>
                <p className="text-2xl">{formatTime(stats.best.single?.value)}</p>
                <p className="text-secondary text-xs">{stats.best.single ? formatDate(stats.best.single.date) : '-'}</p>
              </div>
              <div className="text-center">
                <p className="text-secondary text-xs">ao5</p>
                <p className="text-2xl">{formatTime(stats.best.ao5?.value)}</p>
                <p className="text-secondary text-xs">{stats.best.ao5 ? formatDate(stats.best.ao5.date) : '-'}</p>
              </div>
              <div className="text-center">
                <p className="text-secondary text-xs">ao12</p>
                <p className="text-2xl">{formatTime(stats.best.ao12?.value)}</p>
                <p className="text-secondary text-xs">{stats.best.ao12 ? formatDate(stats.best.ao12.date) : '-'}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Modal>
  )
}

export default PuzzleStatsModal
