import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import 'augmented-ui/augmented-ui.min.css'

import ThemeWrapper from '@repo/design-system/ThemeWrapper'
import '@repo/design-system/styles/reset.css'
import '@repo/design-system/styles/fonts.css'

import CryptoApp from './components/CryptoApp'

import styles from './styles/devMode.module.css'
import './styles/devMode.css'

ReactDOM.createRoot(document.getElementById('root')!, {
  identifierPrefix: 'crypto-app-'
}).render(
  <StrictMode>
    <ThemeWrapper className={styles.themeWrapper}>
      <div className={styles.wrapper}>
        <CryptoApp />
      </div>
    </ThemeWrapper>
  </StrictMode>
)
