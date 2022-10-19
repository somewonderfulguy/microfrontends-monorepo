// TODO: add serious comment that explains a lot like in federatedComponent.tsx

import React, { ComponentType, FunctionComponent, ReactNode } from 'react'
import { useQuery, QueryKey } from 'react-query'
import { v4 as uuidv4 } from 'uuid'
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary'

import { Any, AnyFunctionType } from '../../typesShared'

import { DefaultFallbackComponent, errorHandler, ResetWrapper } from '../federatedShared'

type commonProps = {
  hooks: { [key: string]: Promise<Any> }
  queryKey?: QueryKey
  delayedElement?: ReactNode
}

type LoadingWrapperProps = commonProps & {
  render: (loadedHooks: Any) => ReactNode
  renderFallback: (error: Error, refetch: () => void) => void
}

type withLazyHooksProps<Props = undefined> = commonProps & {
  Component: ComponentType<Props>
  Fallback?: ComponentType<Props & FallbackProps>
}

const errorMessage = 'Federated hook(s) failed!'

const LoadingWrapper = ({ hooks, render, renderFallback, queryKey = uuidv4(), delayedElement }: LoadingWrapperProps) => {
  const queryOptions = {
    staleTime: Infinity,
    cacheTime: 0,
    refetchOnWindowFocus: false
  }

  const {
    data: loadedHooks, isLoading, isError, refetch, error
  } = useQuery<AnyFunctionType[], Error>(
    queryKey,
    () => Promise.all(Object.values(hooks)),
    queryOptions
  )

  const loader = <>{delayedElement ?? <div aria-busy="true" />}</>
  const renderWithHooks = (hooks?: AnyFunctionType[]) => <>{hooks ? render(hooks) : null}</>

  if (isLoading) return loader

  if (isError) {
    const errorObj = error?.message
      ? error
      : new Error(typeof error === 'string' ? error : 'Unknown error on federated hooks loading')

    errorHandler(errorObj)

    return (
      <>{renderFallback(errorObj, refetch)}</>
    )
  }

  return renderWithHooks(loadedHooks)
}

export const withLazyHooks = <Props = undefined>({
  hooks, Component, Fallback, ...rest
}: withLazyHooksProps<Props>) => (
  ((props: Any) => (
    <ResetWrapper render={(resetComponent) => (
      <ReactErrorBoundary
        fallbackRender={errorProps => (
          Fallback
            ? <Fallback {...errorProps} {...props} />
            : (
              <DefaultFallbackComponent {...errorProps} {...props} resetErrorBoundary={resetComponent}>
                {errorMessage}
              </DefaultFallbackComponent>
            )
        )}
        onError={(...args) => errorHandler(...args)}
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
            <DefaultFallbackComponent error={error} resetErrorBoundary={() => refetch()}>
              {errorMessage}
            </DefaultFallbackComponent>
          )}
          {...rest}
        />
      </ReactErrorBoundary>
    )} />
  )) as unknown as FunctionComponent<Props>
)