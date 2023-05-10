import React, { ReactNode, forwardRef, useEffect, useImperativeHandle } from 'react'

export type PropType = {
  children?: ReactNode
  withError?: boolean
}

export type RefType = {
  log: () => void
}

export const errorMsg = '💣'
export const logMsg = 'it works!'

const TestComponent = forwardRef(({ children, withError }: PropType, ref) => {
  // eslint-disable-next-line no-console
  useImperativeHandle(ref, () => ({ log: () => console.log(logMsg) }))

  useEffect(() => {
    if (withError) throw new Error(errorMsg)
  }, [withError])

  return (
    <div>{children}</div>
  )
})
TestComponent.displayName = 'TestComponent'

export default TestComponent