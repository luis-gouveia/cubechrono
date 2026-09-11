export const THEME_TYPES = ['light', 'dark'] as const
export type Theme = (typeof THEME_TYPES)[number]

export const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
]
