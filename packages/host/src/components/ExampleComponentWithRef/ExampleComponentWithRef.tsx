import { forwardRef, useImperativeHandle, useState } from 'react'

import { WithLazyHooks, usePreviousHook } from 'library/src/typesShared'
import { withLazyHooks as sharedWithLazyHooks } from 'library/build/hoc/withLazyHooks'
import { FallbackProps } from 'react-error-boundary'

const withLazyHooks: WithLazyHooks = sharedWithLazyHooks

type PropType = {
  exampleProp: string
}

type HooksType = {
  usePrevious: usePreviousHook
}

const ExampleComponentWithRef = forwardRef(
  ({ usePrevious, exampleProp }: PropType & HooksType, ref) => {
    const [count, setCount] = useState(0)
    const previousExampleProp = usePrevious(exampleProp)

    useImperativeHandle(ref, () => ({ crushComponent: () => void setCount(1) }))
    if (count === 1) throw new Error('Crushed component')

    return (
      <>
        {exampleProp} {previousExampleProp}
      </>
    )
  }
)
ExampleComponentWithRef.displayName = 'ExampleComponentWithRef'

const ExampleComponentWithRefWrapped = withLazyHooks<
  HooksType,
  PropType,
  { crushComponent: () => void }
>({
  hooks: { usePrevious: import('library/build/hooks/usePrevious') },
  delayedElement: <div>Please wait, loading...</div>,
  Fallback: ({
    error,
    resetErrorBoundary,
    ...props
  }: FallbackProps & PropType) => (
    <div>
      Custom fallback,{' '}
      <button onClick={resetErrorBoundary}>try to reset</button>
      <br />
      Error: {error.message}
      <br />
      Props: {JSON.stringify(props)}
    </div>
  )
})(ExampleComponentWithRef)

export default ExampleComponentWithRefWrapped
