import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from './ipc/channels'
import type { ElectronApi } from '../src/types/ipc/electron'

const api: ElectronApi = {
  sessions: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.sessions.list),
    get: (id) => ipcRenderer.invoke(IPC_CHANNELS.sessions.get, id),
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.sessions.create, input),
    update: (input) => ipcRenderer.invoke(IPC_CHANNELS.sessions.update, input),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.sessions.delete, id),
  },
  solves: {
    list: (sessionId) => ipcRenderer.invoke(IPC_CHANNELS.solves.list, sessionId),
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.solves.create, input),
    update: (input) => ipcRenderer.invoke(IPC_CHANNELS.solves.update, input),
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.solves.delete, id),
  },
}

contextBridge.exposeInMainWorld('api', api)
