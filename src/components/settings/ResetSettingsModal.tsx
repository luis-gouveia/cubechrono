import { RotateCcw } from 'lucide-react'
import Modal from '../common/Modal'

interface ResetSettingsModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

function ResetSettingsModal({ open, onClose, onConfirm }: ResetSettingsModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal open={open} title="Reset Settings" onClose={onClose} width="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-button-full">
          <RotateCcw size={22} className="text-secondary" />
        </div>
        <p className="text-sm tyext-primary">Reset all settings to their default values?</p>
        <p className="mt-1 text-xs text-secondary">
          Your timer appearance and solving preferences will be restored to their defaults.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 px-20">
        <button
          type="button"
          onClick={handleConfirm}
          className="cursor-pointer rounded-md px-4 py-2 font-medium transition-colors bg-red-600 text-white hover:bg-red-700"
        >
          Reset Settings
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 mb-3 cursor-pointer rounded-md border border-divider px-4 py-2 transition-colors hover:bg-button-empty-hover"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default ResetSettingsModal
