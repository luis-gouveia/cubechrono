import { ChevronDown, Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export interface DropdownOption<T extends string> {
  value: T
  label: string
}

interface DropdownProps<T extends string> {
  value: string
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  align?: 'left' | 'center'
  width?: string
}

function Dropdown<T extends string>({ value, options, onChange, align = 'left', width = 'w-40' }: DropdownProps<T>) {
  const [open, setOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  const alignment = align === 'center' ? 'justify-center text-center' : 'justify-start text-left'

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className={`relative ${width}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex
          w-full
          items-center
          justify-between
          rounded-lg
          border
          border-divider
          bg-transparent
          px-4
          py-0.5
          text-primary
          transition-colors
          hover:bg-button-full-hover
          hover:cursor-pointer
        "
      >
        <div className={`flex flex-1 items-center gap-3 text-sm ${alignment}`}>
          <span>{selected?.label ?? 'Select...'}</span>
        </div>
        <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="
            scrollbar
            absolute
            left-0
            right-0
            z-50
            mt-2
            overflow-y-auto
            overflow-x-hidden
            max-h-[50vh]
            rounded-lg
            border
            border-divider
            bg-background
            shadow-xl
            "
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className="
                flex
                w-full
                items-center
                justify-between
                px-4
                py-1.5
                transition-colors
                hover:bg-button-full-hover
                hover:cursor-pointer
                text-sm
              "
            >
              <div className="flex items-center gap-3">
                <span>{option.label}</span>
              </div>
              {option.value === value && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
