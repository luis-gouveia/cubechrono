import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import Database from 'better-sqlite3'
import { Session } from '../../../src/domain/session'
import { SessionRepo } from '../../../electron/data/repos/sessionRepo'
import { sessionMapper } from '../../../electron/data/mappers'
import { createTestDatabase } from '../helpers/createTestDatabase'

const createSession = (name: string, position: number) => {
  return Session.create({ name, puzzle: '3x3', position })
}

describe('SessionRepo', () => {
  let db: Database.Database
  let repo: SessionRepo

  beforeEach(() => {
    db = createTestDatabase()
    repo = new SessionRepo(db, sessionMapper)
  })

  afterEach(() => {
    db.close()
  })

  describe('getById', () => {
    it('returns a session by id', () => {
      const session = createSession('Session 1', 0)
      repo.save(session)
      const result = repo.getById(session.id)
      expect(result).toBeDefined()
      expect(result?.id).toBe(session.id)
      expect(result?.name).toBe('Session 1')
      expect(result?.position).toBe(0)
    })

    it('returns undefined when the session does not exist', () => {
      const result = repo.getById(crypto.randomUUID())
      expect(result).toBeUndefined()
    })
  })

  describe('getAll', () => {
    it('returns all sessions ordered by position', () => {
      const session1 = createSession('Session 1', 0)
      const session2 = createSession('Session 2', 1)
      const session3 = createSession('Session 3', 2)
      repo.save(session3)
      repo.save(session1)
      repo.save(session2)
      const result = repo.getAll()
      expect(result.map((session) => session.id)).toEqual([session1.id, session2.id, session3.id])
    })

    it('returns an empty array when there are no sessions', () => {
      expect(repo.getAll()).toEqual([])
    })
  })

  describe('save', () => {
    it('inserts a new session', () => {
      const session = createSession('Session 1', 0)
      repo.save(session)
      const result = repo.getById(session.id)
      expect(result?.name).toBe('Session 1')
    })

    it('updates an existing session', () => {
      const session = createSession('Session 1', 0)
      repo.save(session)
      session.update({ name: 'Updated Session', description: 'Updated description' })
      repo.save(session)
      const result = repo.getById(session.id)
      expect(result?.name).toBe('Updated Session')
      expect(result?.description).toBe('Updated description')
    })

    it('does not create a duplicate when saving an existing session', () => {
      const session = createSession('Session 1', 0)
      repo.save(session)
      repo.save(session)
      expect(repo.getAll()).toHaveLength(1)
    })
  })

  describe('delete', () => {
    it('deletes a session', () => {
      const session1 = createSession('Session 1', 0)
      const session2 = createSession('Session 2', 1)
      repo.save(session1)
      repo.save(session2)
      repo.delete(session1)
      expect(repo.getById(session1.id)).toBeUndefined()
      expect(repo.getAll()).toHaveLength(1)
    })

    it('reorders remaining sessions after deletion', () => {
      const session1 = createSession('Session 1', 0)
      const session2 = createSession('Session 2', 1)
      const session3 = createSession('Session 3', 2)
      repo.save(session1)
      repo.save(session2)
      repo.save(session3)
      repo.delete(session2)
      const sessions = repo.getAll()
      expect(sessions).toHaveLength(2)
      expect(sessions.map((session) => session.name)).toEqual(['Session 1', 'Session 3'])
      expect(sessions.map((session) => session.position)).toEqual([0, 1])
    })
  })

  describe('move', () => {
    it('moves a session up', () => {
      const session1 = createSession('Session 1', 0)
      const session2 = createSession('Session 2', 1)
      const session3 = createSession('Session 3', 2)
      repo.save(session1)
      repo.save(session2)
      repo.save(session3)
      repo.move(session3, 0)
      const sessions = repo.getAll()
      expect(sessions.map((session) => session.name)).toEqual(['Session 3', 'Session 1', 'Session 2'])
      expect(sessions.map((session) => session.position)).toEqual([0, 1, 2])
    })

    it('moves a session down', () => {
      const session1 = createSession('Session 1', 0)
      const session2 = createSession('Session 2', 1)
      const session3 = createSession('Session 3', 2)
      repo.save(session1)
      repo.save(session2)
      repo.save(session3)
      repo.move(session1, 2)
      const sessions = repo.getAll()
      expect(sessions.map((session) => session.name)).toEqual(['Session 2', 'Session 3', 'Session 1'])
      expect(sessions.map((session) => session.position)).toEqual([0, 1, 2])
    })

    it('does nothing when moving to the same position', () => {
      const session1 = createSession('Session 1', 0)
      const session2 = createSession('Session 2', 1)
      repo.save(session1)
      repo.save(session2)
      repo.move(session1, 0)
      const sessions = repo.getAll()
      expect(sessions.map((session) => session.name)).toEqual(['Session 1', 'Session 2'])
    })
  })
})
