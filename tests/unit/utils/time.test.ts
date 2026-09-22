import { describe, expect, it } from 'vitest'
import { formatTime, formatTimeAverage, getEffectiveTime, formatTimeDiff } from '../../../src/utils/time'
import type { SolveDTO } from '../../../src/types/dtos/solve'
import type { AverageResultDTO } from '../../../src/types/dtos/statistics'
import { PUZZLE } from '../../../src/domain/puzzle'

const createSolve = (time: number, penalty: SolveDTO['penalty'] = 'none'): SolveDTO => ({
  id: crypto.randomUUID(),
  sessionId: 'session-1',
  time,
  penalty,
  scramble: "R U R' U'",
  puzzle: PUZZLE.THREE_BY_THREE,
  createdAt: new Date().toISOString(),
})

describe('formatTime', () => {
  it('returns "-" when time is undefined', () => {
    expect(formatTime()).toBe('-')
  })

  it('formats seconds and centiseconds', () => {
    expect(formatTime(12_340)).toBe('12.34')
  })

  it('formats zero', () => {
    expect(formatTime(0)).toBe('0.00')
  })

  it('formats times with milliseconds', () => {
    expect(formatTime(12_349)).toBe('12.34')
  })

  it('formats times with milliseconds rounded down to centiseconds', () => {
    expect(formatTime(12_399)).toBe('12.39')
  })

  it('formats minutes', () => {
    expect(formatTime(65_430)).toBe('1:05.43')
  })

  it('formats exactly one minute', () => {
    expect(formatTime(60_000)).toBe('1:00.00')
  })

  it('formats multiple minutes', () => {
    expect(formatTime(125_670)).toBe('2:05.67')
  })

  it('pads seconds when minutes are present', () => {
    expect(formatTime(61_230)).toBe('1:01.23')
  })

  it('does not pad seconds when minutes are not present', () => {
    expect(formatTime(1_230)).toBe('1.23')
  })

  it('throws when time is negative', () => {
    expect(() => formatTime(-1)).toThrow('Time cannot be negative')
  })

  describe('penalties', () => {
    it('formats a normal solve without a penalty', () => {
      expect(formatTime(12_340, 'none')).toBe('12.34')
    })

    it('formats a +2 penalty', () => {
      expect(formatTime(12_340, '+2')).toBe('12.34+')
    })

    it('formats a DNF in compact format', () => {
      expect(formatTime(12_340, 'DNF')).toBe('DNF')
    })

    it('formats a DNF in full format', () => {
      expect(formatTime(12_340, 'DNF', 'full')).toBe('DNF(12.34)')
    })

    it('formats an undefined time with +2', () => {
      expect(formatTime(undefined, '+2')).toBe('-+')
    })

    it('formats an undefined time with DNF in compact format', () => {
      expect(formatTime(undefined, 'DNF')).toBe('DNF')
    })

    it('formats an undefined time with DNF in full format', () => {
      expect(formatTime(undefined, 'DNF', 'full')).toBe('DNF(-)')
    })
  })
})

describe('formatTimeAverage', () => {
  it('returns "-" when average is undefined', () => {
    expect(formatTimeAverage()).toBe('-')
  })

  it('returns "-" when average is unavailable', () => {
    const average: AverageResultDTO = { status: 'unavailable' }
    expect(formatTimeAverage(average)).toBe('-')
  })

  it('returns "DNF" when average is DNF', () => {
    const average: AverageResultDTO = { status: 'DNF' }
    expect(formatTimeAverage(average)).toBe('DNF')
  })

  it('formats a valid average', () => {
    const average: AverageResultDTO = {
      status: 'value',
      value: 12_340,
      completedAt: new Date().toISOString(),
    }
    expect(formatTimeAverage(average)).toBe('12.34')
  })

  it('formats a valid average with minutes', () => {
    const average: AverageResultDTO = {
      status: 'value',
      value: 65_430,
      completedAt: new Date().toISOString(),
    }
    expect(formatTimeAverage(average)).toBe('1:05.43')
  })
})

describe('getEffectiveTime', () => {
  it('returns the original time for a normal solve', () => {
    const solve = createSolve(12_340)
    expect(getEffectiveTime(solve)).toBe(12_340)
  })

  it('adds 2 seconds for a +2 penalty', () => {
    const solve = createSolve(12_340, '+2')
    expect(getEffectiveTime(solve)).toBe(14_340)
  })

  it('returns undefined for a DNF', () => {
    const solve = createSolve(12_340, 'DNF')
    expect(getEffectiveTime(solve)).toBeUndefined()
  })

  it('handles a zero-time solve', () => {
    const solve = createSolve(0)
    expect(getEffectiveTime(solve)).toBe(0)
  })

  it('handles a zero-time +2 solve', () => {
    const solve = createSolve(0, '+2')
    expect(getEffectiveTime(solve)).toBe(2_000)
  })
})

describe('formatTimeDiff', () => {
  it('returns "-" when there is no current solve', () => {
    const previous = createSolve(12_340)
    expect(formatTimeDiff(undefined, previous)).toBe('-')
  })

  it('returns "-" when there is no previous solve', () => {
    const current = createSolve(12_340)
    expect(formatTimeDiff(current, undefined)).toBe('-')
  })

  it('returns "-" when both solves are undefined', () => {
    expect(formatTimeDiff()).toBe('-')
  })

  it('returns "-" when the current solve is DNF', () => {
    const current = createSolve(12_340, 'DNF')
    const previous = createSolve(13_000)
    expect(formatTimeDiff(current, previous)).toBe('-')
  })

  it('returns "-" when the previous solve is DNF', () => {
    const current = createSolve(12_340)
    const previous = createSolve(13_000, 'DNF')
    expect(formatTimeDiff(current, previous)).toBe('-')
  })

  it('formats a positive diff', () => {
    const current = createSolve(13_000)
    const previous = createSolve(12_000)
    expect(formatTimeDiff(current, previous)).toBe('+1.00')
  })

  it('formats a negative diff', () => {
    const current = createSolve(12_000)
    const previous = createSolve(13_000)
    expect(formatTimeDiff(current, previous)).toBe('-1.00')
  })

  it('formats a zero diff', () => {
    const current = createSolve(12_000)
    const previous = createSolve(12_000)
    expect(formatTimeDiff(current, previous)).toBe('+0.00')
  })

  it('uses effective time for +2 current solve', () => {
    const current = createSolve(12_000, '+2')
    const previous = createSolve(13_000)
    expect(formatTimeDiff(current, previous)).toBe('+1.00')
  })

  it('uses effective time for +2 previous solve', () => {
    const current = createSolve(14_000)
    const previous = createSolve(12_000, '+2')
    expect(formatTimeDiff(current, previous)).toBe('+0.00')
  })

  it('handles minute-long differences', () => {
    const current = createSolve(70_000)
    const previous = createSolve(5_000)
    expect(formatTimeDiff(current, previous)).toBe('+1:05.00')
  })
})
