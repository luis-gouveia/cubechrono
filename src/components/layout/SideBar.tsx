import { Timer, NotepadText, ChartNoAxesCombined, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  {
    path: '/',
    label: 'Timer',
    icon: Timer,
  },
  {
    path: '/sessions',
    label: 'Sessions',
    icon: NotepadText,
  },
  {
    path: '/statistics',
    label: 'Statistics',
    icon: ChartNoAxesCombined,
  },
]

function Sidebar() {
  return (
    <aside
      className="
        flex h-screen w-16 flex-col
        border-r border-divider
        bg-background
        transition-all duration-300
      "
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-divider">
        <div className="h-8.75 w-8.75 rounded bg-accent text-sm">Logo</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-3">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `
              group relative
              flex w-full items-center
              rounded-lg
              p-3
              transition-colors
              cursor-pointer
              ${
                isActive
                  ? 'bg-button-full text-primary'
                  : 'text-secondary hover:bg-button-empty-hover hover:text-primary'
              }
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
                translate-x-1
                whitespace-nowrap
                rounded-md
                bg-button-empty-hover
                px-3
                py-1.5
                text-sm
                text-primary
                shadow-lg
                opacity-0
                transition-all
                duration-150
                group-hover:translate-x-0
                group-hover:opacity-100
              "
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-divider p-2">
        <NavLink
          to="/settings"
          className={({ isActive }) => `
            group relative
            flex w-full items-center
            rounded-lg
            px-3 py-3
            transition-colors
            ${
              isActive ? 'bg-button-full text-primary' : 'text-secondary hover:bg-button-empty-hover hover:text-primary'
            }
          `}
        >
          <Settings size={20} />

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
              translate-x-1
              whitespace-nowrap
              rounded-md
              bg-button-empty-hover
              px-3
              py-1.5
              text-sm
              text-primary
              shadow-lg
              opacity-0
              transition-all
              duration-150
              group-hover:translate-x-0
              group-hover:opacity-100
            "
          >
            Settings
          </span>
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar
