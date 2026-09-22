import { describe, expect, it } from 'vitest'
import { formatDate, formatDateTime, formatDateAverage, formatDateTimeAverage } from '../../../src/utils/date'
import type { AverageResultDTO } from '../../../src/types/dtos/statistics'

describe('formatDate', () => {
  it('returns "-" when date is undefined', () => {
    expect(formatDate()).toBe('-')
  })

  it('formats a Date as DD/MM/YYYY', () => {
    const date = new Date(2025, 0, 15)
    expect(formatDate(date)).toBe('15/01/2025')
  })

  it('formats an ISO date string as DD/MM/YYYY', () => {
    expect(formatDate('2025-01-15T12:30:00.000Z')).toBe('15/01/2025')
  })

  it('pads day and month with zeros', () => {
    const date = new Date(2025, 0, 5)
    expect(formatDate(date)).toBe('05/01/2025')
  })
})

describe('formatDateTime', () => {
  it('returns "-" when date is undefined', () => {
    expect(formatDateTime()).toBe('-')
  })

  it('formats date and time in compacted format by default', () => {
    const date = new Date(2025, 0, 15, 13, 45, 30)
    expect(formatDateTime(date)).toBe('15/01/2025 13:45')
  })

  it('formats seconds when using full format', () => {
    const date = new Date(2025, 0, 15, 13, 45, 30)
    expect(formatDateTime(date, 'full')).toBe('15/01/2025 13:45:30')
  })

  it('does not include seconds in compacted format', () => {
    const date = new Date(2025, 0, 15, 13, 45, 59)
    expect(formatDateTime(date, 'compacted')).toBe('15/01/2025 13:45')
  })

  it('accepts an ISO date string', () => {
    expect(formatDateTime('2025-01-15T13:45:30')).toBe('15/01/2025 13:45')
  })
})

describe('formatDateAverage', () => {
  it('returns "-" when average is undefined', () => {
    expect(formatDateAverage()).toBe('-')
  })

  it('returns "-" when average is unavailable', () => {
    const average: AverageResultDTO = { status: 'unavailable' }
    expect(formatDateAverage(average)).toBe('-')
  })

  it('returns "-" when average is DNF', () => {
    const average: AverageResultDTO = { status: 'DNF' }
    expect(formatDateAverage(average)).toBe('-')
  })

  it('formats the completion date when average has a value', () => {
    const average: AverageResultDTO = {
      status: 'value',
      value: 12345,
      completedAt: '2025-01-15T13:45:30.000Z',
    }
    expect(formatDateAverage(average)).toBe('15/01/2025')
  })
})

describe('formatDateTimeAverage', () => {
  it('returns "-" when average is undefined', () => {
    expect(formatDateTimeAverage()).toBe('-')
  })

  it('returns "-" when average is unavailable', () => {
    const average: AverageResultDTO = { status: 'unavailable' }
    expect(formatDateTimeAverage(average)).toBe('-')
  })

  it('returns "-" when average is DNF', () => {
    const average: AverageResultDTO = { status: 'DNF' }
    expect(formatDateTimeAverage(average)).toBe('-')
  })

  it('formats the completion date and time when average has a value', () => {
    const average: AverageResultDTO = {
      status: 'value',
      value: 12345,
      completedAt: '2025-01-15T13:45:30.000Z',
    }
    expect(formatDateTimeAverage(average)).toBe('15/01/2025 13:45')
  })

  it('formats seconds for the completion time only through the full formatter', () => {
    const average: AverageResultDTO = {
      status: 'value',
      value: 12345,
      completedAt: '2025-01-15T13:45:30.000Z',
    }
    expect(formatDateTimeAverage(average)).toBe('15/01/2025 13:45')
  })
})
