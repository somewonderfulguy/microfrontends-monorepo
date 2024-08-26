import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import request from '@repo/shared/utils/request'

import { ToUsd, EthScan, BtcScan, TonScan, SolScan, TonJettonsScan, TransformedBalance } from './balanceTypes'
import {
  getBlastBalance,
  getEtherBalance,
  getRatesCoingecko,
  getScrollBalance,
  getOptimismBalance,
  getBaseBalance,
  getZoraBalance,
  getTonBalance,
  getTonTokens,
  getSolBalance
} from './balanceApi'

type QueryOptions<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>

export const useGetRatesCoingecko = (options: QueryOptions<ToUsd> = {}) =>
  useQuery<ToUsd>({
    queryKey: ['ratesCoinGecko'],
    queryFn: getRatesCoingecko,
    ...options
  })

export const useGetBtcBalance = (address: string, options: QueryOptions<TransformedBalance> = {}) =>
  useQuery<TransformedBalance>({
    queryKey: ['btcBalance', address],
    queryFn: () =>
      request<BtcScan>(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`).then(
        ({ final_balance }) => ({
          balance: final_balance / 1e8,
          balanceShort: +(final_balance / 1e8).toFixed(4)
        })
      ),
    ...options
  })

export const useGetEtherBalance = (address: string, options: QueryOptions<EthScan> = {}) =>
  useQuery<EthScan>({
    queryKey: ['ethBalance', address],
    queryFn: () => getEtherBalance(address),
    ...options
  })

export const useGetBlastBalance = (address: string, options: QueryOptions<EthScan> = {}) =>
  useQuery<EthScan>({
    queryKey: ['blastBalance', address],
    queryFn: () => getBlastBalance(address),
    ...options
  })

export const useGetScrollBalance = (address: string, options: QueryOptions<EthScan> = {}) =>
  useQuery<EthScan>({
    queryKey: ['scrollBalance', address],
    queryFn: () => getScrollBalance(address),
    ...options
  })

export const useGetOptimismBalance = (address: string, options: QueryOptions<EthScan> = {}) =>
  useQuery<EthScan>({
    queryKey: ['optimismBalance', address],
    queryFn: () => getOptimismBalance(address),
    ...options
  })

export const useGetBaseBalance = (address: string, options: QueryOptions<EthScan> = {}) =>
  useQuery<EthScan>({
    queryKey: ['baseBalance', address],
    queryFn: () => getBaseBalance(address),
    ...options
  })

export const useGetZoraBalance = (address: string, options: QueryOptions<EthScan> = {}) =>
  useQuery<EthScan>({
    queryKey: ['zoraBalance', address],
    queryFn: () => getZoraBalance(address),
    ...options
  })

export const useGetTonBalance = (address: string, options: QueryOptions<TonScan> = {}) =>
  useQuery<TonScan>({
    queryKey: ['tonBalance', address],
    queryFn: () => getTonBalance(address),
    ...options
  })

export const useTonTokens = (address: string, options: QueryOptions<TonJettonsScan> = {}) =>
  useQuery<TonJettonsScan>({
    queryKey: ['notBalance', address],
    queryFn: () => getTonTokens(address),
    ...options
  })

export const useGetSolBalance = (address: string, options: QueryOptions<SolScan> = {}) =>
  useQuery<SolScan>({
    queryKey: ['solBalance', address],
    queryFn: () => getSolBalance(address),
    ...options
  })
