export type FiatKey = 'usd' | 'uah' | 'gbp' | 'eur' | 'pln' | 'jpy'
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

export type NotScan = {
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
