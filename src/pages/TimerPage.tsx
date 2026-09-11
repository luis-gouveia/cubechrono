import { useState } from 'react'
import { useScramble } from '../hooks/useScramble'
import PuzzleRenderer from '../components/puzzle/PuzzleRenderer'
import Dropdown from '../components/common/Dropdown'
import { PUZZLE, PUZZLES, type Puzzle } from '../domain/puzzle'
import TimerSidePanel from '../components/timer/TimerSidePanel'
import Timer, { TimerState } from '../components/timer/Timer'
import { Copy, RefreshCw, Check } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'

interface TimerSolve {
  id: string
  time: number
  scramble: string
}

function TimerPage() {
  const { settings } = useSettings()

  // TODO: use puzzle from session
  const [puzzle, setPuzzle] = useState<Puzzle>(PUZZLE.THREE_BY_THREE)
  const [session, setSession] = useState('1')
  const [times, setTimes] = useState<TimerSolve[]>([])
  const [copied, setCopied] = useState(false)

  const { scramble, generateScramble } = useScramble(puzzle)

  const [timerState, setTimerState] = useState<TimerState>('idle')
  const isFocusActive = settings.focusMode && timerState !== 'idle'

  const copyScramble = async () => {
    if (!scramble) return
    await navigator.clipboard.writeText(scramble)
    setCopied(true)
    window.setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  const handleSolve = (time: number, penalty: 'none' | '+2' | 'DNF') => {
    if (!scramble) return

    // TODO: Apply penalty to stored solve.
    const solve: TimerSolve = {
      id: crypto.randomUUID(),
      time,
      scramble,
    }

    setTimes((previous) => [solve, ...previous])
    generateScramble()
  }

  const puzzleOptions = Object.entries(PUZZLES).map(([, puzzle]) => ({
    value: puzzle.id,
    label: puzzle.label,
  }))

  const sessionOptions = [
    { value: '1', label: 'My session 1' },
    { value: '2', label: 'My session 2' },
    { value: '3', label: 'My session 3' },
  ]

  return (
    <div className="relative h-full w-full overflow-hidden">
      {settings.showTimerSidePanel && (
        <div className="fixed left-15.25 top-0 h-screen">
          <TimerSidePanel
            puzzle={puzzle}
            stats={{
              solves: {
                completed: times.length,
                total: times.length,
              },
              mean: 0,
              current: {
                single: times[0]?.time ?? 0,
                ao5: 0,
                ao12: 0,
              },
              best: {
                single: {
                  value: 0,
                  date: new Date(),
                },
                ao5: {
                  value: 0,
                  date: new Date(),
                },
                ao12: {
                  value: 0,
                  date: new Date(),
                },
              },
              penalties: {
                plus2: 0,
                dnf: 0,
              },
            }}
            solves={times.map((solve, index) => ({
              id: solve.id,
              index: times.length - index,
              time: solve.time,
              ao5: 0,
              ao12: 0,
            }))}
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
              <Dropdown value={session} options={sessionOptions} onChange={setSession} align="center" width="w-60" />
              <Dropdown value={puzzle} options={puzzleOptions} onChange={setPuzzle} align="center" width="w-35" />
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
                  <span>diff: -1.23</span>
                  <span>ao5: 5.29</span>
                  <span>ao12: 6.32</span>
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
