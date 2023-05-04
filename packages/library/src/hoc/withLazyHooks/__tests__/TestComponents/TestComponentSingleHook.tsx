import React, { useEffect } from 'react'

import useTestHookOne from '../testHooks/useTestHookOne'

export type HooksType = {
  useTestHookOne: typeof useTestHookOne
}

export type PropType = {
  withError?: boolean
}

export const errorMsg = '💣'

const TestComponentSingleHook = ({ useTestHookOne, withError }: PropType & HooksType) => {
  useEffect(() => {
    if (withError) throw new Error(errorMsg)
  }, [withError])

  const result = useTestHookOne()
  return <div>{result}</div>
}

export default TestComponentSingleHook