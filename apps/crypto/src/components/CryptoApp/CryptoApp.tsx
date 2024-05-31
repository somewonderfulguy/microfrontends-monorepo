import { useEffect, useRef } from 'react'

import request from '@repo/shared/utils/request'

const CryptoApp = () => {
  const isInit = useRef(false)
  useEffect(() => {
    if (isInit.current) return
    isInit.current = true

    const resultEth = request<{
      message: string
      result: string
      status: string
    }>(
      'https://api.etherscan.io/api?module=account&action=balance&address=0x118826f0444E3973Ce14B6C43A7899334293904f&tag=latest&apikey=AX8E1T47R1BH42MKRGM3SW1F1RXTNDMMRB'
    )

    const resultEthBlast = request<{
      message: string
      result: string
      status: string
    }>(
      'https://api.blastscan.io/api?module=account&action=balance&address=0x118826f0444E3973Ce14B6C43A7899334293904f&tag=latest&apikey=VBJ6D9KKUTW862GR3XSJM3J3GKX9UG2GWR'
    )

    const resultEthScroll = request<{
      message: string
      result: string
      status: string
    }>(
      'https://api.scrollscan.com/api?module=account&action=balance&address=0x118826f0444E3973Ce14B6C43A7899334293904f&tag=latest&apikey=VJBQK1AIXJ8THNVYHH7XENVUYXQRR3ITZT'
    )

    const resultEthToUst = request<{
      ethereum: {
        usd: number
      }
    }>(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    )

    Promise.all([
      resultEth,
      resultEthBlast,
      resultEthScroll,
      resultEthToUst
    ]).then(([eth, ethBlast, ethScroll, ethToUst]) => {
      console.log(ethScroll)

      const wei = parseInt(eth.result)
      const weiBlast = parseInt(ethBlast.result)
      const ethBalance = wei / 1e18
      const ethBalanceBlast = weiBlast / 1e18

      const ethToUstRate = ethToUst.ethereum.usd
      const ustBalance = ethBalance * ethToUstRate
      const ustBalanceBlast = ethBalanceBlast * ethToUstRate

      const twoDecimalsUstBalance = ustBalance.toFixed(2)
      const fourDecimalsEthBalance = ethBalance.toFixed(4)
      const twoDecimalsUstBalanceBlast = ustBalanceBlast.toFixed(2)
      const fourDecimalsEthBalanceBlast = ethBalanceBlast.toFixed(4)

      const sumEth = ethBalance + ethBalanceBlast
      const sumUst = ustBalance + ustBalanceBlast

      console.log(
        'ETH Mainnet balance:',
        fourDecimalsEthBalance,
        twoDecimalsUstBalance
      )

      console.log(
        'ETH Blast balance:',
        fourDecimalsEthBalanceBlast,
        twoDecimalsUstBalanceBlast
      )

      console.log('Total ETH balance:', sumEth.toFixed(4), sumUst.toFixed(2))
    })
  }, [])

  return <></>
}

export default CryptoApp
