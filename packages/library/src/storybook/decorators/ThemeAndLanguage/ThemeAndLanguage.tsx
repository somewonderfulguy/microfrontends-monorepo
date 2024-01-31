import { CSSProperties } from 'react'
import type { Decorator } from '@storybook/react'

import classNames from 'utils/classNames'
import { ThemeProvider } from 'contexts/themeContext'
import { Theme } from 'types/index'

import styles from './ThemeAndLanguage.module.css'

const ThemeAndLanguage: Decorator = (Story, context) => {
  const { globals, parameters } = context
  const multiselect: { [key: string]: string | string[] } = globals.multiselect
  const gridElementCss = parameters.gridElementCss as CSSProperties | undefined

  const theme = multiselect.theme as Array<Theme>
  // const lang = multiselect.lang as Array<'en' | 'pl' | 'ua'>
  const orientation = multiselect.orientation as 'horizontal' | 'vertical'
  // const priority = globals.priority as 'theme' | 'lang'

  return (
    <div
      className={
        orientation === 'horizontal' ? styles.grid : styles.gridVertical
      }
    >
      {theme.map((_theme) => (
        <ThemeProvider
          className={classNames(
            _theme === 'yellow' && styles.gridElementYellow,
            _theme === 'darkRed' && styles.gridElementDarkRed,
            _theme === 'dark' && styles.gridElementDark,
            _theme === 'whiteOnBlack' && styles.gridElementWhiteOnBlack
          )}
          initialTheme={_theme}
          key={_theme}
          style={gridElementCss}
        >
          <Story />
        </ThemeProvider>
      ))}
    </div>
  )
}

export default ThemeAndLanguage
