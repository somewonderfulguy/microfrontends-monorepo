import { addons } from '@storybook/addons'

import { Theme } from '../src/types'
import { orientationKey, themeKey, themeStorybookKey } from '../src/constants'

import * as themes from './themes'

type Orientation = 'horizontal' | 'vertical'

const topRightClasses = {
  dark: 'topRightDark',
  darkRed: 'topRightDarkRed',
  yellow: 'topRightYellow'
}
const removeTopRightClasses = () =>
  window.document.body.classList.remove(...Object.values(topRightClasses))

const initialTheme = (localStorage.getItem(themeKey) || 'yellow').split(
  ','
) as Theme[]
const initialOrientation = (localStorage.getItem(orientationKey) ||
  'horizontal') as Orientation
const initTopRightClass =
  initialOrientation === 'horizontal'
    ? topRightClasses[initialTheme[initialTheme.length - 1]]
    : topRightClasses[initialTheme[0]]

// initialization
addons.setConfig({
  theme: themes[localStorage.getItem(themeStorybookKey) || 'yellow']
})
window.document.body.classList.add(
  localStorage.getItem(themeStorybookKey) || 'yellow'
)
window.document.body.classList.add(initTopRightClass || 'topRightYellow')

// on storybook theme change
addons.getChannel().on('changeThemeStorybook', (theme: Theme) => {
  addons.setConfig({
    theme: themes[theme]
  })
  window.document.body.classList.remove('dark', 'darkRed', 'yellow')
  window.document.body.classList.add(theme)
})

// on orientation/theme change (set style that will help to style top right corner)
const performTopRightClassChange = (
  themes: Theme[],
  orientation: Orientation
) => {
  removeTopRightClasses()
  if (orientation === 'horizontal') {
    window.document.body.classList.add(
      topRightClasses[themes[themes.length - 1]] || 'topRightYellow'
    )
  } else {
    window.document.body.classList.add(
      topRightClasses[themes[0]] || 'topRightYellow'
    )
  }
}
addons.getChannel().on('changeOrientation', (orientation: Orientation) => {
  const themes = (localStorage.getItem(themeKey) || 'yellow').split(
    ','
  ) as Theme[]
  performTopRightClassChange(themes, orientation)
})
addons.getChannel().on('changeTheme', (themes: Theme[]) => {
  const orientation = (localStorage.getItem(orientationKey) ||
    'horizontal') as Orientation
  performTopRightClassChange(themes, orientation)
})
