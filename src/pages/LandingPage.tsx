import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { Container } from '@/shared/components/Container'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

export function LandingPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            React + TS + Zustand template
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Public landing page, auth (email + Google), protected routes, shadcn UI, and Framer Motion.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild>
              <Link to="/register">Get started</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Modular</CardTitle>
              <CardDescription>Feature-based folder structure.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Auth, routes, shared UI, and pages are separated so files stay small.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Protected routes</CardTitle>
              <CardDescription>Only signed-in users.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Route guards redirect unauthenticated users to login.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Replaceable auth</CardTitle>
              <CardDescription>Mock now, real later.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Swap the auth service for Firebase or your backend without changing UI pages.
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  )
}

