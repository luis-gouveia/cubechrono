interface SolveStats {
  value: number
  date: Date
}

export interface PuzzleStats {
  solves: number
  best: {
    single: SolveStats | undefined
    ao5: SolveStats | undefined
    ao12: SolveStats | undefined
  }
  mean: number | undefined
}
