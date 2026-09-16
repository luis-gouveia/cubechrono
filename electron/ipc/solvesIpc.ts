import { ipcMain } from 'electron'
import { IPC_CHANNELS } from './channels'
import type { SolveService } from '../data/services/solveService'
import { CreateSolveDTO } from '../../src/types/dtos/solve'
import { UpdateSessionDTO } from '../../src/types/dtos/session'

export function solveIpc(solveService: SolveService) {
  ipcMain.handle(IPC_CHANNELS.solves.list, (_event, sessionId: string) => {
    return solveService.getBySessionId(sessionId)
  })

  ipcMain.handle(IPC_CHANNELS.solves.create, (_event, input: CreateSolveDTO) => {
    return solveService.create(input)
  })

  ipcMain.handle(IPC_CHANNELS.solves.update, (_event, input: UpdateSessionDTO) => {
    return solveService.update(input)
  })

  ipcMain.handle(IPC_CHANNELS.solves.delete, (_event, id: string) => {
    return solveService.delete(id)
  })
}
