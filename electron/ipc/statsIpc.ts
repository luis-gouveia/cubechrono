import { ipcMain } from 'electron'
import { IPC_CHANNELS } from './channels'
import type { SolveService } from '../data/services/solveService'
import { Puzzle } from '../../src/domain/puzzle'

export function statsIpc(solveService: SolveService) {
  ipcMain.handle(IPC_CHANNELS.stats.getByPuzzle, (_event, puzzle: Puzzle) => {
    return solveService.getPuzzleStats(puzzle)
  })
}
