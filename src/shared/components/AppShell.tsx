import { Link } from 'react-router-dom'

import { useAuth } from '@/features/auth/useAuth'
import { Container } from '@/shared/components/Container'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { useToast } from '@/shared/toast/ToastProvider'
import { Button } from '@/shared/ui/button'

export function AppShell() {
  const { isAuthenticated, user, logout, isLoading } = useAuth()
  const { success } = useToast()

  return (
    <header className="border-b">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-semibold tracking-tight">
            Template
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-muted-foreground sm:flex">
            <Link to="/" className="hover:text-foreground">
              Landing
            </Link>
            <Link to="/app" className="hover:text-foreground">
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Signed in as <span className="text-foreground">{user?.email}</span>
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  void logout().then(() => {
                    success('You have been logged out.')
                  })
                }
                disabled={isLoading}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Create account</Link>
              </Button>
            </>
          )}
        </div>
      </Container>
    </header>
  )
}

