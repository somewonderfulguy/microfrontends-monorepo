import { CSSProperties } from 'react'
import type { Decorator } from '@storybook/react'

import styles from './ThemeAndLanguage.module.css'

function cx(...args: unknown[]) {
  return args
    .flat()
    .filter((x) => typeof x === 'string')
    .join(' ')
    .trim()
}

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
        <div
          className={cx(
            _theme === 'yellow' && styles.gridElementYellow,
            _theme === 'darkRed' && styles.gridElementDarkRed,
            _theme === 'dark' && styles.gridElementDark
          )}
          key={_theme}
          style={gridElementCss}
        >
          <Story />
        </div>
      ))}
    </div>
  )
}

export default ThemeAndLanguage
