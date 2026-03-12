import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/auth.store'
import { useAuth } from '@/features/auth/useAuth'
import { useToast } from '@/shared/toast/ToastProvider'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Separator } from '@/shared/ui/separator'

import { GoogleLoginButton } from './GoogleLoginButton'

export function RegisterForm() {
  const navigate = useNavigate()
  const { registerWithEmail, status, error, clearError } = useAuth()
  const { success, error: toastError } = useToast()
  const isLoading = status === 'loading' || status === 'idle'

  const [name, setName] = useState('Demo User')
  const [email, setEmail] = useState('demo@local.dev')
  const [password, setPassword] = useState('password')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await registerWithEmail({ name, email, password })
    const state = useAuthStore.getState()
    if (state.status === 'authenticated') {
      success('Account created and logged in.')
      navigate('/app', { replace: true })
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
          <span className="bg-card px-2 text-muted-foreground">Or create an account</span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit} onChange={clearError}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
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
            autoComplete="new-password"
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
          Create account
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link className="text-foreground underline underline-offset-4" to="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}

