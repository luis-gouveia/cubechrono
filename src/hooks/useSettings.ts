import { useEffect, useState } from 'react'
import { DEFAULT_SETTINGS, type Settings } from '../types/settings'
import { loadSettings, saveSettings } from '../utils/settings'

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings())

  useEffect(() => {
    document.querySelector('body')?.setAttribute('data-theme', settings.theme.toLowerCase())
  }, [settings.theme])

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((previous) => {
      const next = { ...previous, [key]: value }
      saveSettings(next)
      return next
    })
  }

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((previous) => {
      const next = { ...previous, ...updates }
      saveSettings(next)
      return next
    })
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    saveSettings(DEFAULT_SETTINGS)
  }

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
  }
}
