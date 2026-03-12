import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/auth.store'
import { FullScreenLoader } from '@/shared/components/FullScreenLoader'

export function PublicOnlyRoute() {
  const status = useAuthStore((s) => s.status)
  const isAuthed = status === 'authenticated'

  if (status === 'idle' || status === 'loading') {
    return <FullScreenLoader />
  }

  if (isAuthed) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}

