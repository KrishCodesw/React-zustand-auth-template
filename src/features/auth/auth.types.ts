export type AuthProvider = 'email' | 'google'

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

export type AuthUser = {
  id: string
  email: string
  name: string
  photoUrl?: string
  provider: AuthProvider
}

export type AuthSession = {
  user: AuthUser
  accessToken?: string
}

