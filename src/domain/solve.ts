import { z } from 'zod'
import { puzzleSchema } from './puzzle'

const SOLVE_PENALTY = ['none', '+2', 'DNF'] as const

export const solveSchema = z.object({
  id: z.uuid(),
  time: z.number().positive(),
  penalty: z.enum(SOLVE_PENALTY),
  scramble: z.string().min(1).max(500),
  puzzle: puzzleSchema,
  comment: z.string().max(255).optional(),
  createdAt: z.date(),
})
export type SolveProps = z.infer<typeof solveSchema>

export class Solve {
  private readonly props: SolveProps

  constructor(input: SolveProps) {
    const validated = solveSchema.parse(input)
    this.props = validated
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
    if (this.penalty === 'DNF') return undefined
    if (this.penalty === '+2') return this.time + 2000
    return this.time
  }
}
