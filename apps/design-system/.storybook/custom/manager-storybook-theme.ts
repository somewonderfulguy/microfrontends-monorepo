import { addons } from '@storybook/addons'

import { Theme } from '../../src/types/theme'
import { themeStorybookKey } from '../../src/constants'

import objectObserver from './objectObserver'
import * as themes from '../themes'

const changeStorybookTheme = (theme: Theme) => {
  addons.setConfig({ theme: themes[theme] })
  window.document.body.classList.remove('dark', 'darkRed', 'yellow')
  window.document.body.classList.add(theme)
}

// change theme between tabs (addEventListener on storage works only between tabs)
window.addEventListener('storage', () => {
  const localStorageTheme = localStorage.getItem(
    themeStorybookKey
  ) as Theme | null
  changeStorybookTheme(localStorageTheme || 'yellow')
})

// changing theme on the fly
objectObserver(window.localStorage, ['setItem'], (method, key, ...args) => {
  if (key === 'themeStorybook') {
    changeStorybookTheme(args[0] as Theme)
  }
})

// initialization
const initialThemeStorybook =
  localStorage.getItem(themeStorybookKey) || 'yellow'
addons.setConfig({ theme: themes[initialThemeStorybook] })
window.document.body.classList.add(initialThemeStorybook)
localStorage.setItem(themeStorybookKey, initialThemeStorybook)
