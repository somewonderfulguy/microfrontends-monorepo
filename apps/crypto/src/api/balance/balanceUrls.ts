export const getEtherBalanceUrl = (address: string) =>
  `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=AX8E1T47R1BH42MKRGM3SW1F1RXTNDMMRB`

export const getBlastBalanceUrl = (address: string) =>
  `https://api.blastscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=VBJ6D9KKUTW862GR3XSJM3J3GKX9UG2GWR`

export const getScrollBalanceUrl = (address: string) =>
  `https://api.scrollscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=VJBQK1AIXJ8THNVYHH7XENVUYXQRR3ITZT`

export const getOptimismBalanceUrl = (address: string) =>
  `https://api-optimistic.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=K424BIE5G9FGFEY3G6E6VNZUWBG6WVHRG3`

export const getBaseBalanceUrl = (address: string) =>
  `https://api.basescan.org/api?module=account&action=balance&address=${address}&tag=latest&apikey=BDP6D9NDXBPIA44AGZ8DTGQJFC5CFQRYFQ`

export const getZoraBalanceUrl = (address: string) =>
  `https://api.routescan.io/v2/network/mainnet/evm/8453/etherscan/api?module=account&action=balance&address=${address}&tag=latest`

// arbitrum
// polygon

// sol

// bybit (mantle)

// ton
// not

export const etherToUstRateUrl = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
