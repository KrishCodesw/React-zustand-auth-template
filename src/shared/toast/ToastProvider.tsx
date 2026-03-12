import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/shared/lib/utils'

type ToastVariant = 'default' | 'success' | 'error'

type Toast = {
  id: number
  title?: string
  description?: string
  variant?: ToastVariant
}

type ToastContextValue = {
  show: (toast: Omit<Toast, 'id'>) => void
  success: (description: string, title?: string) => void
  error: (description: string, title?: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

let idCounter = 1

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([])

  function show(toast: Omit<Toast, 'id'>) {
    const id = idCounter++
    const next: Toast = { id, ...toast }
    setToasts((current) => [...current, next])
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id))
    }, 3500)
  }

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success(description, title = 'Success') {
        show({ description, title, variant: 'success' })
      },
      error(description, title = 'Error') {
        show({ description, title, variant: 'error' })
      },
    }),
    []
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}

type ToasterProps = {
  toasts: Toast[]
}

function Toaster({ toasts }: ToasterProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-50 flex justify-center px-4 sm:top-4 sm:justify-end sm:px-6">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className={cn(
                'pointer-events-auto overflow-hidden rounded-md border bg-card px-4 py-3 text-sm shadow-sm',
                toast.variant === 'success' && 'border-green-500/50 bg-green-500/10',
                toast.variant === 'error' && 'border-red-500/50 bg-red-500/10'
              )}
            >
              {toast.title ? (
                <p className="font-medium text-foreground">{toast.title}</p>
              ) : null}
              {toast.description ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{toast.description}</p>
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

