import { Puzzle } from '../../domain/puzzle'
import { EntityDTO } from './entity'
import { SessionStatsDTO } from './statistics'

export interface SessionDTO extends EntityDTO {
  name: string
  description?: string
  puzzle: Puzzle
  position: number
  stats?: SessionStatsDTO
}

export interface CreateSessionDTO {
  name: string
  description?: string
  puzzle: Puzzle
}

export interface UpdateSessionDTO extends Partial<CreateSessionDTO> {
  id: string
  position?: number
}
