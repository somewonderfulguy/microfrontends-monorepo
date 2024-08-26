'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

import ThemeWrapper from '@repo/design-system/ThemeWrapper'

import styles from './Providers.module.css'

type Props = {
  children: ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity
    }
  }
})

export default function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeWrapper className={styles.themeWrapper}>{children}</ThemeWrapper>
    </QueryClientProvider>
  )
}
