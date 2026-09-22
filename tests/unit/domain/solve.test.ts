import { describe, expect, it } from 'vitest'
import { Solve } from '../../../src/domain/solve'
import { PUZZLE } from '../../../src/domain/puzzle'

const createSolveInput = () => ({
  sessionId: crypto.randomUUID(),
  time: 12_340,
  penalty: 'none' as const,
  scramble: "R U R' U'",
  puzzle: PUZZLE.THREE_BY_THREE,
  comment: 'Good solve',
})

describe('Solve', () => {
  describe('create', () => {
    it('creates a solve with valid properties', () => {
      const input = createSolveInput()
      const solve = Solve.create(input)
      expect(solve.sessionId).toBe(input.sessionId)
      expect(solve.time).toBe(12_340)
      expect(solve.penalty).toBe('none')
      expect(solve.scramble).toBe("R U R' U'")
      expect(solve.puzzle).toBe(PUZZLE.THREE_BY_THREE)
      expect(solve.comment).toBe('Good solve')
    })

    it('generates an id', () => {
      const solve = Solve.create(createSolveInput())
      expect(solve.id).toBeDefined()
      expect(typeof solve.id).toBe('string')
      expect(solve.id.length).toBeGreaterThan(0)
    })

    it('generates a creation date', () => {
      const before = new Date()
      const solve = Solve.create(createSolveInput())
      const after = new Date()
      expect(solve.createdAt).toBeInstanceOf(Date)
      expect(solve.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(solve.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('allows comment to be omitted', () => {
      const input = createSolveInput()
      const solve = Solve.create({ ...input, comment: undefined })
      expect(solve.comment).toBeUndefined()
    })
  })

  describe('from', () => {
    it('creates a solve from existing entity properties', () => {
      const id = crypto.randomUUID()
      const sessionId = crypto.randomUUID()
      const createdAt = new Date('2025-01-15T12:00:00.000Z')
      const solve = Solve.from({
        id,
        sessionId,
        time: 15_230,
        penalty: '+2',
        scramble: "R U R' U'",
        puzzle: PUZZLE.THREE_BY_THREE,
        comment: 'Existing solve',
        createdAt,
      })
      expect(solve.id).toBe(id)
      expect(solve.sessionId).toBe(sessionId)
      expect(solve.time).toBe(15_230)
      expect(solve.penalty).toBe('+2')
      expect(solve.scramble).toBe("R U R' U'")
      expect(solve.puzzle).toBe(PUZZLE.THREE_BY_THREE)
      expect(solve.comment).toBe('Existing solve')
      expect(solve.createdAt).toBe(createdAt)
    })
  })

  describe('getters', () => {
    it('returns all solve properties', () => {
      const id = crypto.randomUUID()
      const sessionId = crypto.randomUUID()
      const createdAt = new Date()
      const solve = Solve.from({
        id,
        sessionId,
        time: 10_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: PUZZLE.THREE_BY_THREE,
        comment: 'Test',
        createdAt,
      })
      expect(solve.id).toBe(id)
      expect(solve.sessionId).toBe(sessionId)
      expect(solve.time).toBe(10_000)
      expect(solve.penalty).toBe('none')
      expect(solve.scramble).toBe('R U')
      expect(solve.puzzle).toBe(PUZZLE.THREE_BY_THREE)
      expect(solve.comment).toBe('Test')
      expect(solve.createdAt).toBe(createdAt)
    })
  })

  describe('effectiveTime', () => {
    it('returns the original time for a normal solve', () => {
      const solve = Solve.create({ ...createSolveInput(), time: 12_345, penalty: 'none' })
      expect(solve.effectiveTime).toBe(12_345)
    })

    it('adds 2000ms for a +2 penalty', () => {
      const solve = Solve.create({ ...createSolveInput(), time: 12_345, penalty: '+2' })
      expect(solve.effectiveTime).toBe(14_345)
    })

    it('returns undefined for a DNF', () => {
      const solve = Solve.create({ ...createSolveInput(), time: 12_345, penalty: 'DNF' })
      expect(solve.effectiveTime).toBeUndefined()
    })

    it('handles a zero time', () => {
      expect(() => Solve.create({ ...createSolveInput(), time: 0 })).toThrow()
    })
  })

  describe('update', () => {
    it('updates the penalty', () => {
      const solve = Solve.create(createSolveInput())
      solve.update({ penalty: '+2' })
      expect(solve.penalty).toBe('+2')
      expect(solve.effectiveTime).toBe(14_340)
    })

    it('updates the comment', () => {
      const solve = Solve.create(createSolveInput())
      solve.update({ comment: 'Updated comment' })
      expect(solve.comment).toBe('Updated comment')
    })

    it('updates both penalty and comment', () => {
      const solve = Solve.create(createSolveInput())
      solve.update({ penalty: 'DNF', comment: 'DNF solve' })
      expect(solve.penalty).toBe('DNF')
      expect(solve.comment).toBe('DNF solve')
      expect(solve.effectiveTime).toBeUndefined()
    })

    it('preserves properties that are not updated', () => {
      const input = createSolveInput()
      const solve = Solve.create(input)
      solve.update({ penalty: '+2' })
      expect(solve.sessionId).toBe(input.sessionId)
      expect(solve.time).toBe(12_340)
      expect(solve.scramble).toBe("R U R' U'")
      expect(solve.puzzle).toBe(PUZZLE.THREE_BY_THREE)
      expect(solve.comment).toBe('Good solve')
    })

    it('allows clearing the comment', () => {
      const solve = Solve.create(createSolveInput())
      solve.update({ comment: undefined })
      expect(solve.comment).toBeUndefined()
    })

    it('does not partially update when validation fails', () => {
      const solve = Solve.create(createSolveInput())
      expect(() => solve.update({ penalty: 'invalid' as never, comment: 'New comment' })).toThrow()
      expect(solve.penalty).toBe('none')
      expect(solve.comment).toBe('Good solve')
    })
  })

  describe('validation', () => {
    it('rejects an invalid session id', () => {
      expect(() => Solve.create({ ...createSolveInput(), sessionId: 'invalid-id' })).toThrow()
    })

    it('rejects a zero time', () => {
      expect(() => Solve.create({ ...createSolveInput(), time: 0 })).toThrow()
    })

    it('rejects a negative time', () => {
      expect(() => Solve.create({ ...createSolveInput(), time: -1 })).toThrow()
    })

    it('rejects an invalid penalty', () => {
      expect(() => Solve.create({ ...createSolveInput(), penalty: 'invalid' as never })).toThrow()
    })

    it('accepts all valid penalties', () => {
      expect(() => Solve.create({ ...createSolveInput(), penalty: 'none' })).not.toThrow()

      expect(() => Solve.create({ ...createSolveInput(), penalty: '+2' })).not.toThrow()

      expect(() => Solve.create({ ...createSolveInput(), penalty: 'DNF' })).not.toThrow()
    })

    it('rejects an empty scramble', () => {
      expect(() => Solve.create({ ...createSolveInput(), scramble: '' })).toThrow()
    })

    it('rejects a scramble longer than 500 characters', () => {
      expect(() => Solve.create({ ...createSolveInput(), scramble: 'R'.repeat(501) })).toThrow()
    })

    it('accepts a scramble with exactly 500 characters', () => {
      expect(() => Solve.create({ ...createSolveInput(), scramble: 'R'.repeat(500) })).not.toThrow()
    })

    it('rejects a comment longer than 255 characters', () => {
      expect(() => Solve.create({ ...createSolveInput(), comment: 'a'.repeat(256) })).toThrow()
    })

    it('accepts a comment with exactly 255 characters', () => {
      expect(() => Solve.create({ ...createSolveInput(), comment: 'a'.repeat(255) })).not.toThrow()
    })

    it('rejects an invalid puzzle', () => {
      expect(() => Solve.create({ ...createSolveInput(), puzzle: 'invalid-puzzle' as never })).toThrow()
    })
  })

  describe('update validation', () => {
    it('rejects an invalid penalty', () => {
      const solve = Solve.create(createSolveInput())
      expect(() => solve.update({ penalty: 'invalid' as never })).toThrow()
      expect(solve.penalty).toBe('none')
    })

    it('rejects a comment longer than 255 characters', () => {
      const solve = Solve.create(createSolveInput())
      expect(() => solve.update({ comment: 'a'.repeat(256) })).toThrow()
      expect(solve.comment).toBe('Good solve')
    })
  })
})
