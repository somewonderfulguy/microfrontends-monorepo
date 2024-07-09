export type FiatKey = 'usd' | 'uah' | 'gbp' | 'eur' | 'pln' | 'jpy'
type Fiat = { [key in FiatKey]: number }
export type ToUsd = {
  // keep in alphabetical order
  bitcoin: Fiat
  ethereum: Fiat
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
