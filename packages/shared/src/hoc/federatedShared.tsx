/* eslint-disable no-console */

import React, { Fragment, ReactNode, useCallback, useState } from 'react'
import { FallbackProps } from 'react-error-boundary'

import { Any } from '../typesShared'

const errorStyle = {
  display: 'inline-block',
  background: 'rgba(255, 0, 0, 0.226)',
  padding: '5px 15px 20px'
}
const errorButtonStyle = { cursor: 'pointer' }

interface IDefaultFallbackComponent extends FallbackProps {
  children?: ReactNode
}

const DefaultFallbackComponent = ({ children, error, resetErrorBoundary }: IDefaultFallbackComponent) => (
  <div role="alert" style={errorStyle}>
    <p>{children}</p>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary} style={errorButtonStyle} title="Reset component">Try to reset</button>
  </div>
)

const errorHandler = (error: Error, info?: { componentStack: string }) => {
  const logStyle = (size = 18) => `color: white; background: red; font-size: ${size}px`
  console.log(`%cFederated module failed!`, logStyle(24))
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