/**
 * HOC that wraps federated module that takes lazy loaded component (`Component` in props) wraps it into Suspence & ErrorBoundary.
 * As loader, `delayedElement` can be passed as loader - if no passed then empty div will be displayed.
 * `Fallback` will be used if `Component` failed.
 * If no `Fallback` provided, the default fallback will be used.
 * 
 * Default fallback outputs error and reset button. The button resets components by resetting component completely.
 * Resetting component is achieved by changing React's key
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
          fallbackRender={errorProps => (
            Fallback
              ? <Fallback {...errorProps} {...props} />
              : (
                <DefaultFallbackComponent {...errorProps} {...props} resetErrorBoundary={resetComponent}>
                  Federated module failed!
                </DefaultFallbackComponent>
              )
          )}
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