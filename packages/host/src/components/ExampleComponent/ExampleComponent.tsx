import React from 'react'

import { Any, DivRefType, WithLazyHooks, usePreviousHook, useResizeObserverHook } from 'library/src/typesShared'
import { withLazyHooks as sharedWithLazyHooks } from 'library/build-npm/hoc/withLazyHooks'

const withLazyHooks: WithLazyHooks = sharedWithLazyHooks

type HooksType = {
  usePrevious: usePreviousHook
  useResizeObserver: useResizeObserverHook
}

const ExampleComponentImpl = ((props: Any) => {
  const { usePrevious, useResizeObserver } = props as HooksType
  const [bindResizeObserver, { width }] = useResizeObserver()
  const prevWidth = usePrevious(width)
  return (
    <>
      <div ref={bindResizeObserver as DivRefType} />
      <div>Current width: {width}</div>
      <div>Previous width: {prevWidth}</div>
    </>
  )
})

const ExampleComponent = withLazyHooks({
  hooks: {
    usePrevious: import('library/build-npm/hooks/usePrevious'),
    useResizeObserver: import('library/build-npm/hooks/useResizeObserver')
  },
  Component: ExampleComponentImpl,
  queryKey: ['usePrevious', 'useResizeObserver']
})

export default ExampleComponent
