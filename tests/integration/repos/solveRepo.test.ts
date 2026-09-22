import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import Database from 'better-sqlite3'
import { Solve } from '../../../src/domain/solve'
import { Session } from '../../../src/domain/session'
import { SolveRepo } from '../../../electron/data/repos/solveRepo'
import { SessionRepo } from '../../../electron/data/repos/sessionRepo'
import { solveMapper, sessionMapper } from '../../../electron/data/mappers'
import { createTestDatabase } from '../helpers/createTestDatabase'

const createSession = (position = 0) => Session.create({ name: 'Session 1', puzzle: '3x3', position })

const createSolve = (sessionId: string, time = 10_000, createdAt?: Date) =>
  Solve.from({
    id: crypto.randomUUID(),
    sessionId,
    time,
    penalty: 'none',
    scramble: "R U R' U'",
    puzzle: '3x3',
    comment: undefined,
    createdAt: createdAt ?? new Date(),
  })

describe('SolveRepo', () => {
  let db: Database.Database
  let repo: SolveRepo
  let sessionRepo: SessionRepo
  let session: Session

  beforeEach(() => {
    db = createTestDatabase()
    repo = new SolveRepo(db, solveMapper)
    sessionRepo = new SessionRepo(db, sessionMapper)
    session = createSession()
    sessionRepo.save(session)
  })

  afterEach(() => {
    db.close()
  })

  describe('getById', () => {
    it('returns a solve by id', () => {
      const solve = createSolve(session.id)
      repo.save(solve)
      const result = repo.getById(solve.id)
      expect(result).toBeDefined()
      expect(result?.id).toBe(solve.id)
      expect(result?.sessionId).toBe(session.id)
      expect(result?.time).toBe(10_000)
    })

    it('returns undefined when solve does not exist', () => {
      expect(repo.getById(crypto.randomUUID())).toBeUndefined()
    })
  })

  describe('getAll', () => {
    it('returns solves ordered by createdAt descending', () => {
      const solve1 = createSolve(session.id, 10_000, new Date('2025-01-01T10:00:00Z'))
      const solve2 = createSolve(session.id, 11_000, new Date('2025-01-01T11:00:00Z'))
      const solve3 = createSolve(session.id, 12_000, new Date('2025-01-01T12:00:00Z'))
      repo.save(solve1)
      repo.save(solve2)
      repo.save(solve3)
      const result = repo.getAll()
      expect(result.map((solve) => solve.id)).toEqual([solve3.id, solve2.id, solve1.id])
    })
  })

  describe('getBySessionId', () => {
    it('returns only solves belonging to the session', () => {
      const session2 = createSession(1)
      sessionRepo.save(session2)
      const solve1 = createSolve(session.id)
      const solve2 = createSolve(session2.id)
      repo.save(solve1)
      repo.save(solve2)
      const result = repo.getBySessionId(session.id)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(solve1.id)
    })

    it('returns solves ordered newest first', () => {
      const solve1 = createSolve(session.id, 10_000, new Date('2025-01-01T10:00:00Z'))
      const solve2 = createSolve(session.id, 11_000, new Date('2025-01-01T11:00:00Z'))
      repo.save(solve1)
      repo.save(solve2)
      const result = repo.getBySessionId(session.id)
      expect(result.map((solve) => solve.id)).toEqual([solve2.id, solve1.id])
    })

    it('returns an empty array when the session has no solves', () => {
      expect(repo.getBySessionId(session.id)).toEqual([])
    })
  })

  describe('save', () => {
    it('inserts a solve', () => {
      const solve = createSolve(session.id)
      repo.save(solve)
      expect(repo.getById(solve.id)).toBeDefined()
    })

    it('updates an existing solve', () => {
      const solve = createSolve(session.id)
      repo.save(solve)
      solve.update({ penalty: '+2', comment: 'Updated' })
      repo.save(solve)
      const result = repo.getById(solve.id)
      expect(result?.penalty).toBe('+2')
      expect(result?.comment).toBe('Updated')
    })
  })

  describe('delete', () => {
    it('deletes a solve', () => {
      const solve = createSolve(session.id)
      repo.save(solve)
      repo.delete(solve.id)
      expect(repo.getById(solve.id)).toBeUndefined()
    })
  })

  describe('deleteBySessionId', () => {
    it('deletes all solves belonging to a session', () => {
      const solve1 = createSolve(session.id)
      const solve2 = createSolve(session.id)
      repo.save(solve1)
      repo.save(solve2)
      repo.deleteBySessionId(session.id)
      expect(repo.getBySessionId(session.id)).toEqual([])
    })

    it('does not delete solves from other sessions', () => {
      const session2 = createSession(1)
      sessionRepo.save(session2)
      const solve1 = createSolve(session.id)
      const solve2 = createSolve(session2.id)
      repo.save(solve1)
      repo.save(solve2)
      repo.deleteBySessionId(session.id)
      expect(repo.getById(solve1.id)).toBeUndefined()
      expect(repo.getById(solve2.id)).toBeDefined()
    })
  })

  describe('getByPuzzle', () => {
    it('returns solves matching the puzzle', () => {
      const solve1 = createSolve(session.id)
      const solve2 = Solve.from({
        ...solve1,
        id: crypto.randomUUID(),
        puzzle: '2x2',
        createdAt: solve1.createdAt,
        penalty: 'none',
        scramble: solve1.scramble,
        sessionId: solve1.sessionId,
        time: solve1.time,
      })
      repo.save(solve1)
      repo.save(solve2)
      const result = repo.getByPuzzle('3x3')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(solve1.id)
    })

    it('orders results by createdAt ascending', () => {
      const solve1 = createSolve(session.id, 10_000, new Date('2025-01-01T11:00:00Z'))
      const solve2 = createSolve(session.id, 11_000, new Date('2025-01-01T10:00:00Z'))
      repo.save(solve1)
      repo.save(solve2)
      const result = repo.getByPuzzle('3x3')
      expect(result.map((solve) => solve.id)).toEqual([solve2.id, solve1.id])
    })
  })
})
