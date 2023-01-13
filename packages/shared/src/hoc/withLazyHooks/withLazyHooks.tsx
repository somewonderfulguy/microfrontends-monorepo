/**
 * HOC that wraps federated module that takes array of lazy loaded hooks and wraps the array in useQuery & ErrorBoundary.
 * As loader, `delayedElement` can be passed as loader - if no passed then empty div will be displayed.
 * `Fallback` will be used if `Component` failed.
 * If no `Fallback` provided, the default fallback will be used.
 * 
 * Default fallback outputs error and reset button. The button resets components by resetting component completely.
 * Resetting component is achieved by changing React's key
 */

import React, { ComponentType, FunctionComponent, ReactNode, useRef } from 'react'
import { useQuery, QueryKey } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary'

import { Any, AnyFunctionType } from '../../typesShared'

import { DefaultFallbackComponent, errorHandler, ResetWrapper } from '../federatedShared'

type CommonProps = {
  hooks: { [key: string]: Promise<Any> }
  queryKey?: QueryKey
  delayedElement?: ReactNode
}

type LoadingWrapperProps = CommonProps & {
  render: (loadedHooks: Any) => ReactNode
  renderFallback: (error: Error, refetch: () => void) => void
}

type WithLazyHooksProps<Props = undefined> = CommonProps & {
  Component: ComponentType<Props>
  Fallback?: ComponentType<Props & FallbackProps>
}

const errorMessage = 'Federated hook(s) failed!'

const LoadingWrapper = ({ hooks, render, renderFallback, queryKey = uuidv4(), delayedElement }: LoadingWrapperProps) => {
  const queryKeyValue = useRef(queryKey);
  const {
    data: loadedHooks, isLoading, isError, refetch, error
  } = useQuery<AnyFunctionType[], Error>(
    queryKeyValue.current,
    () => Promise.all(Object.values(hooks)),
    {
      staleTime: Infinity,
      cacheTime: 0,
      refetchOnWindowFocus: false
    }
  )

  const loader = <>{delayedElement ?? <div aria-busy="true" />}</>
  const renderWithHooks = (hooks?: AnyFunctionType[]) => <>{hooks && render(hooks)}</>

  if (isLoading) return loader

  if (isError) {
    const errorObj = error?.message
      ? error
      : new Error(typeof error === 'string' ? error : /* istanbul ignore next */ 'Unknown error on federated hooks loading')

    errorHandler(errorObj, { errorMessage })

    return <>{renderFallback(errorObj, refetch)}</>
  }

  return renderWithHooks(loadedHooks)
}

export const withLazyHooks = <Props = Record<string, never>>({
  hooks, Component, Fallback, ...rest
}: WithLazyHooksProps<Props>) => {
  const renderFallback = (fallbackProps: FallbackProps & Any) => (
    Fallback
      ? <Fallback {...fallbackProps} />
      : (
        <DefaultFallbackComponent {...fallbackProps}>
          {errorMessage}
        </DefaultFallbackComponent>
      )
  )

  return (
    ((props: Any) => (
      <ResetWrapper render={(resetComponent) => (
        <ReactErrorBoundary
          fallbackRender={errorProps => {
            const fallbackProps = { ...errorProps, ...props, resetErrorBoundary: resetComponent }
            return renderFallback(fallbackProps)
          }}
          onError={(error, info) => errorHandler(error, { ...info, errorMessage })}
        >
          <LoadingWrapper
            hooks={hooks}
            render={(loadedHooks) => {
              const hookNames = Object.keys(hooks)
              const hooksToProps: { [key: string]: AnyFunctionType } = {}
              hookNames.forEach((name, idx) => hooksToProps[name] = loadedHooks[idx].default)
              return <Component {...props} {...hooksToProps} />
            }}
            renderFallback={(error, refetch) => (
              renderFallback({ error, resetErrorBoundary: refetch })
            )}
            {...rest}
          />
        </ReactErrorBoundary>
      )} />
    )) as unknown as FunctionComponent<Props>
  )
}