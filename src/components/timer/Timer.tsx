import { useCallback, useEffect, useRef, useState } from 'react'
import { Timer as TimerIcon } from 'lucide-react'
import { formatTime } from '../../utils/time'
import { SolvePenalty } from '../../types/solve'

const HOLD_TIME = 550
const INSPECTION_PLUS_TWO = 15_000
const INSPECTION_DNF = 17_000

export type TimerState = 'idle' | 'inspection' | 'holding' | 'ready' | 'running'

interface TimerProps {
  inspectionEnabled?: boolean
  onSolve: (time: number, penalty: SolvePenalty) => void
  onStateChange?: (state: TimerState) => void
  initialTime?: number
}

function Timer({ inspectionEnabled = false, onSolve, initialTime = 0, onStateChange }: TimerProps) {
  const [state, setState] = useState<TimerState>('idle')
  const [time, setTime] = useState(initialTime)
  const [inspectionTime, setInspectionTime] = useState(0)
  const [penalty, setPenalty] = useState<SolvePenalty>('none')

  const stateRef = useRef<TimerState>('idle')
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const solveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const inspectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const inspectionStartRef = useRef<number | null>(null)
  const solveStartRef = useRef<number | null>(null)
  const penaltyRef = useRef<SolvePenalty>('none')

  const setTimerState = useCallback((nextState: TimerState) => {
    stateRef.current = nextState
    setState(nextState)
  }, [])
  const setCurrentPenalty = useCallback((value: SolvePenalty) => {
    penaltyRef.current = value
    setPenalty(value)
  }, [])

  const clearHoldTimeout = useCallback(() => {
    if (holdTimeoutRef.current !== null) {
      clearTimeout(holdTimeoutRef.current)
      holdTimeoutRef.current = null
    }
  }, [])
  const clearSolveInterval = useCallback(() => {
    if (solveIntervalRef.current !== null) {
      clearInterval(solveIntervalRef.current)
      solveIntervalRef.current = null
    }
  }, [])
  const clearInspectionInterval = useCallback(() => {
    if (inspectionIntervalRef.current !== null) {
      clearInterval(inspectionIntervalRef.current)
      inspectionIntervalRef.current = null
    }
  }, [])
  const clearTimers = useCallback(() => {
    clearHoldTimeout()
    clearSolveInterval()
    clearInspectionInterval()
  }, [clearHoldTimeout, clearSolveInterval, clearInspectionInterval])

  const getInspectionPenalty = useCallback((elapsed: number): SolvePenalty => {
    if (elapsed >= INSPECTION_DNF) return 'DNF'
    if (elapsed > INSPECTION_PLUS_TWO) return '+2'
    return 'none'
  }, [])

  const startInspection = useCallback(() => {
    clearInspectionInterval()
    const now = performance.now()
    inspectionStartRef.current = now
    setInspectionTime(0)
    setCurrentPenalty('none')
    setTimerState('inspection')

    inspectionIntervalRef.current = setInterval(() => {
      if (inspectionStartRef.current === null) return
      const elapsed = performance.now() - inspectionStartRef.current
      setInspectionTime(elapsed)
      const nextPenalty = getInspectionPenalty(elapsed)
      setCurrentPenalty(nextPenalty)
    }, 50)
  }, [clearInspectionInterval, getInspectionPenalty, setCurrentPenalty, setTimerState])

  const startHold = useCallback(() => {
    clearHoldTimeout()
    setTimerState('holding')

    holdTimeoutRef.current = setTimeout(() => {
      holdTimeoutRef.current = null
      setTimerState('ready')
    }, HOLD_TIME)
  }, [clearHoldTimeout, setTimerState])

  const startSolve = useCallback(() => {
    clearSolveInterval()

    let finalPenalty: SolvePenalty = 'none'
    if (inspectionStartRef.current !== null) {
      const elapsed = performance.now() - inspectionStartRef.current
      setInspectionTime(elapsed)
      finalPenalty = getInspectionPenalty(elapsed)
      setCurrentPenalty(finalPenalty)
      clearInspectionInterval()
      inspectionStartRef.current = null
    }

    solveStartRef.current = performance.now()
    setTime(0)
    setTimerState('running')

    solveIntervalRef.current = setInterval(() => {
      if (solveStartRef.current === null) return
      const elapsed = performance.now() - solveStartRef.current
      setTime(elapsed)
    }, 10)
  }, [clearInspectionInterval, clearSolveInterval, getInspectionPenalty, setCurrentPenalty, setTimerState])

  const stopSolve = useCallback(() => {
    if (solveStartRef.current === null) return
    const finalTime = performance.now() - solveStartRef.current
    const finalPenalty = penaltyRef.current
    clearSolveInterval()
    solveStartRef.current = null
    setTime(finalTime)
    setTimerState('idle')
    onSolve(finalTime, finalPenalty)
  }, [clearSolveInterval, onSolve, setTimerState])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return
      event.preventDefault()
      if (event.repeat) return

      const currentState = stateRef.current
      if (currentState === 'running') {
        stopSolve()
        return
      }
      if (currentState === 'idle') {
        if (inspectionEnabled) {
          startInspection()
        } else {
          setCurrentPenalty('none')
          startHold()
        }
        return
      }
      if (currentState === 'inspection') {
        startHold()
        return
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return
      event.preventDefault()

      const currentState = stateRef.current
      if (currentState === 'holding') {
        clearHoldTimeout()
        if (inspectionStartRef.current !== null) {
          setTimerState('inspection')
        } else {
          setTimerState('idle')
        }
        return
      }
      if (currentState === 'ready') {
        startSolve()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [
    inspectionEnabled,
    clearHoldTimeout,
    setCurrentPenalty,
    setTimerState,
    startHold,
    startInspection,
    startSolve,
    stopSolve,
  ])

  useEffect(() => {
    return () => {
      clearTimers()
      inspectionStartRef.current = null
      solveStartRef.current = null
      stateRef.current = 'idle'
    }
  }, [clearTimers])

  useEffect(() => {
    onStateChange?.(state)
  }, [state, onStateChange])

  if (state === 'inspection') {
    return (
      <div className="flex items-center justify-center">
        <div
          className={`
            flex select-none items-center gap-4 text-7xl sm:text-8xl md:text-9xl
            ${penalty === 'DNF' ? 'text-red-500' : penalty === '+2' ? 'text-yellow-400' : 'text-primary'}
          `}
        >
          <TimerIcon size={48} strokeWidth={1.5} />

          <span>{Math.floor(inspectionTime / 1000)}</span>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      className={`
        select-none text-7xl sm:text-8xl md:text-9xl transition-colors
        ${state === 'holding' ? 'text-red-400' : state === 'ready' ? 'text-green-400' : 'text-primary'}
      `}
      aria-label="Timer"
    >
      {formatTime(time)}
    </button>
  )
}

export default Timer
