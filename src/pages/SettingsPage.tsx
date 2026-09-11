import { useState } from 'react'
import Dropdown from '../components/common/Dropdown'
import { DEFAULT_SETTINGS, Settings } from '../types/settings'
import { THEME_OPTIONS } from '../types/theme'

function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  return (
    <main className="h-full w-full overflow-y-auto bg-background text-primary scrollbar-hidden">
      <div className="mx-auto w-full max-w-3xl px-6 py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-medium">Settings</h1>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm font-medium text-secondary">Appearance</h2>

            <div className="rounded-lg border border-divider">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm">Theme</p>
                  <p className="mt-0.5 text-xs text-secondary">Choose the application theme</p>
                </div>
                <Dropdown
                  value={settings.theme}
                  options={THEME_OPTIONS}
                  onChange={(value) => updateSetting('theme', value as Settings['theme'])}
                  width="w-25"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium text-secondary">Timer</h2>

            <div className="rounded-lg border border-divider">
              <SettingRow
                label="Show timer side panel"
                description="Show the session timer panel while solving"
                checked={settings.showTimerSidePanel}
                onChange={(value) => updateSetting('showTimerSidePanel', value)}
              />
              <SettingRow
                label="Show current stats"
                description="Show current ao5, ao12 and diff bellow the current time"
                checked={settings.showCurrentStats}
                onChange={(value) => updateSetting('showCurrentStats', value)}
              />
              <SettingRow
                label="Show scramble"
                description="Show the current scramble rendering"
                checked={settings.showScramble}
                onChange={(value) => updateSetting('showScramble', value)}
              />
              <SettingRow
                label="Inspection time"
                description="Use WCA-style inspection before starting a solve"
                checked={settings.inspectionTime}
                onChange={(value) => updateSetting('inspectionTime', value)}
              />
              <SettingRow
                label="Focus mode"
                description="Hide distractions while performing a solve"
                checked={settings.focusMode}
                onChange={(value) => updateSetting('focusMode', value)}
                last
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

type SettingRowProps = {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
  last?: boolean
}

function SettingRow({ label, description, checked, onChange, last = false }: SettingRowProps) {
  return (
    <div className={`flex items-center justify-between gap-6 px-4 py-3 ${!last ? 'border-b border-divider' : ''}`}>
      <div className="min-w-0">
        <p className="text-sm">{label}</p>
        <p className="mt-0.5 text-xs text-secondary">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-10 shrink-0 cursor-pointer rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-button-empty-hover'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-5 rounded-full bg-white transition-transform ${checked ? '-translate-x-1/6' : '-translate-x-4'}`}
        />
      </button>
    </div>
  )
}

export default SettingsPage
