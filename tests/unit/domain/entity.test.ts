import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { Entity, entitySchema } from '../../../src/domain/common/entity'

const testEntitySchema = z.object({ name: z.string().min(1) })
type TestEntityProps = z.infer<typeof testEntitySchema> & z.infer<typeof entitySchema>
class TestEntity extends Entity<TestEntityProps, typeof testEntitySchema.shape> {
  constructor(input: TestEntityProps | z.infer<typeof testEntitySchema>) {
    super(input, testEntitySchema)
  }
  get id() {
    return this.props.id
  }
  get createdAt() {
    return this.props.createdAt
  }
  get name() {
    return this.props.name
  }
}

describe('entitySchema', () => {
  it('accepts a valid entity', () => {
    const props = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    expect(entitySchema.parse(props)).toEqual(props)
  })

  it('rejects an invalid id', () => {
    expect(() => entitySchema.parse({ id: 'invalid-id', createdAt: new Date() })).toThrow()
  })

  it('rejects an invalid createdAt', () => {
    expect(() => entitySchema.parse({ id: crypto.randomUUID(), createdAt: '2025-01-01' })).toThrow()
  })
})

describe('Entity', () => {
  it('generates an id when creating a new entity', () => {
    const entity = new TestEntity({ name: 'Test' })
    expect(entity.id).toBeDefined()
    expect(typeof entity.id).toBe('string')
    expect(entity.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('generates createdAt when creating a new entity', () => {
    const before = new Date()
    const entity = new TestEntity({ name: 'Test' })
    const after = new Date()
    expect(entity.createdAt).toBeInstanceOf(Date)
    expect(entity.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(entity.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
  })

  it('preserves the input properties', () => {
    const entity = new TestEntity({ name: 'Test' })
    expect(entity.name).toBe('Test')
  })

  it('preserves an existing id', () => {
    const id = crypto.randomUUID()
    const entity = new TestEntity({
      id,
      name: 'Test',
      createdAt: new Date(),
    })
    expect(entity.id).toBe(id)
  })

  it('preserves an existing createdAt', () => {
    const createdAt = new Date('2025-01-15T12:00:00.000Z')
    const entity = new TestEntity({
      id: crypto.randomUUID(),
      createdAt,
      name: 'Test',
    })
    expect(entity.createdAt).toBe(createdAt)
  })

  it('validates the entity-specific properties', () => {
    expect(() => new TestEntity({ name: '' })).toThrow()
  })

  it('validates the entity id', () => {
    expect(() => new TestEntity({ id: 'invalid-id', createdAt: new Date(), name: 'Test' })).toThrow()
  })

  it('validates the entity createdAt', () => {
    expect(
      () => new TestEntity({ id: crypto.randomUUID(), createdAt: 'invalid-date' as unknown as Date, name: 'Test' }),
    ).toThrow()
  })

  it('does not mutate the supplied input object', () => {
    const input = { name: 'Test' }
    new TestEntity(input)
    expect(input).toEqual({ name: 'Test' })
  })
})
