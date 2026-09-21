import { useEffect, useState } from 'react'
import { useScramble } from '../hooks/useScramble'
import PuzzleRenderer from '../components/puzzle/PuzzleRenderer'
import Dropdown from '../components/common/Dropdown'
import { PUZZLE, PUZZLES, type Puzzle } from '../domain/puzzle'
import TimerSidePanel from '../components/timer/TimerSidePanel'
import Timer, { TimerState } from '../components/timer/Timer'
import { Copy, RefreshCw, Check } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { useSessions } from '../hooks/useSessions'
import { useSolves } from '../hooks/useSolves'
import { UpdateSolveDTO } from '../types/dtos/solve'
import { formatTimeAverage, formatTimeDiff } from '../utils/time'

const ACTIVE_SESSION_KEY = 'cubechrono.activeSessionId'

function TimerPage() {
  const { settings } = useSettings()

  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(
    () => localStorage.getItem(ACTIVE_SESSION_KEY) ?? undefined,
  )
  const { sessions, loading: sessionsLoading, updateSession, reloadSessions } = useSessions()
  const activeSession = sessions.find((session) => session.id === activeSessionId)

  useEffect(() => {
    if (activeSessionId !== undefined) return
    if (sessions.length === 0) return
    setActiveSessionId(sessions[0].id)
  }, [sessions, activeSessionId])

  useEffect(() => {
    if (!activeSessionId) return
    localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId)
  }, [activeSessionId])

  const { solves, createSolve, updateSolve, deleteSolve } = useSolves(activeSession?.id)
  const [copied, setCopied] = useState(false)
  const [timerState, setTimerState] = useState<TimerState>('idle')

  const puzzle = activeSession?.puzzle ?? PUZZLE.THREE_BY_THREE
  const { scramble, generateScramble } = useScramble(puzzle)

  const isFocusActive = settings.focusMode && timerState !== 'idle'
  const loading = sessionsLoading && sessions.length === 0
  // TODO:
  if (loading) {
    return <div className="flex h-full w-full items-center justify-center bg-background text-secondary">Loading...</div>
  }
  if (!activeSession) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background text-secondary">
        No active session
      </div>
    )
  }

  const handleSessionChange = (sessionId: string) => {
    if (sessionId === activeSession.id) return
    setActiveSessionId(sessionId)
  }
  const handlePuzzleChange = async (puzzle: Puzzle) => {
    if (puzzle === activeSession.puzzle) return
    await updateSession({
      id: activeSession.id,
      name: activeSession.name,
      description: activeSession.description,
      puzzle,
    })
  }

  const handleSolve = async (time: number, penalty: 'none' | '+2' | 'DNF') => {
    if (!scramble) return
    await createSolve({
      sessionId: activeSession.id,
      time,
      penalty,
      scramble,
      puzzle: activeSession.puzzle,
    })
    await reloadSessions()
    generateScramble()
  }
  const handleSolveUpdate = async (input: UpdateSolveDTO) => {
    await updateSolve(input)
    await reloadSessions()
  }
  const handleSolveDelete = async (id: string) => {
    await deleteSolve(id)
    await reloadSessions()
  }

  const copyScramble = async () => {
    if (!scramble) return
    await navigator.clipboard.writeText(scramble)
    setCopied(true)
    window.setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  const puzzleOptions = Object.entries(PUZZLES).map(([, puzzle]) => ({
    value: puzzle.id,
    label: puzzle.label,
  }))

  const sessionOptions = sessions.map((session) => ({
    value: session.id,
    label: session.name,
  }))

  return (
    <div className="relative h-full w-full overflow-hidden">
      {settings.showTimerSidePanel && (
        <div className="fixed left-15.25 top-0 h-screen">
          <TimerSidePanel
            puzzle={puzzle}
            stats={activeSession.stats}
            solves={solves}
            onUpdate={handleSolveUpdate}
            onDelete={handleSolveDelete}
          />
        </div>
      )}
      <main
        className={`
          flex h-full flex-col justify-between overflow-hidden bg-background text-primary pl-10
          ${settings.showTimerSidePanel ? 'ml-64 w-[calc(100%-16rem)]' : 'w-full'}
        `}
      >
        <div className="flex flex-col items-center">
          {!isFocusActive && (
            <div className="flex w-full items-center justify-center gap-2 pt-2">
              <Dropdown
                value={activeSessionId ?? ''}
                options={sessionOptions}
                onChange={handleSessionChange}
                align="center"
                width="w-60"
              />
              <Dropdown
                value={puzzle}
                options={puzzleOptions}
                onChange={handlePuzzleChange}
                align="center"
                width="w-35"
              />
            </div>
          )}
          {!isFocusActive && (
            <div className="mt-5 flex w-full max-w-3xl flex-col items-center px-6 text-center">
              <p className="text-lg leading-6 tracking-widest text-primary">{scramble}</p>

              <div className="mt-3 flex items-center gap-1">
                <button
                  type="button"
                  onClick={copyScramble}
                  title={copied ? 'Copied!' : 'Copy scramble'}
                  className={`
                  cursor-pointer rounded-md p-1.5 transition-colors
                  ${copied ? 'text-green-400' : 'text-secondary hover:bg-button-empty-hover hover:text-primary'}
                `}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
                <button
                  type="button"
                  onClick={() => generateScramble()}
                  title="New scramble"
                  className="cursor-pointer rounded-md p-1.5 text-secondary transition-colors hover:bg-button-empty-hover hover:text-primary"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
        <div
          className={
            isFocusActive
              ? `fixed inset-0 z-50 flex items-center justify-center bg-background`
              : `flex min-h-0 w-full flex-1 flex-col items-center justify-center`
          }
        >
          <Timer onSolve={handleSolve} inspectionEnabled={settings.inspectionTime} onStateChange={setTimerState} />
          {!isFocusActive && (
            <>
              {settings.showCurrentStats && (
                <div className=" my-3 flex flex-col items-center leading-5 text-secondary">
                  <span>diff: {formatTimeDiff(solves[0], solves[1])}</span>
                  <span>ao5: {formatTimeAverage(activeSession.stats?.ao5)}</span>
                  <span>ao12: {formatTimeAverage(activeSession.stats?.ao12)}</span>
                </div>
              )}
            </>
          )}
        </div>
        <div>
          {!isFocusActive && (
            <div>
              {settings.showScramble && scramble && (
                <div className="flex h-50 w-full shrink-0 justify-center mb-5">
                  <PuzzleRenderer alg={scramble} puzzle={puzzle} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TimerPage
