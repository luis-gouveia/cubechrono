import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  width?: string
}

function Modal({ open, title, children, onClose, width = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/30 backdrop-blur-xs"
      onClick={() => onClose()}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`relative w-full ${width} max-h-[90vh] mx-4 rounded-xl border border-divider bg-background shadow-xl overflow-y-auto scrollbar`}
      >
        <div className="flex items-center justify-between  px-6 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md text-secondary transition hover:text-primary"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-8 py-4">{children}</div>
      </div>
    </div>
  )
}

export default Modal
