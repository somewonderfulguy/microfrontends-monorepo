import React, { ComponentType, lazy } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { BlockComponent, ButtonComponent, FederatedComponent } from 'library/src/typesShared'
import { federatedComponent as sharedFederatedComponent } from 'library/build-npm/hoc/federatedComponent'
// import Button from 'library/Button'

// import { ExampleComponent } from 'components'
import 'services/resizeObserverPolyfill'
import 'styles/index.css'

import styles from './App.module.css'

const federatedComponent: FederatedComponent = sharedFederatedComponent

// const Block = federatedComponent<BlockComponent>({
//   Component: lazy(() => import('library/Block')),
//   delayedElement: 'Loading...',
//   Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <div {...props} />
// })
const Button = federatedComponent<ButtonComponent>({
  Component: lazy(() => import('library/Button')),
  delayedElement: <>Loading...</>,
  Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <button {...props} />
})
// const SubApplication = federatedComponent<ComponentType>({
//   Component: lazy(() => import('sub-application/app')),
//   delayedElement: 'please wait...',
// })

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className={styles.app}>
      <Button type="button">Click for no reason</Button>
      {/* <SubApplication /> */}
      {/* <Block>I am a text in a shared block</Block>
      <div>
        <Button type="button">Click for no reason</Button>
      </div> */}
    </div>
    {/* <div className={styles.exampleContainer}>
      <ExampleComponent />
    </div> */}
    <ReactQueryDevtools position="bottom-right" />
  </QueryClientProvider>
)

export default App
