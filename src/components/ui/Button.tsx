'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-brand-blue text-white
    hover:bg-[#1a5ce8] active:bg-[#1550d0]
    shadow-[0_0_0_1px_rgba(45,111,255,0.3)]
    hover:shadow-glow
  `,
  secondary: `
    bg-bg-card text-text-primary
    border border-border hover:border-brand-blue/50
    hover:bg-[#1e2740]
  `,
  ghost: `
    bg-transparent text-text-secondary
    hover:text-text-primary hover:bg-white/5
  `,
  danger: `
    bg-error text-white
    hover:bg-[#dc2626] active:bg-[#b91c1c]
  `,
  gold: `
    bg-brand-gold text-bg-primary font-semibold
    hover:bg-[#d4a80a] active:bg-[#b8930a]
    shadow-[0_0_0_1px_rgba(245,197,24,0.3)]
    hover:shadow-glow-gold
  `,
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-sm',
  md: 'h-10 px-5 text-sm gap-2 rounded-md',
  lg: 'h-12 px-7 text-base gap-2.5 rounded-md',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? {} : { scale: 0.97 }}
        disabled={isDisabled}
        className={`
          relative inline-flex items-center justify-center
          font-body font-medium transition-all duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          select-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading && (
          <Loader2
            className="animate-spin shrink-0"
            size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16}
          />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === 'right' && (
          <span className="shrink-0">{icon}</span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
export default Button
