import { HTMLAttributes } from 'react'

import useThemeStore from '@mf/state/themeStore'

import ControlBar from '../ControlBar'
import Sidebar from '../Sidebar'

import styles from './PlayerApp.module.css'

const PlayerApp = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useThemeStore((s) => s.theme)

  return (
    <div className={`${styles.playerApp} ${className}`} {...props}>
      <div className={styles.mainContainer}>
        <main className={styles.viewContainer}>
          <img
            style={{ scale: '1.5' }}
            src="https://lh3.googleusercontent.com/P407b89uopoffRRT0fdoJgX-12MEZYPB6Df7wpj05QF8HIrX5kXvr2TKzRBm27vjG1L23yDyzA4YXHEe=w544-h544-l90-rj"
          />
        </main>
        <div className={styles.sidebarContainer}>
          <Sidebar />
        </div>
      </div>
      <div className={styles.controlBarContainer}>
        <ControlBar />
      </div>
    </div>
  )
}

export default PlayerApp
