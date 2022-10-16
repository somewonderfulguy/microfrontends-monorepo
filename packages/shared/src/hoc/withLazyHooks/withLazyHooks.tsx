/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ComponentType, FunctionComponent, ReactNode } from 'react'
import { useQuery, QueryKey } from 'react-query'
import { v4 as uuidv4 } from 'uuid'

import { AnyFunctionType } from '../../typesShared'

// TODO: add serious comment that explains a lot like in federatedComponent.tsx

type commonProps = {
  hooks: { [key: string]: Promise<any> }
  fallbackHooks?: { [key: string]: Promise<any> }
  queryKey?: QueryKey
  delayedElement?: ReactNode
}

type LoadingWrapperProps = commonProps & {
  render: (resetComponent: any) => ReactNode
}

const LoadingWrapper = ({ hooks, fallbackHooks, render, queryKey = uuidv4(), delayedElement }: LoadingWrapperProps) => {
  const queryOptions = {
    staleTime: Infinity,
    cacheTime: 0,
    refetchOnWindowFocus: false
  }
  // TODO: error
  // - default error
  // - custom error
  const {
    data: loadedHooks, isLoading, isError, refetch, error
  } = useQuery<AnyFunctionType[]>(
    queryKey,
    () => Promise.all(Object.values(hooks)),
    queryOptions
  )

  const { data: loadedFallbackHooks } = useQuery<AnyFunctionType[]>(
    typeof queryKey === 'string' ? `fallback_${queryKey}` : ['fallback'].concat(queryKey as string[]),
    () => Promise.all(Object.values(fallbackHooks ?? {})),
    {
      ...queryOptions,
      enabled: !isLoading && !isError && !!fallbackHooks, 
    }
  );

  if (isLoading) return <>{delayedElement ?? <div aria-busy="true" />}</>

  if (isError) return <>Oh, no...</>

  return <>{loadedHooks ? render(loadedHooks) : null}</>
}

type withLazyHooksProps<Props> = commonProps & {
  Component: ComponentType<Props>
  Fallback?: ComponentType<Props>
  FinalFallback?: ComponentType<Props> // TODO extend with error
}

export function withLazyHooks<Props>({
  hooks, Component, Fallback, FinalFallback, ...rest
}: withLazyHooksProps<Props>) {
  return (
    ((props: any) => (
      <LoadingWrapper
        hooks={hooks}
        render={(loadedHooks) => {
          const hookNames = Object.keys(hooks)
          const hooksToProps: { [key: string]: AnyFunctionType } = {}
          hookNames.forEach((name, idx) => hooksToProps[name] = loadedHooks[idx].default)
          return <Component {...props} {...hooksToProps} />
        }}
        {...rest}
      />
    )) as unknown as FunctionComponent<Props>
  )
}