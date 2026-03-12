import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/auth.store'
import { AuthCallbackPage } from '@/features/auth/pages/AuthCallbackPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LandingPage } from '@/pages/LandingPage'
import { AppShell } from '@/shared/components/AppShell'
import { AppQueryProvider } from '@/shared/query/QueryProvider'
import { ThemeProvider } from '@/shared/theme/ThemeProvider'
import { ToastProvider } from '@/shared/toast/ToastProvider'
import { ProtectedRoute } from '@/shared/routes/ProtectedRoute'
import { PublicOnlyRoute } from '@/shared/routes/PublicOnlyRoute'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/" element={<LandingPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<DashboardPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  useEffect(() => {
    useAuthStore.getState().bootstrap()
  }, [])

  return (
    <ThemeProvider>
      <AppQueryProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="min-h-dvh">
              <AppShell />
              <AnimatedRoutes />
            </div>
          </BrowserRouter>
        </ToastProvider>
      </AppQueryProvider>
    </ThemeProvider>
  )
}
