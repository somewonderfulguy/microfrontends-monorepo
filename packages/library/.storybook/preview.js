import '../../../node_modules/augmented-ui/augmented-ui.min.css'

import '../src/styles/cyberFont.css'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}