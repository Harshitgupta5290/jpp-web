import { forwardRef } from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  glow?: 'blue' | 'gold' | 'none'
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const glowStyles = {
  none: '',
  blue: 'shadow-[0_0_0_1px_rgba(45,111,255,0.2),0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_0_0_1px_rgba(45,111,255,0.4),0_8px_40px_rgba(45,111,255,0.15)]',
  gold: 'shadow-[0_0_0_1px_rgba(245,197,24,0.2),0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_0_0_1px_rgba(245,197,24,0.4),0_8px_40px_rgba(245,197,24,0.15)]',
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, padding = 'md', glow = 'none', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          card
          ${hover ? 'card-hover cursor-pointer' : ''}
          ${paddingStyles[padding]}
          ${glow !== 'none' ? glowStyles[glow] : 'shadow-card'}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Sub-components for composition
export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`font-display text-text-primary font-semibold ${className}`} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-text-secondary mt-1 ${className}`} {...props}>
      {children}
    </p>
  )
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 pt-4 border-t border-border flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Card
