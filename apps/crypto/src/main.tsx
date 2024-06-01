import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'augmented-ui/augmented-ui.min.css'

import ThemeWrapper from '@repo/design-system/ThemeWrapper'
import '@repo/design-system/styles/reset.css'
import '@repo/design-system/styles/fonts.css'

import CryptoApp from './components/CryptoApp'

import styles from './styles/devMode.module.css'
import './styles/devMode.css'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!, {
  identifierPrefix: 'crypto-app-'
}).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeWrapper className={styles.themeWrapper}>
        <div className={styles.wrapper}>
          <CryptoApp />
        </div>
      </ThemeWrapper>
    </QueryClientProvider>
  </StrictMode>
)
