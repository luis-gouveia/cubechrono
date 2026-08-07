import { Puzzle } from '../domain/puzzle'

export interface SessionListItem {
  id: string
  name: string
  description?: string
  puzzle: Puzzle
  solves: {
    completed: number
    total: number
  }
  mean?: number
  createdAt: Date
}

interface SessionRecordStat {
  value: number
  date: Date
}

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
    single: SessionRecordStat
    ao5: SessionRecordStat
    ao12: SessionRecordStat
  }
  penalties: {
    plus2: number
    dnf: number
  }
}
