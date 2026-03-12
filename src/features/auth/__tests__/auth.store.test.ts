import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '../auth.store'

describe('auth.store', () => {
  beforeEach(() => {
    // reset store and clear persisted data
    useAuthStore.setState({
      status: 'idle',
      session: null,
      error: null,
      bootstrap: useAuthStore.getState().bootstrap,
      loginWithEmail: useAuthStore.getState().loginWithEmail,
      registerWithEmail: useAuthStore.getState().registerWithEmail,
      loginWithGoogle: useAuthStore.getState().loginWithGoogle,
      logout: useAuthStore.getState().logout,
      clearError: useAuthStore.getState().clearError,
    })
    window.localStorage.clear()
  })

  it('starts unauthenticated after bootstrap when no session', () => {
    useAuthStore.getState().bootstrap()
    expect(useAuthStore.getState().status).toBe('unauthenticated')
  })
})

