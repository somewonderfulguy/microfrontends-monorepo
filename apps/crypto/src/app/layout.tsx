import type { Metadata } from 'next'
import { ReactNode } from 'react'
import 'augmented-ui/augmented-ui.min.css'

import '@repo/design-system/styles/reset.css'
import '@repo/design-system/styles/fonts.css'

import Providers from '@/components/Providers'

import './globals.css'

export const metadata: Metadata = {
  title: 'Crypto Balance',
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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
