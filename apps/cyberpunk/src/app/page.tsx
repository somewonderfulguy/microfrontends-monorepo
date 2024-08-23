'use client'

import Player from '@repo/player'
import ThemeWrapper from '@repo/design-system/ThemeWrapper'

import Menu from '@/components/Menu'

import styles from './page.module.css'

export default function Home() {
  return (
    <ThemeWrapper className={styles.themeWrapper}>
      <div className={styles.appContainer}>
        <div className={styles.app}>
          <header className={styles.header}>
            <div className={styles.menuContainer}>
              <Menu />
            </div>
          </header>
          <Player className={styles.player} />
        </div>
      </div>
    </ThemeWrapper>
  )
}
