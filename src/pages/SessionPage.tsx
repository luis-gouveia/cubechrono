import { ArrowLeft, Pencil, Trash2, Trophy, Hash, TriangleAlert } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { formatTime, formatTimeAverage } from '../utils/time'
import { PUZZLES } from '../domain/puzzle'
import { formatDate, formatDateAverage, formatDateTime } from '../utils/date'
import { useState } from 'react'
import DeleteSessionModal, { DeleteSessionAction } from '../components/sessions/DeleteSessionModal'
import SessionModal from '../components/sessions/SessionModal'
import SolveModal from '../components/solves/SolveModal'
import { useSession } from '../hooks/useSession'
import { useSolves } from '../hooks/useSolves'
import { UpdateSessionDTO } from '../types/dtos/session'
import { SolveDTO, UpdateSolveDTO } from '../types/dtos/solve'

function SessionPage() {
  const navigate = useNavigate()
  const { sessionId } = useParams()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const {
    session,
    loading: sessionLoading,
    updateSession,
    deleteSession,
    clearSession,
    reload,
  } = useSession(sessionId!)
  const { solves, loading: solvesLoading, updateSolve, deleteSolve } = useSolves(sessionId!)
  const loading = sessionLoading || solvesLoading

  const [selectedSolveId, setSelectedSolveId] = useState<string | undefined>(undefined)
  const selectedSolve = solves.find((solve) => solve.id === selectedSolveId)

  const handleDeleteAction = async (action: DeleteSessionAction) => {
    switch (action) {
      case 'delete':
        await deleteSession()
        navigate('/sessions')
        break
      case 'clear':
        await clearSession()
        break
    }
    setShowDeleteModal(false)
  }
  const handleSaveSession = async (updatedSession: UpdateSessionDTO) => {
    await updateSession(updatedSession)
    setShowEditModal(false)
  }

  const handleSelectSolve = async (solve: SolveDTO) => {
    setSelectedSolveId(solve.id)
    await reload()
  }
  const handleUpdateSolve = async (updatedSolve: UpdateSolveDTO) => {
    updateSolve(updatedSolve)
    await reload()
  }
  const handleDeleteSolve = async (id: string) => {
    await deleteSolve(id)
    await reload()
  }

  if (loading) {
    return (
      <main className="flex h-full w-full items-center justify-center bg-background text-secondary">Loading...</main>
    )
  }

  // TODO:
  if (!session) {
    return (
      <main className="flex h-full w-full flex-col items-center justify-center gap-3 bg-background text-secondary">
        <p>Session not found</p>

        <button type="button" onClick={() => navigate('/sessions')} className="text-sm hover:text-primary">
          Back to sessions
        </button>
      </main>
    )
  }

  return (
    <main className="h-full w-full overflow-y-auto bg-background text-primary scrollbar-hidden">
      <div className="mx-auto w-full max-w-3xl px-6 py-6">
        <header className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/sessions')}
            className="mb-3 flex cursor-pointer items-center gap-2 text-sm text-secondary transition-colors hover:text-primary"
          >
            <ArrowLeft size={15} />
            <span>back to sessions</span>
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="truncate text-3xl font-medium">{session.name}</h1>
                <div>
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded"
                    style={{ backgroundColor: `${PUZZLES[session.puzzle].color}` }}
                  >
                    <img src={PUZZLES[session.puzzle].logo} alt={PUZZLES[session.puzzle].label} className="h-4 w-4" />
                  </div>
                </div>
              </div>
              {session.description && <p className="mt-1 text-sm text-secondary">{session.description}</p>}
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                title="Edit session"
                onClick={() => setShowEditModal(true)}
                className="cursor-pointer rounded-md px-1 py-2 text-secondary transition-colors hover:text-primary"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                title="Delete Session"
                onClick={() => setShowDeleteModal(true)}
                className="cursor-pointer rounded-md px-1 py-2 text-secondary transition-colors hover:text-primary"
              >
                <Trash2 size={16} />
              </button>

              <SessionModal
                open={showEditModal}
                mode="edit"
                session={session}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleSaveSession}
              />
              <DeleteSessionModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAction}
              />
            </div>
          </div>
        </header>

        <section className="mb-6 grid grid-cols-4 gap-2">
          <div className="rounded-md border col-span-4 sm:col-span-2 border-divider bg-background px-4 py-3">
            <div className="grid grid-cols-3">
              <div className="col-span-3 flex justify-center items-center mb-2">
                <Trophy size={15} className="text-yellow-400 mx-1" />
                <p>Times</p>
              </div>
              <div className="text-center">
                <p className="text-secondary text-xs">single</p>
                <p className="text-2xl">{formatTime(session.stats?.best?.value)}</p>
                <p className="text-secondary text-xs">{formatDate(session.stats?.best?.completedAt)}</p>
              </div>
              <div className="text-center">
                <p className="text-secondary text-xs">ao5</p>
                <p className="text-2xl">{formatTimeAverage(session.stats?.bestAo5)}</p>
                <p className="text-secondary text-xs">{formatDateAverage(session.stats?.bestAo5)}</p>
              </div>
              <div className="text-center">
                <p className="text-secondary text-xs">ao12</p>
                <p className="text-2xl">{formatTimeAverage(session.stats?.bestAo12)}</p>
                <p className="text-secondary text-xs">{formatDateAverage(session.stats?.bestAo12)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-md border col-span-2 sm:col-span-1 border-divider bg-background px-4 py-3">
            <div className="grid grid-cols-2">
              <div className="col-span-2 flex justify-center items-center mb-3">
                <Hash size={15} className="text-blue-400 mx-1" />
                <p>Solves</p>
              </div>
              <div className="col-span-1 text-center">
                <p className="text-secondary text-xs">solves</p>
                <p className="text-2xl">
                  {`${session.stats?.solves.completed ?? 0}/${session.stats?.solves.total ?? 0}`}
                </p>
              </div>
              <div className="col-span-1 text-center">
                <p className="text-secondary text-xs">mean</p>
                <p className="text-2xl">{session.stats?.mean ? formatTime(session.stats?.mean) : '--'}</p>
              </div>
            </div>
          </div>
          <div className="rounded-md border col-span-2 sm:col-span-1 border-divider bg-background px-4 py-3">
            <div className="grid grid-cols-2">
              <div className="col-span-2 flex justify-center items-center mb-3">
                <TriangleAlert size={15} className="text-red-400 mx-1" />
                <p>Penalties</p>
              </div>
              <div className="col-span-1 text-center">
                <p className="text-secondary text-xs">+2</p>
                <p className="text-2xl">{session.stats?.solves.plusTwo ? session.stats?.solves.plusTwo : '0'}</p>
              </div>
              <div className="col-span-1 text-center">
                <p className="text-secondary text-xs">DNF</p>
                <p className="text-2xl">{session.stats?.solves.dnf ? session.stats?.solves.dnf : '0'}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-[40px_70px_70px_70px_minmax(0,1fr)_130px] gap-2 border-b border-divider px-2 pb-2 text-sm text-secondary">
            <span className="text-center">#</span>
            <span className="text-center">Time</span>
            <span className="text-center">ao5</span>
            <span className="text-center">ao12</span>
            <span>Scramble</span>
            <span className="text-center mr-5">Date</span>
          </div>
          <div className="max-h-[50vh] overflow-y-auto scrollbar">
            {solves.length === 0 && (
              <div className="text-center text-secondary text-sm mt-5">There are no solves in this session</div>
            )}
            {solves.map((solve, index) => (
              <div
                key={solve.id}
                onClick={() => handleSelectSolve(solve)}
                className="grid grid-cols-[40px_70px_70px_70px_minmax(0,1fr)_130px] items-center gap-2 border-b border-divider/50 px-2 py-1.5 text-xs transition-colors hover:bg-button-full-hover hover:cursor-pointer"
              >
                <span className="text-secondary text-center">{solves.length - index}</span>
                <span className="text-center">{formatTime(solve.time, solve.penalty)}</span>
                <span className="text-center">{formatTimeAverage(solve.stats?.ao5)}</span>
                <span className="text-center">{formatTimeAverage(solve.stats?.ao12)}</span>
                <span className="truncate text-secondary">{solve.scramble}</span>
                <span className="text-secondary text-center">{formatDateTime(solve.createdAt)}</span>
              </div>
            ))}
          </div>
          {selectedSolve && (
            <SolveModal
              open
              solve={selectedSolve}
              onClose={() => setSelectedSolveId(undefined)}
              onUpdate={handleUpdateSolve}
              onDelete={handleDeleteSolve}
            />
          )}
        </section>
      </div>
    </main>
  )
}

export default SessionPage
