import { beforeEach, describe, expect, it } from 'vitest'
import { Solve } from '../../../src/domain/solve'
import { StatisticsCalculator } from '../../../electron/data/statistics/statisticsCalculator'

describe('StatisticsCalculator', () => {
  let calculator: StatisticsCalculator

  beforeEach(() => {
    calculator = new StatisticsCalculator()
  })

  function createSolve(time: number, penalty: 'none' | '+2' | 'DNF' = 'none', createdAt?: Date): Solve {
    const solve = Solve.from({
      id: crypto.randomUUID(),
      sessionId: crypto.randomUUID(),
      time,
      penalty,
      scramble: "R U R' U'",
      puzzle: '3x3',
      createdAt: createdAt ?? new Date(),
    })
    return solve
  }

  describe('calculateSessionStats', () => {
    it('returns empty statistics for no solves', () => {
      const result = calculator.calculateSessionStats([])
      expect(result).toEqual({
        solves: {
          total: 0,
          completed: 0,
          plusTwo: 0,
          dnf: 0,
        },
        mean: undefined,
        current: undefined,
        best: undefined,
        ao5: { status: 'unavailable' },
        ao12: { status: 'unavailable' },
        bestAo5: { status: 'unavailable' },
        bestAo12: { status: 'unavailable' },
      })
    })

    it('calculates solve counts', () => {
      const solves = [createSolve(10_000), createSolve(11_000, '+2'), createSolve(12_000, 'DNF'), createSolve(13_000)]
      const result = calculator.calculateSessionStats(solves)
      expect(result.solves).toEqual({
        total: 4,
        completed: 3,
        plusTwo: 1,
        dnf: 1,
      })
    })

    it('calculates the mean using effective times', () => {
      const solves = [createSolve(10_000), createSolve(12_000, '+2'), createSolve(20_000, 'DNF')]
      const result = calculator.calculateSessionStats(solves)
      expect(result.mean).toBe(12_000)
    })

    it('ignores DNF when calculating the mean', () => {
      const solves = [createSolve(10_000), createSolve(20_000, 'DNF')]
      const result = calculator.calculateSessionStats(solves)
      expect(result.mean).toBe(10_000)
    })

    it('returns undefined mean when all solves are DNF', () => {
      const solves = [createSolve(10_000, 'DNF'), createSolve(20_000, 'DNF')]
      const result = calculator.calculateSessionStats(solves)
      expect(result.mean).toBeUndefined()
    })

    it('returns the effective time of the newest solve as current', () => {
      const solves = [createSolve(12_000, '+2'), createSolve(10_000)]
      const result = calculator.calculateSessionStats(solves)
      expect(result.current).toBe(14_000)
    })

    it('returns undefined current when there are no solves', () => {
      const result = calculator.calculateSessionStats([])
      expect(result.current).toBeUndefined()
    })

    it('returns the best solve using effective time', () => {
      const bestDate = new Date('2025-01-03T12:00:00.000Z')
      const solves = [
        createSolve(12_000),
        createSolve(9_000, '+2'),
        createSolve(10_000, 'none', bestDate),
        createSolve(8_000, 'DNF'),
      ]
      const result = calculator.calculateSessionStats(solves)
      expect(result.best).toEqual({
        value: 10_000,
        completedAt: bestDate.toISOString(),
      })
    })

    it('returns undefined best when every solve is DNF', () => {
      const solves = [createSolve(10_000, 'DNF'), createSolve(12_000, 'DNF')]
      const result = calculator.calculateSessionStats(solves)
      expect(result.best).toBeUndefined()
    })
  })

  describe('calculateSolveStats', () => {
    it('returns solves in newest-first order', () => {
      const oldest = createSolve(10_000, 'none', new Date('2025-01-01T10:00:00.000Z'))
      const middle = createSolve(11_000, 'none', new Date('2025-01-02T10:00:00.000Z'))
      const newest = createSolve(12_000, 'none', new Date('2025-01-03T10:00:00.000Z'))
      const result = calculator.calculateSolveStats([newest, middle, oldest])
      expect(result.map(({ solve }) => solve.id)).toEqual([newest.id, middle.id, oldest.id])
    })

    it('returns unavailable AO5 until five solves exist', () => {
      const solves = [createSolve(10_000), createSolve(11_000), createSolve(12_000), createSolve(13_000)]
      const result = calculator.calculateSolveStats(solves)
      expect(result[0].stats.ao5).toEqual({ status: 'unavailable' })
    })

    it('calculates AO5 after five solves', () => {
      const solves = [
        createSolve(10_000),
        createSolve(11_000),
        createSolve(12_000),
        createSolve(13_000),
        createSolve(14_000),
      ]
      const result = calculator.calculateSolveStats(solves)
      expect(result[0].stats.ao5).toMatchObject({ status: 'value', value: 12_000 })
    })

    it('calculates AO12 after twelve solves', () => {
      const solves = Array.from({ length: 12 }, (_, index) => createSolve(10_000 + index * 1_000))
      const result = calculator.calculateSolveStats(solves)
      expect(result[0].stats.ao12).toMatchObject({ status: 'value', value: 15_500 })
    })

    it('returns DNF when an average contains more than one DNF', () => {
      const solves = [
        createSolve(10_000),
        createSolve(11_000, 'DNF'),
        createSolve(12_000, 'DNF'),
        createSolve(13_000),
        createSolve(14_000),
      ]
      const result = calculator.calculateSolveStats(solves)
      expect(result[0].stats.ao5).toEqual({ status: 'DNF' })
    })

    it('removes the DNF and the best valid solve when exactly one DNF exists', () => {
      const solves = [
        createSolve(10_000),
        createSolve(11_000),
        createSolve(12_000, 'DNF'),
        createSolve(13_000),
        createSolve(14_000),
      ]
      const result = calculator.calculateSolveStats(solves)
      expect(result[0].stats.ao5).toMatchObject({ status: 'value', value: (11_000 + 13_000 + 14_000) / 3 })
    })

    it('handles +2 penalties when calculating averages', () => {
      const solves = [
        createSolve(10_000),
        createSolve(11_000),
        createSolve(12_000),
        createSolve(13_000, '+2'),
        createSolve(14_000),
      ]
      const result = calculator.calculateSolveStats(solves)
      expect(result[0].stats.ao5).toMatchObject({ status: 'value', value: (11_000 + 12_000 + 14_000) / 3 })
    })
  })

  describe('best averages', () => {
    it('returns unavailable when there are not enough solves', () => {
      const solves = [createSolve(10_000), createSolve(11_000), createSolve(12_000)]
      const result = calculator.calculateSessionStats(solves)
      expect(result.bestAo5).toEqual({ status: 'unavailable' })
      expect(result.bestAo12).toEqual({ status: 'unavailable' })
    })

    it('returns the best AO5', () => {
      const solves = [
        createSolve(20_000),
        createSolve(20_000),
        createSolve(20_000),
        createSolve(20_000),
        createSolve(20_000),
        createSolve(10_000),
        createSolve(10_000),
        createSolve(10_000),
        createSolve(10_000),
        createSolve(10_000),
      ]
      const result = calculator.calculateSessionStats(solves)
      expect(result.bestAo5).toMatchObject({ status: 'value', value: 10_000 })
    })

    it('returns the best AO12', () => {
      const solves = [
        ...Array.from({ length: 12 }, () => createSolve(20_000)),
        ...Array.from({ length: 12 }, () => createSolve(10_000)),
      ]
      const result = calculator.calculateSessionStats(solves)
      expect(result.bestAo12).toMatchObject({ status: 'value', value: 10_000 })
    })
  })

  describe('AO5 rolling windows', () => {
    it('calculates each rolling AO5 independently', () => {
      const solves = [
        createSolve(10_000),
        createSolve(20_000),
        createSolve(30_000),
        createSolve(40_000),
        createSolve(50_000),
        createSolve(60_000),
      ]
      const result = calculator.calculateSolveStats(solves)
      expect(result[0].stats.ao5).toMatchObject({ status: 'value', value: 30_000 })
      expect(result[0].solve.id).toBe(solves[0].id)
      expect(result[1].stats.ao5).toMatchObject({ status: 'value', value: 40_000 })
    })
  })

  describe('completedAt', () => {
    it('uses the timestamp of the solve that completes the average', () => {
      const completionDate = new Date('2025-05-15T14:30:00.000Z')
      const solves = [
        createSolve(10_000, 'none', completionDate),
        createSolve(11_000),
        createSolve(12_000),
        createSolve(13_000),
        createSolve(14_000),
      ]
      const result = calculator.calculateSolveStats(solves)
      expect(result[0].stats.ao5).toEqual({ status: 'value', value: 12_000, completedAt: completionDate.toISOString() })
    })
  })
})
