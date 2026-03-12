import type { AuthSession } from './auth.types'
import { authenticateWithGoogle } from './googleClient'

export type EmailLoginInput = {
  email: string
  password: string
}

export type EmailRegisterInput = {
  email: string
  password: string
  name: string
}

export type AuthService = {
  loginWithEmail(input: EmailLoginInput): Promise<AuthSession>
  registerWithEmail(input: EmailRegisterInput): Promise<AuthSession>
  loginWithGoogle(): Promise<AuthSession>
  logout(): Promise<void>
}

type StoredUser = {
  id: string
  email: string
  name: string
  passwordHash: string
}

const USERS_KEY = 'template_email_users'

function loadUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(USERS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : []
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function hashPassword(password: string): string {
  // For a real backend, use a strong password hasher; this is template-only.
  return btoa(password)
}

export const authService: AuthService = {
  async loginWithEmail(input) {
    const users = loadUsers()
    const user = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase())
    if (!user) {
      throw new Error('User not found.')
    }
    if (user.passwordHash !== hashPassword(input.password)) {
      throw new Error('Invalid email or password.')
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: 'email',
      },
    }
  },

  async registerWithEmail(input) {
    if (!input.email.includes('@') || input.password.length < 6) {
      throw new Error('Please use a valid email and a 6+ character password.')
    }
    if (!input.name.trim()) {
      throw new Error('Name is required.')
    }

    const email = input.email.toLowerCase()
    const users = loadUsers()
    if (users.some((u) => u.email === email)) {
      throw new Error('An account with this email already exists.')
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email,
      name: input.name.trim(),
      passwordHash: hashPassword(input.password),
    }

    const nextUsers = [...users, newUser]
    saveUsers(nextUsers)

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        provider: 'email',
      },
    }
  },

  async loginWithGoogle() {
    const { accessToken, userInfo } = await authenticateWithGoogle()

    return {
      user: {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        photoUrl: userInfo.picture,
        provider: 'google',
      },
      accessToken,
    }
  },

  async logout() {
    // Google tokens are short-lived; we just clear local session in the store.
  },
}

