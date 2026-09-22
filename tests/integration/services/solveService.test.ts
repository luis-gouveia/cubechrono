import Database from 'better-sqlite3'
import { beforeEach, afterEach, describe, expect, it } from 'vitest'
import { SolveService } from '../../../electron/data/services/solveService'
import { SolveRepo } from '../../../electron/data/repos/solveRepo'
import { StatisticsCalculator } from '../../../electron/data/statistics/statisticsCalculator'
import { runMigrations } from '../../../electron/data/database/migrations'
import { sessionMapper, solveMapper } from '../../../electron/data/mappers'
import { SessionRepo } from '../../../electron/data/repos/sessionRepo'
import { Session } from '../../../src/domain/session'
import { PUZZLE } from '../../../src/domain/puzzle'

describe('SolveService', () => {
  let db: Database.Database
  let service: SolveService
  let sessionId: string
  let sessionRepo: SessionRepo

  beforeEach(() => {
    db = new Database(':memory:')
    db.pragma('foreign_keys = ON')
    runMigrations(db)
    const solveRepo = new SolveRepo(db, solveMapper)
    sessionRepo = new SessionRepo(db, sessionMapper)
    const statisticsCalculator = new StatisticsCalculator()
    const session = Session.create({ name: 'Test Session', puzzle: PUZZLE.THREE_BY_THREE, position: 0 })
    sessionRepo.save(session)
    sessionId = session.id
    service = new SolveService(solveRepo, solveMapper, statisticsCalculator)
  })

  afterEach(() => {
    db.close()
  })

  describe('getById', () => {
    it('returns a solve by id', () => {
      const created = service.create({
        sessionId,
        time: 12_500,
        penalty: 'none',
        scramble: "R U R' U'",
        puzzle: '3x3',
      })
      const result = service.getById(created.id)
      expect(result).toEqual(created)
    })

    it('throws when the solve does not exist', () => {
      expect(() => service.getById(crypto.randomUUID())).toThrow('Solve not found!')
    })
  })

  describe('getBySessionId', () => {
    it('returns solves belonging to the session', () => {
      const anotherSession = Session.create({ name: 'Another Session', puzzle: PUZZLE.THREE_BY_THREE, position: 1 })
      sessionRepo.save(anotherSession)
      const solve1 = service.create({
        sessionId,
        time: 10_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: '3x3',
      })
      const solve2 = service.create({
        sessionId,
        time: 12_000,
        penalty: '+2',
        scramble: 'F R U',
        puzzle: '3x3',
      })
      service.create({
        sessionId: anotherSession.id,
        time: 8_000,
        penalty: 'none',
        scramble: 'L U',
        puzzle: '3x3',
      })
      const result = service.getBySessionId(sessionId)
      expect(result).toHaveLength(2)
      expect(result.map((solve) => solve.id)).toEqual(expect.arrayContaining([solve1.id, solve2.id]))
      expect(result.every((solve) => solve.sessionId === sessionId)).toBe(true)
    })

    it('returns an empty array when the session has no solves', () => {
      const result = service.getBySessionId(crypto.randomUUID())
      expect(result).toEqual([])
    })

    it('includes statistics for each solve', () => {
      service.create({
        sessionId,
        time: 10_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: '3x3',
      })
      service.create({
        sessionId,
        time: 12_000,
        penalty: 'none',
        scramble: 'F R',
        puzzle: '3x3',
      })
      const result = service.getBySessionId(sessionId)
      expect(result).toHaveLength(2)
      for (const solve of result) {
        expect(solve).toHaveProperty('stats')
        expect(solve.stats).toHaveProperty('ao5')
        expect(solve.stats).toHaveProperty('ao12')
      }
    })
  })

  describe('create', () => {
    it('creates and persists a solve', () => {
      const result = service.create({
        sessionId,
        time: 15_250,
        penalty: 'none',
        scramble: "R U R' U'",
        puzzle: '3x3',
      })
      expect(result.id).toBeDefined()
      expect(result.sessionId).toBe(sessionId)
      expect(result.time).toBe(15_250)
      expect(result.penalty).toBe('none')
      expect(result.scramble).toBe("R U R' U'")
      expect(result.puzzle).toBe('3x3')
      const persisted = service.getById(result.id)
      expect(persisted).toEqual(result)
    })

    it('creates a solve with a +2 penalty', () => {
      const result = service.create({
        sessionId,
        time: 10_000,
        penalty: '+2',
        scramble: 'R U',
        puzzle: '3x3',
      })
      expect(result.penalty).toBe('+2')
    })

    it('creates a DNF solve', () => {
      const result = service.create({
        sessionId,
        time: 10_000,
        penalty: 'DNF',
        scramble: 'R U',
        puzzle: '3x3',
      })
      expect(result.penalty).toBe('DNF')
    })

    it('creates a solve with a comment', () => {
      const result = service.create({
        sessionId,
        time: 10_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: '3x3',
        comment: 'Bad cross',
      })
      expect(result.comment).toBe('Bad cross')
    })
  })

  describe('update', () => {
    it('updates a solve', () => {
      const created = service.create({
        sessionId,
        time: 10_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: '3x3',
      })
      const result = service.update({
        id: created.id,
        penalty: '+2',
        comment: 'Missed last pair',
      })
      expect(result.id).toBe(created.id)
      expect(result.time).toBe(created.time)
      expect(result.scramble).toBe(created.scramble)
      expect(result.puzzle).toBe(created.puzzle)
      expect(result.penalty).toBe('+2')
      expect(result.comment).toBe('Missed last pair')
    })

    it('persists the updated solve', () => {
      const created = service.create({
        sessionId,
        time: 10_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: '3x3',
      })
      service.update({
        id: created.id,
        penalty: '+2',
      })
      const persisted = service.getById(created.id)
      expect(persisted.penalty).toBe('+2')
    })

    it('can clear a comment', () => {
      const created = service.create({
        sessionId,
        time: 10_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: '3x3',
        comment: 'Something went wrong',
      })
      const result = service.update({ id: created.id, comment: undefined })
      expect(result.comment).toBeUndefined()
      const persisted = service.getById(created.id)
      expect(persisted.comment).toBeUndefined()
    })

    it('throws when the solve does not exist', () => {
      expect(() => service.update({ id: crypto.randomUUID(), penalty: '+2' })).toThrow('Solve not found!')
    })
  })

  describe('delete', () => {
    it('deletes a solve', () => {
      const created = service.create({
        sessionId,
        time: 10_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: '3x3',
      })
      service.delete(created.id)
      expect(() => service.getById(created.id)).toThrow('Solve not found!')
    })

    it('only deletes the specified solve', () => {
      const solve1 = service.create({
        sessionId,
        time: 10_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: '3x3',
      })
      const solve2 = service.create({
        sessionId,
        time: 11_000,
        penalty: 'none',
        scramble: 'F R',
        puzzle: '3x3',
      })
      service.delete(solve1.id)
      expect(() => service.getById(solve1.id)).toThrow('Solve not found!')
      expect(service.getById(solve2.id)).toEqual(solve2)
    })
  })

  describe('getPuzzleStats', () => {
    it('returns statistics for the requested puzzle', () => {
      service.create({
        sessionId,
        time: 10_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: '3x3',
      })
      service.create({
        sessionId,
        time: 12_000,
        penalty: '+2',
        scramble: 'F R',
        puzzle: '3x3',
      })
      service.create({
        sessionId,
        time: 8_000,
        penalty: 'none',
        scramble: 'L U',
        puzzle: '2x2',
      })
      const result = service.getPuzzleStats('3x3')
      expect(result.solves.total).toBe(2)
      expect(result.solves.completed).toBe(2)
      expect(result.solves.plusTwo).toBe(1)
      expect(result.solves.dnf).toBe(0)
    })

    it('does not include solves from another puzzle', () => {
      service.create({
        sessionId,
        time: 10_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: '3x3',
      })
      service.create({
        sessionId,
        time: 8_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: '2x2',
      })
      const result = service.getPuzzleStats('3x3')
      expect(result.solves.total).toBe(1)
      expect(result.mean).toBe(10_000)
      expect(result.best?.value).toBe(10_000)
    })

    it('returns empty statistics when there are no solves', () => {
      const result = service.getPuzzleStats('3x3')
      expect(result.solves.total).toBe(0)
      expect(result.solves.completed).toBe(0)
      expect(result.solves.plusTwo).toBe(0)
      expect(result.solves.dnf).toBe(0)
      expect(result.mean).toBeUndefined()
      expect(result.current).toBeUndefined()
      expect(result.best).toBeUndefined()
      expect(result.ao5).toEqual({ status: 'unavailable' })
      expect(result.ao12).toEqual({ status: 'unavailable' })
    })
  })
})
