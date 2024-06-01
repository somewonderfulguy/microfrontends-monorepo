import {
  useGetEtherUsdRate,
  useGetBlastBalance,
  useGetEtherBalance,
  useGetScrollBalance,
  useGetOptimismBalance,
  useGetBaseBalance,
  useGetZoraBalance
} from '../../api/balance'

import styles from './CryptoApp.module.css'

const wallet = ''

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
  const { data: etherUsdRate, isLoading } = useGetEtherUsdRate()
  const { ethFull, ethShort } = getEth(balanceWei)
  const { ustFull, ustShort } = getEthInUst(
    ethFull,
    etherUsdRate?.ethereum.usd ?? NaN
  )
  return (
    <div>
      <h2 className={styles.subtitle}>{label}</h2>
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
  const { data: etherUsdRate } = useGetEtherUsdRate()
  const { data: etherBalance } = useGetEtherBalance(wallet)
  const { data: blastBalance } = useGetBlastBalance(wallet)
  const { data: scrollBalance } = useGetScrollBalance(wallet)
  const { data: optimismBalance } = useGetOptimismBalance(wallet)
  const { data: baseBalance } = useGetBaseBalance(wallet)
  const { data: zoraBalance } = useGetZoraBalance(wallet)

  const sum = getSumEth(
    [
      etherBalance?.result ?? '0',
      blastBalance?.result ?? '0',
      scrollBalance?.result ?? '0',
      optimismBalance?.result ?? '0',
      baseBalance?.result ?? '0',
      zoraBalance?.result ?? '0'
    ],
    etherUsdRate?.ethereum.usd ?? NaN
  )

  return (
    <div>
      <div className={styles.head}>
        <h1 className={styles.title}>Crypto Ballance</h1>
        <p>Wallet: {wallet}</p>
      </div>
      <div className={styles.balances}>
        <div>
          <EthEntry label="Ethereum" balanceWei={etherBalance?.result ?? '0'} />
          <EthEntry label="Blast" balanceWei={blastBalance?.result ?? '0'} />
          <EthEntry label="Scroll" balanceWei={scrollBalance?.result ?? '0'} />
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
        <h2 className={styles.subtitle}>Sum</h2>
        <div>
          <div title={String(sum.ethFull)}>{sum.ethShort} ETH</div>
          <div title={String(sum.ustFull)}>{sum.ustShort} USD</div>
        </div>
      </div>
    </div>
  )
}

export default CryptoApp
