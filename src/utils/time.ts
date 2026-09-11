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
