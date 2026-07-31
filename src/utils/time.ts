export function formatTime(milliseconds?: number): string {
  if (!milliseconds) return '-'

  if (milliseconds < 0) throw new Error('Time cannot be negative')

  const minutes = Math.floor(milliseconds / 60_000)
  const seconds = Math.floor((milliseconds % 60_000) / 1_000)
  const centiseconds = Math.floor((milliseconds % 1_000) / 10)

  if (minutes > 0)
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
  return `${seconds}.${centiseconds.toString().padStart(2, '0')}`
}
