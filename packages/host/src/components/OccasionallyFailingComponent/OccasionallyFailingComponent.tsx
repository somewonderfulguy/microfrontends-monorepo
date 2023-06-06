import { lazy, MutableRefObject, useEffect, useRef, useState } from 'react'
import { FallbackProps } from 'react-error-boundary'

import {
  BlockProps,
  ButtonProps,
  ForwardedRefType,
  WithLazyLoad
} from 'library/src/typesShared'
import { withLazyLoad as sharedWithLazyLoad } from 'library/build/hoc/withLazyLoad'

const withLazyLoad: WithLazyLoad = sharedWithLazyLoad

const Block = withLazyLoad<BlockProps, ForwardedRefType>({
  delayedElement: 'Loading...',
  displayName: 'Block'
})(lazy(() => import('library/build/components/Block')))

const Button = withLazyLoad<ButtonProps>({
  delayedElement: <>Loading...</>,
  Fallback: ({
    error,
    resetErrorBoundary,
    ...props
  }: FallbackProps & ButtonProps) => <button {...props} />,
  displayName: 'Button'
})(lazy(() => import('library/build/components/formLike/Button')))

const generateRandomZeroOrOne = () => Math.floor(Math.random() * 2)

const CrushingSubComponent = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (generateRandomZeroOrOne()) throw new Error('Artificial error')
  }, [count])

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      Force re-render
    </button>
  )
}

const OccasionallyFailingComponent = () => {
  const blockRef =
    useRef<ForwardedRefType>() as MutableRefObject<ForwardedRefType>

  return (
    <>
      <Block ref={blockRef}>
        I am a text in a shared block.
        <div>
          <CrushingSubComponent />
        </div>
      </Block>
      <Button onClick={() => blockRef?.current.log()} type="button">
        Click for no reason
      </Button>
    </>
  )
}

export default OccasionallyFailingComponent
