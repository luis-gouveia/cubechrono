import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SessionList from '../components/sessions/SessionList'
import SessionModal from '../components/sessions/SessionModal'
import DeleteSessionModal, { type DeleteSessionAction } from '../components/sessions/DeleteSessionModal'
import { useSessions } from '../hooks/useSessions'
import { CreateSessionDTO, SessionDTO, UpdateSessionDTO } from '../types/dtos/session'
import { toast } from 'sonner'

function SessionsPage() {
  const navigate = useNavigate()

  const { sessions, loading, error, createSession, updateSession, deleteSession, clearSession } = useSessions()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingSession, setEditingSession] = useState<SessionDTO | undefined>(undefined)
  const [deletingSession, setDeletingSession] = useState<SessionDTO | undefined>(undefined)

  useEffect(() => {
    if (!error) return
    toast.error(error.message)
  }, [error])

  const handleOpen = (session: SessionDTO) => {
    navigate(`/sessions/${session.id}`)
  }

  const handleEdit = (session: SessionDTO) => {
    setEditingSession(session)
  }
  const handleDelete = (session: SessionDTO) => {
    setDeletingSession(session)
  }
  const handleCreate = () => {
    setShowCreateModal(true)
  }

  const handleCreateSubmit = async (session: CreateSessionDTO) => {
    await createSession(session)
    setShowCreateModal(false)
  }
  const handleEditSubmit = async (session: UpdateSessionDTO) => {
    await updateSession(session)
    setEditingSession(undefined)
  }
  const handleDeleteAction = async (action: DeleteSessionAction) => {
    switch (action) {
      case 'delete':
        await deleteSession(deletingSession!.id)
        break
      case 'clear':
        await clearSession(deletingSession!.id)
        break
    }
    setDeletingSession(undefined)
  }

  if (loading) {
    return <div>Loading Sessions...</div>
  }

  return (
    <main className="h-full w-full overflow-y-auto bg-background text-primary scrollbar-hidden">
      <div className="mx-auto w-full max-w-3xl px-6 py-6">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-medium">Sessions</h1>
          <button
            type="button"
            onClick={handleCreate}
            className="cursor-pointer rounded-md p-2 text-primary transition-colors hover:bg-button-empty-hover hover:text-primary"
            title="Create session"
          >
            <Plus size={22} />
          </button>
        </header>

        <div className="mb-2 grid grid-cols-[32px_minmax(0,1fr)_64px_64px_96px_56px] items-center gap-2 px-2 text-sm text-secondary">
          <span />
          <div className="flex gap-6">
            <span className="text-center">Puzzle</span>
            <span>Name</span>
          </div>
          <span className="text-center">Solves</span>
          <span className="text-center">Mean</span>
          <span className="text-center">Created At</span>
          <span className="text-center">Actions</span>
        </div>

        <SessionList
          sessions={sessions}
          onReorder={handleEditSubmit}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onOpen={handleOpen}
        />
      </div>

      <SessionModal
        open={showCreateModal}
        mode="create"
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
      />
      {editingSession && (
        <SessionModal
          open
          mode="edit"
          session={editingSession}
          onClose={() => setEditingSession(undefined)}
          onSubmit={handleEditSubmit}
        />
      )}
      {deletingSession && (
        <DeleteSessionModal open onClose={() => setDeletingSession(undefined)} onConfirm={handleDeleteAction} />
      )}
    </main>
  )
}

export default SessionsPage
