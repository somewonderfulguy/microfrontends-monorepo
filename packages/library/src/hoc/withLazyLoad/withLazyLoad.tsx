/**
 * HOC that wraps lazy loaded component into Suspense & ErrorBoundary.
 * As loader, `delayedElement` can be passed - if no passed then empty <div aria-busy="true" /> will be displayed.
 * `Fallback` prop will be used if lazily loaded component failed.
 * If no `Fallback` provided, the default fallback will be used.
 *
 * Ref forwarding is supported.
 *
 * Default fallback outputs error and reset button. The reset works through key prop that re-renders component completely.
 *
 * Examples of usage:
 *
 * // minimal config (bear in mind that if you don't pass `displayName` then it will be `LazyComponent`)
 * const Button = federatedComponent<ButtonProps>()(lazy(() => import('pathTo/Button')))
 *
 * // full config (all props & ref)
 * type RefType = { log: () => void }
 * const Button = federatedComponent<ButtonProps, RefType>({
 *   delayedElement: <>Loading...</>,
 *   // see FallbackProps & ButtonProps - this is for ESLint (react/prop-types rule), TS actually will work perfectly
 *   Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps & ButtonProps) => <button {...props} />,
 *   displayName: 'Button'
 * })(lazy(() => import('pathTo/Button')))
 */

import {
  ComponentType,
  ReactNode,
  Suspense,
  PropsWithoutRef,
  forwardRef
} from 'react'
import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps
} from 'react-error-boundary'

import {
  DefaultFallbackComponent,
  errorHandler,
  ResetWrapper
} from '../federatedShared'
import { HOCRefComponent } from '../types'

type FederatedComponentProps<TProps> = {
  delayedElement?: ReactNode
  Fallback?: ComponentType<FallbackProps & TProps>
  displayName?: string
}

const errorMessage = 'Lazy component failed!'

export const withLazyLoad =
  <TProps extends object, TRef extends object = Record<string, unknown>>({
    delayedElement,
    Fallback,
    displayName
  }: FederatedComponentProps<TProps> = {}) =>
  (
    WrappedComponent: HOCRefComponent<TRef, TProps>
  ): HOCRefComponent<TRef, TProps> => {
    const ReturnComponent = forwardRef<TRef, TProps>(
      (props: TProps, ref): JSX.Element => (
        <ResetWrapper
          render={(resetComponent) => (
            <ReactErrorBoundary
              fallbackRender={(errorProps) => {
                const unitedProps = {
                  ...errorProps,
                  ...props,
                  resetErrorBoundary: resetComponent
                }
                return Fallback ? (
                  <Fallback {...unitedProps} />
                ) : (
                  <DefaultFallbackComponent {...unitedProps}>
                    {errorMessage}
                  </DefaultFallbackComponent>
                )
              }}
              onError={(error, info) =>
                errorHandler(error, { ...info, errorMessage })
              }
            >
              <Suspense fallback={delayedElement ?? <div aria-busy="true" />}>
                <WrappedComponent
                  {...(props as PropsWithoutRef<TProps>)}
                  ref={ref}
                />
              </Suspense>
            </ReactErrorBoundary>
          )}
        />
      )
    )

    ReturnComponent.displayName = `withLazyLoad(${
      displayName ?? 'LazyComponent'
    })`

    return ReturnComponent
  }
