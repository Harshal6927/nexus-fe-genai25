'use client'

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps as NextThemeProviderProps,
} from 'next-themes'

type ThemeProviderProps = Omit<NextThemeProviderProps, 'attribute'> & {
  attribute?: NextThemeProviderProps['attribute']
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
