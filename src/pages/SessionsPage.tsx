import { useState } from 'react'
import { Plus } from 'lucide-react'
import SessionList from '../components/sessions/SessionList'
import type { SessionListItem } from '../types/session'
import { PUZZLE } from '../domain/puzzle'
import { useNavigate } from 'react-router-dom'

const initialSessions: SessionListItem[] = [
  {
    id: '1',
    name: 'My Session 4',
    description: 'This is the description for the session',
    puzzle: PUZZLE.THREE_BY_THREE,
    solves: {
      total: 59,
      completed: 60,
    },
    mean: 10340,
    createdAt: new Date('2025-10-15'),
  },
  {
    id: '2',
    name: 'My Session 5',
    puzzle: PUZZLE.THREE_BY_THREE,
    solves: {
      total: 59,
      completed: 59,
    },
    mean: 10340,
    createdAt: new Date('2025-10-15'),
  },
  {
    id: '3',
    name: 'My Session 6',
    puzzle: PUZZLE.SKEWB,
    solves: {
      total: 0,
      completed: 0,
    },
    createdAt: new Date('2025-10-15'),
  },
  {
    id: '4',
    name: 'My Session 7',
    puzzle: PUZZLE.PYRAMINX,
    solves: {
      total: 0,
      completed: 0,
    },
    createdAt: new Date('2025-10-15'),
  },
  {
    id: '5',
    name: 'My Session 8',
    puzzle: PUZZLE.THREE_BY_THREE,
    solves: {
      total: 0,
      completed: 0,
    },
    createdAt: new Date('2025-10-15'),
  },
  {
    id: '6',
    name: 'My Session 8',
    puzzle: PUZZLE.FOUR_BY_FOUR,
    solves: {
      total: 0,
      completed: 0,
    },
    createdAt: new Date('2025-10-15'),
  },
  {
    id: '7',
    name: 'My Session 9 With drag icon',
    puzzle: PUZZLE.FOUR_BY_FOUR,
    solves: {
      total: 0,
      completed: 0,
    },
    createdAt: new Date('2025-10-15'),
  },
]

function SessionsPage() {
  const [sessions, setSessions] = useState<SessionListItem[]>(initialSessions)
  const navigate = useNavigate()

  const handleEdit = (session: SessionListItem) => {
    console.log('edit', session)
  }

  const handleDelete = (session: SessionListItem) => {
    console.log('delete', session)
  }

  const handleOpen = (session: SessionListItem) => navigate(`/sessions/${session.id}`)

  const handleCreate = () => {
    console.log('create session')
  }

  return (
    <main className="h-full w-full overflow-y-auto bg-background text-primary">
      <div className="mx-auto w-full max-w-3xl px-6 py-6">
        <header className="mt-5 mb-5 flex items-center justify-between">
          <h1 className="text-3xl font-medium">Sessions</h1>

          <button
            type="button"
            onClick={handleCreate}
            className="cursor-pointer rounded-md p-2 text-primary transition-colors hover:bg-button-empty-hover hover:text-primary"
            title="Create session"
          >
            <Plus size={20} />
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
          onChange={setSessions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onOpen={handleOpen}
        />
      </div>
    </main>
  )
}

export default SessionsPage
