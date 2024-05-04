import React from 'react'
import type { Preview } from '@storybook/react'
import { Addon } from 'storybook-addon-multiselect'
import 'augmented-ui/augmented-ui.min.css'

import ThemeAndLanguage from '../src/storybook/decorators/ThemeAndLanguage'
import { orientationKey, themeKey, themeStorybookKey } from '../src/constants'

import './custom/preview-theme-logic'

import '../src/styles/fonts.css'
import '../src/styles/reset.css'
import '../src/storybook/styles/storybook.css'

const svgSharedProps2 = {
  stroke: 'currentColor',
  height: '1em',
  width: '1em',
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 16 16',
  fill: 'currentColor',
  strokeWidth: '0',
  role: 'img'
}

const svgPrioritySharedProps = {
  ...svgSharedProps2,
  fill: 'none',
  viewBox: '0 0 24 24'
}

const multiselect: Addon = {
  themeStorybook: {
    name: 'Storybook theme',
    icon: (
      <svg {...svgPrioritySharedProps} fill="currentColor">
        <path d="M16.71.243l-.12 2.71a.18.18 0 00.29.15l1.06-.8.9.7a.18.18 0 00.28-.14l-.1-2.76 1.33-.1a1.2 1.2 0 011.279 1.2v21.596a1.2 1.2 0 01-1.26 1.2l-16.096-.72a1.2 1.2 0 01-1.15-1.16l-.75-19.797a1.2 1.2 0 011.13-1.27L16.7.222zM13.64 9.3c0 .47 3.16.24 3.59-.08 0-3.2-1.72-4.89-4.859-4.89-3.15 0-4.899 1.72-4.899 4.29 0 4.45 5.999 4.53 5.999 6.959 0 .7-.32 1.1-1.05 1.1-.96 0-1.35-.49-1.3-2.16 0-.36-3.649-.48-3.769 0-.27 4.03 2.23 5.2 5.099 5.2 2.79 0 4.969-1.49 4.969-4.18 0-4.77-6.099-4.64-6.099-6.999 0-.97.72-1.1 1.13-1.1.45 0 1.25.07 1.19 1.87z" />
      </svg>
    ),
    description: 'Change theme of Storybook (outer shell)',
    elements: [
      {
        type: 'singleSelect',
        queryKey: 'themeStorybook',
        defaultValue: 'yellow',
        localStorageKey: themeStorybookKey,
        options: [
          {
            title: 'Yellow',
            value: 'yellow',
            icon: '🟡'
          },
          {
            title: 'Dark Red',
            value: 'darkRed',
            icon: '🔴'
          },
          {
            title: 'Dark',
            value: 'dark',
            icon: '⚫'
          }
        ]
      }
    ]
  },
  themeAndLanguage: {
    icon: (
      <svg {...svgSharedProps2} fill="currentColor" viewBox="0 0 512 512">
        <path d="M381.25 112a48 48 0 00-90.5 0H48v32h242.75a48 48 0 0090.5 0H464v-32zM176 208a48.09 48.09 0 00-45.25 32H48v32h82.75a48 48 0 0090.5 0H464v-32H221.25A48.09 48.09 0 00176 208zm160 128a48.09 48.09 0 00-45.25 32H48v32h242.75a48 48 0 0090.5 0H464v-32h-82.75A48.09 48.09 0 00336 336z" />
      </svg>
    ),
    name: 'Theme & Language',
    description: 'Change the theme and language of the components',
    elements: [
      {
        type: 'reset'
      },
      {
        type: 'singleSelect',
        queryKey: 'priority',
        title: 'Priority (in progress)',
        defaultValue: 'theme',
        options: [
          {
            title: 'Theme',
            value: 'theme',
            icon: (
              <svg {...svgPrioritySharedProps}>
                <path
                  key={1}
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.20348 2.00378C9.46407 2.00378 10.5067 3.10742 10.6786 4.54241L19.1622 13.0259L11.384 20.8041C10.2124 21.9757 8.31291 21.9757 7.14134 20.8041L2.8987 16.5615C1.72713 15.3899 1.72713 13.4904 2.8987 12.3188L5.70348 9.51404V4.96099C5.70348 3.32777 6.82277 2.00378 8.20348 2.00378ZM8.70348 4.96099V6.51404L7.70348 7.51404V4.96099C7.70348 4.63435 7.92734 4.36955 8.20348 4.36955C8.47963 4.36955 8.70348 4.63435 8.70348 4.96099ZM8.70348 10.8754V9.34247L4.31291 13.733C3.92239 14.1236 3.92239 14.7567 4.31291 15.1473L8.55555 19.3899C8.94608 19.7804 9.57924 19.7804 9.96977 19.3899L16.3337 13.0259L10.7035 7.39569V10.8754C10.7035 10.9184 10.7027 10.9612 10.7012 11.0038H8.69168C8.69941 10.9625 8.70348 10.9195 8.70348 10.8754Z"
                  fill="currentColor"
                />
                <path
                  key={2}
                  d="M16.8586 16.8749C15.687 18.0465 15.687 19.946 16.8586 21.1175C18.0302 22.2891 19.9297 22.2891 21.1013 21.1175C22.2728 19.946 22.2728 18.0465 21.1013 16.8749L18.9799 14.7536L16.8586 16.8749Z"
                  fill="currentColor"
                />
              </svg>
            )
          },
          {
            title: 'Language',
            value: 'lang',
            icon: (
              <svg
                {...svgPrioritySharedProps}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path key={1} stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path key={2} d="M4 5h7" />
                <path key={3} d="M7 4c0 4.846 0 7 .5 8" />
                <path
                  key={4}
                  d="M10 8.5c0 2.286 -2 4.5 -3.5 4.5s-2.5 -1.135 -2.5 -2c0 -2 1 -3 3 -3s5 .57 5 2.857c0 1.524 -.667 2.571 -2 3.143"
                />
                <path key={5} d="M12 20l4 -9l4 9" />
                <path key={6} d="M19.1 18h-6.2" />
              </svg>
            )
          }
        ]
      },
      {
        type: 'singleSelect',
        queryKey: 'orientation',
        title: 'Orientation',
        defaultValue: 'vertical',
        localStorageKey: orientationKey,
        options: [
          {
            title: 'Horizontal',
            value: 'horizontal',
            icon: (
              <svg
                {...svgSharedProps2}
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
            icon: (
              <svg
                {...svgSharedProps2}
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
        localStorageKey: themeKey,
        options: [
          {
            title: 'Yellow',
            value: 'yellow',
            icon: '🟡'
          },
          {
            title: 'Dark Red',
            value: 'darkRed',
            icon: '🔴'
          },
          {
            title: 'Dark',
            value: 'dark',
            icon: '⚫'
          },
          {
            title: 'White on black',
            value: 'whiteOnBlack',
            icon: '⚪'
          }
        ]
      },
      {
        title: 'Language (in progress)',
        type: 'multiSelect',
        queryKey: 'lang',
        defaultValues: ['en'],
        options: [
          {
            title: 'English',
            value: 'en',
            icon: '🇬🇧'
          },
          {
            title: 'Polish',
            value: 'pl',
            icon: '🇵🇱'
          },
          {
            title: 'Ukrainian',
            value: 'ua',
            icon: '🇺🇦'
          }
        ]
      }
    ]
  }
}

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    backgrounds: {
      disable: true,
      grid: {
        disable: true
      }
    },
    multiselect
  },
  globals: {
    multiselect: {}
  },
  decorators: [ThemeAndLanguage]
}

export default preview
