type BadgeVariant = 'blue' | 'gold' | 'success' | 'error' | 'warning' | 'neutral'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: React.ReactNode
  dot?: boolean
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  blue: 'bg-brand-blue/15 text-brand-blue border border-brand-blue/30',
  gold: 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30',
  success: 'bg-success/15 text-success border border-success/30',
  error: 'bg-error/15 text-error border border-error/30',
  warning: 'bg-warning/15 text-[#F59E0B] border border-[#F59E0B]/30',
  neutral: 'bg-white/5 text-text-secondary border border-border',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
}

export default function Badge({
  variant = 'neutral',
  size = 'md',
  icon,
  dot = false,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        badge font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full shrink-0
            ${variant === 'blue' ? 'bg-brand-blue' : ''}
            ${variant === 'gold' ? 'bg-brand-gold' : ''}
            ${variant === 'success' ? 'bg-success' : ''}
            ${variant === 'error' ? 'bg-error' : ''}
            ${variant === 'warning' ? 'bg-[#F59E0B]' : ''}
            ${variant === 'neutral' ? 'bg-text-secondary' : ''}
          `}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
