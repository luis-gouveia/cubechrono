import { useEffect, useState } from 'react'
import { DEFAULT_SETTINGS, type Settings } from '../types/settings'
import { loadSettings, saveSettings } from '../utils/settings'

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    document.querySelector('body')?.setAttribute('data-theme', settings.theme.toLowerCase())
  }, [settings.theme])

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    try {
      setSettings((previous) => {
        const next = { ...previous, [key]: value }
        saveSettings(next)
        return next
      })
      setError(undefined)
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to save setting'))
    }
  }

  const updateSettings = (updates: Partial<Settings>) => {
    try {
      setSettings((previous) => {
        const next = { ...previous, ...updates }
        saveSettings(next)
        return next
      })
      setError(undefined)
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to save setting'))
    }
  }

  const resetSettings = () => {
    try {
      setSettings(DEFAULT_SETTINGS)
      saveSettings(DEFAULT_SETTINGS)
      setError(undefined)
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to save setting'))
    }
  }

  return {
    settings,
    error,
    updateSetting,
    updateSettings,
    resetSettings,
  }
}
