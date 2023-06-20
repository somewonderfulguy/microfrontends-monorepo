import { forwardRef, useEffect, useImperativeHandle } from 'react'

import useTestHookOne from '../testHooks/useTestHookOne'

export type HooksType = {
  useTestHookOne: typeof useTestHookOne
}

export type PropType = {
  withError?: boolean
}

export type RefType = {
  log: () => void
}

export const errorMsg = '💣'
export const logMsg = 'it works!'

const TestComponentSingleHook = forwardRef<RefType, PropType & HooksType>(
  ({ useTestHookOne, withError }, ref) => {
    // TODO: replace (or not, investigate) with alert or something else (console.log affects tests)
    // eslint-disable-next-line no-console
    useImperativeHandle(ref, () => ({ log: () => console.log(logMsg) }))

    useEffect(() => {
      if (withError) throw new Error(errorMsg)
    }, [withError])

    const result = useTestHookOne()
    return <div>{result}</div>
  }
)
TestComponentSingleHook.displayName = 'TestComponentSingleHook'

export default TestComponentSingleHook
