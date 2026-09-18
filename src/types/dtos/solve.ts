import { Puzzle } from '../../domain/puzzle'
import { SolvePenalty } from '../solve'
import { EntityDTO } from './entity'
import { SolveStatsDTO } from './statistics'

export interface SolveDTO extends EntityDTO {
  sessionId: string
  time: number
  penalty: SolvePenalty
  scramble: string
  puzzle: Puzzle
  comment?: string
  stats?: SolveStatsDTO
}

export interface CreateSolveDTO {
  sessionId: string
  time: number
  penalty: SolvePenalty
  scramble: string
  puzzle: Puzzle
  comment?: string
}

export interface UpdateSolveDTO extends Partial<Pick<CreateSolveDTO, 'penalty' | 'comment'>> {
  id: string
}
