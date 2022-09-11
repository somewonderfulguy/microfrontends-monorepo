/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

/**
 * HOC that wraps federated module that takes lazy loaded component (`Component` in props) wraps it into Suspence & ErrorBoundary.
 * As loader, `delayedElement` can be passed (will be used in <Suspense />).
 * `Fallback` will be used if `Component` failed. If `Fallback` is undefined, then it will got to `FinalFallback`.
 * `FinalFallback` is, as name implies, is a fallback component that will be displayed if:
 * a) `Component` crushed and no `Fallback` provided;
 * b) Both `Component` and `Fallback` crushed;
 * If no `FinalFallback` provided, the default fallback will be used.
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
  Fallback?: LazyExoticComponent<any>,
  FinalFallback?: ComponentType<FallbackProps>
}

export function federatedComponent<T extends ComponentType>({
  Component, delayedElement, FinalFallback, Fallback
}: federatedComponentProps) {
  const SuspenceWrapper = ({ children }: { children: ReactNode }) => (
    <Suspense fallback={delayedElement ?? <div />}>
      {children}
    </Suspense>
  )

  return ((props: { [key: string]: any }) => (
    <ReactErrorBoundary
      fallbackRender={errorProps => {
        const renderFallback = (fallbackProps: FallbackProps) => FinalFallback
          ? <FinalFallback {...fallbackProps} {...props} />
          : <DefaultFallbackComponent {...fallbackProps} {...props} />

        return (
          Fallback ? (
            <ReactErrorBoundary
              fallbackRender={nestedErrorProps => renderFallback(nestedErrorProps)}
              onError={(...args) => errorHandler(...args, true)}
            >
              <SuspenceWrapper>
                <Fallback {...props} />
              </SuspenceWrapper>
            </ReactErrorBoundary>
          ) : renderFallback(errorProps)
        )
      }}
      onError={(...args) => errorHandler(...args)}
    >
      <SuspenceWrapper>
        <Component {...props} />
      </SuspenceWrapper>
    </ReactErrorBoundary>
  )) as unknown as T
}