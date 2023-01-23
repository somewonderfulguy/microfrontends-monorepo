import React, { ComponentType, lazy } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { BlockComponent, ButtonComponent, FederatedComponent } from 'shared/src/typesShared'
import { federatedComponent as sharedFederatedComponent } from 'shared/build-npm/hoc/federatedComponent'

import { ExampleComponent } from 'components'
import 'services/resizeObserverPolyfill'

const federatedComponent: FederatedComponent = sharedFederatedComponent

const Block = federatedComponent<BlockComponent>({
  Component: lazy(() => import('shared/build-npm/components/Block')),
  delayedElement: 'Loading...',
  Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <div {...props} />
})
const Button = federatedComponent<ButtonComponent>({
  Component: lazy(() => import('shared/build-npm/components/formLike/Button')),
  delayedElement: <>Loading...</>,
  Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <button {...props} />
})
const SubApplication = federatedComponent<ComponentType>({
  Component: lazy(() => import('sub-application/build-npm/App')),
  delayedElement: 'please wait...',
})

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className="App">
      <Block>I am a text in a shared block</Block>
      <Button isPreview type="button">Click for no reason</Button>
      <SubApplication />
      Text from host app
      <ExampleComponent />
    </div>
    <ReactQueryDevtools position="bottom-right" />
  </QueryClientProvider>
)

export default App
