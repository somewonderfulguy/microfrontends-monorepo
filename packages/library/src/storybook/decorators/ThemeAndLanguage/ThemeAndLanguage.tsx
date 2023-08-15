import { CSSProperties } from 'react'
import type { Decorator } from '@storybook/react'

import classNames from '@utils/classNames'
import { ThemeProvider } from '@contexts/themeContext'

import styles from './ThemeAndLanguage.module.css'

const ThemeAndLanguage: Decorator = (Story, context) => {
  const { globals, parameters } = context
  const multiselect: { [key: string]: string | string[] } = globals.multiselect
  const gridElementCss = parameters.gridElementCss as CSSProperties | undefined

  const lang = multiselect.lang as Array<'en' | 'pl' | 'ua'>
  const theme = multiselect.theme as Array<'yellow' | 'darkRed' | 'dark'>
  const orientation = multiselect.orientation as 'horizontal' | 'vertical'
  const priority = globals.priority as 'theme' | 'lang'

  return (
    <div
      className={
        orientation === 'horizontal' ? styles.grid : styles.gridVertical
      }
    >
      {theme.map((_theme) => (
        <ThemeProvider key={_theme} initialTheme={_theme}>
          <div
            className={classNames(
              _theme === 'yellow' && [
                styles.gridElementYellow,
                'cyberpunk-ui-theme-yellow'
              ],
              _theme === 'darkRed' && [
                styles.gridElementDarkRed,
                'cyberpunk-ui-theme-dark-red'
              ],
              _theme === 'dark' && [
                styles.gridElementDark,
                'cyberpunk-ui-theme-dark'
              ]
            )}
            style={gridElementCss}
          >
            <Story />
          </div>
        </ThemeProvider>
      ))}
    </div>
  )
}

export default ThemeAndLanguage
