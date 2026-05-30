'use client'

interface SpecSelectorProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export default function SpecSelector({ label, options, value, onChange, required }: SpecSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`
                px-3 py-2 rounded-sm text-sm font-medium border transition-all duration-150
                ${selected
                  ? 'bg-brand-blue text-white border-brand-blue shadow-glow'
                  : 'bg-bg-secondary text-text-secondary border-border hover:border-brand-blue/40 hover:text-text-primary'
                }
              `}
              aria-pressed={selected}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
