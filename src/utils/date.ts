export function formatDate(date: Date | string): string {
  date = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(date: Date | string, timeFormat: 'full' | 'compacted' = 'compacted'): string {
  date = typeof date === 'string' ? new Date(date) : date
  return `${formatDate(date)} ${date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: timeFormat === 'full' ? '2-digit' : undefined,
  })}`
}
