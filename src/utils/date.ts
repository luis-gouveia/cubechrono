export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(date: Date, timeFormat: 'full' | 'compacted' = 'compacted'): string {
  return `${formatDate(date)} ${date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: timeFormat === 'full' ? '2-digit' : undefined,
  })}`
}
