/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

/**
 * HOC that wraps federated module that takes lazy loaded component wraps it into Suspence & ErrorBoundary
 */

import React, { ComponentType, LazyExoticComponent, ReactNode, Suspense } from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';

import styles from './federatedComponent.module.css';

const FallbackComponent = ({ error }: FallbackProps) => (
  <div role="alert" className={styles.error}>
    <p>Federated module failed!</p>
    <pre>{error.message}</pre>
  </div>
);

function errorHandler(error: Error, info: { componentStack: string; }) {
  const logStyle = (size = 18) => `color: white; background: red; font-size: ${size}px`;
  console.log(`%cFederated module failed!`, logStyle(24));
  console.dir(error);
  console.dir(info.componentStack);
}

export function federatedComponent<T extends ComponentType>(
  Component: LazyExoticComponent<any>,
  delayedElement?: ReactNode,
  Fallback?: ComponentType<FallbackProps>
) {
  return ((props: { [key: string]: any }) => (
    <ReactErrorBoundary
      fallbackRender={props => (
        Fallback
          ? <Fallback {...props} />
          : <FallbackComponent {...props} />
      )}
      onError={(...args) => errorHandler(...args)}
    >
      <Suspense fallback={delayedElement ?? <div />}>
        <Component {...props} />
      </Suspense>
    </ReactErrorBoundary>
  )) as unknown as T;
}