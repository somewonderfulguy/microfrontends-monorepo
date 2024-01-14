import { addons } from '@storybook/addons'

import { Theme } from '../../src/types'
import {
  orientationKey,
  themeKey,
  themeStorybookKey
} from '../../src/constants'

import * as themes from '../themes'

type Orientation = 'horizontal' | 'vertical'

/**
 * Top right classes are used to determine what color should be used for top right corner based on orientation and theme (theme of components, not storybook).
 * The idea is the theme that closest to the top right corner should be used for top right corner.
 * */
const topRightClasses = {
  dark: 'topRightDark',
  darkRed: 'topRightDarkRed',
  yellow: 'topRightYellow'
}
const removeTopRightClasses = () =>
  window.document.body.classList.remove(...Object.values(topRightClasses))

// initial orientation and theme from url
const params = new URLSearchParams(document.location.search)
const urlGlobals = params.get('globals')
const wantedKeys = ['multiselect.theme[', 'multiselect.orientation:']
const urlOrientationTheme =
  urlGlobals
    ?.split(';')
    .filter((_) => wantedKeys.some((key) => _.startsWith(key))) ?? []
const urlOrientation = urlOrientationTheme
  .find((_) => _.startsWith('multiselect.orientation:'))
  ?.replace('multiselect.orientation:', '') as Orientation | undefined
const urlTheme = urlOrientationTheme
  .filter((_) => !_.startsWith(wantedKeys[1]))
  .map((_) => _.replace(wantedKeys[0], '').replace(/^\d+\]:/, '')) as Theme[]

const localStorageTheme = localStorage.getItem(themeKey)
const initialTheme = localStorageTheme
  ? localStorageTheme.split(',')
  : urlTheme?.length
  ? urlTheme
  : ['yellow']
const initialOrientation = (localStorage.getItem(orientationKey) ||
  urlOrientation ||
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
  const localStorageThemes = localStorage.getItem(themeKey)?.split(',') as
    | Theme[]
    | undefined
  const urlThemes = new URLSearchParams(document.location.search)
    .get('globals')
    ?.split(';')
    .filter((_) => _.startsWith('multiselect.theme['))
    .map((_) => _.replace('multiselect.theme[', '').replace(/^\d+\]:/, '')) as
    | Theme[]
    | undefined

  if (!localStorageThemes && !urlThemes) {
    console.warn('no themes in url or local storage')
  }

  const themes = (localStorageThemes || urlThemes || ['yellow']) as Theme[]
  performTopRightClassChange(themes, orientation)
})

addons.getChannel().on('changeTheme', (themes: Theme[]) => {
  const localStorageOrientation = localStorage.getItem(orientationKey)
  const urlOrientation = new URLSearchParams(document.location.search)
    .get('globals')
    ?.split(';')
    .find((_) => _.startsWith('multiselect.orientation:'))
    ?.replace('multiselect.orientation:', '') as Orientation | undefined

  if (!localStorageOrientation && !urlOrientation) {
    console.warn('no orientation in url or local storage')
  }

  const orientation = (localStorageOrientation ||
    urlOrientation ||
    'horizontal') as Orientation
  performTopRightClassChange(themes, orientation)
})

// yellow bottom border on top panel (dark theme)
document.addEventListener('DOMContentLoaded', () => {
  const baseSelector = `#root div[role='main'] > div > div > div:first-child > div:first-child`
  const topRightElement = document.querySelector(
    `${baseSelector} > div > div:last-child`
  )
  const header = document.querySelector(baseSelector)

  if (!topRightElement) {
    console.warn(`couldn't find top right corner element`)
    return
  }

  if (!header) {
    console.warn(`couldn't find header`)
    return
  }

  const observer = ([entry]: ResizeObserverEntry[]) => {
    const bounds = (
      Array.isArray(entry) ? entry[0].contentRect : entry.contentRect
    ) as ResizeObserverEntry['contentRect']

    const width = bounds.right - 1
    ;(header as HTMLDivElement).style.setProperty(
      '--corner--width',
      `${width}px`
    )
  }

  const resizeObserver = new ResizeObserver(observer)

  resizeObserver.observe(topRightElement)
})
