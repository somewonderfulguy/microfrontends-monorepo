import classNames from '@repo/shared/utils/classNames'

import {
  useGetRatesCoingecko,
  useGetBlastBalance,
  useGetEtherBalance,
  useGetScrollBalance,
  useGetOptimismBalance,
  useGetBaseBalance,
  useGetZoraBalance,
  useGetBtcBalance
} from '../../api/balance'

import styles from './CryptoApp.module.css'

// TODO:
// BTC
// MANTLE
// TON
// SOL

const ethWallet = '0x118826f0444E3973Ce14B6C43A7899334293904f'
const btcWallet = 'bc1qq4kl5p65gl4e6x3v3chnu9tlsh4sejkldpeunk'

const getEth = (wei: string) => {
  const ethBalance = parseInt(wei) / 1e18
  return {
    ethFull: ethBalance,
    ethShort: ethBalance.toFixed(4)
  }
}

const getEthInUst = (eth: number, rate: number) => {
  const ustBalance = eth * rate
  return {
    ustFull: ustBalance,
    ustShort: ustBalance.toFixed(2)
  }
}

const getSumEth = (balancesWei: string[], rate: number) => {
  const sumWei = balancesWei.reduce((acc, wei) => acc + parseInt(wei), 0)
  const sumEth = sumWei / 1e18
  const sumUst = sumEth * rate

  return {
    ethFull: sumEth,
    ethShort: sumEth.toFixed(4),
    ustFull: sumUst,
    ustShort: sumUst.toFixed(2)
  }
}

type Props = {
  label: string
  balanceWei: string
}

const EthEntry = ({ balanceWei, label }: Props) => {
  const { data: rates, isLoading } = useGetRatesCoingecko()
  const { ethFull, ethShort } = getEth(balanceWei)
  const { ustFull, ustShort } = getEthInUst(ethFull, rates?.ethereum.usd ?? NaN)
  return (
    <div>
      <h3 className={classNames(styles.h3, styles.headerSpace)}>{label}</h3>
      <div>
        <div title={String(ethFull)}>{ethShort} ETH</div>
        <div title={String(ustFull)}>
          {isLoading ? 'Loading...' : `${ustShort} USD`}
        </div>
      </div>
    </div>
  )
}

const CryptoApp = () => {
  const { data: rates } = useGetRatesCoingecko()
  const { data: etherBalance } = useGetEtherBalance(ethWallet)
  const { data: blastBalance } = useGetBlastBalance(ethWallet)
  const { data: scrollBalance } = useGetScrollBalance(ethWallet)
  const { data: optimismBalance } = useGetOptimismBalance(ethWallet)
  const { data: baseBalance } = useGetBaseBalance(ethWallet)
  const { data: zoraBalance } = useGetZoraBalance(ethWallet)
  const { data: btcBalance } = useGetBtcBalance(btcWallet)

  const btc = (btcBalance?.final_balance ?? 0) / 1e8
  const btcRate = rates?.bitcoin.usd ?? NaN
  const btcInUst = btc * btcRate

  const sum = getSumEth(
    [
      etherBalance?.result ?? '0',
      blastBalance?.result ?? '0',
      scrollBalance?.result ?? '0',
      optimismBalance?.result ?? '0',
      baseBalance?.result ?? '0',
      zoraBalance?.result ?? '0'
    ],
    rates?.ethereum.usd ?? NaN
  )

  return (
    <div>
      <div className={styles.head}>
        <h1 className={styles.h1}>Crypto Ballance</h1>
        <p
          title={String(sum.ustFull + btcInUst)}
          className={styles.overallBalance}
        >
          ${(sum.ustFull + btcInUst).toFixed(2)}
        </p>
      </div>

      <div className={styles.grid}>
        <div>
          <h2 className={classNames(styles.h2, styles.headerSpace)}>
            Ethereum <span className={styles.titleNote}>ETH</span>
          </h2>
          <p className={styles.cryptoCurrencyPrice}>${rates?.ethereum.usd}</p>
          <p>
            Wallet:{' '}
            <span title={ethWallet}>
              {/* TODO: add copy */}
              {ethWallet.slice(0, 7)}...{ethWallet.slice(-5)}
            </span>
          </p>
          <div className={styles.balances}>
            <div>
              <EthEntry
                label="Ethereum"
                balanceWei={etherBalance?.result ?? '0'}
              />
              <EthEntry
                label="Blast"
                balanceWei={blastBalance?.result ?? '0'}
              />
              <EthEntry
                label="Scroll"
                balanceWei={scrollBalance?.result ?? '0'}
              />
            </div>
            <div>
              <EthEntry
                label="Optimism"
                balanceWei={optimismBalance?.result ?? '0'}
              />
              <EthEntry label="Base" balanceWei={baseBalance?.result ?? '0'} />
              <EthEntry label="Zora" balanceWei={zoraBalance?.result ?? '0'} />
            </div>
          </div>
          <div>
            <h3 className={classNames(styles.h3, styles.headerSpace)}>
              Sum <span className={styles.titleNote}>ETH</span>
            </h3>
            <div>
              <div title={String(sum.ethFull)}>{sum.ethShort} ETH</div>
              <div title={String(sum.ustFull)}>{sum.ustShort} USD</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className={classNames(styles.h2, styles.headerSpace)}>
            Bitcoin <span className={styles.titleNote}>BTC</span>
          </h2>
          <p style={{ marginBottom: 16 }}>
            Wallet:{' '}
            <span title={btcWallet}>
              {/* TODO: add copy */}
              {btcWallet.slice(0, 7)}...{btcWallet.slice(-5)}
            </span>
          </p>
          <div title={String(btc)}>{btc.toFixed(4)} BTC</div>
          <div title={String(sum.ustFull)}>{btcInUst.toFixed(2)} USD</div>
        </div>
      </div>
    </div>
  )
}

export default CryptoApp
