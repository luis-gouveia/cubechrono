import { z } from 'zod'
import { Entity, EntityProps } from './common/entity'
import { puzzleSchema } from './puzzle'

const SOLVE_PENALTY = ['none', '+2', 'DNF'] as const

export const createSolveSchema = z.object({
  time: z.number().positive(),
  penalty: z.enum(SOLVE_PENALTY),
  scramble: z.string().min(1).max(500),
  puzzle: puzzleSchema,
  comment: z.string().max(255).optional(),
})
export type CreateSolveProps = z.infer<typeof createSolveSchema>
export type SolveProps = EntityProps & CreateSolveProps

export class Solve extends Entity<SolveProps, typeof createSolveSchema.shape> {
  private constructor(input: SolveProps | CreateSolveProps) {
    super(input, createSolveSchema)
  }

  static create(input: CreateSolveProps) {
    return new Solve(input)
  }

  static from(input: SolveProps) {
    return new Solve(input)
  }

  get id() {
    return this.props.id
  }

  get time() {
    return this.props.time
  }

  get penalty() {
    return this.props.penalty
  }

  get scramble() {
    return this.props.scramble
  }

  get puzzle() {
    return this.props.puzzle
  }

  get comment() {
    return this.props.comment
  }

  get createdAt() {
    return this.props.createdAt
  }

  get effectiveTime(): number | undefined {
    switch (this.penalty) {
      case 'DNF':
        return undefined
      case '+2':
        return this.time + 2000
      default:
        return this.time
    }
  }
}
