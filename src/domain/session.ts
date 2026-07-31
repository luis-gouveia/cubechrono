import { z } from 'zod'
import { puzzleSchema } from './puzzle'

export const sessionSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  puzzle: puzzleSchema,
  createdAt: z.date(),
})
export type SessionProps = z.infer<typeof sessionSchema>

export class Session {
  private readonly props: SessionProps

  constructor(input: SessionProps) {
    const validated = sessionSchema.parse(input)
    this.props = validated
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
