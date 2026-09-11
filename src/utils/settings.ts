import { DEFAULT_SETTINGS, type Settings } from '../types/settings'

const STORAGE_KEY = 'settings'

export function loadSettings(): Settings {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return DEFAULT_SETTINGS

  try {
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(stored),
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
