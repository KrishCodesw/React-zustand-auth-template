import { motion } from 'framer-motion'

import { cn } from '@/shared/lib/utils'

export function FullScreenLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="grid min-h-[calc(100dvh-4rem)] place-items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn('text-sm text-muted-foreground')}
      >
        {label}
      </motion.div>
    </div>
  )
}

