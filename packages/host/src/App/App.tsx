import { lazy, MutableRefObject, useRef } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { WithLazyLoad, ButtonProps } from 'library/src/typesShared'
import { withLazyLoad as sharedWithLazyLoad } from 'library/build/hoc/withLazyLoad'

import {
  ExampleComponent,
  ExampleComponentWithRef,
  OccasionallyFailingComponent
} from 'components'
import 'polyfills'
import 'styles/index.css'

import styles from './App.module.css'

const withLazyLoad: WithLazyLoad = sharedWithLazyLoad

const Button = withLazyLoad<ButtonProps>({
  delayedElement: <>Loading...</>,
  Fallback: ({
    error,
    resetErrorBoundary,
    ...props
  }: FallbackProps & ButtonProps) => <button {...props} />,
  displayName: 'Button'
})(lazy(() => import('library/build/components/controls/Button')))

const SubApplication = withLazyLoad({
  delayedElement: 'please wait...',
  displayName: 'SubApplication'
})(lazy(() => import('sub-application/build-npm/App')))

const queryClient = new QueryClient()

const App = () => {
  const exampleComponentRef = useRef<{
    crushComponent: () => void
  }>() as MutableRefObject<{ crushComponent: () => void }>

  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.app}>
        <SubApplication />
        <OccasionallyFailingComponent />
        <div className={styles.buttons}>
          <Button
            onClick={() => exampleComponentRef?.current.crushComponent()}
            type="button"
          >
            Click to crush component
          </Button>
        </div>
      </div>
      <div className={styles.exampleContainer}>
        <ExampleComponent />
      </div>
      <div className={styles.exampleContainer}>
        <ExampleComponentWithRef
          exampleProp="Example Text"
          ref={exampleComponentRef}
        />
      </div>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  )
}

export default App
