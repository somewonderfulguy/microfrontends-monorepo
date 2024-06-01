export type EthToUsd = {
  ethereum: {
    usd: number
  }
}

export type Scan = {
  status: '1' | '0'
  message: string
  result: string
}
