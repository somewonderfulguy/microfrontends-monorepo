import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import type { Preview } from '@storybook/react'
import 'augmented-ui/augmented-ui.min.css'

import '../src/styles/fonts.css'

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
    },
    backgrounds: {
      default: 'cyberpunk',
      values: [{ name: 'cyberpunk', value: '#f5ed00' }]
    }
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    )
  ]
}

// Storybook makes lots of requests and MSW throws warnings about unhandled requests, so whitelist some endpoints
const whiteListEndpoints = [
  '/sb-common-assets',
  '/static/media',
  '/node_modules_',
  '.bundle.js',
  '/iframe.html'
]

if (typeof global.process === 'undefined') {
  const { worker } = require('../src/api/offline')
  worker.start({
    onUnhandledRequest(req, print) {
      if (
        whiteListEndpoints.some((endpoint) =>
          req.url.pathname.includes(endpoint)
        )
      ) {
        return
      }
      print.warning()
    }
  })
}

export const globalTypes = {
  scheme: {
    name: 'Scheme',
    description: 'Color scheme',
    defaultValue: 'all',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'all', title: 'All', icon: 'circlehollow' },
        { value: 'light', title: 'Light', icon: 'circlehollow' },
        { value: 'dark', title: 'Dark', icon: 'circlehollow' }
      ]
    }
  }
}

export default preview
