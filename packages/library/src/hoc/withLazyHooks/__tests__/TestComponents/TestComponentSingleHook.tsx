import React, { useEffect } from 'react'

import useTestHookOne from '../testHooks/useTestHookOne'

type HooksType = {
  useTestHookOne: typeof useTestHookOne
}

type Props = {
  withError?: boolean
}

export const errorMsg = '💣'

const TestComponentSingleHook = (props: Props) => {
  const { useTestHookOne, withError = false } = props as unknown as Props & HooksType
  
  useEffect(() => {
    if (withError) throw new Error(errorMsg)
  }, [withError])
  
  const result = useTestHookOne()
  return <div>{result}</div>
}

export default TestComponentSingleHook