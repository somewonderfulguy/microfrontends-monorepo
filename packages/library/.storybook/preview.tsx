import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import type { Preview } from '@storybook/react'
import { Addon } from 'storybook-addon-multiselect'
import 'augmented-ui/augmented-ui.min.css'

import '../src/styles/fonts.css'

const svgSharedProps = {
  stroke: 'currentColor',
  height: '1em',
  width: '1em',
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 16 16',
  fill: 'currentColor',
  strokeWidth: '0'
}

const svgPrioritySharedProps = {
  ...svgSharedProps,
  fill: 'none',
  viewBox: '0 0 24 24'
}

// TODO: update react-query to the latest version
const queryClient = new QueryClient()

const multiselect: Addon = {
  themeAndLanguage: {
    icon: 'cog',
    name: 'Theme & Language',
    description: 'Change the theme and language of the components',
    elements: [
      {
        type: 'reset'
      },
      {
        type: 'singleSelect',
        queryKey: 'priority',
        title: 'Priority',
        defaultValue: 'theme',
        options: [
          {
            title: 'Theme',
            value: 'theme',
            left: (
              <svg {...svgPrioritySharedProps}>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.20348 2.00378C9.46407 2.00378 10.5067 3.10742 10.6786 4.54241L19.1622 13.0259L11.384 20.8041C10.2124 21.9757 8.31291 21.9757 7.14134 20.8041L2.8987 16.5615C1.72713 15.3899 1.72713 13.4904 2.8987 12.3188L5.70348 9.51404V4.96099C5.70348 3.32777 6.82277 2.00378 8.20348 2.00378ZM8.70348 4.96099V6.51404L7.70348 7.51404V4.96099C7.70348 4.63435 7.92734 4.36955 8.20348 4.36955C8.47963 4.36955 8.70348 4.63435 8.70348 4.96099ZM8.70348 10.8754V9.34247L4.31291 13.733C3.92239 14.1236 3.92239 14.7567 4.31291 15.1473L8.55555 19.3899C8.94608 19.7804 9.57924 19.7804 9.96977 19.3899L16.3337 13.0259L10.7035 7.39569V10.8754C10.7035 10.9184 10.7027 10.9612 10.7012 11.0038H8.69168C8.69941 10.9625 8.70348 10.9195 8.70348 10.8754Z"
                  fill="currentColor"
                />
                <path
                  d="M16.8586 16.8749C15.687 18.0465 15.687 19.946 16.8586 21.1175C18.0302 22.2891 19.9297 22.2891 21.1013 21.1175C22.2728 19.946 22.2728 18.0465 21.1013 16.8749L18.9799 14.7536L16.8586 16.8749Z"
                  fill="currentColor"
                />
              </svg>
            )
          },
          {
            title: 'Language',
            value: 'lang',
            left: (
              <svg
                {...svgPrioritySharedProps}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 5h7" />
                <path d="M7 4c0 4.846 0 7 .5 8" />
                <path d="M10 8.5c0 2.286 -2 4.5 -3.5 4.5s-2.5 -1.135 -2.5 -2c0 -2 1 -3 3 -3s5 .57 5 2.857c0 1.524 -.667 2.571 -2 3.143" />
                <path d="M12 20l4 -9l4 9" />
                <path d="M19.1 18h-6.2" />
              </svg>
            )
          }
        ]
      },
      {
        type: 'singleSelect',
        queryKey: 'orientation',
        title: 'Orientation',
        defaultValue: 'horizontal',
        options: [
          {
            title: 'Horizontal',
            value: 'horizontal',
            left: (
              <svg
                {...svgSharedProps}
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
              >
                <path d="M14 1H3L2 2v11l1 1h11l1-1V2l-1-1zM8 13H3V2h5v11zm6 0H9V2h5v11z" />
              </svg>
            )
          },
          {
            title: 'Vertical',
            value: 'vertical',
            left: (
              <svg
                {...svgSharedProps}
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
              >
                <path d="M14 1H3L2 2v11l1 1h11l1-1V2l-1-1zm0 12H3V8h11v5zm0-6H3V2h11v5z" />
              </svg>
            )
          }
        ]
      },
      {
        title: 'Theme',
        type: 'multiSelect',
        queryKey: 'theme',
        defaultValues: ['yellow'],
        options: [
          {
            title: 'Yellow',
            value: 'yellow',
            left: '🟡'
          },
          {
            title: 'Dark Red',
            value: 'darkRed',
            left: '🔴'
          },
          {
            title: 'Dark',
            value: 'dark',
            left: '⚫'
          }
        ]
      },
      {
        title: 'Language',
        type: 'multiSelect',
        queryKey: 'lang',
        defaultValues: ['en'],
        options: [
          {
            title: 'English',
            value: 'en',
            left: '🇬🇧'
          },
          {
            title: 'Polish',
            value: 'pl',
            left: '🇵🇱'
          },
          {
            title: 'Ukrainian',
            value: 'ua',
            left: '🇺🇦'
          }
        ]
      }
    ]
  }
}

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
      disable: true
      // '#f5ed00'
      // 'linear-gradient(355deg, rgba(5,9,14,1) 0%, rgba(71,21,25,1) 100%)'
      // '#171017'
    },
    multiselect
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    )
  ]
}

// decorator
/*
const withSmth = (Story, context) => {
  const { scheme } = context.globals

  return ...
}
*/

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

export default preview
