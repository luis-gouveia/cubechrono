import { Puzzle } from '../../domain/puzzle'
import { CreateSessionDTO, SessionDTO, UpdateSessionDTO } from '../dtos/session'
import { CreateSolveDTO, SolveDTO, UpdateSolveDTO } from '../dtos/solve'
import { PuzzleStatsDTO } from '../dtos/statistics'

export interface ElectronApi {
  sessions: {
    list(): Promise<SessionDTO[]>
    get(id: string): Promise<SessionDTO>
    create(input: CreateSessionDTO): Promise<SessionDTO>
    update(input: UpdateSessionDTO): Promise<SessionDTO>
    delete(id: string): Promise<void>
  }
  solves: {
    list(sessionId: string): Promise<SolveDTO[]>
    create(input: CreateSolveDTO): Promise<SolveDTO>
    update(input: UpdateSolveDTO): Promise<SolveDTO>
    delete(id: string): Promise<void>
  }
  stats: {
    getByPuzzle(puzzle: Puzzle): Promise<PuzzleStatsDTO[]>
  }
}
