/* eslint-disable no-console */

import React, { Fragment, ReactNode, useCallback, useState } from 'react'
import { FallbackProps } from 'react-error-boundary'

import { Any } from '../typesShared'

import styles from './federated.module.css'

interface IDefaultFallbackComponent extends FallbackProps {
  children?: ReactNode
}

const DefaultFallbackComponent = ({ children, error, resetErrorBoundary }: IDefaultFallbackComponent) => (
  <div role="alert" className={styles.error}>
    <p>{children}</p>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary} className={styles.errorButton} title="Reset component">Try to reset</button>
  </div>
)

const errorHandler = (error: Error, info?: { componentStack: string }) => {
  console.log(`%cFederated module failed!`, 'color: white; background: red; font-size: 24px')
  console.dir(error)
  info && console.dir(info.componentStack)
}

const ResetWrapper = ({ render }: { render: (resetComponent: Any) => ReactNode }) => {
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

export { DefaultFallbackComponent, errorHandler, ResetWrapper }