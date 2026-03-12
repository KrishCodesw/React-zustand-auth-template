import { RenderOptions, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ReactElement } from 'react'

import { ThemeProvider } from '@/shared/theme/ThemeProvider'
import { ToastProvider } from '@/shared/toast/ToastProvider'

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </ToastProvider>
    </ThemeProvider>,
    options
  )
}

