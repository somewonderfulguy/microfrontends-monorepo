import React, { ComponentType, lazy } from 'react'
import { FallbackProps } from 'react-error-boundary'

import { BlockComponent, ButtonComponent, FederatedComponent } from 'shared/src/typesShared'
import { federatedComponent as sharedFederatedComponent } from 'shared/build-npm/hoc'

const federatedComponent: FederatedComponent = sharedFederatedComponent

const Block = federatedComponent<BlockComponent>({
  Component: lazy(() => import('shared-mf/Block')),
  delayedElement: 'Loading...',
  Fallback: lazy(() => import('shared/build-npm/components/Block')),
  FinalFallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <div {...props} />
})
const Button = federatedComponent<ButtonComponent>({
  Component: lazy(() => import('shared-mf/Button')),
  delayedElement: <>Loading...</>,
  Fallback: lazy(() => import('shared/build-npm/components/formLike/Button')),
  FinalFallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <button {...props} />
})
const SubApplication = federatedComponent<ComponentType>({
  Component: lazy(() => import('sub-application-mf/app')),
  delayedElement: 'please wait...',
  Fallback: lazy(() => import('sub-application/build-npm/App'))
})

function App() {
  return (
    <div className="App">
      <Block>I am a text in a shared block</Block>
      <Button type="button">Click for no reason</Button>
      <SubApplication />
      Text from host app
    </div>
  )
}

export default App
