/* eslint-disable @typescript-eslint/no-explicit-any */

import { FunctionComponent, HTMLProps, MutableRefObject } from 'react'

import { IButtonProps } from './components'
import { usePrevious, useResizeObserver } from './hooks'
import { federatedComponent, withLazyHooks } from './hoc'

export type BlockComponent = FunctionComponent<HTMLProps<HTMLDivElement>>
export type ButtonComponent = FunctionComponent<IButtonProps>

export type FederatedComponent = typeof federatedComponent
export type WithLazyHooks = typeof withLazyHooks

export type usePreviousHook = typeof usePrevious
export type useResizeObserverHook = typeof useResizeObserver

export type DivRefType = MutableRefObject<HTMLDivElement>

export type AnyFunctionType = (...args: any[]) => any
export type AnyArrayType = any[]
export type Any = any