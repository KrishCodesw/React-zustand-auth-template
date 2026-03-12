import { motion } from 'framer-motion'

import { useAuth } from '@/features/auth/useAuth'
import { Container } from '@/shared/components/Container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="py-10">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              This page is protected. You can only see it when authenticated.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Current user</CardTitle>
              <CardDescription>From Zustand auth store.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <pre className="overflow-auto rounded-md bg-muted p-4 text-xs">
                {JSON.stringify(user, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </div>
  )
}

