import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/shared/theme/ThemeProvider'
import { Button } from '@/shared/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme()

  function handleToggle() {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
      return
    }
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label="Toggle theme"
      onClick={handleToggle}
    >
      {isDark ? <Moon /> : <Sun />}
    </Button>
  )
}

