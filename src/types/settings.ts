import { Theme } from './theme'

export interface Settings {
  theme: Theme
  showTimerSidePanel: boolean
  showCurrentStats: boolean
  showScramble: boolean
  inspectionTime: boolean
  focusMode: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  showTimerSidePanel: true,
  showCurrentStats: true,
  showScramble: true,
  inspectionTime: false,
  focusMode: true,
}
