import React, { lazy } from 'react'
import { FallbackProps } from 'react-error-boundary'

import { IBlockProps, WithLazyLoad } from 'library/src/typesShared'
import { withLazyLoad as sharedWithLazyLoad } from 'library/build-npm/hoc/withLazyLoad'

const withLazyLoad: WithLazyLoad = sharedWithLazyLoad

const Block = withLazyLoad<IBlockProps>({
  delayedElement: 'Loading...',
  Fallback: ({ error, resetErrorBoundary, ...props }: FallbackProps) => <div {...props} />,
  displayName: 'Block'
})(lazy(() => import('library-mf/Block')))

function App() {
  return (
    <Block className="App" withCybercat>
      Sub Application
    </Block>
  )
}

export default App
