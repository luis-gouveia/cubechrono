import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import Modal from '../common/Modal'
import PuzzleRenderer from '../puzzle/PuzzleRenderer'
import type { Solve } from '../../domain/solve'
import { formatTime } from '../../utils/time'
import { formatDateTime } from '../../utils/date'
import { SolvePenalty } from '../../types/solve'

interface SolveModalProps {
  open: boolean
  solve: Solve
  onClose: () => void
  onDelete: (solve: Solve) => void
  onUpdate?: (solve: Solve) => void
}

function SolveModal({ open, solve, onClose, onDelete, onUpdate }: SolveModalProps) {
  const [penalty, setPenalty] = useState(solve.penalty)
  const [comment, setComment] = useState(solve.comment ?? '')

  useEffect(() => {
    if (!open) return
    setPenalty(solve.penalty)
    setComment(solve.comment ?? '')
  }, [open, solve])

  const handlePenaltyChange = (newPenalty: Omit<SolvePenalty, 'none'>) => {
    if (newPenalty === '+2') {
      if (penalty === '+2') setPenalty('none')
      else setPenalty('+2')
    } else {
      if (penalty === 'DNF') setPenalty('none')
      else setPenalty('DNF')
    }
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value)
  }

  const handleCommentBlur = () => {
    onUpdate?.(solve)
  }

  return (
    <Modal open={open} onClose={onClose} title="Solve" width="max-w-xl">
      <div className="space-y-6">
        <section className="grid grid-cols-1 text-center">
          <p className="leading-6">{solve.scramble}</p>
          <p className="text-5xl my-3">{formatTime(solve.time, penalty, 'full')}</p>
          <p className="text-secondary text-xs">{formatDateTime(solve.createdAt)}</p>
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => handlePenaltyChange('+2')}
              className={`cursor-pointer px-3 py-2 text-xs ${penalty === '+2' ? 'text-yellow-400 hover:text-yellow-500' : 'text-secondary hover:text-yellow-400'} transition-colors`}
            >
              +2
            </button>
            <button
              type="button"
              onClick={() => handlePenaltyChange('DNF')}
              className={`cursor-pointer px-3 py-2 text-xs ${penalty === 'DNF' ? 'text-red-400 hover:text-red-500' : 'text-secondary hover:text-red-400'} transition-colors`}
            >
              DNF
            </button>
            <button
              type="button"
              onClick={() => onDelete(solve)}
              className="cursor-pointer px-3 py-2 text-sm text-secondary transition-colors hover:text-red-400"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </section>

        <section className="flex h-40 w-full justify-center">
          <PuzzleRenderer alg={solve.scramble} puzzle={solve.puzzle} />
        </section>

        <section className="mb-3">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-secondary">Comment</label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            onBlur={handleCommentBlur}
            maxLength={255}
            rows={3}
            placeholder="Add a comment..."
            className="w-full resize-none rounded-md border border-divider bg-button-empty px-3 py-2 text-sm text-primary outline-none transition-colors placeholder:text-secondary focus:border-primary"
          />
          <p className="mt-1 text-right text-xs text-secondary">{comment.length}/255</p>
        </section>
      </div>
    </Modal>
  )
}

export default SolveModal
