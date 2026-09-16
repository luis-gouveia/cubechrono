import { Puzzle } from '../../domain/puzzle'
import { EntityDTO } from './entity'

export interface SessionDTO extends EntityDTO {
  name: string
  description?: string
  puzzle: Puzzle
  position: number
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
