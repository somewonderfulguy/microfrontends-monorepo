/**
 * HOC that takes lazy loaded component (`Component` in props) wraps it into Suspence & ErrorBoundary.
 * As loader, `delayedElement` can be passed as loader - if no passed then empty <div aria-busy="true" /> will be displayed.
 * `Fallback` prop will be used if `Component` failed.
 * If no `Fallback` provided, the default fallback will be used.
 * 
 * Default fallback outputs error and reset button. The reset works through key prop that rerenders component completely.
 * 
 * Examples of usage:
 * 
 * const Button = federatedComponent<ButtonComponent>({
 *   Component: lazy(() => import('pathTo/Button')),
 *   delayedElement: <>Loading...</>,
 *   Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <button {...props} />
 * })
 * 
 * const Button = federatedComponent<ButtonComponent>({
 *   Component: lazy(() => import('pathTo/Button'))
 * })
 */

import React, { ComponentType, LazyExoticComponent, ReactNode, Suspense } from 'react'
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary'

import { Any } from '../../typesShared'

import { DefaultFallbackComponent, errorHandler, ResetWrapper } from '../federatedShared'

type federatedComponentProps = {
  Component: LazyExoticComponent<Any>
  delayedElement?: ReactNode
  Fallback?: ComponentType<FallbackProps>
}

export const federatedComponent = <T extends ComponentType>({
  Component, delayedElement, Fallback
}: federatedComponentProps) => {
  const SuspenseWrapper = ({ children }: { children: ReactNode }) => (
    <Suspense fallback={delayedElement ?? <div aria-busy="true" />}>
      {children}
    </Suspense>
  )

  return (
    ((props: { [key: string]: Any }) => (
      <ResetWrapper render={(resetComponent) => (
        <ReactErrorBoundary
          fallbackRender={errorProps => {
            const unitedProps = { ...errorProps, ...props, resetErrorBoundary: resetComponent }
            return (
              Fallback
                ? <Fallback {...unitedProps} />
                : (
                  <DefaultFallbackComponent {...unitedProps}>
                    Federated module failed!
                  </DefaultFallbackComponent>
                )
            )
          }}
          onError={(...args) => errorHandler(...args)}
        >
          <SuspenseWrapper>
            <Component {...props} />
          </SuspenseWrapper>
        </ReactErrorBoundary>
      )} />
    )) as unknown as T
  )
}