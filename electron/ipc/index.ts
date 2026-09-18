import type { SessionService } from '../data/services/sessionService'
import type { SolveService } from '../data/services/solveService'
import { sessionIpc } from './sessionsIpc'
import { solveIpc } from './solvesIpc'
import { statsIpc } from './statsIpc'

export function registerIpcHandlers(sessions: SessionService, solves: SolveService) {
  sessionIpc(sessions)
  solveIpc(solves)
  statsIpc(solves)
}
