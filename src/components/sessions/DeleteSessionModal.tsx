import { useState } from 'react'
import { Trash2, BrushCleaning } from 'lucide-react'
import Modal from '../common/Modal'

export type DeleteSessionAction = 'clear' | 'delete'
interface DeleteSessionModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (action: DeleteSessionAction) => void
}

function DeleteSessionModal({ open, onClose, onConfirm }: DeleteSessionModalProps) {
  const [action, setAction] = useState<DeleteSessionAction>('clear')

  const handleConfirm = () => {
    onConfirm(action)
    onClose()
  }

  return (
    <Modal open={open} title="Delete Session" onClose={onClose} width="max-w-md">
      <p className="mb-5 text-sm text-secondary text-center">Choose what you would like to do with this session</p>

      <div className="space-y-3 grid grid-cols-2">
        <button
          type="button"
          onClick={() => setAction('clear')}
          className={`grid grid-cols-1 h-50 cursor-pointer rounded-lg border p-4 m-2 transition-colors ${
            action === 'clear' ? 'border-primary' : 'border-divider hover:border-primary'
          }`}
        >
          <div className="text-blue-400 flex justify-center items-center mt-5">
            <BrushCleaning size={30} />
          </div>
          <div className="text-center">
            <p className="font-medium">Clear all solves</p>
            <p className="mt-1 text-sm text-secondary">Remove every solve from the session</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setAction('delete')}
          className={`grid grid-cols-1 h-50 cursor-pointer rounded-lg border p-4 m-2 transition-colors ${
            action === 'delete' ? 'border-red-500 ' : 'border-divider hover:border-red-500'
          }`}
        >
          <div className="text-red-400 flex justify-center items-center mt-5">
            <Trash2 size={30} />
          </div>
          <div className="text-center">
            <p className="font-medium">Delete session</p>
            <p className="mt-1 text-sm text-secondary">Permanently delete this session and every solve it contains.</p>
          </div>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 px-20">
        <button
          type="button"
          onClick={handleConfirm}
          className={`cursor-pointer rounded-md px-4 py-2 font-medium transition-colors ${
            action === 'delete'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-primary text-background hover:opacity-90'
          }`}
        >
          {action === 'delete' ? 'Delete Session' : 'Clear Solves'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-md border border-divider px-4 py-2 mt-2 transition-colors hover:bg-button-empty-hover"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default DeleteSessionModal
