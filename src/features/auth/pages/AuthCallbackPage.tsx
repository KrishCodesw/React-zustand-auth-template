import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

/**
 * Placeholder route for future “real” OAuth flows.
 * For the default template mock auth, we just redirect.
 */
export function AuthCallbackPage() {
  useEffect(() => {
    // In a real setup, exchange code/token here and finalize session.
  }, [])

  return <Navigate to="/app" replace />
}

