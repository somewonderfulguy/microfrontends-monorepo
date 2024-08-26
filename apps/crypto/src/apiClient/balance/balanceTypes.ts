export type FiatKey = 'usd' | 'uah' | 'gbp' | 'eur' | 'pln' | 'jpy'
// eslint-disable-next-line no-unused-vars
type Fiat = { [key in FiatKey]: number }
export type ToUsd = {
  // keep in alphabetical order
  bitcoin: Fiat
  ethereum: Fiat
  mantle: Fiat
  notcoin: Fiat
  solana: Fiat
  'the-open-network': Fiat
}

export type TransformedBalance = {
  /** Human readable value (already processed, meaning, divided by 1e8 or 1e9). Full value with all decimals. */
  balance: number
  /** Human readable value (already processed, meaning, divided by 1e8 or 1e9). Short value with 2 decimals. */
  balanceShort: number
}

export type EthScan = {
  status: '1' | '0'
  message: string
  result: string
}

export type BtcScan = {
  address: string
  balance: number
  final_balance: number
  final_n_tx: number
  n_tx: number
  total_received: number
  total_sent: number
  unconfirmed_balance: number
  unconfirmed_n_tx: number
}

export type TonScan = {
  ok: boolean
  result: string
}

export type TonJettonsScan = {
  balances: Array<{
    balance: string
    price: {
      prices: {
        USD: number
      }
      diff_24h: {
        USD: string
      }
      diff_7d: {
        USD: string
      }
      diff_30d: {
        USD: string
      }
    }
    wallet_address: {
      address: string
      is_scam: boolean
      is_wallet: boolean
    }
    jetton: {
      address: string
      name: 'Notcoin' | 'Tether USD'
      symbol: 'NOT' | 'USD₮'
      decimals: number
      image: string
      verification: string
    }
  }>
}

export type SolScan = {
  balance: number
}
