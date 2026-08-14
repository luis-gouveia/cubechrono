import { z } from 'zod'
import { puzzleSchema } from './puzzle'
import { Entity, EntityProps } from './common/entity'

export const sessionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  puzzle: puzzleSchema,
})
export type CreateSessionProps = z.infer<typeof sessionSchema>
export type SessionProps = EntityProps & CreateSessionProps

export class Session extends Entity<SessionProps, typeof sessionSchema.shape> {
  private constructor(props: SessionProps | CreateSessionProps) {
    super(props, sessionSchema)
  }

  static create(input: CreateSessionProps) {
    return new Session(input)
  }

  static from(input: SessionProps) {
    return new Session(input)
  }

  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get puzzle() {
    return this.props.puzzle
  }

  get createdAt() {
    return this.props.createdAt
  }
}
