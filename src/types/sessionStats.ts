export interface SessionStats {
  solves: {
    completed: number
    total: number
  }
  mean: number
  current: {
    single: number
    ao5: number
    ao12: number
  }
  best: {
    single: number
    ao5: number
    ao12: number
  }
}
