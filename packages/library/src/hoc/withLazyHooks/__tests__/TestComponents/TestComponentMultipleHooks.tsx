import React from 'react'

import { Any } from '../../../../typesShared'

import useTestHookOne from '../testHooks/useTestHookOne'
import useTestHookTwo from '../testHooks/useTestHookTwo'

type HooksType = {
  useTestHookOne: typeof useTestHookOne,
  useTestHookTwo: typeof useTestHookTwo
}

const TestComponentMultipleHooks = (props: Any) => {
  const { useTestHookOne, useTestHookTwo } = props as HooksType
  const resultOne = useTestHookOne()
  const resultTwo = useTestHookTwo()
  return (
    <>
      <div>{resultOne}</div>
      <div>{resultTwo}</div>
    </>
  )
}

export default TestComponentMultipleHooks