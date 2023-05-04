import React, { lazy, MutableRefObject, useRef } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

// TODO: no I in front of interface
import { WithLazyLoad, IBlockProps, IButtonProps, ForwardedRefType } from 'library/src/typesShared'
import { withLazyLoad as sharedWithLazyLoad } from 'library/build-npm/hoc/withLazyLoad'

import { ExampleComponent, ExampleComponentWithRef } from 'components'
import 'polyfills'
import 'styles/index.css'

import styles from './App.module.css'

const withLazyLoad: WithLazyLoad = sharedWithLazyLoad

const Block = withLazyLoad<IBlockProps, { log: () => void }>({
  delayedElement: 'Loading...',
  Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps & IBlockProps) => <div {...props} />,
  displayName: 'Block'
})(lazy(() => import('library/build-npm/components/Block')))

const Button = withLazyLoad<IButtonProps>({
  delayedElement: <>Loading...</>,
  Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps & IButtonProps) => <button {...props} />,
  displayName: 'Button'
})(lazy(() => import('library/build-npm/components/formLike/Button')))

const SubApplication = withLazyLoad({
  delayedElement: 'please wait...',
  displayName: 'SubApplication'
})(lazy(() => import('sub-application/build-npm/App')))

const queryClient = new QueryClient()

const App = () => {
  const blockRef = useRef<ForwardedRefType>() as MutableRefObject<ForwardedRefType>
  const exampleComponentRef = useRef<{ crushComponent: () => void }>() as MutableRefObject<{ crushComponent: () => void }>

  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.app}>
        <SubApplication />
        {/* TODO: add occasional crushing */}
        <Block ref={blockRef}>I am a text in a shared block</Block>
        <div className={styles.buttons}>
          <Button onClick={() => blockRef?.current.log()} type="button">Click for no reason</Button>
          <Button onClick={() => exampleComponentRef?.current.crushComponent()} type="button">Click to crush component</Button>
        </div>
      </div>
      <div className={styles.exampleContainer}>
        <ExampleComponent />
      </div>
      <div className={styles.exampleContainer}>
        <ExampleComponentWithRef exampleProp="Example Text" ref={exampleComponentRef} />
      </div>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  )
}

export default App
