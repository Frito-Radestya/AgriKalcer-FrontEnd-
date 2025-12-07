import { cn } from '@/lib/utils'

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-[20px] md:rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl text-white shadow-[0_20px_45px_rgba(0,0,0,0.45)] transition-all duration-300 hover:border-white/20 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-4 md:p-6 border-b border-white/10', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn('text-xl md:text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('p-4 md:p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('flex items-center p-4 md:p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
}
