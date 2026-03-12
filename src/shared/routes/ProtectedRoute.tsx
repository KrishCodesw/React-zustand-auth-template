import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/auth.store'
import { FullScreenLoader } from '@/shared/components/FullScreenLoader'

export function ProtectedRoute() {
  const status = useAuthStore((s) => s.status)
  const isAuthed = status === 'authenticated'
  const location = useLocation()

  if (status === 'idle' || status === 'loading') {
    return <FullScreenLoader />
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

