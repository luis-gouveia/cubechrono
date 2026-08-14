import { ArrowLeft, Pencil, Trash2, Trophy, Hash, TriangleAlert } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import type { SessionListItem, SessionStats } from '../types/session'
import { formatTime } from '../utils/time'
import { PUZZLE } from '../domain/puzzle'
import { formatDate, formatDateTime } from '../utils/date'
import { useState } from 'react'
import DeleteSessionModal, { DeleteSessionAction } from '../components/sessions/DeleteSessionModal'
import SessionModal from '../components/sessions/SessionModal'
import { Session } from '../domain/session'
import { Solve } from '../domain/solve'
import { SolveItem } from '../types/solve'
import SolveModal from '../components/solves/SolveModal'

function SessionPage() {
  const navigate = useNavigate()
  const { sessionId } = useParams()

  const session: SessionListItem = {
    id: crypto.randomUUID() ?? sessionId, // TODO:
    name: 'My Session',
    description: 'This is the description for my session',
    puzzle: PUZZLE.THREE_BY_THREE,
    solves: {
      completed: 59,
      total: 60,
    },
    mean: 34290,
    createdAt: new Date('2025-10-15'),
  }
  const sessionStats: SessionStats = {
    solves: {
      completed: 59,
      total: 60,
    },
    mean: 10050,
    current: {
      single: 10050,
      ao5: 10050,
      ao12: 10050,
    },
    best: {
      single: { value: 10050, date: new Date() },
      ao5: { value: 10050, date: new Date() },
      ao12: { value: 10050, date: new Date() },
    },
    penalties: {
      plus2: 3,
      dnf: 1,
    },
  }
  const solves = Array.from({ length: 40 }, (_, i) => ({
    id: `${i}`,
    index: 50 - i,
    time: 10240,
    ao5: 33412,
    ao12: 33412,
    scramble: "B Dw2 B' Rw' Rw' 3Rw R2 3Uw2 3Rw...",
    date: new Date('2025-10-15T16:48:00'),
  }))

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const handleDeleteAction = (action: DeleteSessionAction) => {
    switch (action) {
      case 'clear':
        console.log('Clear solves')
        break
      case 'delete':
        console.log('Delete session')
        navigate('/sessions')
        break
    }
  }
  const [showEditModal, setShowEditModal] = useState(false)
  const handleSaveSession = (updatedSession: Session) => {
    console.log(updatedSession)
    setShowEditModal(false)
  }

  const [selectedSolve, setSelectedSolve] = useState<Solve | null>(null)
  const handleSelectSolve = (solve: SolveItem) => {
    const solveEntity = Solve.from({
      id: crypto.randomUUID(),
      time: solve.time,
      penalty: 'none',
      scramble: "D' R2 D B2 R2 D L2 F2 L2 U2 L' U' B' F L U L' R' D F'",
      puzzle: session.puzzle,
      comment: undefined,
      createdAt: new Date(),
    })

    setSelectedSolve(solveEntity)
  }
  const handleUpdateSolve = (updatedSolve: Solve) => {
    console.log('update solve', updatedSolve)
  }
  const handleDeleteSolve = (solve: Solve) => {
    console.log('delete solve', solve.id)
    setSelectedSolve(null)
  }

  return (
    <main className="h-full w-full overflow-y-auto bg-background text-primary">
      <div className="mx-auto w-full max-w-3xl px-6 py-6">
        <header className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/sessions')}
            className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-secondary transition-colors hover:text-primary"
          >
            <ArrowLeft size={15} />
            <span>back to sessions</span>
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="truncate text-2xl font-medium">{session.name}</h1>
                <div className=" flex h-6 w-6 shrink-0 items-center justify-center rounded bg-accent text-[10px]" />
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
                <Pencil size={15} />
              </button>
              <button
                type="button"
                title="Delete Session"
                onClick={() => setShowDeleteModal(true)}
                className="cursor-pointer rounded-md px-1 py-2 text-secondary transition-colors hover:text-primary"
              >
                <Trash2 size={15} />
              </button>

              <SessionModal
                open={showEditModal}
                mode="edit"
                session={Session.from({ ...session })}
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

        {/* Session stats */}
        <section className="mb-6 grid grid-cols-4 gap-2">
          <div className="rounded-md border col-span-2 border-divider bg-background px-4 py-3">
            <div className="grid grid-cols-3">
              <div className="col-span-3 flex justify-center items-center mb-2">
                <Trophy size={15} className="text-yellow-400 mx-1" />
                <p>Times</p>
              </div>
              <div className="text-center">
                <p className="text-secondary text-xs">single</p>
                <p className="text-2xl">{formatTime(sessionStats.best.single.value)}</p>
                <p className="text-secondary text-xs">{formatDate(sessionStats.best.single.date)}</p>
              </div>
              <div className="text-center">
                <p className="text-secondary text-xs">ao5</p>
                <p className="text-2xl">{formatTime(sessionStats.best.ao5.value)}</p>
                <p className="text-secondary text-xs">{formatDate(sessionStats.best.ao5.date)}</p>
              </div>
              <div className="text-center">
                <p className="text-secondary text-xs">ao12</p>
                <p className="text-2xl">{formatTime(sessionStats.best.ao12.value)}</p>
                <p className="text-secondary text-xs">{formatDate(sessionStats.best.ao12.date)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-md border col-span-1 border-divider bg-background px-4 py-3">
            <div className="grid grid-cols-2">
              <div className="col-span-2 flex justify-center items-center mb-3">
                <Hash size={15} className="text-blue-400 mx-1" />
                <p>Solves</p>
              </div>
              <div className="col-span-1 text-center">
                <p className="text-secondary text-xs">solves</p>
                <p className="text-2xl">{`${sessionStats.solves.completed}/${sessionStats.solves.total}`}</p>
              </div>
              <div className="col-span-1 text-center">
                <p className="text-secondary text-xs">mean</p>
                <p className="text-2xl">{formatTime(sessionStats.mean)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-md border col-span-1 border-divider bg-background px-4 py-3">
            <div className="grid grid-cols-2">
              <div className="col-span-2 flex justify-center items-center mb-3">
                <TriangleAlert size={15} className="text-red-400 mx-1" />
                <p>Penalties</p>
              </div>
              <div className="col-span-1 text-center">
                <p className="text-secondary text-xs">+2</p>
                <p className="text-2xl">{sessionStats.penalties.plus2}</p>
              </div>
              <div className="col-span-1 text-center">
                <p className="text-secondary text-xs">DNF</p>
                <p className="text-2xl">{sessionStats.penalties.dnf}</p>
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
            {solves.map((solve) => (
              <div
                key={solve.id}
                onClick={() => handleSelectSolve(solve)}
                className="grid grid-cols-[40px_70px_70px_70px_minmax(0,1fr)_130px] items-center gap-2 border-b border-divider/50 px-2 py-1.5 text-xs transition-colors hover:bg-button-full-hover hover:cursor-pointer"
              >
                <span className="text-secondary text-center">{solve.index}</span>
                <span className="text-center">{formatTime(solve.time)}</span>
                <span className="text-center">{formatTime(solve.ao5)}</span>
                <span className="text-center">{formatTime(solve.ao12)}</span>
                <span className="truncate text-secondary">{solve.scramble}</span>
                <span className="text-secondary text-center">{formatDateTime(solve.date)}</span>
              </div>
            ))}
          </div>
          {selectedSolve && (
            <SolveModal
              open
              solve={selectedSolve}
              onClose={() => setSelectedSolve(null)}
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
