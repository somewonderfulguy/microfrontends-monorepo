import { addons } from '@storybook/addons'

import { Theme } from '../src/types'

import * as themes from './themes'

addons.setConfig({
  theme: themes.yellow
})

addons.getChannel().on('changeTheme', (theme: Theme) => {
  addons.setConfig({
    theme: themes[theme]
  })
  window.document.body.classList.remove('dark', 'darkRed', 'yellow')
  window.document.body.classList.add(theme)
})
