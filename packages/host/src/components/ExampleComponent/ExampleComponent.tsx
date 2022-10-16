import React from 'react'

import { Any, DivRefType, WithLazyHooks, usePreviousHook, useResizeObserverHook } from 'shared/src/typesShared'
import { withLazyHooks as sharedWithLazyHooks } from 'shared/build-npm/hoc'

const withLazyHooks: WithLazyHooks = sharedWithLazyHooks

type hooksType = {
  usePrevious: usePreviousHook
  useResizeObserver: useResizeObserverHook
}

const ExampleComponentImpl = ((props: Any) => {
  const { usePrevious, useResizeObserver } = props as hooksType;
  const [bindResizeObserver, { width }] = useResizeObserver();
  const prevWidth = usePrevious(width);
  return (
    <>
      <div ref={bindResizeObserver as DivRefType} />
      <div>Current width: {width}</div>
      <div>Previous width: {prevWidth}</div>
    </>
  )
});

const ExampleComponent = withLazyHooks<Any>({
  hooks: {
    usePrevious: import('shared-mf/usePrevious'),
    useResizeObserver: import('shared-mf/useResizeObserver')
  },
  Component: ExampleComponentImpl,
  queryKey: ['useSomeHook', 'useAnotherHook']
})

export default ExampleComponent
