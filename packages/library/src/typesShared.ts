/* eslint-disable @typescript-eslint/no-explicit-any */

import { MutableRefObject } from 'react'

import { usePrevious, useResizeObserver } from './hooks'
import { withLazyLoad, withLazyHooks } from './hoc'

export { type IBlockProps, type IButtonProps, type ForwardedRefType } from './components'

// TODO: revisit this

export type WithLazyHooks = typeof withLazyHooks
export type WithLazyLoad = typeof withLazyLoad

export type usePreviousHook = typeof usePrevious
export type useResizeObserverHook = typeof useResizeObserver

export type DivRefType = MutableRefObject<HTMLDivElement>

export type AnyFunctionType = (...args: any[]) => any
export type AnyArrayType = any[]
export type Any = any