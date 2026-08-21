import { useEffect, useState } from 'react'
import { useScramble } from '../hooks/useScramble'
import PuzzleRenderer from '../components/puzzle/PuzzleRenderer'
import Dropdown from '../components/common/Dropdown'
import { Puzzle, PUZZLE, PUZZLES } from '../domain/puzzle'
import TimerSidePanel from '../components/timer/TimerSidePanel'
import { Copy, RefreshCw, Check } from 'lucide-react'
import { formatTime } from '../utils/time'

function TimerPage() {
  const [time, setTime] = useState(25350)
  const [isRunning, setIsRunning] = useState(false)

  const [puzzle, setPuzzle] = useState<Puzzle>(PUZZLE.THREE_BY_THREE)
  const [session, setSession] = useState('1')

  const { scramble, generateScramble } = useScramble(puzzle)

  const [copied, setCopied] = useState(false)

  const copyScramble = async () => {
    if (!scramble) return

    await navigator.clipboard.writeText(scramble)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime((previousTime) => previousTime + 10)
    }, 10)

    return () => clearInterval(interval)
  }, [isRunning])

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
      <div className="fixed left-16 top-0 h-screen">
        <TimerSidePanel
          puzzle={puzzle}
          stats={{
            solves: {
              completed: 49,
              total: 50,
            },
            mean: 3450,
            current: {
              single: 4020,
              ao5: 3450,
              ao12: 12340,
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
          }}
          solves={Array.from({ length: 50 }, (_, i) => ({
            id: `${i}`,
            index: 50 - i,
            time: 5040,
            ao5: 6230,
            ao12: 8010,
          }))}
        />
      </div>

      <main className="ml-64 flex h-full w-[calc(100%-16rem)] flex-col items-center bg-background text-primary overflow-hidden">
        <div className="flex w-full items-center justify-center gap-2 pt-2">
          <Dropdown value={session} options={sessionOptions} onChange={setSession} align="center" width="w-60" />
          <Dropdown value={puzzle} options={puzzleOptions} onChange={setPuzzle} align="center" width="w-35" />
        </div>

        <div className="mt-5 flex w-full max-w-3xl flex-col items-center px-6 text-center">
          <p className="text-lg leading-6 tracking-widest text-primary">{scramble}</p>

          <div className="mt-3 flex items-center gap-1">
            <button
              type="button"
              onClick={copyScramble}
              title={copied ? 'Copied!' : 'Copy scramble'}
              className={`cursor-pointer rounded-md p-1.5 transition-colors ${copied ? 'text-green-400' : 'text-secondary hover:bg-button-empty-hover hover:text-primary'}`}
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

        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
          <button
            onClick={() => setIsRunning((previous) => !previous)}
            className="cursor-pointer select-none text-7xl sm:text-8xl md:text-9xl text-primary transition-opacity hover:opacity-80"
          >
            {formatTime(time)}
          </button>

          <div className="my-3 flex flex-col items-center leading-5 text-secondary">
            <span>diff: -1.23</span>
            <span>ao5: 5.29</span>
            <span>ao12: 6.32</span>
          </div>

          {scramble && (
            <div className="flex h-50 mt-[15vh] w-full justify-center shrink-0">
              <PuzzleRenderer alg={scramble} puzzle={puzzle} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TimerPage
