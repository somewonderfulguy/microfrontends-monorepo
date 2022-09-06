/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

/**
 * HOC that wraps federated module that takes lazy loaded component (`Component` in props) wraps it into Suspence & ErrorBoundary.
 * As loader, `delayedElement` can be passed (will be used in <Suspense />).
 * `NPMFallback` will be used if `Component` failed. If `NPMFallback` is undefined, then it will got to `Fallback`.
 * `Fallback` is, as name implies, a fallback component that will be displayed if:
 * a) `Component` crushed and no `NPMFallback` provided;
 * b) Both `Component` and `NPMFallback` crushed;
 * If no `Fallback` provided, the default fallback will be used.
 */

import React, { ComponentType, LazyExoticComponent, ReactNode, Suspense } from 'react'
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary'

const errorStyle = {
  display: 'inline-block',
  background: 'rgba(255, 0, 0, 0.226)',
  padding: '5px 15px'
}

// TODO: try resetErrorBoundary
const DefaultFallbackComponent = ({ error }: FallbackProps) => (
  <div role="alert" style={errorStyle}>
    <p>Federated module failed!</p>
    <pre>{error.message}</pre>
  </div>
)

function errorHandler(error: Error, info: { componentStack: string }, isNpm = false) {
  const logStyle = (size = 18) => `color: white; background: red; font-size: ${size}px`
  console.log(`%c${isNpm ? 'NPM' : 'Federated'} module failed!`, logStyle(24))
  console.dir(error)
  console.dir(info.componentStack)
}

type federatedComponentProps = {
  Component: LazyExoticComponent<any>,
  delayedElement?: ReactNode,
  NPMFallback?: LazyExoticComponent<any>,
  Fallback?: ComponentType<FallbackProps>
}

export function federatedComponent<T extends ComponentType>({
  Component, delayedElement, Fallback, NPMFallback
}: federatedComponentProps) {
  const SuspenceWrapper = ({ children }: { children: ReactNode }) => (
    <Suspense fallback={delayedElement ?? <div />}>
      {children}
    </Suspense>
  )

  return ((props: { [key: string]: any }) => (
    <ReactErrorBoundary
      fallbackRender={errorProps => {
        const renderFallback = (fallbackProps: FallbackProps) => Fallback
          ? <Fallback {...fallbackProps} {...props} />
          : <DefaultFallbackComponent {...fallbackProps} {...props} />

        return (
          NPMFallback ? (
            <ReactErrorBoundary
              fallbackRender={nestedErrorProps => renderFallback(nestedErrorProps)}
              onError={(...args) => errorHandler(...args, true)}
            >
              <SuspenceWrapper>
                <NPMFallback {...props} />
              </SuspenceWrapper>
            </ReactErrorBoundary>
          ) : renderFallback(errorProps)
        );
      }}
      onError={(...args) => errorHandler(...args)}
    >
      <SuspenceWrapper>
        <Component {...props} />
      </SuspenceWrapper>
    </ReactErrorBoundary>
  )) as unknown as T
}