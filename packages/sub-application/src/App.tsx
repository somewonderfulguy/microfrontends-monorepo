import React, { lazy } from 'react'
import { FallbackProps } from 'react-error-boundary'

import { BlockComponent, FederatedComponent } from 'library/src/typesShared'
import { federatedComponent as sharedFederatedComponent } from 'library/build-npm/hoc/federatedComponent'

const federatedComponent: FederatedComponent = sharedFederatedComponent

const Block = federatedComponent<BlockComponent>({
  Component: lazy(() => import('library/build-npm/components/Block')),
  delayedElement: 'Loading...',
  Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <div {...props} />
})

function App() {
  return (
    <Block className="App" withCybercat>
      Sub Application
    </Block>
  )
}

export default App
