import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import 'augmented-ui/augmented-ui.min.css'

import ThemeWrapper from '@repo/design-system/ThemeWrapper'
import '@repo/design-system/styles/reset.css'
import '@repo/design-system/styles/fonts.css'

import PlayerApp from './components/PlayerApp'

import styles from './styles/devMode.module.css'
import './styles/devMode.css'

ReactDOM.createRoot(document.getElementById('root')!, {
  identifierPrefix: 'player-app-'
}).render(
  <StrictMode>
    <ThemeWrapper className={styles.themeWrapper}>
      <div className={styles.wrapper}>
        <PlayerApp />
      </div>
    </ThemeWrapper>
  </StrictMode>
)
