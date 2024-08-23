import type { Metadata } from 'next'
import { ReactNode } from 'react'
import 'augmented-ui/augmented-ui.min.css'

import '@repo/design-system/styles/reset.css'
import '@repo/design-system/styles/fonts.css'

import './globals.css'

export const metadata: Metadata = {
  title: 'Cyberpunk'
}

type Props = {
  children: ReactNode
}

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
