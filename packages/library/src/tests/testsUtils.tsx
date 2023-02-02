import React, { FunctionComponent, ReactElement, ReactNode } from 'react'
import { render as rtlRender } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false
    }
  }
})

const render = (ui: ReactElement, options = {}) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
  return rtlRender(ui, { wrapper: Wrapper as FunctionComponent, ...options })
}

export * from '@testing-library/react'
export { userEvent, render }