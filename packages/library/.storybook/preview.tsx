import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import type { Preview } from '@storybook/react'

import '../src/styles/cyberFont.css'

// TODO: update react-query to the latest version
const queryClient = new QueryClient()

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>{Story()}</QueryClientProvider>
    )
  ]
}

export default preview
