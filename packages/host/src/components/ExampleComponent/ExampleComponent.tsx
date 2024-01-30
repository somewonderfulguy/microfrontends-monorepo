import {
  WithLazyHooks,
  usePreviousHook,
  useResizeObserverHook
} from 'library/src/typesShared'
import { withLazyHooks as sharedWithLazyHooks } from 'library/build/hoc/withLazyHooks'

const withLazyHooks: WithLazyHooks = sharedWithLazyHooks

type HooksType = {
  usePrevious: usePreviousHook
  useResizeObserver: useResizeObserverHook
}

const ExampleComponent = ({ usePrevious, useResizeObserver }: HooksType) => {
  const [bindResizeObserver, { width }] = useResizeObserver<HTMLDivElement>()
  const prevWidth = usePrevious(width)

  return (
    <>
      <div ref={bindResizeObserver} />
      <div>Current width: {width}</div>
      <div>Previous width: {prevWidth}</div>
    </>
  )
}

const ExampleComponentWrapped = withLazyHooks<HooksType>({
  hooks: {
    usePrevious: import('library/build/hooks/usePrevious'),
    useResizeObserver: import('library/build/hooks/useResizeObserver')
  }
})(ExampleComponent)

export default ExampleComponentWrapped
