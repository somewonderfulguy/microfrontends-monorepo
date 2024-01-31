import { CSSProperties } from 'react'
import type { Decorator } from '@storybook/react'

import classNames from 'utils/classNames'
import { ThemeProvider } from 'contexts/themeContext'
import { Theme, ThemeStorybook } from 'types/index'

import styles from './ThemeAndLanguage.module.css'

const getClassNames = (theme: Theme | ThemeStorybook) => {
  switch (theme) {
    case 'yellow':
      return styles.gridElementYellow
    case 'darkRed':
      return styles.gridElementDarkRed
    case 'dark':
      return styles.gridElementDark
    default:
      return ''
  }
}

const ThemeAndLanguage: Decorator = (Story, context) => {
  const { globals, parameters, viewMode } = context
  const isDocs = viewMode === 'docs'
  const multiselect: { [key: string]: string | string[] } = globals.multiselect
  const gridElementCss = parameters.gridElementCss as CSSProperties | undefined

  const theme = multiselect.theme as Array<Theme>
  // const lang = multiselect.lang as Array<'en' | 'pl' | 'ua'>
  const orientation = multiselect.orientation as 'horizontal' | 'vertical'
  // const priority = globals.priority as 'theme' | 'lang'
  const themeStorybook = multiselect.themeStorybook as ThemeStorybook

  return (
    <div
      className={
        orientation === 'horizontal' ? styles.grid : styles.gridVertical
      }
    >
      {isDocs ? (
        <ThemeProvider
          className={classNames(getClassNames(themeStorybook))}
          initialTheme={themeStorybook}
          style={gridElementCss}
        >
          <Story />
        </ThemeProvider>
      ) : (
        theme.map((_theme) => (
          <ThemeProvider
            className={classNames(
              getClassNames(_theme),
              _theme === 'whiteOnBlack' && styles.gridElementWhiteOnBlack
            )}
            initialTheme={_theme}
            key={_theme}
            style={gridElementCss}
          >
            <Story />
          </ThemeProvider>
        ))
      )}
    </div>
  )
}

export default ThemeAndLanguage
