import { motion } from 'framer-motion'

import { useAuth } from '@/features/auth/useAuth'
import { useDemoProjects } from '@/features/demo-data/useDemoProjects'
import { Container } from '@/shared/components/Container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

export function DashboardPage() {
  const { user } = useAuth()
  const { data: projects, isLoading } = useDemoProjects()

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

          <Card>
            <CardHeader>
              <CardTitle>Demo projects</CardTitle>
              <CardDescription>Loaded via TanStack Query (frontend-only API).</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              {isLoading && <p className="text-muted-foreground">Loading projects…</p>}
              {!isLoading && projects && (
                <ul className="space-y-1 text-xs">
                  {projects.map((project) => (
                    <li key={project.id}>
                      <span className="font-medium">{project.name}</span>{' '}
                      <span className="text-muted-foreground">({project.status})</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </div>
  )
}

