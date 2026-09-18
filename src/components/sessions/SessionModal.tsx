import { useState } from 'react'
import Modal from '../common/Modal'
import Dropdown from '../common/Dropdown'
import { PUZZLES } from '../../domain/puzzle'
import { CreateSessionDTO, SessionDTO, UpdateSessionDTO } from '../../types/dtos/session'

type SessionModalProps =
  | {
      open: boolean
      mode: 'create'
      session?: SessionDTO
      onClose: () => void
      onSubmit: (session: CreateSessionDTO) => void
    }
  | {
      open: boolean
      mode: 'edit'
      session?: SessionDTO
      onClose: () => void
      onSubmit: (session: UpdateSessionDTO) => void
    }

function SessionModal({ open, mode, session, onClose, onSubmit }: SessionModalProps) {
  const [name, setName] = useState(session?.name ?? '')
  const [description, setDescription] = useState(session?.description ?? '')
  const [puzzle, setPuzzle] = useState(session?.puzzle ?? PUZZLES['3x3'].id)

  const puzzleOptions = Object.values(PUZZLES).map((puzzle) => ({
    value: puzzle.id,
    label: puzzle.label,
  }))

  const handleSubmit = () => {
    const input = {
      name,
      description: description || undefined,
      puzzle,
    }

    if (mode === 'create') onSubmit(input)
    else onSubmit({ ...input, id: session!.id })
    onClose()
  }

  return (
    <Modal open={open} title={mode === 'create' ? 'Create Session' : 'Edit Session'} onClose={onClose} width="max-w-lg">
      <div className="space-y-3">
        <div>
          <label className="mb-2 block text-sm text-secondary">Puzzle</label>
          <Dropdown value={puzzle} options={puzzleOptions} onChange={setPuzzle} width="w-50" />
        </div>

        <div>
          <label className="mb-2 block text-sm text-secondary">Name</label>
          <input
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-divider bg-button-empty px-3 py-2 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-secondary">Description</label>
          <textarea
            rows={4}
            value={description}
            maxLength={255}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none rounded-md border border-divider bg-button-empty px-3 py-2 outline-none focus:border-primary"
          />
        </div>

        <div className="flex justify-center gap-5 pt-2 mt-5">
          <button
            onClick={onClose}
            className="w-30 cursor-pointer rounded-md border border-divider px-4 py-2 transition hover:bg-button-empty-hover"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-30 cursor-pointer rounded-md bg-primary px-4 py-2 text-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mode === 'create' ? 'Create' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default SessionModal
