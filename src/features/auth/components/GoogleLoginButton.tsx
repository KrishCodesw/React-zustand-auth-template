import { Chrome } from 'lucide-react'

import { useAuth } from '@/features/auth/useAuth'
import { Button } from '@/shared/ui/button'

export function GoogleLoginButton() {
  const { loginWithGoogle, isLoading } = useAuth()

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => void loginWithGoogle()}
      disabled={isLoading}
    >
      <Chrome className="opacity-80" />
      Continue with Google
    </Button>
  )
}

