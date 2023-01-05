import React from 'react'

import { Any } from '../../../../typesShared'

import useTestHookOne from '../testHooks/useTestHookOne'

type HooksType = {
  useTestHookOne: typeof useTestHookOne
}

const TestComponentSingleHook = (props: Any) => {
  const { useTestHookOne } = props as HooksType
  const result = useTestHookOne()
  return <div>{result}</div>
}

export default TestComponentSingleHook