export type AverageResultDTO =
  { status: 'unavailable' } | { status: 'DNF' } | { status: 'value'; value: number; completedAt: string }

export interface SessionStatsDTO {
  solves: {
    total: number
    completed: number
    plusTwo: number
    dnf: number
  }
  mean: number | null
  best: {
    value: number
    completedAt: string
  } | null
  ao5: AverageResultDTO
  ao12: AverageResultDTO
  bestAo5: AverageResultDTO
  bestAo12: AverageResultDTO
}

export interface SolveStatsDTO {
  ao5: AverageResultDTO
  ao12: AverageResultDTO
}
