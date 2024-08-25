import type { Metadata } from 'next'
import { ReactNode } from 'react'
import 'augmented-ui/augmented-ui.min.css'

import '@repo/design-system/styles/reset.css'
import '@repo/design-system/styles/fonts.css'

import Providers from '@/components/Providers'
import Menu from '@/components/Menu'

import styles from './Cyberpunk.module.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cyberpunk',
  icons: {
    icon: '/favicon.svg'
  }
}

type Props = {
  children: ReactNode
}

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className={styles.appContainer}>
            <div className={styles.app}>
              <header className={styles.header}>
                <div className={styles.menuContainer}>
                  <Menu />
                </div>
              </header>
              <main className={styles.pageContainer}>{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
