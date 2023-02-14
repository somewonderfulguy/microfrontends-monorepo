import React, { ReactNode, useEffect } from 'react'

export interface IProps {
  children?: ReactNode
  withError?: boolean
}

export const errorMsg = '💣'

const TestComponent = ({ children, withError }: IProps) => {
  useEffect(() => {
    if (withError) throw new Error(errorMsg)
  }, [withError])

  return (
    <div>{children}</div>
  )
}

export default TestComponent