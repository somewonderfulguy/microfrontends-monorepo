/**
 * HOC that wraps lazy loaded component into Suspence & ErrorBoundary.
 * As loader, `delayedElement` can be passed as loader - if no passed then empty <div aria-busy="true" /> will be displayed.
 * `Fallback` prop will be used if `Component` failed.
 * If no `Fallback` provided, the default fallback will be used.
 * 
 * Ref forwarding is supported.
 * 
 * Default fallback outputs error and reset button. The reset works through key prop that rerenders component completely.
 * 
 * Examples of usage:
 * 
 * // minimal config (bear in mind that if you don't pass `displayName` then it will be `LazyComponent`)
 * const Button = federatedComponent<IButtonProps>()(lazy(() => import('pathTo/Button')))
 * 
 * // full config
 * type RefType = { log: () => void }
 * const Button = federatedComponent<IButtonProps, RefType>({
 *   delayedElement: <>Loading...</>,
 *   Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <button {...props} />,
 *   displayName: 'Button'
 * })(lazy(() => import('pathTo/Button')))
 */

import React, { ComponentType, ReactNode, Suspense, PropsWithoutRef, RefAttributes, ForwardRefExoticComponent, forwardRef } from 'react'
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary'

import { DefaultFallbackComponent, errorHandler, ResetWrapper } from '../federatedShared'

type HOCForRefComponent<T, P extends object> = ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>

type FederatedComponentProps<P> = {
  delayedElement?: ReactNode
  Fallback?: ComponentType<FallbackProps & P>
  displayName?: string
}

const errorMessage = 'Lazy component failed!'

export const withLazyLoad = <P extends object, T extends object = Record<string, unknown>>({ delayedElement, Fallback, displayName }: FederatedComponentProps<P> = {}) => (
  (WrappedComponent: HOCForRefComponent<T, P>): HOCForRefComponent<T, P> => {
    const ReturnComponent = forwardRef<T, P>(((props: P, ref): JSX.Element => (
      <ResetWrapper render={(resetComponent) => (
        <ReactErrorBoundary
          fallbackRender={errorProps => {
            const unitedProps = { ...errorProps, ...props, resetErrorBoundary: resetComponent }
            return (
              Fallback
                ? <Fallback {...unitedProps} />
                : (
                  <DefaultFallbackComponent {...unitedProps}>
                    {errorMessage}
                  </DefaultFallbackComponent>
                )
            )
          }}
          onError={(error, info) => errorHandler(error, { ...info, errorMessage })}
        >
          <Suspense fallback={delayedElement ?? <div aria-busy="true" />}>
            <WrappedComponent {...props as PropsWithoutRef<P>} ref={ref} />
          </Suspense>
        </ReactErrorBoundary>
      )} />
    )))

    ReturnComponent.displayName = `withLazyLoad(${displayName ?? 'LazyComponent'})`

    return ReturnComponent
  }
)