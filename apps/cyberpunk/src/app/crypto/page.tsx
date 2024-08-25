import Crypto from '@repo/crypto'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crypto Balance'
}

export default function CryptoPage() {
  return <Crypto />
}
