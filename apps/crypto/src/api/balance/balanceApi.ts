import request from '@repo/shared/utils/request'

import { EthToUsd, Scan } from './balanceTypes'
import {
  etherToUstRateUrl,
  getBlastBalanceUrl,
  getEtherBalanceUrl,
  getScrollBalanceUrl,
  getOptimismBalanceUrl,
  getBaseBalanceUrl,
  getZoraBalanceUrl
} from './balanceUrls'

export const getEtherUsdRate = () => request<EthToUsd>(etherToUstRateUrl)

export const getEtherBalance = (address: string) =>
  request<Scan>(getEtherBalanceUrl(address))

export const getBlastBalance = (address: string) =>
  request<Scan>(getBlastBalanceUrl(address))

export const getScrollBalance = (address: string) =>
  request<Scan>(getScrollBalanceUrl(address))

export const getOptimismBalance = (address: string) =>
  request<Scan>(getOptimismBalanceUrl(address))

export const getBaseBalance = (address: string) =>
  request<Scan>(getBaseBalanceUrl(address))

export const getZoraBalance = (address: string) =>
  request<Scan>(getZoraBalanceUrl(address))
