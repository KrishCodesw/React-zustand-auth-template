import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/auth.store'
import { useAuth } from '@/features/auth/useAuth'
import { useToast } from '@/shared/toast/ToastProvider'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Separator } from '@/shared/ui/separator'

import { GoogleLoginButton } from './GoogleLoginButton'

type LocationState = {
  from?: { pathname?: string }
}

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loginWithEmail, status, error, clearError } = useAuth()
  const { success, error: toastError } = useToast()

  const isLoading = status === 'loading' || status === 'idle'

  const [email, setEmail] = useState('demo@local.dev')
  const [password, setPassword] = useState('password')

  const from = useMemo(() => {
    const state = location.state as LocationState | null
    return state?.from?.pathname ?? '/app'
  }, [location.state])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await loginWithEmail({ email, password })
    const state = useAuthStore.getState()
    if (state.status === 'authenticated') {
      success('Logged in successfully.')
      navigate(from, { replace: true })
    } else if (state.error) {
      toastError(state.error)
    }
  }

  return (
    <div className="space-y-4">
      <GoogleLoginButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit} onChange={clearError}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button className="w-full" disabled={isLoading}>
          Log in
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          No account?{' '}
          <Link className="text-foreground underline underline-offset-4" to="/register">
            Create one
          </Link>
        </p>
      </form>
    </div>
  )
}

