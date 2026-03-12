import { useAuthStore } from './auth.store'

export function useAuth() {
  const status = useAuthStore((s) => s.status)
  const session = useAuthStore((s) => s.session)
  const user = session?.user ?? null
  const error = useAuthStore((s) => s.error)
  const clearError = useAuthStore((s) => s.clearError)

  const loginWithEmail = useAuthStore((s) => s.loginWithEmail)
  const registerWithEmail = useAuthStore((s) => s.registerWithEmail)
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle)
  const logout = useAuthStore((s) => s.logout)

  return {
    status,
    session,
    user,
    error,
    clearError,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || status === 'idle',
  }
}

