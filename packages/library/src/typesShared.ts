/* eslint-disable @typescript-eslint/no-explicit-any */

import { MutableRefObject } from 'react'

import { usePrevious, useResizeObserver } from './hooks'
import { withLazyLoad, withLazyHooks } from './hoc'

export {
  type BlockProps,
  type ButtonProps,
  type ForwardedRefType
} from './components'

export type WithLazyHooks = typeof withLazyHooks
export type WithLazyLoad = typeof withLazyLoad

export type usePreviousHook = typeof usePrevious
export type useResizeObserverHook = typeof useResizeObserver

export type DivRefType = MutableRefObject<HTMLDivElement>
