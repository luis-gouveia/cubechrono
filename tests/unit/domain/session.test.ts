import { describe, expect, it } from 'vitest'
import { PUZZLE } from '../../../src/domain/puzzle'
import { Session } from '../../../src/domain/session'

const createSessionInput = () => ({
  name: 'Main Session',
  description: 'My 3x3 session',
  puzzle: PUZZLE.THREE_BY_THREE,
  position: 0,
})

describe('Session', () => {
  describe('create', () => {
    it('creates a session with valid properties', () => {
      const session = Session.create(createSessionInput())
      expect(session.name).toBe('Main Session')
      expect(session.description).toBe('My 3x3 session')
      expect(session.puzzle).toBe(PUZZLE.THREE_BY_THREE)
      expect(session.position).toBe(0)
    })

    it('generates an id', () => {
      const session = Session.create(createSessionInput())
      expect(session.id).toBeDefined()
      expect(typeof session.id).toBe('string')
      expect(session.id.length).toBeGreaterThan(0)
    })

    it('generates a creation date', () => {
      const before = new Date()
      const session = Session.create(createSessionInput())
      const after = new Date()
      expect(session.createdAt).toBeInstanceOf(Date)
      expect(session.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(session.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('allows description to be omitted', () => {
      const session = Session.create({
        name: 'Main Session',
        puzzle: PUZZLE.THREE_BY_THREE,
        position: 0,
      })
      expect(session.description).toBeUndefined()
    })
  })

  describe('from', () => {
    it('creates a session from existing entity properties', () => {
      const sessionProps = {
        id: crypto.randomUUID(),
        name: 'Imported Session',
        description: 'Existing session',
        puzzle: PUZZLE.THREE_BY_THREE,
        position: 2,
        createdAt: new Date('2025-01-15T12:00:00.000Z'),
      }
      const session = Session.from(sessionProps)
      expect(session.id).toBe(sessionProps.id)
      expect(session.name).toBe(sessionProps.name)
      expect(session.description).toBe(sessionProps.description)
      expect(session.puzzle).toBe(sessionProps.puzzle)
      expect(session.position).toBe(sessionProps.position)
      expect(session.createdAt).toBe(sessionProps.createdAt)
    })
  })

  describe('getters', () => {
    it('returns all session properties', () => {
      const sessionProps = {
        id: crypto.randomUUID(),
        name: 'Main Session',
        description: 'Description',
        puzzle: PUZZLE.THREE_BY_THREE,
        position: 3,
        createdAt: new Date('2025-01-15T12:00:00.000Z'),
      }
      const session = Session.from(sessionProps)
      expect(session.id).toBe(sessionProps.id)
      expect(session.name).toBe(sessionProps.name)
      expect(session.description).toBe(sessionProps.description)
      expect(session.puzzle).toBe(sessionProps.puzzle)
      expect(session.position).toBe(sessionProps.position)
      expect(session.createdAt).toBe(sessionProps.createdAt)
    })
  })

  describe('update', () => {
    it('updates the name', () => {
      const session = Session.create(createSessionInput())
      session.update({ name: 'Updated Session' })
      expect(session.name).toBe('Updated Session')
      expect(session.description).toBe('My 3x3 session')
      expect(session.puzzle).toBe(PUZZLE.THREE_BY_THREE)
      expect(session.position).toBe(0)
    })

    it('updates the description', () => {
      const session = Session.create(createSessionInput())
      session.update({ description: 'Updated description' })
      expect(session.description).toBe('Updated description')
    })

    it('updates the puzzle', () => {
      const session = Session.create(createSessionInput())
      session.update({ puzzle: PUZZLE.TWO_BY_TWO })
      expect(session.puzzle).toBe(PUZZLE.TWO_BY_TWO)
    })

    it('updates the position', () => {
      const session = Session.create(createSessionInput())
      session.update({ position: 5 })
      expect(session.position).toBe(5)
    })

    it('supports updating multiple properties', () => {
      const session = Session.create(createSessionInput())
      session.update({
        name: 'Updated',
        description: 'New description',
        position: 3,
      })
      expect(session.name).toBe('Updated')
      expect(session.description).toBe('New description')
      expect(session.position).toBe(3)
    })

    it('preserves properties that are not updated', () => {
      const session = Session.create(createSessionInput())
      session.update({ name: 'Updated' })
      expect(session.description).toBe('My 3x3 session')
      expect(session.puzzle).toBe(PUZZLE.THREE_BY_THREE)
      expect(session.position).toBe(0)
    })

    it('allows clearing the description', () => {
      const session = Session.create(createSessionInput())
      session.update({ description: undefined })
      expect(session.description).toBeUndefined()
    })
  })

  describe('validation', () => {
    it('rejects an empty name', () => {
      expect(() => Session.create({ ...createSessionInput(), name: '' })).toThrow()
    })

    it('rejects a name longer than 100 characters', () => {
      expect(() => Session.create({ ...createSessionInput(), name: 'a'.repeat(101) })).toThrow()
    })

    it('accepts a name with exactly 100 characters', () => {
      expect(() => Session.create({ ...createSessionInput(), name: 'a'.repeat(100) })).not.toThrow()
    })

    it('rejects a description longer than 255 characters', () => {
      expect(() =>
        Session.create({
          ...createSessionInput(),
          description: 'a'.repeat(256),
        }),
      ).toThrow()
    })

    it('accepts a description with exactly 255 characters', () => {
      expect(() => Session.create({ ...createSessionInput(), description: 'a'.repeat(255) })).not.toThrow()
    })

    it('rejects a negative position', () => {
      expect(() => Session.create({ ...createSessionInput(), position: -1 })).toThrow()
    })

    it('rejects a decimal position', () => {
      expect(() => Session.create({ ...createSessionInput(), position: 1.5 })).toThrow()
    })

    it('accepts position zero', () => {
      expect(() => Session.create({ ...createSessionInput(), position: 0 })).not.toThrow()
    })

    it('rejects an invalid puzzle', () => {
      expect(() => Session.create({ ...createSessionInput(), puzzle: 'invalid-puzzle' as never })).toThrow()
    })
  })

  describe('update validation', () => {
    it('rejects an invalid name', () => {
      const session = Session.create(createSessionInput())
      expect(() => session.update({ name: '' })).toThrow()
      expect(session.name).toBe('Main Session')
    })

    it('rejects an invalid position', () => {
      const session = Session.create(createSessionInput())
      expect(() => session.update({ position: -1 })).toThrow()
      expect(session.position).toBe(0)
    })

    it('rejects an invalid puzzle', () => {
      const session = Session.create(createSessionInput())
      expect(() => session.update({ puzzle: 'invalid-puzzle' as never })).toThrow()
      expect(session.puzzle).toBe(PUZZLE.THREE_BY_THREE)
    })
  })
})
