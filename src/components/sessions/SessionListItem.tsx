import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil, Trash2, GripVertical } from 'lucide-react'
import type { SessionListItem as Session } from '../../types/session'
import { formatDate } from '../../utils/date'
import { formatTime } from '../../utils/time'
import { PUZZLES } from '../../domain/puzzle'

interface SessionListItemProps {
  session: Session
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
  onOpen: (session: Session) => void
}

function SessionListItem({ session, onEdit, onDelete, onOpen }: SessionListItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: session.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? undefined : 'transform 120ms cubic-bezier(0.2, 0, 0, 1)',
      }}
      className={`
        grid grid-cols-[32px_minmax(0,1fr)_64px_64px_96px_56px] items-center gap-2 rounded-md border border-divider bg-background px-2 py-3 text-sm transition-all hover:bg-button-full-hover
        ${isDragging ? 'z-10 scale-[1.01] shadow-xl opacity-90' : ''}
      `}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex cursor-grab items-center justify-center text-secondary hover:text-primary active:cursor-grabbing"
        aria-label={`Reorder ${session.name}`}
      >
        <GripVertical size={14} />
      </button>

      <button
        type="button"
        onClick={() => onOpen(session)}
        className="flex min-w-0 items-center gap-3 text-left cursor-pointer"
      >
        <div className="ml-1.25 mr-5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded"
            style={{ backgroundColor: `${PUZZLES[session.puzzle].color}` }}
          >
            <img src={PUZZLES[session.puzzle].logo} alt={PUZZLES[session.puzzle].label} className="h-5 w-5" />
          </div>
        </div>

        <div className="min-w-0">
          <p className="truncate text-primary">{session.name}</p>
          {session.description && <p className="truncate text-xs text-secondary">{session.description}</p>}
        </div>
      </button>

      <span className={`text-xs text-${session.solves.completed === 0 ? 'secondary' : 'primary'} text-center`}>
        {session.solves.completed === 0 ? '--' : `${session.solves.completed}/${session.solves.total}`}
      </span>

      <span className={`text-xs text-${session.mean ? 'primary' : 'secondary'} text-center`}>
        {session.mean ? formatTime(session.mean) : '--'}
      </span>

      <span className="text-xs text-primary text-center">{formatDate(session.createdAt)}</span>

      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => onEdit(session)}
          className="cursor-pointer rounded p-1.5 text-secondary hover:text-primary"
          title="Edit session"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(session)}
          className="cursor-pointer rounded p-1.5 text-secondary hover:text-primary"
          title="Delete session"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default SessionListItem
