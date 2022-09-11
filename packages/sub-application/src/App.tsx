import React, { lazy } from 'react'
import { FallbackProps } from 'react-error-boundary'

import { BlockComponent, FederatedComponent } from 'shared/src/typesShared'
import { federatedComponent as sharedFederatedComponent } from 'shared/build-npm/hoc'

const federatedComponent: FederatedComponent = sharedFederatedComponent

const Block = federatedComponent<BlockComponent>({
  Component: lazy(() => import('shared/build-npm/components/Block')),
  delayedElement: 'Loading...',
  FinalFallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <div {...props} />
})

function App() {
  return (
    <Block className="App">
      Sub Application
    </Block>
  )
}

export default App
