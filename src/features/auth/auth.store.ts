import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthSession, AuthStatus, AuthUser } from './auth.types'
import { authService, type EmailLoginInput, type EmailRegisterInput } from './auth.service'

type AuthState = {
  status: AuthStatus
  session: AuthSession | null
  error: string | null

  bootstrap: () => void
  loginWithEmail: (input: EmailLoginInput) => Promise<void>
  registerWithEmail: (input: EmailRegisterInput) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      session: null,
      error: null,

      bootstrap: () => {
        const { session } = get()
        set({
          status: session ? 'authenticated' : 'unauthenticated',
        })
      },

      clearError: () => set({ error: null }),

      loginWithEmail: async (input) => {
        set({ status: 'loading', error: null })
        try {
          const session = await authService.loginWithEmail(input)
          set({ session, status: 'authenticated' })
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Login failed.'
          set({ status: 'unauthenticated', session: null, error: message })
        }
      },

      registerWithEmail: async (input) => {
        set({ status: 'loading', error: null })
        try {
          const session = await authService.registerWithEmail(input)
          set({ session, status: 'authenticated' })
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Registration failed.'
          set({ status: 'unauthenticated', session: null, error: message })
        }
      },

      loginWithGoogle: async () => {
        set({ status: 'loading', error: null })
        try {
          const session = await authService.loginWithGoogle()
          set({ session, status: 'authenticated' })
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Google login failed.'
          set({ status: 'unauthenticated', session: null, error: message })
        }
      },

      logout: async () => {
        set({ status: 'loading', error: null })
        try {
          await authService.logout()
        } finally {
          set({ session: null, status: 'unauthenticated' })
        }
      },
    }),
    {
      name: 'template_auth',
      partialize: (state) => ({ session: state.session }),
      version: 1,
    }
  )
)

export const selectAuthUser = (s: ReturnType<typeof useAuthStore.getState>): AuthUser | null =>
  s.session?.user ?? null

