import type { PropsWithChildren } from 'react'

import { cn } from '@/shared/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'

type AuthCardProps = PropsWithChildren<{
  title: string
  description?: string
  className?: string
}>

export function AuthCard({ title, description, className, children }: AuthCardProps) {
  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

