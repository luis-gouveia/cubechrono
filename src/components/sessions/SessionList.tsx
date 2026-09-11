import { DndContext, closestCenter, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react'
import SessionListItem from './SessionListItem'
import type { SessionListItem as Session } from '../../types/session'

interface SessionListProps {
  sessions: Session[]
  onChange: (sessions: Session[]) => void
  onEdit: (session: Session) => void
  onDelete: (session: Session) => void
  onOpen: (session: Session) => void
}

function SessionList({ sessions, onChange, onEdit, onDelete, onOpen }: SessionListProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeSession = sessions.find((session) => session.id === activeId)

  const handleDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id))
  const handleDragCancel = () => setActiveId(null)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return
    const oldIndex = sessions.findIndex((session) => session.id === active.id)
    const newIndex = sessions.findIndex((session) => session.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onChange(arrayMove(sessions, oldIndex, newIndex))
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sessions.map((session) => session.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-1.5 mt-3">
          {sessions.map((session) => (
            <SessionListItem key={session.id} session={session} onEdit={onEdit} onDelete={onDelete} onOpen={onOpen} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeSession ? (
          <SessionListItem session={activeSession} onEdit={() => {}} onDelete={() => {}} onOpen={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default SessionList
