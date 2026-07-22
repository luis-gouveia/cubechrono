import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgba(var(--background))',
        primary: 'rgba(var(--primary))',
        secondary: 'rgba(var(--secondary))',
        'button-full': 'rgba(var(--button-full))',
        'button-full-hover': 'rgba(var(--button-full-hover))',
        'button-empty': 'rgba(var(--button-empty))',
        'button-empty-hover': 'rgba(var(--button-empty-hover))',
        divider: 'rgba(var(--divider))',
        accent: 'rgba(var(--accent))',
      },
    },
  },
  plugins: [],
}

export default config
