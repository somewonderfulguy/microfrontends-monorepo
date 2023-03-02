/**
 * HOC that takes a Component and array of lazy loaded hooks and wraps it in useQuery & ErrorBoundary.
 * `Component` prop is, as name implies, a Component that is going to get lazy loaded hooks.
 * These lazy loaded hooks will be added as props to the component. Required.
 * `hooks` are list of lazy loading hooks. Required.
 * As loader, `delayedElement` can be passed as loader - if no passed then empty <div aria-busy="true" /> will be displayed.
 * `Fallback` will be used if hooks lazy loading failed
 * If no `Fallback` provided, the default fallback will be used.
 * `queryKey` is QueryKey type from react-query. Might be used in order to refetch.
 * If no `queryKey` passed, then uuid generated will be applied.
 * 
 * Default fallback outputs error and reset button. The reset works through key prop that rerenders component completely.
 * 
 * Examples of usage:
 * 
 * 1) Minimal configuration:
 * 
 * const ExampleComponentImpl = ((props: Any) => {
 *   const { someHook } = props as { someHook: () => string }
 *   const hookResult = someHook()
 *   return <>{hookResult}</>
 * })
 * 
 * const ExampleComponent = withLazyHooks({
 *   hooks: { someHook: import('pathTo/someHook') },
 *   Component: TestComponentSingleHookImpl
 * })
 * 
 * ------------------------------------------------------------
 * 
 * 2) Extended configuration:
 * 
 * type HooksType = {
 *   usePrevious: typeof usePrevious
 *   useResizeObserver: typeof useResizeObserver
 * }
 * 
 * type Props = {
 *   exampleProp: boolean;
 * }
 * 
 * const ExampleComponentImpl = (props: Props) => {
 *   const { usePrevious, useResizeObserver, exampleProp } = props as unknown as Props & HooksType
 *   const [bindResizeObserver, { width }] = useResizeObserver()
 *   const prevWidth = usePrevious(width)
 *   return (
 *     <>
 *       <div>current width: {width}</div>
 *       <div>previous width: {prevWidth}</div>
 *     </>
 *   )
 * }
 * 
 * const ExampleComponent = withLazyHooks({
 *   hooks: {
 *     usePrevious: import('pathTo/usePrevious'),
 *     useResizeObserver: import('pathTo/useResizeObserver')
 *   },
 *   Component: ExampleComponentImpl,
 *   queryKey: ['usePrevious', 'useResizeObserver'],
 *   delayedElement: <div>Please wait, loading...</div>,
 *   Fallback: ({ error, resetErrorBoundary }: FallbackProps) => (
 *     <div>
 *       <div role="alert">{error.message}</div>
 *       <button onClick={resetErrorBoundary}>reset</button>
 *     </div>
 *   )
 * })
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

// TODO: currying
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