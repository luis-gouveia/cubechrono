import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import Database from 'better-sqlite3'
import { SessionService } from '../../../electron/data/services/sessionService'
import { SessionRepo } from '../../../electron/data/repos/sessionRepo'
import { SolveRepo } from '../../../electron/data/repos/solveRepo'
import { sessionMapper, solveMapper } from '../../../electron/data/mappers'
import { StatisticsCalculator } from '../../../electron/data/statistics/statisticsCalculator'
import { Session } from '../../../src/domain/session'
import { Solve } from '../../../src/domain/solve'
import { createTestDatabase } from '../helpers/createTestDatabase'

describe('SessionService', () => {
  let db: Database.Database
  let sessionRepo: SessionRepo
  let solveRepo: SolveRepo
  let service: SessionService

  beforeEach(() => {
    db = createTestDatabase()
    sessionRepo = new SessionRepo(db, sessionMapper)
    solveRepo = new SolveRepo(db, solveMapper)
    const statisticsCalculator = new StatisticsCalculator()
    service = new SessionService(sessionRepo, solveRepo, sessionMapper, statisticsCalculator)
  })

  afterEach(() => {
    db.close()
  })

  describe('getById', () => {
    it('returns a session DTO', () => {
      const session = Session.create({
        name: 'Session 1',
        puzzle: '3x3',
        position: 0,
      })
      sessionRepo.save(session)
      const result = service.getById(session.id)
      expect(result.id).toBe(session.id)
      expect(result.name).toBe('Session 1')
      expect(result.puzzle).toBe('3x3')
      expect(result.position).toBe(0)
    })

    it('includes session statistics', () => {
      const session = Session.create({
        name: 'Session 1',
        puzzle: '3x3',
        position: 0,
      })
      sessionRepo.save(session)
      const solve = Solve.create({
        sessionId: session.id,
        time: 10_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: '3x3',
      })
      solveRepo.save(solve)
      const result = service.getById(session.id)
      expect(result.stats).toBeDefined()
      expect(result.stats?.solves.total).toBe(1)
      expect(result.stats?.solves.completed).toBe(1)
      expect(result.stats?.current).toBe(10_000)
      expect(result.stats?.mean).toBe(10_000)
    })

    it('throws when the session does not exist', () => {
      expect(() => service.getById(crypto.randomUUID())).toThrow('Session not found!')
    })
  })

  describe('getAll', () => {
    it('returns all sessions', () => {
      const session1 = Session.create({
        name: 'Session 1',
        puzzle: '3x3',
        position: 0,
      })
      const session2 = Session.create({
        name: 'Session 2',
        puzzle: '2x2',
        position: 1,
      })
      sessionRepo.save(session1)
      sessionRepo.save(session2)
      const result = service.getAll()
      expect(result).toHaveLength(2)
      expect(result.map((session) => session.name)).toEqual(['Session 1', 'Session 2'])
    })

    it('includes statistics for every session', () => {
      const session1 = Session.create({
        name: 'Session 1',
        puzzle: '3x3',
        position: 0,
      })
      const session2 = Session.create({
        name: 'Session 2',
        puzzle: '2x2',
        position: 1,
      })
      sessionRepo.save(session1)
      sessionRepo.save(session2)
      solveRepo.save(
        Solve.create({
          sessionId: session1.id,
          time: 10_000,
          penalty: 'none',
          scramble: 'R U',
          puzzle: '3x3',
        }),
      )
      const result = service.getAll()
      expect(result[0].stats?.solves.total).toBe(1)
      expect(result[1].stats?.solves.total).toBe(0)
    })
  })

  describe('create', () => {
    it('creates the first session at position 0', () => {
      const result = service.create({
        name: 'Session 1',
        puzzle: '3x3',
      })
      expect(result.name).toBe('Session 1')
      expect(result.position).toBe(0)
    })

    it('assigns the next position automatically', () => {
      service.create({
        name: 'Session 1',
        puzzle: '3x3',
      })
      const result = service.create({
        name: 'Session 2',
        puzzle: '3x3',
      })
      expect(result.position).toBe(1)
    })

    it('persists the created session', () => {
      const result = service.create({
        name: 'Session 1',
        description: 'Test session',
        puzzle: '3x3',
      })
      const stored = sessionRepo.getById(result.id)
      expect(stored?.name).toBe('Session 1')
      expect(stored?.description).toBe('Test session')
    })
  })

  describe('update', () => {
    it('updates session fields', () => {
      const session = Session.create({
        name: 'Session 1',
        puzzle: '3x3',
        position: 0,
      })
      sessionRepo.save(session)
      const result = service.update({
        id: session.id,
        name: 'Updated Session',
        description: 'Updated',
        puzzle: '2x2',
      })
      expect(result.name).toBe('Updated Session')
      expect(result.description).toBe('Updated')
      expect(result.puzzle).toBe('2x2')
    })

    it('throws when updating a missing session', () => {
      expect(() => service.update({ id: crypto.randomUUID(), name: 'Updated' })).toThrow('Session not found!')
    })

    it('moves a session when position changes', () => {
      const session1 = Session.create({
        name: 'Session 1',
        puzzle: '3x3',
        position: 0,
      })
      const session2 = Session.create({
        name: 'Session 2',
        puzzle: '3x3',
        position: 1,
      })
      const session3 = Session.create({
        name: 'Session 3',
        puzzle: '3x3',
        position: 2,
      })
      sessionRepo.save(session1)
      sessionRepo.save(session2)
      sessionRepo.save(session3)
      service.update({
        id: session3.id,
        position: 0,
      })
      const sessions = sessionRepo.getAll()
      expect(sessions.map((session) => session.name)).toEqual(['Session 3', 'Session 1', 'Session 2'])
      expect(sessions.map((session) => session.position)).toEqual([0, 1, 2])
    })
  })

  describe('delete', () => {
    it('deletes a session', () => {
      const session1 = Session.create({
        name: 'Session 1',
        puzzle: '3x3',
        position: 0,
      })
      const session2 = Session.create({
        name: 'Session 2',
        puzzle: '3x3',
        position: 1,
      })
      sessionRepo.save(session1)
      sessionRepo.save(session2)
      service.delete(session1.id)
      expect(sessionRepo.getById(session1.id)).toBeUndefined()
    })

    it('reorders remaining sessions after deletion', () => {
      const session1 = Session.create({
        name: 'Session 1',
        puzzle: '3x3',
        position: 0,
      })
      const session2 = Session.create({
        name: 'Session 2',
        puzzle: '3x3',
        position: 1,
      })
      const session3 = Session.create({
        name: 'Session 3',
        puzzle: '3x3',
        position: 2,
      })
      sessionRepo.save(session1)
      sessionRepo.save(session2)
      sessionRepo.save(session3)
      service.delete(session2.id)
      const sessions = sessionRepo.getAll()
      expect(sessions.map((session) => session.name)).toEqual(['Session 1', 'Session 3'])
      expect(sessions.map((session) => session.position)).toEqual([0, 1])
    })

    it('prevents deleting the last session', () => {
      const session = Session.create({
        name: 'Session 1',
        puzzle: '3x3',
        position: 0,
      })
      sessionRepo.save(session)
      expect(() => service.delete(session.id)).toThrow('You have to have at least one session!')
      expect(sessionRepo.getById(session.id)).toBeDefined()
    })

    it('throws when deleting a missing session', () => {
      expect(() => service.delete(crypto.randomUUID())).toThrow('Session not found!')
    })
  })

  describe('clear', () => {
    it('deletes all solves from a session', () => {
      const session = Session.create({
        name: 'Session 1',
        puzzle: '3x3',
        position: 0,
      })
      sessionRepo.save(session)
      solveRepo.save(
        Solve.create({
          sessionId: session.id,
          time: 10_000,
          penalty: 'none',
          scramble: 'R U',
          puzzle: '3x3',
        }),
      )
      solveRepo.save(
        Solve.create({
          sessionId: session.id,
          time: 11_000,
          penalty: 'none',
          scramble: 'R U',
          puzzle: '3x3',
        }),
      )
      service.clear(session.id)
      expect(solveRepo.getBySessionId(session.id)).toEqual([])
    })

    it('does not delete solves from another session', () => {
      const session1 = Session.create({
        name: 'Session 1',
        puzzle: '3x3',
        position: 0,
      })
      const session2 = Session.create({
        name: 'Session 2',
        puzzle: '3x3',
        position: 1,
      })
      sessionRepo.save(session1)
      sessionRepo.save(session2)
      const solve = Solve.create({
        sessionId: session2.id,
        time: 10_000,
        penalty: 'none',
        scramble: 'R U',
        puzzle: '3x3',
      })
      solveRepo.save(solve)
      service.clear(session1.id)
      expect(solveRepo.getBySessionId(session2.id)).toHaveLength(1)
    })

    it('throws when clearing a missing session', () => {
      expect(() => service.clear(crypto.randomUUID())).toThrow('Session not found!')
    })
  })
})
