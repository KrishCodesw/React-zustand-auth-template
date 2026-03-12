import { motion } from 'framer-motion'

import { AuthCard } from '@/features/auth/components/AuthCard'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { Container } from '@/shared/components/Container'

export function RegisterPage() {
  return (
    <div className="py-12">
      <Container className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md"
        >
          <AuthCard title="Create account" description="Email + password, or Google sign-in.">
            <RegisterForm />
          </AuthCard>
        </motion.div>
      </Container>
    </div>
  )
}

