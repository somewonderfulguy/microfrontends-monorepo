import { Theme } from '../../src/types/theme'
import { themeStorybookKey } from '../../src/constants'

/**
 * Theme logic for `Docs` page.
 * This logic relies on `localStorage` to determine what theme should be used.
 * `localStorage` is set by `manager-theme-logic.ts`.
 */

// initial theme from localStorage
// interval because `localStorage` is not available immediately, but some time after page load
const timer = setInterval(() => {
  const localStorageTheme = localStorage.getItem(
    themeStorybookKey
  ) as Theme | null

  if (localStorageTheme) {
    document.documentElement.setAttribute('data-theme', localStorageTheme)
    clearInterval(timer)
  }
}, 60)

// TODO: consider using `proxyObserveObject` to listen to `localStorage` changes
// listen to `localStorage` (theme) changes
window.addEventListener('storage', () => {
  const localStorageTheme = localStorage.getItem(
    themeStorybookKey
  ) as Theme | null
  document.documentElement.setAttribute(
    'data-theme',
    localStorageTheme || 'yellow'
  )
})
