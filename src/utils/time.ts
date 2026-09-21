import { SolveDTO } from '../types/dtos/solve'
import { AverageResultDTO } from '../types/dtos/statistics'
import { SolvePenalty } from '../types/solve'

export function formatTime(
  milliseconds?: number,
  penalty: SolvePenalty = 'none',
  format: 'compact' | 'full' = 'compact',
): string {
  let result = '-'
  if (milliseconds !== undefined) {
    if (milliseconds < 0) throw new Error('Time cannot be negative')

    const minutes = Math.floor(milliseconds / 60_000)
    const seconds = Math.floor((milliseconds % 60_000) / 1_000)
    const centiseconds = Math.floor((milliseconds % 1_000) / 10)

    if (minutes > 0)
      result = `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
    else result = `${seconds}.${centiseconds.toString().padStart(2, '0')}`
  }

  switch (penalty) {
    case 'none':
      return result
    case '+2':
      return `${result}+`
    case 'DNF':
      return format === 'compact' ? 'DNF' : `DNF(${result})`
  }
}

export function formatTimeAverage(time?: AverageResultDTO): string {
  if (!time) return '-'
  switch (time.status) {
    case 'unavailable':
      return '-'
    case 'DNF':
      return 'DNF'
    case 'value':
      return formatTime(time.value)
  }
}

export function getEffectiveTime(solve: SolveDTO): number | undefined {
  if (solve.penalty === 'DNF') return undefined
  if (solve.penalty === '+2') return solve.time + 2000
  return solve.time
}

export function formatTimeDiff(currentSolve?: SolveDTO, previousSolve?: SolveDTO): string {
  const currentTime = currentSolve ? getEffectiveTime(currentSolve) : undefined
  const previousTime = previousSolve ? getEffectiveTime(previousSolve) : undefined
  if (currentTime === undefined || previousTime === undefined) return '-'

  const diff = currentTime - previousTime
  return `${diff >= 0 ? '+' : '-'}${formatTime(Math.abs(diff))}`
}
