import { useQuery, UseQueryOptions } from '@tanstack/react-query'

import { EthToUsd, Scan } from './balanceTypes'
import {
  getBlastBalance,
  getEtherBalance,
  getEtherUsdRate,
  getScrollBalance,
  getOptimismBalance,
  getBaseBalance,
  getZoraBalance
} from './balanceApi'

type QueryOptions<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>

export const useGetEtherUsdRate = (options: QueryOptions<EthToUsd> = {}) =>
  useQuery<EthToUsd>({
    queryKey: ['ethUsdRate'],
    queryFn: getEtherUsdRate,
    ...options
  })

export const useGetEtherBalance = (
  address: string,
  options: QueryOptions<Scan> = {}
) =>
  useQuery<Scan>({
    queryKey: ['ethBalance', address],
    queryFn: () => getEtherBalance(address),
    ...options
  })

export const useGetBlastBalance = (
  address: string,
  options: QueryOptions<Scan> = {}
) =>
  useQuery<Scan>({
    queryKey: ['blastBalance', address],
    queryFn: () => getBlastBalance(address),
    ...options
  })

export const useGetScrollBalance = (
  address: string,
  options: QueryOptions<Scan> = {}
) =>
  useQuery<Scan>({
    queryKey: ['scrollBalance', address],
    queryFn: () => getScrollBalance(address),
    ...options
  })

export const useGetOptimismBalance = (
  address: string,
  options: QueryOptions<Scan> = {}
) =>
  useQuery<Scan>({
    queryKey: ['optimismBalance', address],
    queryFn: () => getOptimismBalance(address),
    ...options
  })

export const useGetBaseBalance = (
  address: string,
  options: QueryOptions<Scan> = {}
) =>
  useQuery<Scan>({
    queryKey: ['baseBalance', address],
    queryFn: () => getBaseBalance(address),
    ...options
  })

export const useGetZoraBalance = (
  address: string,
  options: QueryOptions<Scan> = {}
) =>
  useQuery<Scan>({
    queryKey: ['zoraBalance', address],
    queryFn: () => getZoraBalance(address),
    ...options
  })
