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
 * 
 * Default fallback outputs error and reset button. The button resets components by resetting component completely.
 * Resetting component is achieved by changing React's key
 */

import React, { ComponentType, Fragment, LazyExoticComponent, ReactNode, Suspense, useCallback, useState } from 'react'
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary'

const errorStyle = {
  display: 'inline-block',
  background: 'rgba(255, 0, 0, 0.226)',
  padding: '5px 15px 20px'
}
const errorButtonStyle = { cursor: 'pointer' }

const DefaultFallbackComponent = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div role="alert" style={errorStyle}>
    <p>Federated module failed!</p>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary} style={errorButtonStyle} title="Reset component">Try to reset</button>
  </div>
)

const errorHandler = (error: Error, info: { componentStack: string }, isNpm = false) => {
  const logStyle = (size = 18) => `color: white; background: red; font-size: ${size}px`
  console.log(`%c${isNpm ? 'NPM' : 'Federated'} module failed!`, logStyle(24))
  console.dir(error)
  console.dir(info.componentStack)
}

const ResetWrapper = ({ render }: { render: (resetComponent: any) => ReactNode }) => {
  const getKey = () => new Date().getTime()
  const [key, setKey] = useState(() => getKey())
  const resetComponent = useCallback(() => void setKey(getKey()), [])

  return (
    // changing key resets node completely and internal state of all subcomponents
    <Fragment key={key}>
      {render(resetComponent)}
    </Fragment>
  )
}

type federatedComponentProps = {
  Component: LazyExoticComponent<any>
  delayedElement?: ReactNode
  Fallback?: LazyExoticComponent<any>
  FinalFallback?: ComponentType<FallbackProps>
}

export const federatedComponent = <T extends ComponentType>({
  Component, delayedElement, FinalFallback, Fallback
}: federatedComponentProps) => {
  const SuspenceWrapper = ({ children }: { children: ReactNode }) => (
    <Suspense fallback={delayedElement ?? <div aria-busy="true" />}>
      {children}
    </Suspense>
  )

  return (
    ((props: { [key: string]: any }) => (
      <ResetWrapper render={(resetComponent) => (
        <ReactErrorBoundary
          fallbackRender={errorProps => {
            const renderFallback = (fallbackProps: FallbackProps) => FinalFallback
              ? <FinalFallback {...fallbackProps} {...props} />
              : <DefaultFallbackComponent {...fallbackProps} {...props} resetErrorBoundary={resetComponent} />

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
      )} />
    )) as unknown as T
  )
}