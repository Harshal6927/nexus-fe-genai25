'use client'

import { useEffect, useState } from 'react'
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    setTheme(storedTheme === 'light' ? 'light' : 'dark')

    window.addEventListener('storage', () => {
      const newTheme =
        localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
      setTheme(newTheme)
    })
  }, [])

  return (
    <NextThemesProvider {...props} forcedTheme={theme}>
      {children}
    </NextThemesProvider>
  )
}
