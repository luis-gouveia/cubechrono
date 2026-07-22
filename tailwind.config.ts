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
        'button-empty': 'rgba(var(--button-empty))',
      },
    },
  },
  plugins: [],
}

export default config
