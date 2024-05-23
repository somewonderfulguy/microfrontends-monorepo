import React from 'react'
import type { Preview } from '@storybook/react'

import ThemeWrapper from '@repo/design-system/ThemeWrapper'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    (Story) => (
      <ThemeWrapper>
        <Story />
      </ThemeWrapper>
    )
  ]
}

export default preview
