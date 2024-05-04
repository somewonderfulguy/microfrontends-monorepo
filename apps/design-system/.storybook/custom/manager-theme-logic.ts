// TODO: refactor

import { addons } from '@storybook/addons'

import { Theme } from '../../src/types/theme'
import {
  orientationKey,
  themeKey,
  themeStorybookKey
} from '../../src/constants'

import objectObserver from './objectObserver'
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
const wantedKeys = ['multiselect.theme[', 'multiselect.orientation:'] as const
const getThemeOrientationFromUrl = () => {
  const params = new URLSearchParams(document.location.search)
  const urlGlobals = params.get('globals')
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

  return { urlOrientation, urlTheme }
}
const { urlOrientation, urlTheme } = getThemeOrientationFromUrl()

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

window.document.body.classList.add(initTopRightClass || 'topRightYellow')

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
const changeOrientation = (orientation: Orientation) => {
  const localStorageThemes = localStorage.getItem(themeKey)?.split(',') as
    | Theme[]
    | undefined
  const urlThemes = new URLSearchParams(document.location.search)
    .get('globals')
    ?.split(';')
    .filter((_) => _.startsWith(wantedKeys[0]))
    .map((_) => _.replace(wantedKeys[0], '').replace(/^\d+\]:/, '')) as
    | Theme[]
    | undefined

  if (!localStorageThemes && !urlThemes) {
    console.warn('no themes in url or local storage')
  }

  const themes = (localStorageThemes || urlThemes || ['yellow']) as Theme[]
  performTopRightClassChange(themes, orientation)
}

const changeTheme = (themes: Theme[]) => {
  const localStorageOrientation = localStorage.getItem(orientationKey)
  const urlOrientation = new URLSearchParams(document.location.search)
    .get('globals')
    ?.split(';')
    .find((_) => _.startsWith(wantedKeys[1]))
    ?.replace(wantedKeys[1], '') as Orientation | undefined

  if (!localStorageOrientation && !urlOrientation) {
    console.warn('no orientation in url or local storage')
  }

  const orientation = (localStorageOrientation ||
    urlOrientation ||
    'horizontal') as Orientation
  performTopRightClassChange(themes, orientation)
}

objectObserver(window.localStorage, ['setItem'], (method, key, ...args) => {
  const arg = args[0] as string
  if (key === 'theme') {
    changeTheme(arg.split(',') as Theme[])
  } else if (key === 'orientation') {
    changeOrientation(arg as Orientation)
  }
})

// TODO: move to separate file
// yellow bottom border on top panel (dark theme)
document.addEventListener('DOMContentLoaded', async () => {
  // wait for storybook to initialize (needed in Chrome, FF works without it)
  await new Promise((resolve) => setTimeout(resolve))

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
