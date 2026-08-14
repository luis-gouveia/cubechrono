import { SOLVE_PENALTY } from '../domain/solve'

export interface SolveItem {
  id: string
  time: number
  index: number
  ao5?: number
  ao12?: number
}

export type SolvePenalty = (typeof SOLVE_PENALTY)[number]
