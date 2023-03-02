import React, { lazy, MutableRefObject, useRef } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { WithLazyLoad, IBlockProps, IButtonProps } from 'library/src/typesShared'
import { withLazyLoad as sharedWithLazyLoad } from 'library/build-npm/hoc/withLazyLoad'

import { ExampleComponent } from 'components'
import 'services/resizeObserverPolyfill'
import 'styles/index.css'

import styles from './App.module.css'

const withLazyLoad: WithLazyLoad = sharedWithLazyLoad

const Block = withLazyLoad<IBlockProps, { log: () => void }>({
  delayedElement: 'Loading...',
  Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <div {...props} />,
  displayName: 'Block'
})(lazy(() => import('library/build-npm/components/Block')))

const Button = withLazyLoad<IButtonProps>({
  delayedElement: <>Loading...</>,
  Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <button {...props} />,
  displayName: 'Button'
})(lazy(() => import('library/build-npm/components/formLike/Button')))

const SubApplication = withLazyLoad({
  delayedElement: 'please wait...',
  displayName: 'SubApplication'
})(lazy(() => import('sub-application/build-npm/App')))

const queryClient = new QueryClient()

const App = () => {
  const blockRef = useRef<{ log: () => void; }>() as MutableRefObject<{ log: () => void }>;
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.app}>
        <SubApplication />
        <Block ref={blockRef}>I am a text in a shared block</Block>
        <div>
          <Button onClick={() => blockRef?.current?.log()} type="button">Click for no reason</Button>
        </div>
      </div>
      <div className={styles.exampleContainer}>
        <ExampleComponent />
      </div>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  )
}

export default App
