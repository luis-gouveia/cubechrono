import { ipcMain } from 'electron'
import { IPC_CHANNELS } from './channels'
import type { SessionService } from '../data/services/sessionService'
import { CreateSessionDTO, UpdateSessionDTO } from '../../src/types/dtos/session'

export function sessionIpc(sessionService: SessionService) {
  ipcMain.handle(IPC_CHANNELS.sessions.list, () => {
    return sessionService.getAll()
  })

  ipcMain.handle(IPC_CHANNELS.sessions.get, (_event, id: string) => {
    return sessionService.getById(id)
  })

  ipcMain.handle(IPC_CHANNELS.sessions.create, (_event, input: CreateSessionDTO) => {
    return sessionService.create(input)
  })

  ipcMain.handle(IPC_CHANNELS.sessions.update, (_event, input: UpdateSessionDTO) => {
    return sessionService.update(input)
  })

  ipcMain.handle(IPC_CHANNELS.sessions.delete, (_event, id: string) => {
    return sessionService.delete(id)
  })

  ipcMain.handle(IPC_CHANNELS.sessions.clear, (_event, id: string) => {
    return sessionService.clear(id)
  })
}
