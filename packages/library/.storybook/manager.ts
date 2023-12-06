import { addons } from '@storybook/addons'
import * as Events from '@storybook/core-events'

import { Theme } from '../src/types'
import { orientationKey, themeKey, themeStorybookKey } from '../src/constants'
import throttle from '../src/utils/throttle'

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

// hooking on panel to know it position (bottom or right side)
let initialized = false
addons.getChannel().on(Events.STORY_RENDERED, () => {
  if (initialized) return
  initialized = true
  const panelElement = document.querySelector(
    '#storybook-panel-root'
  )?.parentElement
  console.log(panelElement)

  if (!panelElement)
    return console.warn(
      `Couldn't find panel element (selector: #storybook-panel-root.parentElement)`
    )

  const observer = throttle(([entry]) => {
    const target = (Array.isArray(entry) ? entry[0] : entry).target
    const left = window.getComputedStyle(target).left
    const top = window.getComputedStyle(target).top
    const isBottom = left === '0px' && top !== '0px'

    if (isBottom) {
      target.classList.remove('right-panel')
      target.classList.add('bottom-panel')
    } else {
      target.classList.remove('bottom-panel')
      target.classList.add('right-panel')
    }
  }, 200)
  const resizeObserver = new ResizeObserver(observer)

  resizeObserver.observe(panelElement)
})
