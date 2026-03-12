import { motion } from 'framer-motion'

import { AuthCard } from '@/features/auth/components/AuthCard'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { Container } from '@/shared/components/Container'

export function LoginPage() {
  return (
    <div className="py-12">
      <Container className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md"
        >
          <AuthCard title="Welcome back" description="Log in to access protected pages.">
            <LoginForm />
          </AuthCard>
        </motion.div>
      </Container>
    </div>
  )
}

