import { Timer, NotepadText, ChartNoAxesCombined, Settings } from 'lucide-react'

const navItems = [
  {
    id: 'timer',
    label: 'Timer',
    icon: Timer,
  },
  {
    id: 'sessions',
    label: 'Sessions',
    icon: NotepadText,
  },
  {
    id: 'stats',
    label: 'Statistics',
    icon: ChartNoAxesCombined,
  },
]

export default function Sidebar({ active = 'timer' }) {
  return (
    <aside
      className={`
        flex h-screen flex-col
        border-r border-divider
        bg-background
        transition-all duration-300
        ${'w-16'}
      `}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-divider">
        <div className="w-8.75 h-8.75 bg-accent rounded text-sm">Logo</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id

          return (
            <button
              key={id}
              onClick={() => {}}
              className={`
                group relative
                flex w-full items-center
                rounded-lg
                p-3
                transition-colors
                cursor-pointer
                ${isActive ? 'bg-button-full text-primary' : 'text-secondary hover:bg-button-empty-hover hover:text-primary'}
              `}
            >
              <Icon size={20} className="shrink-0" />

              {/* Tooltip */}
              <span
                className="
                    pointer-events-none
                    absolute
                    left-full
                    top-1/2
                    z-50
                    ml-3
                    -translate-y-1/2
                    whitespace-nowrap
                    rounded-md
                    bg-button-empty-hover
                    px-3
                    py-1.5
                    text-sm
                    text-primary
                    shadow-lg

                    opacity-0
                    translate-x-1
                    transition-all
                    duration-150

                    group-hover:opacity-100
                    group-hover:translate-x-0
                  "
              >
                {label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-divider p-2">
        <button
          onClick={() => {}}
          className={`
            group relative
            flex w-full items-center
            rounded-lg
            px-3 py-3
            text-secondary
            transition-colors
            hover:bg-button-empty-hover
            hover:text-primary
          `}
        >
          <Settings size={20} />
          <span
            className="
                pointer-events-none
                absolute
                left-full
                top-1/2
                z-50
                ml-3
                -translate-y-1/2
                whitespace-nowrap
                rounded-md
                bg-button-empty-hover
                px-3
                py-1.5
                text-sm
                text-primary
                shadow-lg

                opacity-0
                translate-x-1
                transition-all
                duration-150

                group-hover:opacity-100
                group-hover:translate-x-0
              "
          >
            Settings
          </span>
        </button>
      </div>
    </aside>
  )
}
