import { cn } from '@/lib/utils'

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-[#ffe457] text-[#1b2c1f]',
    secondary: 'bg-white/10 text-white',
    success: 'bg-[#81f8b3]/20 text-[#81f8b3] border border-[#81f8b3]/50',
    warning: 'bg-[#ffe457]/20 text-[#ffe457] border border-[#ffe457]/40',
    danger: 'bg-[#f18b8b]/20 text-[#f18b8b] border border-[#f18b8b]/40',
    info: 'bg-[#7dd1ff]/20 text-[#7dd1ff] border border-[#7dd1ff]/40',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border border-transparent',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
