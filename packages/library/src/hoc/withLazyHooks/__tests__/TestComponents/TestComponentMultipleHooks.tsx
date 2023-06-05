import React from 'react'

import useTestHookOne from '../testHooks/useTestHookOne'
import useTestHookTwo from '../testHooks/useTestHookTwo'

export type HooksType = {
  useTestHookOne: typeof useTestHookOne
  useTestHookTwo: typeof useTestHookTwo
}

const TestComponentMultipleHooks = ({
  useTestHookOne,
  useTestHookTwo
}: HooksType) => {
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
