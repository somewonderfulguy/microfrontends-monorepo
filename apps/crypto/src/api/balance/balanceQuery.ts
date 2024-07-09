import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import { ToUsd, EthScan, BtcScan } from './balanceTypes'
import {
  getBlastBalance,
  getBtcBalance,
  getEtherBalance,
  getRatesCoingecko,
  getScrollBalance,
  getOptimismBalance,
  getBaseBalance,
  getZoraBalance
} from './balanceApi'

type QueryOptions<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>

export const useGetRatesCoingecko = (options: QueryOptions<ToUsd> = {}) =>
  useQuery<ToUsd>({
    queryKey: ['ratesCoinGecko'],
    queryFn: getRatesCoingecko,
    ...options
  })

export const useGetBtcBalance = (
  address: string,
  options: QueryOptions<BtcScan> = {}
) =>
  useQuery<BtcScan>({
    queryKey: ['btcBalance', address],
    queryFn: () => getBtcBalance(address),
    ...options
  })

export const useGetEtherBalance = (
  address: string,
  options: QueryOptions<EthScan> = {}
) =>
  useQuery<EthScan>({
    queryKey: ['ethBalance', address],
    queryFn: () => getEtherBalance(address),
    ...options
  })

export const useGetBlastBalance = (
  address: string,
  options: QueryOptions<EthScan> = {}
) =>
  useQuery<EthScan>({
    queryKey: ['blastBalance', address],
    queryFn: () => getBlastBalance(address),
    ...options
  })

export const useGetScrollBalance = (
  address: string,
  options: QueryOptions<EthScan> = {}
) =>
  useQuery<EthScan>({
    queryKey: ['scrollBalance', address],
    queryFn: () => getScrollBalance(address),
    ...options
  })

export const useGetOptimismBalance = (
  address: string,
  options: QueryOptions<EthScan> = {}
) =>
  useQuery<EthScan>({
    queryKey: ['optimismBalance', address],
    queryFn: () => getOptimismBalance(address),
    ...options
  })

export const useGetBaseBalance = (
  address: string,
  options: QueryOptions<EthScan> = {}
) =>
  useQuery<EthScan>({
    queryKey: ['baseBalance', address],
    queryFn: () => getBaseBalance(address),
    ...options
  })

export const useGetZoraBalance = (
  address: string,
  options: QueryOptions<EthScan> = {}
) =>
  useQuery<EthScan>({
    queryKey: ['zoraBalance', address],
    queryFn: () => getZoraBalance(address),
    ...options
  })
