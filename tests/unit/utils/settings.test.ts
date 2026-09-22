import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadSettings, saveSettings } from '../../../src/utils/settings'
import { DEFAULT_SETTINGS } from '../../../src/types/settings'

const storage = new Map<string, string>()
const localStorageMock: Storage = {
  get length() {
    return storage.size
  },
  clear() {
    storage.clear()
  },
  getItem(key: string) {
    return storage.get(key) ?? null
  },
  key(index: number) {
    return Array.from(storage.keys())[index] ?? null
  },
  removeItem(key: string) {
    storage.delete(key)
  },
  setItem(key: string, value: string) {
    storage.set(key, value)
  },
}

beforeEach(() => {
  vi.stubGlobal('localStorage', localStorageMock)
})

afterEach(() => {
  storage.clear()
  vi.unstubAllGlobals()
})

describe('loadSettings', () => {
  it('returns default settings when nothing is stored', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('loads stored settings', () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      showCurrentStats: !DEFAULT_SETTINGS.showCurrentStats,
    }
    localStorage.setItem('settings', JSON.stringify(settings))
    expect(loadSettings()).toEqual(settings)
  })

  it('merges stored settings with default settings', () => {
    const storedSettings = {
      showCurrentStats: !DEFAULT_SETTINGS.showCurrentStats,
    }
    localStorage.setItem('settings', JSON.stringify(storedSettings))
    expect(loadSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      ...storedSettings,
    })
  })

  it('returns default settings when stored JSON is invalid', () => {
    localStorage.setItem('settings', '{invalid json')
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('returns default settings when stored value is empty', () => {
    localStorage.setItem('settings', '')
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })
})

describe('saveSettings', () => {
  it('saves settings to localStorage', () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      showCurrentStats: !DEFAULT_SETTINGS.showCurrentStats,
    }
    saveSettings(settings)
    expect(localStorage.getItem('settings')).toBe(JSON.stringify(settings))
  })

  it('saves settings that can be loaded again', () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      showCurrentStats: !DEFAULT_SETTINGS.showCurrentStats,
    }
    saveSettings(settings)
    expect(loadSettings()).toEqual(settings)
  })

  it('overwrites previously saved settings', () => {
    const firstSettings = {
      ...DEFAULT_SETTINGS,
      showCurrentStats: false,
    }
    const secondSettings = {
      ...DEFAULT_SETTINGS,
      showCurrentStats: true,
    }
    saveSettings(firstSettings)
    saveSettings(secondSettings)
    expect(loadSettings()).toEqual(secondSettings)
  })
})
