import { addons } from '@storybook/addons'

import { Theme } from '../src/types'

import * as themes from './themes'

// TODO: init from localStorage and/or from query string
addons.setConfig({
  theme: themes.yellow
})
window.document.body.classList.add('yellow')

addons.getChannel().on('changeTheme', (theme: Theme) => {
  addons.setConfig({
    theme: themes[theme]
  })
  window.document.body.classList.remove('dark', 'darkRed', 'yellow')
  window.document.body.classList.add(theme)
})
