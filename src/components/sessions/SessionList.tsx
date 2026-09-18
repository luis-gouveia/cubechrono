import { DndContext, closestCenter, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import SessionListItem from './SessionListItem'
import { SessionDTO } from '../../types/dtos/session'

interface SessionListProps {
  sessions: SessionDTO[]
  onReorder: (session: SessionDTO) => void
  onEdit: (session: SessionDTO) => void
  onDelete: (session: SessionDTO) => void
  onOpen: (session: SessionDTO) => void
}

function SessionList({ sessions, onReorder, onEdit, onDelete, onOpen }: SessionListProps) {
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
    const session = sessions[oldIndex]
    onReorder({ ...session, position: newIndex })
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
