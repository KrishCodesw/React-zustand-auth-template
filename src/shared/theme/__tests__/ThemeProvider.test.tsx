import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ThemeProvider, useTheme } from '../ThemeProvider'

function ThemeConsumer() {
  const { theme, resolvedTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
    </div>
  )
}

describe('ThemeProvider', () => {
  it('provides a default theme', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme').textContent).toBeDefined()
    expect(screen.getByTestId('resolved').textContent).toBeDefined()
  })
})

