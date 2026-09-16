/// <reference types="vite-plugin-electron/electron-env" />

import type { ElectronApi } from '../src/types/ipc/electron'

declare global {
  interface Window {
    api: ElectronApi
  }
}

export {}
