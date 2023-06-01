import React, { lazy } from 'react'
import { FallbackProps } from 'react-error-boundary'

import { BlockProps, WithLazyLoad } from 'library/src/typesShared'
import { withLazyLoad as sharedWithLazyLoad } from 'library/build/hoc/withLazyLoad'

const withLazyLoad: WithLazyLoad = sharedWithLazyLoad

const Block = withLazyLoad<BlockProps>({
  delayedElement: 'Loading...',
  Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <div {...props} />,
  displayName: 'Block'
})(lazy(() => import('library/build/components/Block')))

function App() {
  return (
    <Block className="App" withCybercat withJohnySilverhand>
      Sub Application
    </Block>
  )
}

export default App
